/**
 * AgriShift — Main Recommendation Engine Orchestrator
 * Coordinates eligibility filtering, multi-criteria scoring, and rotation pathway synthesis.
 */

const { Crop, CropSuitability, ClimateProfile, DatasetMetadata } = require('../../models');
const { evaluateEligibility } = require('./eligibilityEngine');
const { scoreYields } = require('./yieldScorer');
const { scoreClimateCompatibility } = require('./climateScorer');
const { buildRotationPathways } = require('./rotationEngine');

// Mapping of country codes to closest benchmark climate archetype if available
const ISO3_TO_CLIMATE_ARCHETYPE = {
  PAK: 'punjab_indus_basin',
  IND: 'punjab_indus_basin',
  AFG: 'punjab_indus_basin',
  USA: 'us_corn_belt_iowa',
  CAN: 'us_corn_belt_iowa',
  KEN: 'kenya_rift_valley',
  ETH: 'kenya_rift_valley',
  TZA: 'kenya_rift_valley',
  UGA: 'kenya_rift_valley',
  BRA: 'brazil_cerrado_matogrosso',
  ARG: 'brazil_cerrado_matogrosso',
  PRY: 'brazil_cerrado_matogrosso',
  BOL: 'brazil_cerrado_matogrosso',
  EGY: 'egypt_nile_delta',
  SDN: 'egypt_nile_delta',
};

/**
 * Generate full recommendation report for farmer assessment input.
 * 
 * @param {Object} input
 * @param {string} input.country - ISO3 country code (e.g. 'PAK')
 * @param {string} [input.currentCrop] - Current crop ID (e.g. 'wheat')
 * @param {string} [input.waterRegime] - 'irrigated' or 'rainfed' (default: 'irrigated')
 * @param {string} [input.managementLevel] - 'high' or 'low' (default: 'high')
 * @param {string} [input.farmingObjective] - 'all' or specific pathway key
 * @param {string} [input.climateArchetype] - optional specific climate archetype ID
 * @returns {Promise<Object>} Recommendation response object
 */
async function generateRecommendations(input) {
  const startTime = Date.now();

  // 1. Sanitize & Normalize Inputs
  const iso3 = (input.country || '').trim().toUpperCase();
  if (!iso3 || iso3.length !== 3) {
    throw new Error(`Invalid country ISO3 code '${input.country}'. Must be a 3-letter sovereign code.`);
  }

  const waterRegime = (input.waterRegime || 'irrigated').trim().toLowerCase();
  if (!['irrigated', 'rainfed'].includes(waterRegime)) {
    throw new Error(`Invalid water regime '${input.waterRegime}'. Must be 'irrigated' or 'rainfed'.`);
  }

  const managementLevel = (input.managementLevel || 'high').trim().toLowerCase();
  if (!['high', 'low'].includes(managementLevel)) {
    throw new Error(`Invalid management level '${input.managementLevel}'. Must be 'high' or 'low'.`);
  }

  const currentCropId = input.currentCrop ? input.currentCrop.trim().toLowerCase() : null;
  const targetWip = `${waterRegime}_${managementLevel}`;

  // 2. Fetch Database Records in Parallel
  const [allCrops, suitabilityRecords, climateProfileDoc, metadataDocs] = await Promise.all([
    Crop.find({}),
    CropSuitability.find({
      'dimensions.iso3': iso3,
      'dimensions.waterManagement': targetWip,
    }),
    (async () => {
      const archId = input.climateArchetype || ISO3_TO_CLIMATE_ARCHETYPE[iso3];
      if (archId) {
        return ClimateProfile.findOne({ archetypeId: archId });
      }
      return null;
    })(),
    DatasetMetadata.find({}),
  ]);

  // Check if country exists in database
  if (!suitabilityRecords || suitabilityRecords.length === 0) {
    // Check if country exists under any regime
    const anyRegime = await CropSuitability.findOne({ 'dimensions.iso3': iso3 });
    if (!anyRegime) {
      throw new Error(`Country code '${iso3}' was not found in the official GAEZ v5 dataset.`);
    } else {
      throw new Error(
        `No GAEZ data available for country '${iso3}' under management regime '${targetWip}'. Available data may exist under alternative regimes.`
      );
    }
  }

  // Retrieve current crop details if provided
  let currentCropDoc = null;
  if (currentCropId) {
    currentCropDoc = allCrops.find((c) => c.cropId === currentCropId);
    if (!currentCropDoc) {
      throw new Error(`Current crop '${currentCropId}' is not recognized in the agricultural catalog.`);
    }
  }

  // 3. Rule-Based Eligibility Filtering
  const { eligibleCrops, ineligibleCrops } = evaluateEligibility({
    allCrops,
    suitabilityRecords,
    waterRegime,
    managementLevel,
    currentCropId,
  });

  if (eligibleCrops.length === 0) {
    return {
      status: 'NO_ELIGIBLE_CROPS',
      message: `No crops met the agro-ecological viability thresholds in ${iso3} under ${targetWip} conditions.`,
      inputParameters: {
        country: iso3,
        currentCrop: currentCropId,
        waterRegime,
        managementLevel,
      },
      eligibilityAudit: {
        totalCropsEvaluated: allCrops.length,
        eligibleCount: 0,
        ineligibleCount: ineligibleCrops.length,
        ineligibleDetails: ineligibleCrops.map((c) => ({
          cropId: c.cropId,
          displayName: c.displayName,
          reason: c.reason,
          failedGate: c.failedGate,
        })),
      },
      ineligibleCrops,
      pathways: null,
      provenance: {
        engineVersion: 'AgriShift Hybrid Engine v1.0',
        processingTimeMs: Date.now() - startTime,
      },
    };
  }

  // 4. Multi-Criteria Scoring: Yield & Suitability
  const yieldScoredCrops = scoreYields(eligibleCrops);

  // 5. Multi-Criteria Scoring: NASA POWER Climate Compatibility
  const climateScoredCrops = scoreClimateCompatibility(
    yieldScoredCrops,
    climateProfileDoc,
    waterRegime
  );

  // 6. Synthesis of Explainable Crop Rotation Pathways
  const pathways = buildRotationPathways(climateScoredCrops, currentCropDoc, waterRegime);

  // Country display name from first suitability record
  const countryName = suitabilityRecords[0].dimensions.countryName;

  // 7. Package Response with Provenance & Disclosures
  return {
    status: 'SUCCESS',
    assessmentSummary: {
      country: {
        iso3,
        name: countryName,
      },
      currentCrop: currentCropDoc
        ? {
            cropId: currentCropDoc.cropId,
            displayName: currentCropDoc.displayName,
            category: currentCropDoc.category,
          }
        : null,
      waterRegime,
      managementLevel,
      evaluatedRegimeCode: targetWip,
      climateProfileApplied: climateProfileDoc
        ? {
            archetypeId: climateProfileDoc.archetypeId,
            locationName: climateProfileDoc.location?.name,
            isRegionalArchetype: true,
            confidenceRating: 'REGIONAL_ARCHETYPE',
            annualMeanTempC: climateProfileDoc.annualSummary?.meanTemperatureC,
            annualPrecipitationEstimateMmYear: climateProfileDoc.annualSummary?.annualPrecipitationEstimateMmYear,
            meanSolarRadiationKwhM2Day: climateProfileDoc.annualSummary?.meanSolarRadiationKwhM2Day,
            meanRelativeHumidityPercent: climateProfileDoc.annualSummary?.meanRelativeHumidityPercent,
            disclosure: `Evaluated using regional NASA POWER profile for ${climateProfileDoc.location?.name || climateProfileDoc.archetypeId}. Reflects regional climatology, not unmeasured field-level microclimate.`
          }
        : {
            archetypeId: 'fallback_global_baseline',
            locationName: 'Generalized Global Baseline',
            isRegionalArchetype: false,
            confidenceRating: 'GLOBAL_BASELINE_FALLBACK',
            annualMeanTempC: 22.0,
            annualPrecipitationEstimateMmYear: 650.0,
            note: 'Evaluated against generalized temperate/tropical baseline (no direct regional archetype assigned).',
            disclosure: 'No matching regional NASA POWER profile; fallback baseline applied. Climate scores carry moderate confidence.'
          },
    },
    pathways: {
      economicReturn: pathways.economicReturn,
      soilRestoration: pathways.soilRestoration,
      waterResilience: pathways.waterResilience,
    },
    rankedAlternatives: pathways.rankedAlternatives,
    eligibilityAudit: {
      totalCropsEvaluated: allCrops.length,
      eligibleCount: eligibleCrops.length,
      ineligibleCount: ineligibleCrops.length,
      ineligibleDetails: ineligibleCrops.map((c) => ({
        cropId: c.cropId,
        displayName: c.displayName,
        reason: c.reason,
        failedGate: c.failedGate,
      })),
    },
    provenance: {
      engine: 'AgriShift Hybrid Recommendation & Rotation Engine',
      version: '1.0.0',
      dataSources: [
        {
          name: 'FAO/IIASA GAEZ v5',
          theme: 'Theme 3: Agro-Ecological Crop Suitability & Attainable Yields',
          scenario: 'Historical Baseline (1981-2000, AgERA5)',
        },
        {
          name: 'NASA POWER Climatology API',
          community: 'Agroclimatology (AG)',
          variables: ['T2M', 'T2M_MAX', 'T2M_MIN', 'PRECTOTCORR', 'ALLSKY_SFC_SW_DWN', 'RH2M'],
        },
      ],
      processingTimeMs: Date.now() - startTime,
      limitations: [
        'Attainable yields are modeled agro-ecological potential benchmarks, not guaranteed harvest projections.',
        'Soil fertility benefits are inferred from biological nitrogen fixation agronomy; field-level soil nutrient and moisture sensors are not directly measured in these observation layers.',
        'Market viability and crop price realization depend on local off-take dynamics.',
      ],
    },
  };
}

module.exports = { generateRecommendations };

/**
 * AgriShift — Main Recommendation Engine Orchestrator
 * Coordinates eligibility filtering, multi-criteria scoring, and rotation pathway synthesis.
 */

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { Crop, CropSuitability, ClimateProfile, DatasetMetadata } = require('../../models');
const { evaluateEligibility } = require('./eligibilityEngine');
const { scoreYields } = require('./yieldScorer');
const { scoreClimateCompatibility } = require('./climateScorer');
const { buildRotationPathways } = require('./rotationEngine');

// Standard verified catalog crops with agronomic profiles
const FALLBACK_ALL_CROPS = [
  {
    cropId: 'wheat',
    displayName: 'Wheat',
    scientificName: 'Triticum aestivum',
    category: 'Cereal / Rabi Grain',
    rotationRole: 'Baseline Cereal / High Starch Staple',
    agronomicProfile: {
      growingSeasonDays: 130,
      optimalTempRangeC: { min: 15, max: 24 },
      waterRequirementRating: 'medium',
      isNitrogenFixing: false,
      droughtTolerance: 'medium',
      rootDepthType: 'deep',
    },
  },
  {
    cropId: 'rice',
    displayName: 'Rice',
    scientificName: 'Oryza sativa',
    category: 'Cereal / Kharif Grain',
    rotationRole: 'Baseline Flooded Cereal / Summer Staple',
    agronomicProfile: {
      growingSeasonDays: 120,
      optimalTempRangeC: { min: 20, max: 35 },
      waterRequirementRating: 'very_high',
      isNitrogenFixing: false,
      droughtTolerance: 'low',
      rootDepthType: 'shallow',
    },
  },
  {
    cropId: 'maize',
    displayName: 'Maize (Corn)',
    scientificName: 'Zea mays',
    category: 'C4 Cereal / Summer Grain',
    rotationRole: 'High-Biomass Feeder / Feed & Food Grain',
    agronomicProfile: {
      growingSeasonDays: 110,
      optimalTempRangeC: { min: 18, max: 30 },
      waterRequirementRating: 'high',
      isNitrogenFixing: false,
      droughtTolerance: 'medium',
      rootDepthType: 'deep',
    },
  },
  {
    cropId: 'soybean',
    displayName: 'Soybean',
    scientificName: 'Glycine max',
    category: 'Legume / Oilseed',
    rotationRole: 'Biological Nitrogen Fixer / Soil Restoration',
    agronomicProfile: {
      growingSeasonDays: 100,
      optimalTempRangeC: { min: 20, max: 30 },
      waterRequirementRating: 'medium',
      isNitrogenFixing: true,
      droughtTolerance: 'medium',
      rootDepthType: 'deep',
    },
  },
  {
    cropId: 'cotton',
    displayName: 'Cotton',
    scientificName: 'Gossypium hirsutum',
    category: 'Fiber / Cash Crop',
    rotationRole: 'Commercial Cash Crop / Deep Taproot Soil Aeration',
    agronomicProfile: {
      growingSeasonDays: 160,
      optimalTempRangeC: { min: 22, max: 35 },
      waterRequirementRating: 'high',
      isNitrogenFixing: false,
      droughtTolerance: 'medium',
      rootDepthType: 'deep',
    },
  },
  {
    cropId: 'sugarcane',
    displayName: 'Sugarcane',
    scientificName: 'Saccharum officinarum',
    category: 'Sugar / Perennial Grass',
    rotationRole: 'High-Biomass Semi-Perennial / Industrial Cash Crop',
    agronomicProfile: {
      growingSeasonDays: 330,
      optimalTempRangeC: { min: 24, max: 38 },
      waterRequirementRating: 'very_high',
      isNitrogenFixing: false,
      droughtTolerance: 'low',
      rootDepthType: 'deep',
    },
  },
  {
    cropId: 'sorghum',
    displayName: 'Sorghum',
    scientificName: 'Sorghum bicolor',
    category: 'C4 Drought Cereal',
    rotationRole: 'Water Resilience / Arid Climate Adaptation',
    agronomicProfile: {
      growingSeasonDays: 95,
      optimalTempRangeC: { min: 22, max: 36 },
      waterRequirementRating: 'low',
      isNitrogenFixing: false,
      droughtTolerance: 'high',
      rootDepthType: 'deep',
    },
  },
  {
    cropId: 'potato',
    displayName: 'Potato',
    scientificName: 'Solanum tuberosum',
    category: 'Root & Tuber',
    rotationRole: 'Tuber Pan-Breaker / Potassium Nutrient Cycling',
    agronomicProfile: {
      growingSeasonDays: 90,
      optimalTempRangeC: { min: 15, max: 22 },
      waterRequirementRating: 'medium',
      isNitrogenFixing: false,
      droughtTolerance: 'low',
      rootDepthType: 'shallow',
    },
  },
];

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

  // 2. Fetch Records (from MongoDB Atlas if online, with automatic offline dataset fallback)
  let allCrops = FALLBACK_ALL_CROPS;
  let suitabilityRecords = [];
  let climateProfileDoc = null;

  if (mongoose.connection.readyState === 1) {
    try {
      const [dbCrops, dbSuitability, dbClimate] = await Promise.all([
        Crop.find({}),
        CropSuitability.find({
          'dimensions.iso3': iso3,
          'dimensions.waterManagement': targetWip,
        }),
        (async () => {
          const archId = input.climateArchetype || ISO3_TO_CLIMATE_ARCHETYPE[iso3];
          return archId ? ClimateProfile.findOne({ archetypeId: archId }) : null;
        })(),
      ]);
      if (dbCrops && dbCrops.length > 0) allCrops = dbCrops;
      if (dbSuitability && dbSuitability.length > 0) suitabilityRecords = dbSuitability;
      if (dbClimate) climateProfileDoc = dbClimate;
    } catch (dbErr) {
      console.warn('MongoDB query buffering/timeout, switching to offline datasets:', dbErr.message);
    }
  }

  // Offline / Resilient Fallback: If suitability records not retrieved from Atlas, load from normalized JSON files
  if (!suitabilityRecords || suitabilityRecords.length === 0) {
    const gaezJsonPath = path.resolve(__dirname, '../../../../dataset/processed/gaez_crop_suitability_normalized.json');
    if (fs.existsSync(gaezJsonPath)) {
      const rawRecords = JSON.parse(fs.readFileSync(gaezJsonPath, 'utf8'));
      suitabilityRecords = rawRecords
        .filter((r) => r.dimensions.iso3 === iso3 && r.dimensions.water_management === targetWip)
        .map((r) => ({
          dimensions: {
            cropId: r.dimensions.crop_id,
            cropDisplayName: r.dimensions.crop_display_name,
            cropScientificName: r.dimensions.crop_scientific_name,
            cropCategory: r.dimensions.crop_category,
            rotationRole: r.dimensions.rotation_role,
            iso3: r.dimensions.iso3,
            countryName: r.dimensions.country_name,
            waterManagement: r.dimensions.water_management,
          },
          agronomics: {
            extentsTotal1000ha: r.agronomics.extents_total_1000ha,
            suitabilityVerySuitable1000ha: r.agronomics.suitability_very_suitable_1000ha,
            suitabilitySuitable1000ha: r.agronomics.suitability_suitable_1000ha,
            suitabilityModeratelySuitable1000ha: r.agronomics.suitability_moderately_suitable_1000ha,
            yieldMaximumKgPerHa: r.agronomics.yield_maximum_kg_per_ha,
            yieldVerySuitableKgPerHa: r.agronomics.yield_very_suitable_kg_per_ha,
            yieldSuitableKgPerHa: r.agronomics.yield_suitable_kg_per_ha,
            yieldModeratelySuitableKgPerHa: r.agronomics.yield_moderately_suitable_kg_per_ha,
          },
        }));

      // Check if country exists at all
      if (suitabilityRecords.length === 0) {
        const countryExists = rawRecords.some((r) => r.dimensions.iso3 === iso3);
        if (!countryExists) {
          throw new Error(`Country code '${iso3}' was not found in the official GAEZ v5 dataset.`);
        } else {
          throw new Error(
            `No GAEZ data available for country '${iso3}' under management regime '${targetWip}'. Available data may exist under alternative regimes.`
          );
        }
      }
    }
  }

  // Load offline climate profile if still null
  if (!climateProfileDoc) {
    const powerJsonPath = path.resolve(__dirname, '../../../../dataset/processed/nasa_power_climatology_normalized.json');
    const targetArchId = input.climateArchetype || ISO3_TO_CLIMATE_ARCHETYPE[iso3];
    if (targetArchId && fs.existsSync(powerJsonPath)) {
      const rawPower = JSON.parse(fs.readFileSync(powerJsonPath, 'utf8'));
      const found = rawPower.find((p) => (p.location.archetype_id || p.location.archetypeId) === targetArchId);
      if (found) {
        climateProfileDoc = {
          archetypeId: targetArchId,
          location: {
            name: (targetArchId || '').replace(/_/g, ' '),
            longitude: found.location.longitude,
            latitude: found.location.latitude,
          },
          annualSummary: {
            meanTemperatureC: found.annual_summary.mean_temperature_c,
            maxTemperatureC: found.annual_summary.max_temperature_c,
            minTemperatureC: found.annual_summary.min_temperature_c,
            annualPrecipitationEstimateMmYear: found.annual_summary.annual_precipitation_estimate_mm_year,
            meanSolarRadiationKwhM2Day: found.annual_summary.mean_solar_radiation_kwh_m2_day,
            meanRelativeHumidityPercent: found.annual_summary.mean_relative_humidity_percent,
          },
        };
      }
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

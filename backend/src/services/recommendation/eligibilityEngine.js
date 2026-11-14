/**
 * AgriShift — Rule-Based Eligibility Engine
 * Filters crops based on empirical GAEZ v5 availability and agronomic viability rules.
 */

/**
 * Filter crops for eligibility in a given country and water management regime.
 * 
 * @param {Object} params
 * @param {Array} params.allCrops - List of all standard Crop documents
 * @param {Array} params.suitabilityRecords - GAEZ CropSuitability documents for country & regime
 * @param {string} params.waterRegime - 'irrigated' or 'rainfed'
 * @param {string} params.managementLevel - 'high' or 'low'
 * @param {string} [params.currentCropId] - The user's current crop identifier
 * @returns {Object} { eligibleCrops, ineligibleCrops }
 */
function evaluateEligibility({
  allCrops,
  suitabilityRecords,
  waterRegime,
  managementLevel = 'high',
  currentCropId = null,
}) {
  const eligibleCrops = [];
  const ineligibleCrops = [];

  // Determine target water management code
  const targetWip = `${waterRegime}_${managementLevel}`.toLowerCase();

  // Index suitability records by cropId
  // Note: If duplicate records exist (e.g. GBR sub-regions), aggregate or select the primary national extent
  const suitabilityByCrop = {};
  for (const record of suitabilityRecords) {
    const cId = record.dimensions.cropId;
    if (!suitabilityByCrop[cId]) {
      suitabilityByCrop[cId] = [];
    }
    suitabilityByCrop[cId].push(record);
  }

  for (const crop of allCrops) {
    const cId = crop.cropId;
    const records = suitabilityByCrop[cId];

    // Gate 1: Check if GAEZ data exists for this crop in this country and regime
    if (!records || records.length === 0) {
      ineligibleCrops.push({
        cropId: cId,
        displayName: crop.displayName,
        category: crop.category,
        reason: `No GAEZ v5 data record found for ${crop.displayName} under ${targetWip} regime.`,
        failedGate: 'DATA_AVAILABILITY',
      });
      continue;
    }

    // Select the record with the maximum agricultural extent if multiple sub-regions exist (e.g. GBR)
    const primaryRecord = records.reduce((prev, curr) => {
      const prevExt = prev.agronomics?.extentsTotal1000ha || 0;
      const currExt = curr.agronomics?.extentsTotal1000ha || 0;
      return currExt >= prevExt ? curr : prev;
    }, records[0]);

    const agronomics = primaryRecord.agronomics || {};
    const extents = agronomics.extentsTotal1000ha || 0;
    const yMax = agronomics.yieldMaximumKgPerHa || 0;
    const yVs = agronomics.yieldVerySuitableKgPerHa || 0;
    const yS = agronomics.yieldSuitableKgPerHa || 0;
    const yMs = agronomics.yieldModeratelySuitableKgPerHa || 0;

    const totalSuitableArea =
      (agronomics.suitabilityVerySuitable1000ha || 0) +
      (agronomics.suitabilitySuitable1000ha || 0) +
      (agronomics.suitabilityModeratelySuitable1000ha || 0);

    // Gate 2: Biological & Agricultural Viability
    // Crop must have positive maximum attainable yield OR positive suitable land area
    if (yMax <= 0 && totalSuitableArea <= 0) {
      ineligibleCrops.push({
        cropId: cId,
        displayName: crop.displayName,
        category: crop.category,
        reason: `Agro-ecological conditions yield 0 kg/ha attainable yield and 0 suitable land extent.`,
        failedGate: 'ZERO_YIELD_VIABILITY',
        suitabilityRecord: primaryRecord,
      });
      continue;
    }

    // Gate 3: Water Regime Physical Constraints
    // For instance, wetland rice under rainfed conditions in arid/semi-arid regions
    if (waterRegime === 'rainfed' && crop.agronomicProfile?.waterRequirementRating === 'very_high') {
      if (yMax < 500 && totalSuitableArea <= 0) {
        ineligibleCrops.push({
          cropId: cId,
          displayName: crop.displayName,
          category: crop.category,
          reason: `Very high water-demand crop has insufficient precipitation-driven viability under rainfed regime.`,
          failedGate: 'WATER_REGIME_CONSTRAINT',
          suitabilityRecord: primaryRecord,
        });
        continue;
      }
    }

    // Passed all gates: Crop is eligible
    eligibleCrops.push({
      cropId: cId,
      displayName: crop.displayName,
      scientificName: crop.scientificName,
      category: crop.category,
      rotationRole: crop.rotationRole,
      agronomicProfile: crop.agronomicProfile,
      suitabilityRecord: primaryRecord,
      isCurrentCrop: currentCropId ? currentCropId.toLowerCase() === cId : false,
      eligibilityMetrics: {
        yieldMaximumKgPerHa: yMax,
        yieldVerySuitableKgPerHa: yVs,
        yieldSuitableKgPerHa: yS,
        yieldModeratelySuitableKgPerHa: yMs,
        extentsTotal1000ha: extents,
        totalSuitableArea1000ha: totalSuitableArea,
      },
    });
  }

  return { eligibleCrops, ineligibleCrops };
}

module.exports = { evaluateEligibility };

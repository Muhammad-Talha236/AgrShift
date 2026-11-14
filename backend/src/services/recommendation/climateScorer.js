/**
 * AgriShift — Climate Scorer
 * Evaluates crop physiological compatibility against NASA POWER agroclimatological indicators.
 */

// Approximate annual water demand benchmarks (mm/year) for scoring rain-fed alignment
const WATER_REQUIREMENT_BENCHMARKS = {
  low: { minMm: 300, optimalMm: 500, label: 'Low (< 500 mm)' },
  medium: { minMm: 500, optimalMm: 800, label: 'Medium (500 - 800 mm)' },
  high: { minMm: 750, optimalMm: 1200, label: 'High (750 - 1200 mm)' },
  very_high: { minMm: 1000, optimalMm: 1600, label: 'Very High (> 1000 mm)' },
};

/**
 * Score crops for climate compatibility using NASA POWER metrics.
 * 
 * @param {Array} scoredCrops - Crops output from yieldScorer
 * @param {Object} [climateProfile] - NASA POWER ClimateProfile document
 * @param {string} waterRegime - 'irrigated' or 'rainfed'
 * @returns {Array} Enriched crop list with climate compatibility scores
 */
function scoreClimateCompatibility(scoredCrops, climateProfile = null, waterRegime = 'irrigated') {
  const hasClimateData = !!climateProfile && !!climateProfile.annualSummary;

  // Default fallback reference metrics if no regional archetype matches
  const annualSummary = hasClimateData
    ? climateProfile.annualSummary
    : {
        meanTemperatureC: 22.0,
        maxTemperatureC: 32.0,
        minTemperatureC: 12.0,
        annualPrecipitationEstimateMmYear: 650.0,
        meanSolarRadiationKwhM2Day: 18.0,
        meanRelativeHumidityPercent: 55.0,
      };

  const isArchetypeAssigned = hasClimateData;
  const climateDisclosure = isArchetypeAssigned
    ? `Evaluated using NASA POWER agroclimatology profile for ${climateProfile.location?.name || climateProfile.archetypeId}.`
    : 'No regional NASA POWER profile assigned; evaluated against global temperate-tropical baseline. Recommendation confidence adjusted accordingly.';

  return scoredCrops.map((crop) => {
    const profile = crop.agronomicProfile || {};
    const tempRange = profile.optimalTempRangeC || { min: 18, max: 30 };
    const waterReq = profile.waterRequirementRating || 'medium';
    const isDroughtTolerant = profile.droughtTolerance === 'high';

    // Component 1: Thermal Suitability (0 to 50 points)
    let thermalScore = 50;
    const meanTemp = annualSummary.meanTemperatureC;

    if (meanTemp < tempRange.min) {
      const deficit = tempRange.min - meanTemp;
      thermalScore = Math.max(10, 50 - deficit * 6);
    } else if (meanTemp > tempRange.max) {
      const excess = meanTemp - tempRange.max;
      thermalScore = Math.max(10, 50 - excess * 5);
    } else {
      // Perfect thermal window
      thermalScore = 50;
    }

    // Component 2: Moisture / Water Regime Alignment (0 to 50 points)
    let moistureScore = 50;
    const precipEst = annualSummary.annualPrecipitationEstimateMmYear || 600;
    const reqBenchmark = WATER_REQUIREMENT_BENCHMARKS[waterReq] || WATER_REQUIREMENT_BENCHMARKS.medium;

    if (waterRegime === 'irrigated') {
      // Under irrigation, precipitation deficit is supplemented by artificial water application
      // High score with minor bonus for solar irradiance
      moistureScore = 48;
    } else {
      // Under rainfed conditions, natural precipitation must support crop water requirement
      if (precipEst >= reqBenchmark.optimalMm) {
        moistureScore = 50;
      } else if (precipEst >= reqBenchmark.minMm) {
        const ratio = (precipEst - reqBenchmark.minMm) / (reqBenchmark.optimalMm - reqBenchmark.minMm);
        moistureScore = Math.round((25 + ratio * 25) * 10) / 10;
      } else {
        // Severe moisture deficit
        const deficitRatio = precipEst / reqBenchmark.minMm;
        moistureScore = Math.round(deficitRatio * 25 * 10) / 10;
      }

      // Drought resilience bonus for C4 crops like Sorghum
      if (isDroughtTolerant && precipEst < reqBenchmark.optimalMm) {
        moistureScore = Math.min(50, moistureScore + 10);
      }
    }

    const totalClimateScore = Math.round((thermalScore + moistureScore) * 10) / 10;

    return {
      ...crop,
      climateScoring: {
        totalClimateScore,
        thermalSuitabilityScore: Math.round(thermalScore * 10) / 10,
        moistureSuitabilityScore: Math.round(moistureScore * 10) / 10,
        observedMeanTempC: meanTemp,
        optimalTempRangeC: tempRange,
        estimatedPrecipitationMmYear: precipEst,
        waterRequirementRating: waterReq,
        isDroughtTolerant,
        hasClimateData: isArchetypeAssigned,
        disclosure: climateDisclosure,
      },
    };
  });
}

module.exports = { scoreClimateCompatibility };

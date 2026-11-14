/**
 * AgriShift — Yield Scorer
 * Evaluates empirical GAEZ v5 attainable yields and land suitability extents.
 */

/**
 * Score eligible crops on attainable yield and land suitability coverage.
 * 
 * @param {Array} eligibleCrops - List of eligible crop objects from eligibilityEngine
 * @returns {Array} List of crops enriched with yield score and breakdown
 */
function scoreYields(eligibleCrops) {
  if (!eligibleCrops || eligibleCrops.length === 0) {
    return [];
  }

  // Find the cohort maximum attainable yield across eligible crops for normalization
  const maxCohortYield = Math.max(
    ...eligibleCrops.map((c) => c.eligibilityMetrics.yieldMaximumKgPerHa || 0),
    1 // Prevent division by zero
  );

  return eligibleCrops.map((crop) => {
    const metrics = crop.eligibilityMetrics;
    const yMax = metrics.yieldMaximumKgPerHa || 0;
    const yVs = metrics.yieldVerySuitableKgPerHa || 0;
    const yS = metrics.yieldSuitableKgPerHa || 0;
    const extents = metrics.extentsTotal1000ha || 1;
    const totalSuitable = metrics.totalSuitableArea1000ha || 0;

    // Component 1: Normalized Yield Potential (0 to 60 points)
    // Combines relative Ymax and average high-suitability yield (Y_VS / Y_S)
    const effectiveYield = yVs > 0 ? (yVs * 0.6 + yMax * 0.4) : (yS > 0 ? yS : yMax * 0.5);
    const yieldRatio = Math.min(effectiveYield / maxCohortYield, 1.0);
    const yieldPotentialScore = Math.round(yieldRatio * 60 * 10) / 10;

    // Component 2: Land Suitability Coverage Ratio (0 to 40 points)
    // Proportion of national agricultural land categorized as suitable
    const coverageRatio = extents > 0 ? Math.min(totalSuitable / extents, 1.0) : 0;
    const suitabilityCoverageScore = Math.round(coverageRatio * 40 * 10) / 10;

    // Composite Yield Score (0 to 100)
    const totalYieldScore = Math.round((yieldPotentialScore + suitabilityCoverageScore) * 10) / 10;

    return {
      ...crop,
      yieldScoring: {
        totalYieldScore,
        yieldPotentialScore,
        suitabilityCoverageScore,
        attainableYieldBenchmarkKgHa: effectiveYield,
        maxCohortYieldKgHa: maxCohortYield,
        landCoveragePercentage: Math.round(coverageRatio * 1000) / 10,
        provenanceNotice: 'Attainable yield derived from FAO/IIASA GAEZ v5 agro-ecological modeling; reflects optimal potential under historical AgERA5 baseline, not guaranteed field output.',
      },
    };
  });
}

module.exports = { scoreYields };

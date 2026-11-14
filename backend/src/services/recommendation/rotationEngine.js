/**
 * AgriShift — Explainable Crop Rotation Engine
 * Synthesizes three distinct rotation pathways:
 * 1. Economic Return
 * 2. Soil Restoration
 * 3. Water Resilience
 */

/**
 * Generate rotation transition explanation between current and recommended crop.
 */
function generateRotationTransition(currentCrop, nextCrop) {
  if (!currentCrop) {
    return {
      transitionType: 'NEW_ESTABLISHMENT',
      description: `Establish ${nextCrop.displayName} based on superior agro-ecological suitability in this country.`,
      benefits: ['Optimized for sovereign agro-ecological zone potential.'],
      precautions: ['Monitor regional weather patterns during germination phase.'],
    };
  }

  const currentId = currentCrop.cropId;
  const nextId = nextCrop.cropId;

  // Case 1: Monoculture continuation
  if (currentId === nextId) {
    return {
      transitionType: 'CONTINUOUS_CROPPING',
      description: `Continuing ${nextCrop.displayName} monoculture maintains familiar agronomic practices but carries cumulative soil-borne pathogen and nutrient depletion risks.`,
      benefits: ['Familiar farm management and established market channels.'],
      precautions: [
        'High risk of pest build-up and specific micronutrient depletion.',
        'Consider introducing cover crops or short-duration legume fallows between seasons.',
      ],
    };
  }

  // Case 2: Cereal to Legume (Optimal Rotation)
  if (nextCrop.agronomicProfile?.isNitrogenFixing) {
    return {
      transitionType: 'CEREAL_TO_LEGUME_BREAK',
      description: `Rotating from ${currentCrop.displayName} to legume ${nextCrop.displayName} provides biological nitrogen fixation via Rhizobium symbiosis, breaking cereal pathogen cycles.`,
      benefits: [
        'Biological atmospheric nitrogen fixation enriches the root zone for subsequent crops.',
        'Interrupts cereal-specific nematode, root-rot, and foliar disease cycles.',
        'Diversifies farm income with a high-protein crop.',
      ],
      precautions: [
        'Ensure proper Rhizobium inoculant is applied at planting if field lacks legume history.',
        'Note: Expected soil health benefits are based on established agronomic principles; in-situ soil nutrients are unmeasured in this observation dataset.',
      ],
    };
  }

  // Case 3: Transition to Drought-Tolerant C4 Cereal
  if (nextCrop.agronomicProfile?.droughtTolerance === 'high') {
    return {
      transitionType: 'WATER_CONSERVING_TRANSITION',
      description: `Switching from ${currentCrop.displayName} to drought-resilient ${nextCrop.displayName} conserves moisture reserves and stabilizes yield against precipitation deficits.`,
      benefits: [
        'High water-use efficiency (C4 photosynthetic pathway).',
        'Deep root architecture accesses subsoil residual moisture.',
        'Significantly lower irrigation energy and water cost.',
      ],
      precautions: [
        'Ensure local market channels or livestock feed off-take exists for grain sorghum.',
      ],
    };
  }

  // Case 4: Deep Taproot / Root Tuber Transition
  if (nextCrop.agronomicProfile?.rootDepthType === 'deep' && nextCrop.category?.includes('Root')) {
    return {
      transitionType: 'COMPACTED_PAN_BREAKER',
      description: `Rotating into ${nextCrop.displayName} breaks compacted plow-pan layers and alters root rhizosphere dynamics.`,
      benefits: [
        'Taproot penetration improves soil aeration and subsequent water infiltration.',
        'Disrupts surface weed seedbanks.',
      ],
      precautions: [
        'Avoid harvesting in wet soils to prevent subsoil compaction.',
      ],
    };
  }

  // Standard Cereal / Cash Crop Rotation
  return {
    transitionType: 'DIVERSITY_ROTATION',
    description: `Rotating from ${currentCrop.displayName} to ${nextCrop.displayName} diversifies cropping family and breaks seasonal monoculture pressures.`,
    benefits: [
      'Alters weed competition dynamics and seasonal canopy architecture.',
      'Spreads harvest labor and market volatility risk.',
    ],
    precautions: [
      'Adjust fertilizer N-P-K applications to match specific crop nutrient uptake curves.',
    ],
  };
}

/**
 * Synthesizes three independent pathways from scored eligible crops.
 * 
 * @param {Array} scoredCrops - Eligible crops enriched with yield & climate scores
 * @param {Object} [currentCrop] - User's current Crop document
 * @param {string} waterRegime - 'irrigated' or 'rainfed'
 * @returns {Object} Three pathways: economicReturn, soilRestoration, waterResilience
 */
function buildRotationPathways(scoredCrops, currentCrop = null, waterRegime = 'irrigated') {
  if (!scoredCrops || scoredCrops.length === 0) {
    return {
      economicReturn: null,
      soilRestoration: null,
      waterResilience: null,
      availableOptionsCount: 0,
    };
  }

  // Calculate composite hybrid score for each crop:
  // Hybrid = 0.5 * YieldScore + 0.3 * ClimateScore + 0.2 * DiversityBonus
  const evaluatedCrops = scoredCrops.map((c) => {
    const yieldScore = c.yieldScoring.totalYieldScore;
    const climateScore = c.climateScoring.totalClimateScore;
    const isDifferent = currentCrop ? c.cropId !== currentCrop.cropId : true;
    const diversityBonus = isDifferent ? 20 : 5; // Reward crop rotation diversity

    const compositeScore = Math.round((yieldScore * 0.5 + climateScore * 0.3 + diversityBonus) * 10) / 10;

    return {
      ...c,
      compositeScore,
      rotationTransition: generateRotationTransition(currentCrop, c),
    };
  });

  // Sort descending by composite score
  const sortedByComposite = [...evaluatedCrops].sort((a, b) => b.compositeScore - a.compositeScore);

  // -------------------------------------------------------------
  // PATHWAY A: Economic Return
  // Prioritizes highest composite yield & suitability potential
  // -------------------------------------------------------------
  // If possible, prefer a non-identical rotation unless no viable alternative exists
  const nonCurrentCrops = sortedByComposite.filter((c) => !c.isCurrentCrop);
  const economicChoice = nonCurrentCrops.length > 0 ? nonCurrentCrops[0] : sortedByComposite[0];

  const economicPathway = {
    strategyKey: 'ECONOMIC_RETURN',
    strategyTitle: 'Economic Return Pathway',
    summary: `Maximizes grain and commercial output using top attainable yields under verified sovereign agro-climatic conditions.`,
    recommendedCrop: {
      cropId: economicChoice.cropId,
      displayName: economicChoice.displayName,
      scientificName: economicChoice.scientificName,
      category: economicChoice.category,
      rotationRole: economicChoice.rotationRole,
    },
    compositeScore: economicChoice.compositeScore,
    scoreBreakdown: {
      yieldPotentialScore: economicChoice.yieldScoring.yieldPotentialScore,
      suitabilityCoverageScore: economicChoice.yieldScoring.suitabilityCoverageScore,
      totalYieldScore: economicChoice.yieldScoring.totalYieldScore,
      thermalSuitabilityScore: economicChoice.climateScoring.thermalSuitabilityScore,
      moistureSuitabilityScore: economicChoice.climateScoring.moistureSuitabilityScore,
      totalClimateScore: economicChoice.climateScoring.totalClimateScore,
    },
    keyMetrics: {
      attainableYieldKgHa: economicChoice.yieldScoring.attainableYieldBenchmarkKgHa,
      maximumAttainableYieldKgHa: economicChoice.eligibilityMetrics.yieldMaximumKgPerHa,
      landCoveragePercentage: economicChoice.yieldScoring.landCoveragePercentage,
      waterManagement: economicChoice.suitabilityRecord.dimensions.waterManagement,
    },
    rotationRationale: economicChoice.rotationTransition,
    disclosures: [
      economicChoice.yieldScoring.provenanceNotice,
      economicChoice.climateScoring.disclosure,
      'Does not guarantee market price realization or local input costs.',
    ],
  };

  // -------------------------------------------------------------
  // PATHWAY B: Soil Restoration
  // Prioritizes eligible legume rotations (especially soybean)
  // -------------------------------------------------------------
  const legumes = evaluatedCrops.filter((c) => c.agronomicProfile?.isNitrogenFixing);
  let soilChoice = null;
  let soilDisclosure = null;

  if (legumes.length > 0) {
    // Sort legumes by composite score
    legumes.sort((a, b) => b.compositeScore - a.compositeScore);
    soilChoice = legumes[0];
    soilDisclosure = `Prioritized ${soilChoice.displayName} as an eligible biological nitrogen-fixing legume to regenerate soil organic nitrogen without synthetic fertilizer dependency.`;
  } else {
    // Fallback: deep-rooted pan-breaking crop or high-biomass alternative
    const deepRooted = evaluatedCrops.filter((c) => c.agronomicProfile?.rootDepthType === 'deep' && !c.isCurrentCrop);
    if (deepRooted.length > 0) {
      deepRooted.sort((a, b) => b.compositeScore - a.compositeScore);
      soilChoice = deepRooted[0];
      soilDisclosure = `No nitrogen-fixing legume is verified eligible under current regime. Prioritized deep-rooted ${soilChoice.displayName} to break subsoil plow-pans and improve aeration.`;
    } else {
      soilChoice = sortedByComposite[0];
      soilDisclosure = `No distinct legume or pan-breaking crop was eligible; selected top resilient alternative.`;
    }
  }

  const soilPathway = {
    strategyKey: 'SOIL_RESTORATION',
    strategyTitle: 'Soil Restoration Pathway',
    summary: soilDisclosure,
    recommendedCrop: {
      cropId: soilChoice.cropId,
      displayName: soilChoice.displayName,
      scientificName: soilChoice.scientificName,
      category: soilChoice.category,
      rotationRole: soilChoice.rotationRole,
    },
    compositeScore: soilChoice.compositeScore,
    scoreBreakdown: {
      yieldPotentialScore: soilChoice.yieldScoring.yieldPotentialScore,
      suitabilityCoverageScore: soilChoice.yieldScoring.suitabilityCoverageScore,
      totalYieldScore: soilChoice.yieldScoring.totalYieldScore,
      thermalSuitabilityScore: soilChoice.climateScoring.thermalSuitabilityScore,
      moistureSuitabilityScore: soilChoice.climateScoring.moistureSuitabilityScore,
      totalClimateScore: soilChoice.climateScoring.totalClimateScore,
    },
    keyMetrics: {
      attainableYieldKgHa: soilChoice.yieldScoring.attainableYieldBenchmarkKgHa,
      maximumAttainableYieldKgHa: soilChoice.eligibilityMetrics.yieldMaximumKgPerHa,
      isNitrogenFixing: soilChoice.agronomicProfile?.isNitrogenFixing || false,
      waterManagement: soilChoice.suitabilityRecord.dimensions.waterManagement,
    },
    rotationRationale: soilChoice.rotationTransition,
    disclosures: [
      'Expected soil fertility benefits are derived from biological nitrogen fixation agronomic science; in-situ soil nutrients and microbial biomass are not directly measured in the observation data.',
      soilChoice.yieldScoring.provenanceNotice,
      soilChoice.climateScoring.disclosure,
    ],
  };

  // -------------------------------------------------------------
  // PATHWAY C: Water Resilience
  // Prioritizes drought-tolerant, water-efficient crops (e.g. Sorghum)
  // -------------------------------------------------------------
  const droughtTolerant = evaluatedCrops.filter((c) => c.agronomicProfile?.droughtTolerance === 'high');
  let waterChoice = null;
  let waterDisclosure = null;

  if (droughtTolerant.length > 0) {
    droughtTolerant.sort((a, b) => b.compositeScore - a.compositeScore);
    waterChoice = droughtTolerant[0];
    waterDisclosure = `Prioritized ${waterChoice.displayName} for its high drought tolerance (C4 photosynthetic pathway) and low water requirement to mitigate water stress risk.`;
  } else {
    // Select crop with lowest water requirement rating
    const lowWater = evaluatedCrops.filter((c) => c.agronomicProfile?.waterRequirementRating === 'low');
    if (lowWater.length > 0) {
      lowWater.sort((a, b) => b.compositeScore - a.compositeScore);
      waterChoice = lowWater[0];
      waterDisclosure = `Selected ${waterChoice.displayName} based on low water requirement rating.`;
    } else {
      // Best climate moisture scoring crop
      const bestMoisture = [...evaluatedCrops].sort(
        (a, b) => b.climateScoring.moistureSuitabilityScore - a.climateScoring.moistureSuitabilityScore
      );
      waterChoice = bestMoisture[0];
      waterDisclosure = `Selected ${waterChoice.displayName} based on highest moisture suitability index under regional climatology.`;
    }
  }

  const waterPathway = {
    strategyKey: 'WATER_RESILIENCE',
    strategyTitle: 'Water Resilience Pathway',
    summary: waterDisclosure,
    recommendedCrop: {
      cropId: waterChoice.cropId,
      displayName: waterChoice.displayName,
      scientificName: waterChoice.scientificName,
      category: waterChoice.category,
      rotationRole: waterChoice.rotationRole,
    },
    compositeScore: waterChoice.compositeScore,
    scoreBreakdown: {
      yieldPotentialScore: waterChoice.yieldScoring.yieldPotentialScore,
      suitabilityCoverageScore: waterChoice.yieldScoring.suitabilityCoverageScore,
      totalYieldScore: waterChoice.yieldScoring.totalYieldScore,
      thermalSuitabilityScore: waterChoice.climateScoring.thermalSuitabilityScore,
      moistureSuitabilityScore: waterChoice.climateScoring.moistureSuitabilityScore,
      totalClimateScore: waterChoice.climateScoring.totalClimateScore,
    },
    keyMetrics: {
      attainableYieldKgHa: waterChoice.yieldScoring.attainableYieldBenchmarkKgHa,
      maximumAttainableYieldKgHa: waterChoice.eligibilityMetrics.yieldMaximumKgPerHa,
      waterRequirementRating: waterChoice.agronomicProfile?.waterRequirementRating || 'medium',
      droughtTolerance: waterChoice.agronomicProfile?.droughtTolerance || 'medium',
      waterManagement: waterChoice.suitabilityRecord.dimensions.waterManagement,
    },
    rotationRationale: waterChoice.rotationTransition,
    disclosures: [
      `Evaluated under ${waterRegime.toUpperCase()} management with NASA POWER estimated precipitation.`,
      waterChoice.yieldScoring.provenanceNotice,
      waterChoice.climateScoring.disclosure,
    ],
  };

  return {
    economicReturn: economicPathway,
    soilRestoration: soilPathway,
    waterResilience: waterPathway,
    availableOptionsCount: evaluatedCrops.length,
    rankedAlternatives: evaluatedCrops.map((c) => ({
      cropId: c.cropId,
      displayName: c.displayName,
      compositeScore: c.compositeScore,
      attainableYieldKgHa: c.yieldScoring.attainableYieldBenchmarkKgHa,
      totalYieldScore: c.yieldScoring.totalYieldScore,
      totalClimateScore: c.climateScoring.totalClimateScore,
    })),
  };
}

module.exports = { buildRotationPathways, generateRotationTransition };

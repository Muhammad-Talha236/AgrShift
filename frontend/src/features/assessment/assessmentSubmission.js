export function buildRecommendationPayload(values) {
  return {
    country: values.country,
    currentCrop: values.currentCrop,
    waterRegime: values.waterRegime,
    managementLevel: values.managementLevel,
  };
}

export function validateRecommendationResponse(result) {
  if (result?.status === 'NO_ELIGIBLE_CROPS') {
    throw new Error('No eligible crops were found for these conditions. Go back and try another water regime or management level.');
  }
  if (result?.status !== 'SUCCESS' || !result.assessmentSummary ||
      !result.pathways || !Array.isArray(result.rankedAlternatives) ||
      !result.eligibilityAudit || !result.provenance ||
      ['economicReturn', 'soilRestoration', 'waterResilience'].some((key) =>
        typeof result.pathways[key]?.strategyTitle !== 'string' || !result.pathways[key].strategyTitle.trim())) {
    throw new Error('The server returned an incomplete recommendation. Please try again.');
  }
  return result;
}

export function submissionErrorMessage(error) {
  const message = error instanceof Error ? error.message : String(error);
  if (/No GAEZ data available/i.test(message)) {
    return 'No suitability data is available for this country and management combination. Go back and try another water regime or management level.';
  }
  if (/not found in the official GAEZ/i.test(message)) {
    return 'This country is no longer available in the suitability dataset. Go back and refresh the country list.';
  }
  if (/Failed to fetch|NetworkError|fetch failed/i.test(message)) {
    return 'Could not reach the recommendation service. Check your connection and try again.';
  }
  return message || 'The recommendation request failed. Please try again.';
}

// Lives in the assessment feature. A future route owner can receive the entire
// validated result through the wizard's onRecommendationsReady(result) callback.
export function createAssessmentSubmitter() {
  let inFlight = false;
  return {
    async submit(values, request, { onStart, onSuccess, onError, onComplete }) {
      if (inFlight) return null;
      inFlight = true;
      onStart();
      try {
        const result = validateRecommendationResponse(await request(buildRecommendationPayload(values)));
        onSuccess(result);
        return result;
      } catch (error) {
        onError(submissionErrorMessage(error));
        return null;
      } finally {
        inFlight = false;
        onComplete();
      }
    },
  };
}

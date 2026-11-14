import test from 'node:test';
import assert from 'node:assert/strict';
import { buildRecommendationPayload, createAssessmentSubmitter, validateRecommendationResponse } from './assessmentSubmission.js';

const values = { country: 'PAK', currentCrop: 'wheat', waterRegime: 'irrigated', managementLevel: 'high', ignored: 'local-only' };
const result = {
  status: 'SUCCESS',
  assessmentSummary: { country: { iso3: 'PAK', name: 'Pakistan' } },
  pathways: {
    economicReturn: { strategyTitle: 'Economic Return' },
    soilRestoration: { strategyTitle: 'Soil Restoration' },
    waterResilience: { strategyTitle: 'Water Resilience' },
  },
  rankedAlternatives: [],
  eligibilityAudit: { eligibleCount: 3 },
  provenance: { version: '1.0.0' },
};
const callbacks = (events) => ({
  onStart: () => events.push('start'),
  onSuccess: (data) => events.push(data),
  onError: (message) => events.push(message),
  onComplete: () => events.push('complete'),
});

test('builds only the backend request fields', () => {
  assert.deepEqual(buildRecommendationPayload(values), {
    country: 'PAK', currentCrop: 'wheat', waterRegime: 'irrigated', managementLevel: 'high',
  });
});

test('successful submission preserves the complete response', async () => {
  const events = [];
  const received = await createAssessmentSubmitter().submit(values, async (payload) => {
    assert.deepEqual(payload, buildRecommendationPayload(values));
    return result;
  }, callbacks(events));
  assert.strictEqual(received, result);
  assert.deepEqual(events, ['start', result, 'complete']);
  assert.strictEqual(validateRecommendationResponse(result), result);
});

test('network failure gives a retryable message without changing form values', async () => {
  const original = structuredClone(values);
  const events = [];
  const received = await createAssessmentSubmitter().submit(values, async () => {
    throw new TypeError('Failed to fetch');
  }, callbacks(events));
  assert.equal(received, null);
  assert.match(events[1], /Check your connection and try again/);
  assert.deepEqual(values, original);
  assert.equal(events.at(-1), 'complete');
});

test('backend validation error is shown and selections remain available for retry', async () => {
  const original = structuredClone(values);
  const events = [];
  const received = await createAssessmentSubmitter().submit(values, async () => {
    throw new Error('Invalid input: country must be a 3-letter ISO3 code.');
  }, callbacks(events));
  assert.equal(received, null);
  assert.match(events[1], /Invalid input/);
  assert.deepEqual(values, original);
});

test('missing suitability and no eligible crops are actionable failures', async () => {
  const submitter = createAssessmentSubmitter();
  const events = [];
  await submitter.submit(values, async () => {
    throw new Error("No GAEZ data available for country 'PAK' under management regime 'rainfed_low'.");
  }, callbacks(events));
  assert.match(events[1], /try another water regime or management level/);
  const retryEvents = [];
  await submitter.submit(values, async () => ({ status: 'NO_ELIGIBLE_CROPS', pathways: null }), callbacks(retryEvents));
  assert.match(retryEvents[1], /No eligible crops/);
});

test('incomplete success responses are rejected', async () => {
  const events = [];
  const received = await createAssessmentSubmitter().submit(values, async () => ({ status: 'SUCCESS' }), callbacks(events));
  assert.equal(received, null);
  assert.match(events[1], /incomplete recommendation/);
});

test('duplicate submissions are ignored until the first request finishes', async () => {
  let release;
  let calls = 0;
  const pending = new Promise((resolve) => { release = resolve; });
  const submitter = createAssessmentSubmitter();
  const events = [];
  const request = async () => { calls += 1; return pending; };
  const first = submitter.submit(values, request, callbacks(events));
  const second = await submitter.submit(values, request, callbacks(events));
  assert.equal(second, null);
  assert.equal(calls, 1);
  release(result);
  assert.strictEqual(await first, result);
  assert.deepEqual(events, ['start', result, 'complete']);
});

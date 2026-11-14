const path = require('path');
module.paths.push(path.resolve(__dirname, '../../backend/node_modules'));
require('dotenv').config({ path: path.resolve(__dirname, '../../backend/.env') });

const { connectDB, disconnectDB } = require('../../backend/src/config/database');
const { generateRecommendations } = require('../../backend/src/services/recommendation/recommendationEngine');

async function runRecommendationTests() {
  console.log('=== Starting AgriShift Recommendation Engine Test Suite ===\n');
  const results = [];

  try {
    await connectDB();
    console.log('MongoDB Atlas connection established.\n');

    // -------------------------------------------------------------------------
    // TEST 1: Pakistan Irrigated Wheat Rotation
    // -------------------------------------------------------------------------
    console.log('--- TEST 1: Pakistan Irrigated Wheat Rotation ---');
    try {
      const res1 = await generateRecommendations({
        country: 'PAK',
        currentCrop: 'wheat',
        waterRegime: 'irrigated',
        managementLevel: 'high',
      });

      const pass1 =
        res1.status === 'SUCCESS' &&
        res1.pathways.economicReturn &&
        res1.pathways.soilRestoration &&
        res1.pathways.waterResilience &&
        res1.pathways.soilRestoration.recommendedCrop.cropId === 'soybean';

      console.log(`  Status: ${res1.status}`);
      console.log(`  Economic Recommendation: ${res1.pathways.economicReturn.recommendedCrop.displayName} (Score: ${res1.pathways.economicReturn.compositeScore})`);
      console.log(`  Soil Restoration Recommendation: ${res1.pathways.soilRestoration.recommendedCrop.displayName} (Score: ${res1.pathways.soilRestoration.compositeScore})`);
      console.log(`  Water Resilience Recommendation: ${res1.pathways.waterResilience.recommendedCrop.displayName} (Score: ${res1.pathways.waterResilience.compositeScore})`);
      console.log(`  Result: ${pass1 ? 'PASS ✅' : 'FAIL ❌'}\n`);
      results.push({ testId: 1, name: 'Pakistan Irrigated Wheat Rotation', pass: pass1 });
    } catch (e) {
      console.error(`  Test 1 Failed with error: ${e.message}\n`);
      results.push({ testId: 1, name: 'Pakistan Irrigated Wheat Rotation', pass: false, error: e.message });
    }

    // -------------------------------------------------------------------------
    // TEST 2: Pakistan Rain-fed Wheat Rotation
    // -------------------------------------------------------------------------
    console.log('--- TEST 2: Pakistan Rain-fed Wheat Rotation ---');
    try {
      const res2 = await generateRecommendations({
        country: 'PAK',
        currentCrop: 'wheat',
        waterRegime: 'rainfed',
        managementLevel: 'high',
      });

      const pass2 =
        res2.status === 'SUCCESS' &&
        res2.assessmentSummary.evaluatedRegimeCode === 'rainfed_high' &&
        res2.pathways.waterResilience &&
        res2.pathways.waterResilience.recommendedCrop.cropId === 'sorghum';

      console.log(`  Status: ${res2.status}`);
      console.log(`  Water Resilience Recommendation: ${res2.pathways.waterResilience.recommendedCrop.displayName} (Attainable Yield: ${res2.pathways.waterResilience.keyMetrics.attainableYieldKgHa} kg/ha)`);
      console.log(`  Result: ${pass2 ? 'PASS ✅' : 'FAIL ❌'}\n`);
      results.push({ testId: 2, name: 'Pakistan Rain-fed Wheat Rotation', pass: pass2 });
    } catch (e) {
      console.error(`  Test 2 Failed with error: ${e.message}\n`);
      results.push({ testId: 2, name: 'Pakistan Rain-fed Wheat Rotation', pass: false, error: e.message });
    }

    // -------------------------------------------------------------------------
    // TEST 3: Rice-to-Legume Rotation
    // -------------------------------------------------------------------------
    console.log('--- TEST 3: Rice-to-Legume Rotation ---');
    try {
      const res3 = await generateRecommendations({
        country: 'PAK',
        currentCrop: 'rice',
        waterRegime: 'irrigated',
      });

      const soilRec = res3.pathways.soilRestoration;
      const pass3 =
        res3.status === 'SUCCESS' &&
        soilRec.recommendedCrop.cropId === 'soybean' &&
        soilRec.rotationRationale.transitionType === 'CEREAL_TO_LEGUME_BREAK' &&
        soilRec.keyMetrics.isNitrogenFixing === true;

      console.log(`  Current: Rice -> Soil Recommendation: ${soilRec.recommendedCrop.displayName}`);
      console.log(`  Transition Type: ${soilRec.rotationRationale.transitionType}`);
      console.log(`  Nitrogen Fixing: ${soilRec.keyMetrics.isNitrogenFixing}`);
      console.log(`  Result: ${pass3 ? 'PASS ✅' : 'FAIL ❌'}\n`);
      results.push({ testId: 3, name: 'Rice-to-Legume Rotation', pass: pass3 });
    } catch (e) {
      console.error(`  Test 3 Failed with error: ${e.message}\n`);
      results.push({ testId: 3, name: 'Rice-to-Legume Rotation', pass: false, error: e.message });
    }

    // -------------------------------------------------------------------------
    // TEST 4: Wheat-to-Sorghum Water-Resilience Pathway
    // -------------------------------------------------------------------------
    console.log('--- TEST 4: Wheat-to-Sorghum Water-Resilience Pathway ---');
    try {
      const res4 = await generateRecommendations({
        country: 'USA',
        currentCrop: 'wheat',
        waterRegime: 'rainfed',
      });

      const waterRec = res4.pathways.waterResilience;
      const pass4 =
        res4.status === 'SUCCESS' &&
        waterRec.recommendedCrop.cropId === 'sorghum' &&
        waterRec.keyMetrics.droughtTolerance === 'high';

      console.log(`  Water Resilience Crop: ${waterRec.recommendedCrop.displayName}`);
      console.log(`  Drought Tolerance: ${waterRec.keyMetrics.droughtTolerance}`);
      console.log(`  Water Requirement: ${waterRec.keyMetrics.waterRequirementRating}`);
      console.log(`  Result: ${pass4 ? 'PASS ✅' : 'FAIL ❌'}\n`);
      results.push({ testId: 4, name: 'Wheat-to-Sorghum Water-Resilience Pathway', pass: pass4 });
    } catch (e) {
      console.error(`  Test 4 Failed with error: ${e.message}\n`);
      results.push({ testId: 4, name: 'Wheat-to-Sorghum Water-Resilience Pathway', pass: false, error: e.message });
    }

    // -------------------------------------------------------------------------
    // TEST 5: Invalid ISO3 Code
    // -------------------------------------------------------------------------
    console.log('--- TEST 5: Invalid ISO3 Code ---');
    try {
      await generateRecommendations({ country: 'INVALID' });
      console.log('  Result: FAIL ❌ (Should have thrown error)\n');
      results.push({ testId: 5, name: 'Invalid ISO3 Code', pass: false });
    } catch (e) {
      const pass5 = e.message.includes('Must be a 3-letter sovereign code');
      console.log(`  Caught expected error: "${e.message}"`);
      console.log(`  Result: ${pass5 ? 'PASS ✅' : 'FAIL ❌'}\n`);
      results.push({ testId: 5, name: 'Invalid ISO3 Code', pass: pass5 });
    }

    // -------------------------------------------------------------------------
    // TEST 6: Unsupported Current Crop
    // -------------------------------------------------------------------------
    console.log('--- TEST 6: Unsupported Current Crop ---');
    try {
      await generateRecommendations({ country: 'PAK', currentCrop: 'dragonfruit' });
      console.log('  Result: FAIL ❌ (Should have thrown error)\n');
      results.push({ testId: 6, name: 'Unsupported Current Crop', pass: false });
    } catch (e) {
      const pass6 = e.message.includes('not recognized in the agricultural catalog');
      console.log(`  Caught expected error: "${e.message}"`);
      console.log(`  Result: ${pass6 ? 'PASS ✅' : 'FAIL ❌'}\n`);
      results.push({ testId: 6, name: 'Unsupported Current Crop', pass: pass6 });
    }

    // -------------------------------------------------------------------------
    // TEST 7: Missing Climate Profile (Graceful Fallback)
    // -------------------------------------------------------------------------
    console.log('--- TEST 7: Missing Climate Profile (Graceful Fallback) ---');
    try {
      // France (FRA) exists in GAEZ v5 but has no specific benchmark archetype
      const res7 = await generateRecommendations({
        country: 'FRA',
        waterRegime: 'rainfed',
      });

      const pass7 =
        res7.status === 'SUCCESS' &&
        res7.assessmentSummary.climateProfileApplied.archetypeId === 'fallback_global_baseline' &&
        res7.pathways.economicReturn != null;

      console.log(`  Status: ${res7.status}`);
      console.log(`  Climate Archetype: ${res7.assessmentSummary.climateProfileApplied.archetypeId}`);
      console.log(`  Note: ${res7.assessmentSummary.climateProfileApplied.note}`);
      console.log(`  Result: ${pass7 ? 'PASS ✅' : 'FAIL ❌'}\n`);
      results.push({ testId: 7, name: 'Missing Climate Profile Fallback', pass: pass7 });
    } catch (e) {
      console.error(`  Test 7 Failed with error: ${e.message}\n`);
      results.push({ testId: 7, name: 'Missing Climate Profile Fallback', pass: false, error: e.message });
    }

    // -------------------------------------------------------------------------
    // TEST 8: Missing Yield Indicators & Ineligibility Filter (Partial Ineligibility)
    // -------------------------------------------------------------------------
    console.log('--- TEST 8: Missing Yield Indicators & Ineligibility Filter ---');
    try {
      // In Egypt (EGY) rainfed, many crops have 0 rainfed yield due to hyper-arid climate
      const res8 = await generateRecommendations({
        country: 'EGY',
        waterRegime: 'rainfed',
      });

      const pass8 =
        res8.status === 'SUCCESS' &&
        res8.eligibilityAudit &&
        res8.eligibilityAudit.ineligibleCount > 0;

      console.log(`  Country: EGY (Egypt) Rain-fed`);
      console.log(`  Total Evaluated: ${res8.eligibilityAudit.totalCropsEvaluated}`);
      console.log(`  Eligible Count: ${res8.eligibilityAudit.eligibleCount}`);
      console.log(`  Ineligible Count: ${res8.eligibilityAudit.ineligibleCount}`);
      console.log(`  Sample Ineligible Crop: ${res8.eligibilityAudit.ineligibleDetails[0].displayName} (${res8.eligibilityAudit.ineligibleDetails[0].reason})`);
      console.log(`  Result: ${pass8 ? 'PASS ✅' : 'FAIL ❌'}\n`);
      results.push({ testId: 8, name: 'Missing Yield Indicators & Ineligibility Filter', pass: pass8 });
    } catch (e) {
      console.error(`  Test 8 Failed with error: ${e.message}\n`);
      results.push({ testId: 8, name: 'Missing Yield Indicators & Ineligibility Filter', pass: false, error: e.message });
    }

    // -------------------------------------------------------------------------
    // TEST 9: Duplicate Country Records (GBR)
    // -------------------------------------------------------------------------
    console.log('--- TEST 9: Duplicate Country Records (GBR) ---');
    try {
      const res9 = await generateRecommendations({
        country: 'GBR',
        currentCrop: 'wheat',
        waterRegime: 'rainfed',
      });

      const pass9 =
        res9.status === 'SUCCESS' &&
        res9.assessmentSummary.country.iso3 === 'GBR' &&
        res9.pathways.economicReturn != null;

      console.log(`  Status: ${res9.status}`);
      console.log(`  Country: ${res9.assessmentSummary.country.name} (${res9.assessmentSummary.country.iso3})`);
      console.log(`  Top Economic Choice: ${res9.pathways.economicReturn.recommendedCrop.displayName}`);
      console.log(`  Result: ${pass9 ? 'PASS ✅' : 'FAIL ❌'}\n`);
      results.push({ testId: 9, name: 'Duplicate Country Records (GBR)', pass: pass9 });
    } catch (e) {
      console.error(`  Test 9 Failed with error: ${e.message}\n`);
      results.push({ testId: 9, name: 'Duplicate Country Records (GBR)', pass: false, error: e.message });
    }

    // -------------------------------------------------------------------------
    // TEST 10: No Eligible Alternative Crop Handling
    // -------------------------------------------------------------------------
    console.log('--- TEST 10: No Eligible Alternative Crop Handling ---');
    try {
      // In Iceland (ISL) rainfed, sub-polar conditions produce 0 attainable yield across all crops
      const res10 = await generateRecommendations({
        country: 'ISL',
        waterRegime: 'rainfed',
      });

      const pass10 =
        res10.status === 'NO_ELIGIBLE_CROPS' &&
        res10.eligibilityAudit &&
        res10.eligibilityAudit.eligibleCount === 0 &&
        res10.eligibilityAudit.ineligibleCount > 0;

      console.log(`  Country: ISL (Iceland) Rain-fed`);
      console.log(`  Status: ${res10.status}`);
      console.log(`  Message: ${res10.message}`);
      console.log(`  Eligible Count: ${res10.eligibilityAudit.eligibleCount}`);
      console.log(`  Ineligible Count: ${res10.eligibilityAudit.ineligibleCount}`);
      console.log(`  Result: ${pass10 ? 'PASS ✅' : 'FAIL ❌'}\n`);
      results.push({ testId: 10, name: 'No Eligible Alternative Crop Handling', pass: pass10 });
    } catch (e) {
      console.error(`  Test 10 Failed with error: ${e.message}\n`);
      results.push({ testId: 10, name: 'No Eligible Alternative Crop Handling', pass: false, error: e.message });
    }

    // -------------------------------------------------------------------------
    // Summary
    // -------------------------------------------------------------------------
    console.log('========================================');
    const allPassed = results.every((r) => r.pass);
    console.log(`RECOMMENDATION TEST RESULTS: ${results.filter((r) => r.pass).length} / ${results.length} PASSED`);
    console.log(`FINAL OUTCOME: ${allPassed ? 'ALL 10 TESTS PASSED ✅' : 'SOME TESTS FAILED ❌'}`);
    console.log('========================================');

    return { allPassed, results };
  } catch (err) {
    console.error('Test Suite encountered fatal error:', err);
    throw err;
  } finally {
    await disconnectDB();
    console.log('MongoDB connection closed.');
  }
}

if (require.main === module) {
  runRecommendationTests()
    .then((res) => process.exit(res.allPassed ? 0 : 1))
    .catch(() => process.exit(1));
}

module.exports = { runRecommendationTests };

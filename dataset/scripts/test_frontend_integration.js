const path = require('path');
module.paths.push(path.resolve(__dirname, '../../backend/node_modules'));
require('dotenv').config({ path: path.resolve(__dirname, '../../backend/.env') });

const http = require('http');
const app = require('../../backend/src/app');
const { connectDB, disconnectDB } = require('../../backend/src/config/database');

async function runFrontendIntegrationTests() {
  console.log('=== Starting AgriShift Frontend UI/UX Integration Test Suite ===\n');
  const results = [];

  await connectDB();
  console.log('MongoDB Atlas connection established.');

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  console.log(`Backend server listening on internal port ${port}\n`);

  const request = (method, pathUrl, body = null) => {
    return new Promise((resolve, reject) => {
      const opts = {
        host: '127.0.0.1',
        port,
        path: pathUrl,
        method,
        headers: body ? { 'Content-Type': 'application/json' } : {},
      };
      const req = http.request(opts, (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(data) });
          } catch (e) {
            resolve({ status: res.statusCode, data });
          }
        });
      });
      req.on('error', reject);
      if (body) req.write(JSON.stringify(body));
      req.end();
    });
  };

  try {
    // -------------------------------------------------------------------------
    // TEST 1: Load Countries API
    // -------------------------------------------------------------------------
    console.log('--- TEST 1: Load Countries API ---');
    const res1 = await request('GET', '/api/recommendations/countries');
    const pass1 = res1.status === 200 && res1.data.count === 188 && Array.isArray(res1.data.data);
    console.log(`  Status: ${res1.status} | Total Countries: ${res1.data.count}`);
    console.log(`  Sample: ${res1.data.data[0].name} (${res1.data.data[0].iso3})`);
    console.log(`  Result: ${pass1 ? 'PASS ✅' : 'FAIL ❌'}\n`);
    results.push({ testId: 1, name: 'Load Countries API', pass: pass1 });

    // -------------------------------------------------------------------------
    // TEST 2: Load Crop Catalog API
    // -------------------------------------------------------------------------
    console.log('--- TEST 2: Load Crop Catalog API ---');
    const res2 = await request('GET', '/api/recommendations/crops');
    const pass2 = res2.status === 200 && res2.data.count === 8 && Array.isArray(res2.data.data);
    console.log(`  Status: ${res2.status} | Total Crops: ${res2.data.count}`);
    console.log(`  Crops: ${res2.data.data.map((c) => c.displayName).join(', ')}`);
    console.log(`  Result: ${pass2 ? 'PASS ✅' : 'FAIL ❌'}\n`);
    results.push({ testId: 2, name: 'Load Crop Catalog API', pass: pass2 });

    // -------------------------------------------------------------------------
    // TEST 3: Submit Pakistan + Wheat + Irrigated
    // -------------------------------------------------------------------------
    console.log('--- TEST 3: Submit Pakistan + Wheat + Irrigated ---');
    const res3 = await request('POST', '/api/recommendations', {
      country: 'PAK',
      currentCrop: 'wheat',
      waterRegime: 'irrigated',
      managementLevel: 'high',
    });
    const p3 = res3.data.data?.pathways;
    const pass3 =
      res3.status === 200 &&
      p3.economicReturn.recommendedCrop.cropId !== 'wheat' &&
      p3.soilRestoration.recommendedCrop.cropId === 'soybean';
    console.log(`  Status: ${res3.status}`);
    console.log(`  Economic: ${p3.economicReturn.recommendedCrop.displayName} (Yield: ${p3.economicReturn.keyMetrics.attainableYieldKgHa} kg/ha)`);
    console.log(`  Soil: ${p3.soilRestoration.recommendedCrop.displayName} (N-Fixer: ${p3.soilRestoration.keyMetrics.isNitrogenFixing})`);
    console.log(`  Water: ${p3.waterResilience.recommendedCrop.displayName}`);
    console.log(`  Result: ${pass3 ? 'PASS ✅' : 'FAIL ❌'}\n`);
    results.push({ testId: 3, name: 'Submit Pakistan + Wheat + Irrigated', pass: pass3 });

    // -------------------------------------------------------------------------
    // TEST 4: Submit Pakistan + Wheat + Rainfed
    // -------------------------------------------------------------------------
    console.log('--- TEST 4: Submit Pakistan + Wheat + Rainfed ---');
    const res4 = await request('POST', '/api/recommendations', {
      country: 'PAK',
      currentCrop: 'wheat',
      waterRegime: 'rainfed',
      managementLevel: 'high',
    });
    const p4 = res4.data.data?.pathways;
    const pass4 =
      res4.status === 200 &&
      p4.waterResilience.recommendedCrop.cropId === 'sorghum' &&
      p4.waterResilience.keyMetrics.droughtTolerance === 'high';
    console.log(`  Status: ${res4.status}`);
    console.log(`  Water Resilience Recommendation: ${p4.waterResilience.recommendedCrop.displayName}`);
    console.log(`  Drought Tolerance: ${p4.waterResilience.keyMetrics.droughtTolerance}`);
    console.log(`  Result: ${pass4 ? 'PASS ✅' : 'FAIL ❌'}\n`);
    results.push({ testId: 4, name: 'Submit Pakistan + Wheat + Rainfed', pass: pass4 });

    // -------------------------------------------------------------------------
    // TEST 5: Verify All Three Pathways Generated Independently
    // -------------------------------------------------------------------------
    console.log('--- TEST 5: Verify All Three Pathways Generated Independently ---');
    const pathwaysValid =
      p3.economicReturn &&
      p3.soilRestoration &&
      p3.waterResilience &&
      p3.economicReturn.strategyKey === 'ECONOMIC_RETURN' &&
      p3.soilRestoration.strategyKey === 'SOIL_RESTORATION' &&
      p3.waterResilience.strategyKey === 'WATER_RESILIENCE';
    console.log(`  All 3 Pathways Distinct & Structured: ${pathwaysValid}`);
    console.log(`  Result: ${pathwaysValid ? 'PASS ✅' : 'FAIL ❌'}\n`);
    results.push({ testId: 5, name: 'Verify All Three Pathways Generated', pass: pathwaysValid });

    // -------------------------------------------------------------------------
    // TEST 6: Display API Errors Correctly (Validation & Not Found)
    // -------------------------------------------------------------------------
    console.log('--- TEST 6: Display API Errors Correctly ---');
    const res6a = await request('POST', '/api/recommendations', { country: 'BAD_CODE' });
    const res6b = await request('POST', '/api/recommendations', { country: 'PAK', currentCrop: 'unknown_crop' });
    const pass6 = res6a.status === 400 && res6b.status === 404;
    console.log(`  Validation error code: ${res6a.status} (Expected 400) -> Error: ${res6a.data.error}`);
    console.log(`  Not found error code: ${res6b.status} (Expected 404) -> Error: ${res6b.data.error}`);
    console.log(`  Result: ${pass6 ? 'PASS ✅' : 'FAIL ❌'}\n`);
    results.push({ testId: 6, name: 'Display API Errors Correctly', pass: pass6 });

    // -------------------------------------------------------------------------
    // TEST 7: Display Missing Climate Fallback Correctly
    // -------------------------------------------------------------------------
    console.log('--- TEST 7: Display Missing Climate Fallback Correctly ---');
    const res7 = await request('POST', '/api/recommendations', { country: 'FRA', waterRegime: 'rainfed' });
    const climateInfo = res7.data.data?.assessmentSummary?.climateProfileApplied;
    const pass7 =
      res7.status === 200 &&
      climateInfo.isRegionalArchetype === false &&
      climateInfo.archetypeId === 'fallback_global_baseline' &&
      climateInfo.confidenceRating === 'GLOBAL_BASELINE_FALLBACK';
    console.log(`  Climate Archetype: ${climateInfo.archetypeId}`);
    console.log(`  isRegionalArchetype: ${climateInfo.isRegionalArchetype}`);
    console.log(`  confidenceRating: ${climateInfo.confidenceRating}`);
    console.log(`  Result: ${pass7 ? 'PASS ✅' : 'FAIL ❌'}\n`);
    results.push({ testId: 7, name: 'Missing Climate Fallback', pass: pass7 });

    // -------------------------------------------------------------------------
    // TEST 8: Missing Yield Values / Ineligible Crops Filter
    // -------------------------------------------------------------------------
    console.log('--- TEST 8: Missing Yield Values & Ineligibility Filter ---');
    const res8 = await request('POST', '/api/recommendations', { country: 'EGY', waterRegime: 'rainfed' });
    const audit = res8.data.data?.eligibilityAudit;
    const pass8 = res8.status === 200 && audit.ineligibleCount > 0;
    console.log(`  Country: EGY (Egypt) Rain-fed`);
    console.log(`  Ineligible crops flagged: ${audit.ineligibleCount}`);
    console.log(`  First filtered crop: ${audit.ineligibleDetails[0].displayName} (${audit.ineligibleDetails[0].failedGate})`);
    console.log(`  Result: ${pass8 ? 'PASS ✅' : 'FAIL ❌'}\n`);
    results.push({ testId: 8, name: 'Missing Yield Values Filter', pass: pass8 });

    // -------------------------------------------------------------------------
    // TEST 9: Verify Current Crop Is NOT Presented As Alternative
    // -------------------------------------------------------------------------
    console.log('--- TEST 9: Current Crop Exclusion from Alternatives ---');
    const res9 = await request('POST', '/api/recommendations', {
      country: 'PAK',
      currentCrop: 'wheat',
      waterRegime: 'irrigated',
    });
    const d9 = res9.data.data?.pathways;
    const pass9 =
      d9.economicReturn.recommendedCrop.cropId !== 'wheat' &&
      d9.soilRestoration.recommendedCrop.cropId !== 'wheat' &&
      d9.waterResilience.recommendedCrop.cropId !== 'wheat';
    console.log(`  Current Crop: wheat`);
    console.log(`  Economic Alternative: ${d9.economicReturn.recommendedCrop.cropId}`);
    console.log(`  Soil Alternative: ${d9.soilRestoration.recommendedCrop.cropId}`);
    console.log(`  Water Alternative: ${d9.waterResilience.recommendedCrop.cropId}`);
    console.log(`  Result: ${pass9 ? 'PASS ✅' : 'FAIL ❌'}\n`);
    results.push({ testId: 9, name: 'Current Crop Exclusion', pass: pass9 });

    // -------------------------------------------------------------------------
    // TEST 10: Frontend Asset Compilation & Responsive Build
    // -------------------------------------------------------------------------
    console.log('--- TEST 10: Frontend Asset Compilation & Build ---');
    const fs = require('fs');
    const distHtml = path.resolve(__dirname, '../../frontend/dist/index.html');
    const distJs = fs.readdirSync(path.resolve(__dirname, '../../frontend/dist/assets')).filter((f) => f.endsWith('.js'));
    const distCss = fs.readdirSync(path.resolve(__dirname, '../../frontend/dist/assets')).filter((f) => f.endsWith('.css'));
    const pass10 = fs.existsSync(distHtml) && distJs.length > 0 && distCss.length > 0;
    console.log(`  dist/index.html exists: ${fs.existsSync(distHtml)}`);
    console.log(`  Bundled JS chunks: ${distJs.join(', ')}`);
    console.log(`  Bundled CSS chunks: ${distCss.join(', ')}`);
    console.log(`  Result: ${pass10 ? 'PASS ✅' : 'FAIL ❌'}\n`);
    results.push({ testId: 10, name: 'Frontend Asset Build Verification', pass: pass10 });

    console.log('========================================');
    const allPassed = results.every((r) => r.pass);
    console.log(`FRONTEND INTEGRATION TESTS: ${results.filter((r) => r.pass).length} / ${results.length} PASSED`);
    console.log(`OVERALL STATUS: ${allPassed ? 'ALL 10 TESTS PASSED ✅' : 'SOME TESTS FAILED ❌'}`);
    console.log('========================================');

    return { allPassed, results };
  } finally {
    server.close();
    await disconnectDB();
    console.log('Test probe server and DB disconnected.');
  }
}

if (require.main === module) {
  runFrontendIntegrationTests()
    .then((r) => process.exit(r.allPassed ? 0 : 1))
    .catch((e) => {
      console.error('Frontend integration tests failed:', e);
      process.exit(1);
    });
}

module.exports = { runFrontendIntegrationTests };

const path = require('path');
module.paths.push(path.resolve(__dirname, '../../backend/node_modules'));
require('dotenv').config({ path: path.resolve(__dirname, '../../backend/.env') });

const { connectDB, disconnectDB } = require('../../backend/src/config/database');
const {
  Crop,
  CropSuitability,
  ClimateProfile,
  DatasetMetadata,
} = require('../../backend/src/models');

async function runTests() {
  console.log('=== Starting AgriShift Database Verification Tests ===\n');
  const results = {};

  try {
    await connectDB();
    console.log('Connected to MongoDB Atlas.\n');

    // TEST 1: Actual Imported Record Counts
    console.log('--- TEST 1: Record Counts Verification ---');
    const cropCount = await Crop.countDocuments();
    const suitabilityCount = await CropSuitability.countDocuments();
    const powerCount = await ClimateProfile.countDocuments();
    const metaCount = await DatasetMetadata.countDocuments();

    console.log(`Crops: ${cropCount} (Target: 8) -> ${cropCount === 8 ? 'PASS' : 'FAIL'}`);
    console.log(`Suitability Records: ${suitabilityCount} (Target: 2758) -> ${suitabilityCount === 2758 ? 'PASS' : 'FAIL'}`);
    console.log(`Climate Profiles: ${powerCount} (Target: 5) -> ${powerCount === 5 ? 'PASS' : 'FAIL'}`);
    console.log(`Metadata Records: ${metaCount} (Target: 2) -> ${metaCount === 2 ? 'PASS' : 'FAIL'}`);

    results.test1_counts = {
      crops: cropCount,
      suitabilities: suitabilityCount,
      climate_profiles: powerCount,
      metadata: metaCount,
      pass: cropCount === 8 && suitabilityCount === 2758 && powerCount === 5 && metaCount === 2,
    };

    // TEST 2: Crop-Specific Retrieval
    console.log('\n--- TEST 2: Crop-Specific Retrieval ---');
    const targetCrops = ['rice', 'wheat', 'maize', 'soybean', 'cotton', 'sugarcane', 'sorghum', 'potato'];
    const cropDistribution = {};
    for (const c of targetCrops) {
      const cnt = await CropSuitability.countDocuments({ 'dimensions.cropId': c });
      cropDistribution[c] = cnt;
      console.log(`  Crop '${c}': ${cnt} records in DB`);
    }
    const allCropsFound = targetCrops.every((c) => cropDistribution[c] > 0);
    console.log(`Crop Retrieval Test: ${allCropsFound ? 'PASS' : 'FAIL'}`);
    results.test2_crop_retrieval = { distribution: cropDistribution, pass: allCropsFound };

    // TEST 3: Country-Specific Retrieval
    console.log('\n--- TEST 3: Country-Specific Retrieval ---');
    const testIso3s = ['PAK', 'USA', 'KEN', 'BRA', 'EGY'];
    const countryResults = {};
    for (const iso of testIso3s) {
      const recs = await CropSuitability.find({ 'dimensions.iso3': iso }).select('dimensions agronomics');
      countryResults[iso] = {
        country: recs[0]?.dimensions?.countryName,
        total_slices: recs.length,
        crops_available: [...new Set(recs.map((r) => r.dimensions.cropDisplayName))],
      };
      console.log(`  Country ${iso} (${countryResults[iso].country}): ${recs.length} slices, crops: ${countryResults[iso].crops_available.join(', ')}`);
    }
    const countryPass = testIso3s.every((iso) => countryResults[iso].total_slices > 0);
    console.log(`Country Retrieval Test: ${countryPass ? 'PASS' : 'FAIL'}`);
    results.test3_country_retrieval = { countries: countryResults, pass: countryPass };

    // TEST 4: Irrigated vs Rain-Fed Comparison
    console.log('\n--- TEST 4: Irrigated vs Rain-fed Comparison Query ---');
    // Compare Wheat in Pakistan (PAK) or USA (USA)
    const wheatPak = await CropSuitability.find({
      'dimensions.iso3': 'PAK',
      'dimensions.cropId': 'wheat',
    });
    console.log(`  Wheat in Pakistan - Slices found: ${wheatPak.length}`);
    for (const s of wheatPak) {
      console.log(`    Regime: ${s.dimensions.waterManagement} | Extent: ${s.agronomics.extentsTotal1000ha} 10^3 ha | Ymax: ${s.agronomics.yieldMaximumKgPerHa} kg/ha | Y_VS: ${s.agronomics.yieldVerySuitableKgPerHa} kg/ha`);
    }
    const comparisonPass = wheatPak.length >= 2;
    console.log(`Comparison Test: ${comparisonPass ? 'PASS' : 'FAIL'}`);
    results.test4_comparison = { wheat_pak_count: wheatPak.length, pass: comparisonPass };

    // TEST 5: Numeric Yield Values (Check for nulls or negative yields)
    console.log('\n--- TEST 5: Numeric Yield Validation ---');
    const invalidYields = await CropSuitability.countDocuments({
      $or: [
        { 'agronomics.yieldMaximumKgPerHa': { $exists: false } },
        { 'agronomics.yieldMaximumKgPerHa': null },
        { 'agronomics.yieldMaximumKgPerHa': { $lt: 0 } },
        { 'agronomics.yieldModeratelySuitableKgPerHa': { $exists: false } },
        { 'agronomics.yieldModeratelySuitableKgPerHa': null },
      ],
    });
    console.log(`  Invalid/null yield documents: ${invalidYields}`);
    const yieldPass = invalidYields === 0;
    console.log(`Yield Validation Test: ${yieldPass ? 'PASS' : 'FAIL'}`);
    results.test5_numeric_yields = { invalid_count: invalidYields, pass: yieldPass };

    // TEST 6: Duplicate GBR Handling
    console.log('\n--- TEST 6: Duplicate GBR Records Verification ---');
    const gbrRecs = await CropSuitability.find({ 'dimensions.iso3': 'GBR' });
    console.log(`  Total GBR records found: ${gbrRecs.length} (Expected: 30)`);
    // Group GBR by crop and regime
    const gbrGroups = {};
    for (const g of gbrRecs) {
      const key = `${g.dimensions.cropId}_${g.dimensions.waterManagement}`;
      gbrGroups[key] = (gbrGroups[key] || 0) + 1;
    }
    const allGbrDuplicated = Object.values(gbrGroups).every((cnt) => cnt === 2);
    console.log(`  Each GBR slice has exactly 2 sub-region rows: ${allGbrDuplicated}`);
    const gbrPass = gbrRecs.length === 30 && allGbrDuplicated;
    console.log(`GBR Duplicate Test: ${gbrPass ? 'PASS' : 'FAIL'}`);
    results.test6_gbr_duplicates = { total_gbr: gbrRecs.length, pass: gbrPass };

    // TEST 7: NASA POWER Climate Profile Retrieval
    console.log('\n--- TEST 7: NASA POWER Climate Profile Retrieval ---');
    const archetypes = ['punjab_indus_basin', 'us_corn_belt_iowa', 'kenya_rift_valley', 'brazil_cerrado_matogrosso', 'egypt_nile_delta'];
    const powerTestResults = {};
    for (const arch of archetypes) {
      const profile = await ClimateProfile.findOne({ archetypeId: arch });
      powerTestResults[arch] = {
        found: !!profile,
        name: profile?.location?.name,
        annual_temp: profile?.annualSummary?.meanTemperatureC,
        annual_precip_est: profile?.annualSummary?.annualPrecipitationEstimateMmYear,
      };
      console.log(`  Archetype '${arch}' -> Found: ${!!profile} | Temp: ${profile?.annualSummary?.meanTemperatureC}°C | Precip Est: ${profile?.annualSummary?.annualPrecipitationEstimateMmYear} mm/yr`);
    }
    const powerPass = archetypes.every((arch) => powerTestResults[arch].found);
    console.log(`NASA POWER Test: ${powerPass ? 'PASS' : 'FAIL'}`);
    results.test7_power_profiles = { profiles: powerTestResults, pass: powerPass };

    const allPassed = Object.values(results).every((t) => t.pass);
    console.log(`\n========================================`);
    console.log(`ALL 7 TESTS RESULT: ${allPassed ? 'ALL TESTS PASSED ✅' : 'SOME TESTS FAILED ❌'}`);
    console.log(`========================================`);

    return results;
  } catch (err) {
    console.error('Test execution failed:', err);
    throw err;
  } finally {
    await disconnectDB();
    console.log('MongoDB connection closed.');
  }
}

if (require.main === module) {
  runTests()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { runTests };

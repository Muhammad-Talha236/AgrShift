const path = require('path');
module.paths.push(path.resolve(__dirname, '../../backend/node_modules'));
require('dotenv').config({ path: path.resolve(__dirname, '../../backend/.env') });
const fs = require('fs');
const { connectDB, disconnectDB } = require('../../backend/src/config/database');
const {
  Crop,
  CropSuitability,
  ClimateProfile,
  DatasetMetadata,
} = require('../../backend/src/models');

const PROCESSED_DIR = path.resolve(__dirname, '../processed');

const CROPS_SEED_DATA = [
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
      soilPreferences: ['Loam', 'Clay Loam', 'Silt Loam'],
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
      soilPreferences: ['Clay', 'Clay Loam', 'Silty Clay'],
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
      soilPreferences: ['Loam', 'Sandy Loam', 'Well-drained'],
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
      soilPreferences: ['Loam', 'Sandy Loam', 'Clay Loam'],
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
      soilPreferences: ['Deep Loam', 'Alluvial', 'Clay Loam'],
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
      soilPreferences: ['Deep Alluvial', 'Loam', 'Clay Loam'],
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
      soilPreferences: ['Clay', 'Loam', 'Sandy Loam', 'Marginal'],
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
      soilPreferences: ['Loose Sandy Loam', 'Peat', 'Well-drained'],
      isNitrogenFixing: false,
      droughtTolerance: 'low',
      rootDepthType: 'shallow',
    },
  },
];

async function seedDatabase() {
  console.log('=== Starting AgriShift Database Seeding Pipeline ===');
  const startTime = Date.now();

  try {
    await connectDB();
    console.log('MongoDB connection established successfully.');

    // 1. Seed Standard Crops
    console.log('\n[1/4] Seeding Standard Crops Collection...');
    const cropOps = CROPS_SEED_DATA.map((crop) => ({
      updateOne: {
        filter: { cropId: crop.cropId },
        update: { $set: crop },
        upsert: true,
      },
    }));
    const cropRes = await Crop.bulkWrite(cropOps);
    console.log(`Crops upserted: ${cropRes.upsertedCount}, modified: ${cropRes.modifiedCount}`);

    // 2. Seed NASA POWER Climatology Profiles
    console.log('\n[2/4] Seeding NASA POWER Climate Profiles...');
    const powerJsonPath = path.join(PROCESSED_DIR, 'nasa_power_climatology_normalized.json');
    if (!fs.existsSync(powerJsonPath)) {
      throw new Error(`NASA POWER normalized file missing at: ${powerJsonPath}`);
    }
    const powerProfiles = JSON.parse(fs.readFileSync(powerJsonPath, 'utf-8'));
    const powerOps = powerProfiles.map((p) => {
      const archId = p.location.archetype_id || p.location.archetypeId;
      return {
        updateOne: {
          filter: { archetypeId: archId },
          update: {
            $set: {
              archetypeId: archId,
              location: {
                name: (archId || '').replace(/_/g, ' '),
                longitude: p.location.longitude,
                latitude: p.location.latitude,
                elevationMeters: p.location.elevation_meters,
              },
              parameters: {
                temperatureMeanC: p.parameters.temperature_mean_c,
                temperatureMaxC: p.parameters.temperature_max_c,
                temperatureMinC: p.parameters.temperature_min_c,
                precipitationCorrectedMmDay: p.parameters.precipitation_corrected_mm_day,
                solarRadiationSurfaceDownwardKwhM2Day: p.parameters.solar_radiation_surface_downward_kwh_m2_day,
                relativeHumidity2mPercent: p.parameters.relative_humidity_2m_percent,
              },
              annualSummary: {
                meanTemperatureC: p.annual_summary.mean_temperature_c,
                maxTemperatureC: p.annual_summary.max_temperature_c,
                minTemperatureC: p.annual_summary.min_temperature_c,
                meanPrecipitationMmDay: p.annual_summary.mean_precipitation_mm_day,
                annualPrecipitationEstimateMmYear: p.annual_summary.annual_precipitation_estimate_mm_year,
                meanSolarRadiationKwhM2Day: p.annual_summary.mean_solar_radiation_kwh_m2_day,
                meanRelativeHumidityPercent: p.annual_summary.mean_relative_humidity_percent,
              },
              provenance: p.provenance,
            },
          },
          upsert: true,
        },
      };
    });
    const powerRes = await ClimateProfile.bulkWrite(powerOps);
    console.log(`Climate profiles upserted: ${powerRes.upsertedCount}, modified: ${powerRes.modifiedCount}`);

    // 3. Seed GAEZ Crop Suitability Records (in batches of 500)
    console.log('\n[3/4] Seeding GAEZ Crop Suitabilities Collection...');
    const gaezJsonPath = path.join(PROCESSED_DIR, 'gaez_crop_suitability_normalized.json');
    if (!fs.existsSync(gaezJsonPath)) {
      throw new Error(`GAEZ normalized file missing at: ${gaezJsonPath}`);
    }
    const gaezRecords = JSON.parse(fs.readFileSync(gaezJsonPath, 'utf-8'));
    console.log(`Loaded ${gaezRecords.length} normalized GAEZ records from disk.`);

    const BATCH_SIZE = 500;
    let totalUpserted = 0;
    let totalModified = 0;

    for (let i = 0; i < gaezRecords.length; i += BATCH_SIZE) {
      const batch = gaezRecords.slice(i, i + BATCH_SIZE);
      const batchOps = batch.map((r) => ({
        updateOne: {
          filter: {
            'provenance.rawFile': r.provenance.raw_file,
            'provenance.rawRowIndex': r.provenance.raw_row_index,
          },
          update: {
            $set: {
              provenance: {
                sourceDataset: r.provenance.source_dataset,
                theme: r.provenance.theme,
                rawFile: r.provenance.raw_file,
                rawRowIndex: r.provenance.raw_row_index,
              },
              dimensions: {
                cropId: r.dimensions.crop_id,
                cropDisplayName: r.dimensions.crop_display_name,
                cropScientificName: r.dimensions.crop_scientific_name,
                cropCategory: r.dimensions.crop_category,
                rotationRole: r.dimensions.rotation_role,
                iso3: r.dimensions.iso3,
                countryName: r.dimensions.country_name,
                waterManagement: r.dimensions.water_management,
                waterManagementRaw: r.dimensions.water_management_raw,
                climateSource: r.dimensions.climate_source,
                climateScenario: r.dimensions.climate_scenario,
                timePeriod: r.dimensions.time_period,
                landCover: r.dimensions.land_cover,
                exclusionClass: r.dimensions.exclusion_class,
                agroEcologicalZone: r.dimensions.agro_ecological_zone,
                geographicLevel: r.dimensions.geographic_level,
              },
              agronomics: {
                extentsTotal1000ha: r.agronomics.extents_total_1000ha,
                suitabilityVerySuitable1000ha: r.agronomics.suitability_very_suitable_1000ha,
                suitabilitySuitable1000ha: r.agronomics.suitability_suitable_1000ha,
                suitabilityModeratelySuitable1000ha: r.agronomics.suitability_moderately_suitable_1000ha,
                suitabilityMarginallySuitable1000ha: r.agronomics.suitability_marginally_suitable_1000ha,
                suitabilityVeryMarginallySuitable1000ha: r.agronomics.suitability_very_marginally_suitable_1000ha,
                suitabilityNotSuitable1000ha: r.agronomics.suitability_not_suitable_1000ha,
                productionVerySuitable1000tons: r.agronomics.production_very_suitable_1000tons,
                productionSuitable1000tons: r.agronomics.production_suitable_1000tons,
                productionModeratelySuitable1000tons: r.agronomics.production_moderately_suitable_1000tons,
                productionMarginallySuitable1000tons: r.agronomics.production_marginally_suitable_1000tons,
                productionVeryMarginallySuitable1000tons: r.agronomics.production_very_marginally_suitable_1000tons,
                yieldMaximumKgPerHa: r.agronomics.yield_maximum_kg_per_ha,
                yieldVerySuitableKgPerHa: r.agronomics.yield_very_suitable_kg_per_ha,
                yieldSuitableKgPerHa: r.agronomics.yield_suitable_kg_per_ha,
                yieldModeratelySuitableKgPerHa: r.agronomics.yield_moderately_suitable_kg_per_ha,
                yieldMarginallySuitableKgPerHa: r.agronomics.yield_marginally_suitable_kg_per_ha,
                yieldVeryMarginallySuitableKgPerHa: r.agronomics.yield_very_marginally_suitable_kg_per_ha,
              },
            },
          },
          upsert: true,
        },
      }));

      const batchRes = await CropSuitability.bulkWrite(batchOps);
      totalUpserted += batchRes.upsertedCount;
      totalModified += batchRes.modifiedCount;
      console.log(`Processed batch ${Math.floor(i / BATCH_SIZE) + 1} (${batch.length} items)...`);
    }

    console.log(`Suitability records upserted: ${totalUpserted}, modified: ${totalModified}`);

    // 4. Seed Dataset Metadata
    console.log('\n[4/4] Seeding Dataset Metadata...');
    const metadataRecords = [
      {
        datasetKey: 'fao_gaez_v5_crop_summary',
        title: 'FAO/IIASA Global Agro-Ecological Zones (GAEZ v5) Crop Summary Tables',
        provider: 'Food and Agriculture Organization (FAO) & IIASA',
        version: 'v5.0 (2025/2026)',
        officialCatalogUrl: 'https://data.fao.org/catalog/dataset/crop-summary-gaez',
        totalRecords: gaezRecords.length,
        variablesTracked: [
          'EXTENTS', 'SUIT_VS', 'SUIT_S', 'SUIT_MS', 'SUIT_mS', 'SUIT_vmS', 'SUIT_NS',
          'PROD_VS', 'PROD_S', 'PROD_MS', 'PROD_mS', 'PROD_vmS',
          'Ymax', 'Y_VS', 'Y_S', 'Y_MS', 'Y_mS', 'Y_vmS'
        ],
        ingestedAt: new Date(),
      },
      {
        datasetKey: 'nasa_power_agroclimatology',
        title: 'NASA Prediction Of Worldwide Energy Resources (POWER) Agroclimatology',
        provider: 'NASA Langley Research Center (LaRC)',
        version: 'v2.0 Climatology',
        officialCatalogUrl: 'https://power.larc.nasa.gov/',
        totalRecords: powerProfiles.length,
        variablesTracked: [
          'T2M', 'T2M_MAX', 'T2M_MIN', 'PRECTOTCORR', 'ALLSKY_SFC_SW_DWN', 'RH2M'
        ],
        ingestedAt: new Date(),
      },
    ];

    for (const m of metadataRecords) {
      await DatasetMetadata.updateOne(
        { datasetKey: m.datasetKey },
        { $set: m },
        { upsert: true }
      );
    }
    console.log('Dataset metadata upserted successfully.');

    // 5. Final Verification Counts
    const finalCropCount = await Crop.countDocuments();
    const finalSuitabilityCount = await CropSuitability.countDocuments();
    const finalPowerCount = await ClimateProfile.countDocuments();
    const finalMetaCount = await DatasetMetadata.countDocuments();

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log('\n=== Seeding Summary ===');
    console.log(`Execution time: ${elapsed}s`);
    console.log(`Crops in DB: ${finalCropCount}`);
    console.log(`Suitability Records in DB: ${finalSuitabilityCount}`);
    console.log(`Climate Profiles in DB: ${finalPowerCount}`);
    console.log(`Metadata Records in DB: ${finalMetaCount}`);

    return {
      success: true,
      finalCropCount,
      finalSuitabilityCount,
      finalPowerCount,
      finalMetaCount,
      elapsed,
    };
  } catch (err) {
    console.error('Database seeding failed with error:', err.message);
    throw err;
  } finally {
    await disconnectDB();
    console.log('MongoDB connection closed cleanly.');
  }
}

if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { seedDatabase };

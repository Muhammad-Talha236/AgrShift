const mongoose = require('mongoose');

const CropSuitabilitySchema = new mongoose.Schema(
  {
    provenance: {
      sourceDataset: {
        type: String,
        default: 'FAO/IIASA GAEZ v5',
        trim: true,
      },
      theme: {
        type: String,
        default: 'Theme 3: Suitability and Attainable Yield',
        trim: true,
      },
      rawFile: {
        type: String,
        required: true,
        trim: true,
      },
      rawRowIndex: {
        type: Number,
        required: true,
      },
    },
    dimensions: {
      cropId: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        index: true,
      },
      cropDisplayName: {
        type: String,
        required: true,
        trim: true,
      },
      cropScientificName: {
        type: String,
        trim: true,
      },
      cropCategory: {
        type: String,
        trim: true,
      },
      rotationRole: {
        type: String,
        trim: true,
      },
      iso3: {
        type: String,
        required: true,
        trim: true,
        uppercase: true,
        index: true,
      },
      countryName: {
        type: String,
        required: true,
        trim: true,
      },
      waterManagement: {
        type: String,
        required: true,
        enum: ['irrigated_high', 'rainfed_high', 'rainfed_low', 'irrigated_low'],
        index: true,
      },
      waterManagementRaw: {
        type: String,
        trim: true,
      },
      climateSource: {
        type: String,
        default: 'AgERA5',
        trim: true,
      },
      climateScenario: {
        type: String,
        default: 'Historical',
        trim: true,
      },
      timePeriod: {
        type: String,
        default: '1981-2000',
        trim: true,
      },
      landCover: {
        type: String,
        trim: true,
      },
      exclusionClass: {
        type: String,
        default: 'Total land',
        trim: true,
      },
      agroEcologicalZone: {
        type: String,
        default: 'Total land',
        trim: true,
      },
      geographicLevel: {
        type: String,
        default: 'Country',
        trim: true,
      },
    },
    agronomics: {
      extentsTotal1000ha: { type: Number, default: 0 },
      suitabilityVerySuitable1000ha: { type: Number, default: 0 },
      suitabilitySuitable1000ha: { type: Number, default: 0 },
      suitabilityModeratelySuitable1000ha: { type: Number, default: 0 },
      suitabilityMarginallySuitable1000ha: { type: Number, default: 0 },
      suitabilityVeryMarginallySuitable1000ha: { type: Number, default: 0 },
      suitabilityNotSuitable1000ha: { type: Number, default: 0 },
      productionVerySuitable1000tons: { type: Number, default: 0 },
      productionSuitable1000tons: { type: Number, default: 0 },
      productionModeratelySuitable1000tons: { type: Number, default: 0 },
      productionMarginallySuitable1000tons: { type: Number, default: 0 },
      productionVeryMarginallySuitable1000tons: { type: Number, default: 0 },
      yieldMaximumKgPerHa: { type: Number, default: 0 },
      yieldVerySuitableKgPerHa: { type: Number, default: 0 },
      yieldSuitableKgPerHa: { type: Number, default: 0 },
      yieldModeratelySuitableKgPerHa: { type: Number, default: 0 },
      yieldMarginallySuitableKgPerHa: { type: Number, default: 0 },
      yieldVeryMarginallySuitableKgPerHa: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
    collection: 'crop_suitabilities',
  }
);

// Idempotency constraint: each row in each raw file is uniquely addressable
CropSuitabilitySchema.index(
  { 'provenance.rawFile': 1, 'provenance.rawRowIndex': 1 },
  { unique: true }
);

// High-performance compound dimensional indexes for query acceleration (NON-UNIQUE)
CropSuitabilitySchema.index({
  'dimensions.iso3': 1,
  'dimensions.cropId': 1,
  'dimensions.waterManagement': 1,
});

CropSuitabilitySchema.index({
  'dimensions.cropId': 1,
  'dimensions.waterManagement': 1,
});

CropSuitabilitySchema.index({
  'dimensions.iso3': 1,
  'dimensions.countryName': 1,
});

module.exports = mongoose.model('CropSuitability', CropSuitabilitySchema);

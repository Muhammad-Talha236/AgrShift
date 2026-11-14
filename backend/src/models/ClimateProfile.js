const mongoose = require('mongoose');

const MonthlyMetricSchema = new mongoose.Schema(
  {
    JAN: Number,
    FEB: Number,
    MAR: Number,
    APR: Number,
    MAY: Number,
    JUN: Number,
    JUL: Number,
    AUG: Number,
    SEP: Number,
    OCT: Number,
    NOV: Number,
    DEC: Number,
    ANN: Number,
  },
  { _id: false }
);

const ClimateProfileSchema = new mongoose.Schema(
  {
    archetypeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    location: {
      name: { type: String, trim: true },
      longitude: { type: Number, required: true },
      latitude: { type: Number, required: true },
      elevationMeters: { type: Number },
    },
    parameters: {
      temperatureMeanC: MonthlyMetricSchema,
      temperatureMaxC: MonthlyMetricSchema,
      temperatureMinC: MonthlyMetricSchema,
      precipitationCorrectedMmDay: MonthlyMetricSchema,
      solarRadiationSurfaceDownwardKwhM2Day: MonthlyMetricSchema,
      relativeHumidity2mPercent: MonthlyMetricSchema,
    },
    annualSummary: {
      meanTemperatureC: Number,
      maxTemperatureC: Number,
      minTemperatureC: Number,
      meanPrecipitationMmDay: Number,
      annualPrecipitationEstimateMmYear: Number,
      meanSolarRadiationKwhM2Day: Number,
      meanRelativeHumidityPercent: Number,
    },
    provenance: {
      source: { type: String, default: 'NASA POWER API (LaRC)' },
      community: { type: String, default: 'AG' },
      temporalResolution: { type: String, default: 'Climatology' },
      rawFile: { type: String, trim: true },
    },
  },
  {
    timestamps: true,
    collection: 'climate_profiles',
  }
);

ClimateProfileSchema.index({
  'location.longitude': 1,
  'location.latitude': 1,
});

module.exports = mongoose.model('ClimateProfile', ClimateProfileSchema);

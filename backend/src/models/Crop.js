const mongoose = require('mongoose');

const CropSchema = new mongoose.Schema(
  {
    cropId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
    },
    scientificName: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    rotationRole: {
      type: String,
      required: true,
      trim: true,
    },
    agronomicProfile: {
      growingSeasonDays: {
        type: Number,
        default: 120,
      },
      optimalTempRangeC: {
        min: Number,
        max: Number,
      },
      waterRequirementRating: {
        type: String,
        enum: ['low', 'medium', 'high', 'very_high'],
        default: 'medium',
      },
      soilPreferences: [
        {
          type: String,
          trim: true,
        },
      ],
      isNitrogenFixing: {
        type: Boolean,
        default: false,
      },
      droughtTolerance: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
      },
      rootDepthType: {
        type: String,
        enum: ['shallow', 'medium', 'deep'],
        default: 'medium',
      },
    },
  },
  {
    timestamps: true,
    collection: 'crops',
  }
);

module.exports = mongoose.model('Crop', CropSchema);

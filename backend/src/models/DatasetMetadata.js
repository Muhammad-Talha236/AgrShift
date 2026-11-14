const mongoose = require('mongoose');

const DatasetMetadataSchema = new mongoose.Schema(
  {
    datasetKey: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    provider: {
      type: String,
      required: true,
      trim: true,
    },
    version: {
      type: String,
      trim: true,
    },
    officialCatalogUrl: {
      type: String,
      trim: true,
    },
    totalRecords: {
      type: Number,
      default: 0,
    },
    variablesTracked: [
      {
        type: String,
        trim: true,
      },
    ],
    ingestedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: 'dataset_metadata',
  }
);

module.exports = mongoose.model('DatasetMetadata', DatasetMetadataSchema);

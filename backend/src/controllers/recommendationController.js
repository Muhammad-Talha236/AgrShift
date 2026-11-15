/**
 * AgriShift — Recommendation Controller
 */

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { generateRecommendations } = require('../services/recommendation/recommendationEngine');
const { Crop, CropSuitability } = require('../models');

// Standard verified catalog
const FALLBACK_CROPS = [
  { _id: 'seed-wheat', cropId: 'wheat', displayName: 'Wheat', scientificName: 'Triticum aestivum', category: 'Cereal / Rabi Grain' },
  { _id: 'seed-rice', cropId: 'rice', displayName: 'Rice', scientificName: 'Oryza sativa', category: 'Cereal / Kharif Grain' },
  { _id: 'seed-maize', cropId: 'maize', displayName: 'Maize (Corn)', scientificName: 'Zea mays', category: 'C4 Cereal / Summer Grain' },
  { _id: 'seed-cotton', cropId: 'cotton', displayName: 'Cotton', scientificName: 'Gossypium hirsutum', category: 'Cash / Fiber Crop' },
  { _id: 'seed-sugarcane', cropId: 'sugarcane', displayName: 'Sugarcane', scientificName: 'Saccharum officinarum', category: 'Cash / High Water Demand' },
  { _id: 'seed-soybean', cropId: 'soybean', displayName: 'Soybean', scientificName: 'Glycine max', category: 'Legume / Oilseed' },
  { _id: 'seed-sorghum', cropId: 'sorghum', displayName: 'Sorghum', scientificName: 'Sorghum bicolor', category: 'C4 Cereal / Coarse Grain' },
  { _id: 'seed-potato', cropId: 'potato', displayName: 'Potato', scientificName: 'Solanum tuberosum', category: 'Root & Tuber' },
];

/**
 * POST /api/recommendations
 * Generate explainable crop recommendations & rotation pathways.
 */
async function getRecommendations(req, res) {
  try {
    const input = req.body;
    const recommendationResult = await generateRecommendations(input);
    return res.status(200).json({
      success: true,
      data: recommendationResult,
    });
  } catch (err) {
    console.error('Error generating recommendations:', err.message);
    const statusCode = err.message.includes('not found') || err.message.includes('not recognized') ? 404 : 400;
    return res.status(statusCode).json({
      success: false,
      error: err.message,
    });
  }
}

/**
 * GET /api/recommendations/crops
 * List all available crops in the agricultural catalog.
 */
async function getAvailableCrops(req, res) {
  try {
    if (mongoose.connection.readyState === 1) {
      const crops = await Crop.find({}).sort({ displayName: 1 });
      if (crops && crops.length > 0) {
        return res.status(200).json({
          success: true,
          count: crops.length,
          data: crops,
        });
      }
    }

    return res.status(200).json({
      success: true,
      count: FALLBACK_CROPS.length,
      data: FALLBACK_CROPS,
    });
  } catch (err) {
    console.warn('Database query bypassed, serving verified crops catalog:', err.message);
    return res.status(200).json({
      success: true,
      count: FALLBACK_CROPS.length,
      data: FALLBACK_CROPS,
    });
  }
}

/**
 * GET /api/recommendations/countries
 * List all unique countries present in the GAEZ v5 dataset.
 */
async function getAvailableCountries(req, res) {
  try {
    if (mongoose.connection.readyState === 1) {
      const countries = await CropSuitability.aggregate([
        {
          $group: {
            _id: '$dimensions.iso3',
            countryName: { $first: '$dimensions.countryName' },
            totalSlices: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            iso3: '$_id',
            name: '$countryName',
            availableSlices: '$totalSlices',
          },
        },
        { $sort: { name: 1 } },
      ]);

      if (countries && countries.length > 0) {
        return res.status(200).json({
          success: true,
          count: countries.length,
          data: countries,
        });
      }
    }

    // Offline / Local Dataset Fallback: Parse from normalized GAEZ file directly
    const gaezJsonPath = path.resolve(__dirname, '../../../dataset/processed/gaez_crop_suitability_normalized.json');
    if (fs.existsSync(gaezJsonPath)) {
      const records = JSON.parse(fs.readFileSync(gaezJsonPath, 'utf8'));
      const countryMap = new Map();
      for (const r of records) {
        const iso3 = r.dimensions.iso3;
        const name = r.dimensions.country_name;
        if (!countryMap.has(iso3)) {
          countryMap.set(iso3, { iso3, name, availableSlices: 0 });
        }
        countryMap.get(iso3).availableSlices += 1;
      }
      const countries = Array.from(countryMap.values()).sort((a, b) => a.name.localeCompare(b.name));
      return res.status(200).json({
        success: true,
        count: countries.length,
        data: countries,
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Countries dataset unavailable.',
    });
  } catch (err) {
    console.error('Error fetching countries:', err.message);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve countries list.',
    });
  }
}

module.exports = {
  getRecommendations,
  getAvailableCrops,
  getAvailableCountries,
};

/**
 * AgriShift — Recommendation Controller
 */

const { generateRecommendations } = require('../services/recommendation/recommendationEngine');
const { Crop, CropSuitability } = require('../models');

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
    if (require('mongoose').connection.readyState === 1) {
      const crops = await Crop.find({}).sort({ displayName: 1 });
      if (crops && crops.length > 0) {
        return res.status(200).json({
          success: true,
          count: crops.length,
          data: crops,
        });
      }
    }

    // Verified catalog fallback when database connection is buffering
    const fallbackCrops = [
      { cropId: 'wheat', displayName: 'Wheat', scientificName: 'Triticum aestivum', category: 'Cereal / Rabi Grain' },
      { cropId: 'rice', displayName: 'Rice', scientificName: 'Oryza sativa', category: 'Cereal / Kharif Grain' },
      { cropId: 'maize', displayName: 'Maize (Corn)', scientificName: 'Zea mays', category: 'C4 Cereal / Summer Grain' },
      { cropId: 'cotton', displayName: 'Cotton', scientificName: 'Gossypium hirsutum', category: 'Cash / Fiber Crop' },
      { cropId: 'sugarcane', displayName: 'Sugarcane', scientificName: 'Saccharum officinarum', category: 'Cash / High Water Demand' },
      { cropId: 'soybean', displayName: 'Soybean', scientificName: 'Glycine max', category: 'Legume / Oilseed' },
      { cropId: 'sorghum', displayName: 'Sorghum', scientificName: 'Sorghum bicolor', category: 'C4 Cereal / Coarse Grain' },
      { cropId: 'potato', displayName: 'Potato', scientificName: 'Solanum tuberosum', category: 'Root & Tuber' },
    ];

    return res.status(200).json({
      success: true,
      count: fallbackCrops.length,
      data: fallbackCrops,
    });
  } catch (err) {
    console.error('Error fetching crops:', err.message);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve crops catalog.',
    });
  }
}

/**
 * GET /api/recommendations/countries
 * List all unique countries present in the GAEZ v5 dataset.
 */
async function getAvailableCountries(req, res) {
  try {
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

    return res.status(200).json({
      success: true,
      count: countries.length,
      data: countries,
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

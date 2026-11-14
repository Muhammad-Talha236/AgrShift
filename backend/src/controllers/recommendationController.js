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
    const crops = await Crop.find({}).sort({ displayName: 1 });
    return res.status(200).json({
      success: true,
      count: crops.length,
      data: crops,
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

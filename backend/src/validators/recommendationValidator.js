/**
 * AgriShift — Recommendation Input Validation Middleware
 */

function validateRecommendationInput(req, res, next) {
  const { country, currentCrop, waterRegime, managementLevel } = req.body;

  if (!country || typeof country !== 'string' || country.trim().length !== 3) {
    return res.status(400).json({
      success: false,
      error: 'Invalid input: "country" is required and must be a 3-letter ISO3 code (e.g. "PAK", "USA").',
    });
  }

  if (waterRegime && !['irrigated', 'rainfed'].includes(waterRegime.toLowerCase().trim())) {
    return res.status(400).json({
      success: false,
      error: 'Invalid input: "waterRegime" must be either "irrigated" or "rainfed".',
    });
  }

  if (managementLevel && !['high', 'low'].includes(managementLevel.toLowerCase().trim())) {
    return res.status(400).json({
      success: false,
      error: 'Invalid input: "managementLevel" must be either "high" or "low".',
    });
  }

  if (currentCrop && typeof currentCrop !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Invalid input: "currentCrop" must be a string identifier (e.g. "wheat", "rice").',
    });
  }

  next();
}

module.exports = { validateRecommendationInput };

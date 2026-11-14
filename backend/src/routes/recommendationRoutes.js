const express = require('express');
const router = express.Router();
const {
  getRecommendations,
  getAvailableCrops,
  getAvailableCountries,
} = require('../controllers/recommendationController');
const { validateRecommendationInput } = require('../validators/recommendationValidator');

router.post('/', validateRecommendationInput, getRecommendations);
router.get('/crops', getAvailableCrops);
router.get('/countries', getAvailableCountries);

module.exports = router;

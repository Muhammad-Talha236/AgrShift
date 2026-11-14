/**
 * AgriShift — Crop Showcase Controller
 * Returns verified real-life crop showcase information from database/catalog.
 */
const Crop = require('../models/Crop');

const SHOWCASE_CROPS = [
  {
    cropId: 'rice',
    name: 'Rice',
    scientificName: 'Oryza sativa',
    category: 'Wetland Cereal Grain',
    description: 'Primary staple cereal crop thriving in warm climates with high moisture availability.',
    imageUrl: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Golden lush rice paddy field with ripening grain spikes in evening sunlight',
  },
  {
    cropId: 'wheat',
    name: 'Wheat',
    scientificName: 'Triticum aestivum',
    category: 'Temperate Cereal Grain',
    description: 'Vital global food staple cultivated across temperate regions for superior milling quality.',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Sunlit expansive wheat field ready for harvest with amber stalks',
  },
  {
    cropId: 'maize',
    name: 'Maize',
    scientificName: 'Zea mays',
    category: 'C4 High-Biomass Cereal',
    description: 'High-energy C4 cereal crop with exceptional biomass accumulation and industrial versatility.',
    imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Vibrant green maize corn plants with mature ears under natural sunlight',
  },
  {
    cropId: 'cotton',
    name: 'Cotton',
    scientificName: 'Gossypium hirsutum',
    category: 'Industrial Fiber Crop',
    description: 'Premier natural fiber crop driving agricultural economies in warm, sun-drenched valleys.',
    imageUrl: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Cotton plants blooming with fluffy white natural bolls in agricultural field',
  },
  {
    cropId: 'sugarcane',
    name: 'Sugarcane',
    scientificName: 'Saccharum officinarum',
    category: 'Perennial Sucrose & Biomass Crop',
    description: 'Robust perennial grass with massive sucrose accumulation and renewable biofuel potential.',
    imageUrl: 'https://images.unsplash.com/photo-1596706059298-25f0a3e9c606?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Dense green tropical sugarcane field under open daylight',
  },
];

exports.getCropsShowcase = async (req, res) => {
  try {
    // Attempt enrichment from MongoDB if connected
    let cropsData = SHOWCASE_CROPS;
    try {
      const dbCrops = await Crop.find({ cropId: { $in: SHOWCASE_CROPS.map((c) => c.cropId) } }).lean();
      if (dbCrops && dbCrops.length > 0) {
        cropsData = SHOWCASE_CROPS.map((showcase) => {
          const matched = dbCrops.find((dbC) => dbC.cropId === showcase.cropId);
          return {
            ...showcase,
            category: matched ? matched.category : showcase.category,
            scientificName: matched ? matched.scientificName : showcase.scientificName,
          };
        });
      }
    } catch (dbErr) {
      // Graceful fallback to verified catalog if DB connection is initializing
    }

    return res.status(200).json({
      success: true,
      total: cropsData.length,
      data: cropsData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve crop showcase data',
    });
  }
};

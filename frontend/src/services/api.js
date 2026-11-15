/**
 * AgriShift — Centralized API Client Service
 * Connects frontend modules with AgriShift REST backend.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function handleResponse(response) {
  let json;
  try {
    json = await response.json();
  } catch (err) {
    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}: ${response.statusText}`);
    }
    throw new Error('Received non-JSON response from server.');
  }

  if (!response.ok) {
    const errorMsg = json.error || json.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return json;
}

/**
 * -----------------------------------------------------------------------------
 * 1. LANDING & MAP APIS (Shared / Landing)
 * -----------------------------------------------------------------------------
 */

export async function fetchLandingContent() {
  try {
    const res = await fetch(`${API_BASE_URL}/landing`);
    const result = await handleResponse(res);
    return result.data;
  } catch (err) {
    console.warn('API landing request fallback:', err.message);
    return {
      platform: {
        name: 'AgriShift',
        tagline: 'Global Agricultural Intelligence & Explainable Crop Rotation',
      },
      hero: {
        badge: 'AI-POWERED AGRICULTURE',
        heading: 'Grow Smarter. Farm Better. Shape the Future.',
        description:
          'Transform agricultural decisions with intelligent crop predictions, real-world land insights, and climate-aware recommendations.',
        primaryCta: 'Explore Predictions',
        secondaryCta: 'Discover More',
        supportingLine: 'Data-driven insights for sustainable agriculture.',
        heroImage: {
          url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80',
          alt: 'Fertile farmland',
        },
      },
      howItWorks: {
        heading: 'From Farm Data to Smarter Decisions',
        subheading: 'A transparent three-step pipeline bridging Earth observation data with actionable agronomy.',
      },
      ctaSection: {
        heading: 'Ready to Make Smarter Farming Decisions?',
        buttonText: 'Start Your Prediction',
      },
    };
  }
}

export async function fetchCropsShowcase() {
  try {
    const res = await fetch(`${API_BASE_URL}/crops`);
    const result = await handleResponse(res);
    return result.data || [];
  } catch (err) {
    console.warn('API crops showcase fallback:', err.message);
    return [
      {
        cropId: 'rice',
        name: 'Rice',
        scientificName: 'Oryza sativa',
        category: 'Wetland Cereal Grain',
        description: 'Primary staple cereal crop thriving in warm climates with high moisture availability.',
        imageUrl: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=1200&q=80',
      },
      {
        cropId: 'wheat',
        name: 'Wheat',
        scientificName: 'Triticum aestivum',
        category: 'Temperate Cereal Grain',
        description: 'Vital global food staple cultivated across temperate regions for superior milling quality.',
        imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      },
      {
        cropId: 'maize',
        name: 'Maize',
        scientificName: 'Zea mays',
        category: 'C4 High-Biomass Cereal',
        description: 'High-energy C4 cereal crop with exceptional biomass accumulation and industrial versatility.',
        imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=1200&q=80',
      },
      {
        cropId: 'cotton',
        name: 'Cotton',
        scientificName: 'Gossypium hirsutum',
        category: 'Industrial Fiber Crop',
        description: 'Premier natural fiber crop driving agricultural economies in warm, sun-drenched valleys.',
        imageUrl: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=1200&q=80',
      },
      {
        cropId: 'sugarcane',
        name: 'Sugarcane',
        scientificName: 'Saccharum officinarum',
        category: 'Perennial Sucrose Crop',
        description: 'Robust perennial grass with massive sucrose accumulation and renewable biofuel potential.',
        imageUrl: 'https://images.unsplash.com/photo-1596706059298-25f0a3e9c606?auto=format&fit=crop&w=1200&q=80',
      },
    ];
  }
}

export async function fetchMapConfig() {
  try {
    const res = await fetch(`${API_BASE_URL}/map/config`);
    const result = await handleResponse(res);
    return result.data;
  } catch (err) {
    console.warn('API map config fallback:', err.message);
    return {
      initialView: {
        center: [74.3587, 31.5204],
        zoom: 10,
        pitch: 62,
        bearing: -20,
      },
    };
  }
}

/**
 * -----------------------------------------------------------------------------
 * 2. ASSESSMENT DATA APIS (Farmer Assessment Wizard)
 * -----------------------------------------------------------------------------
 */

/**
 * Fetch available sovereign countries from GAEZ v5 dataset
 * GET /api/recommendations/countries
 */
export async function fetchCountries() {
  try {
    const res = await fetch(`${API_BASE_URL}/recommendations/countries`);
    const result = await handleResponse(res);
    return result.data || [];
  } catch (err) {
    console.warn('API fetchCountries fallback:', err.message);
    return [
      { iso3: 'PAK', name: 'Pakistan' },
      { iso3: 'IND', name: 'India' },
      { iso3: 'EGY', name: 'Egypt' },
      { iso3: 'USA', name: 'United States' },
      { iso3: 'KEN', name: 'Kenya' },
      { iso3: 'BRA', name: 'Brazil' },
    ];
  }
}

/**
 * Fetch 8 rotation crops catalog with agronomic metadata
 * GET /api/recommendations/crops
 */
export async function fetchCropsCatalog() {
  try {
    const res = await fetch(`${API_BASE_URL}/recommendations/crops`);
    const result = await handleResponse(res);
    return result.data || [];
  } catch (err) {
    console.warn('API fetchCropsCatalog fallback:', err.message);
    return [
      { cropId: 'wheat', displayName: 'Wheat', scientificName: 'Triticum aestivum', category: 'Cereal / Rabi Grain' },
      { cropId: 'rice', displayName: 'Rice', scientificName: 'Oryza sativa', category: 'Cereal / Kharif Grain' },
      { cropId: 'maize', displayName: 'Maize (Corn)', scientificName: 'Zea mays', category: 'C4 Cereal / Summer Grain' },
      { cropId: 'cotton', displayName: 'Cotton', scientificName: 'Gossypium hirsutum', category: 'Cash / Fiber Crop' },
      { cropId: 'sugarcane', displayName: 'Sugarcane', scientificName: 'Saccharum officinarum', category: 'Cash / High Water Demand' },
      { cropId: 'soybean', displayName: 'Soybean', scientificName: 'Glycine max', category: 'Legume / Oilseed' },
      { cropId: 'sorghum', displayName: 'Sorghum', scientificName: 'Sorghum bicolor', category: 'C4 Cereal / Coarse Grain' },
      { cropId: 'potato', displayName: 'Potato', scientificName: 'Solanum tuberosum', category: 'Root & Tuber' },
    ];
  }
}

/**
 * -----------------------------------------------------------------------------
 * 3. RECOMMENDATION ENGINE API (Dashboard & Visualization)
 * -----------------------------------------------------------------------------
 */

/**
 * Submit farmer assessment and get 3 explainable rotation pathways
 * POST /api/recommendations
 * @param {Object} payload { country: 'PAK', currentCrop: 'wheat', waterRegime: 'irrigated', managementLevel: 'high' }
 */
export async function getRecommendations(payload) {
  const res = await fetch(`${API_BASE_URL}/recommendations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const result = await handleResponse(res);
  return result.data;
}

/**
 * Health check
 * GET /api/health
 */
export async function checkBackendHealth() {
  try {
    const rootUrl = API_BASE_URL.replace(/\/api\/?$/, '');
    const res = await fetch(`${rootUrl}/api/health`);
    if (res.ok) {
      const data = await res.json();
      return { connected: true, data };
    }
    return { connected: false };
  } catch (err) {
    return { connected: false, error: err.message };
  }
}

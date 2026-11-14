/**
 * AgriShift — API Client Service
 * Connects frontend components to backend REST endpoints with robust fallback support.
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
 * Fetch complete landing page structured data
 * GET /api/landing
 */
export async function fetchLandingContent() {
  try {
    const res = await fetch(`${API_BASE_URL}/landing`);
    const result = await handleResponse(res);
    return result.data;
  } catch (err) {
    console.warn('API landing request failed, using structured client fallback:', err.message);
    // Reliable client-side fallback
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
          alt: 'Aerial panoramic view of fertile green agricultural farmland and modern crop plantations',
        },
      },
      howItWorks: {
        heading: 'From Farm Data to Smarter Decisions',
        subheading: 'A transparent three-step pipeline bridging Earth observation data with actionable agronomy.',
        steps: [
          {
            stepNumber: 1,
            title: 'Explore Your Land',
            description: 'Understand geographical and environmental conditions.',
            icon: 'map-pin',
          },
          {
            stepNumber: 2,
            title: 'AI-Powered Analysis',
            description: 'Analyze agricultural information through machine learning.',
            icon: 'cpu',
          },
          {
            stepNumber: 3,
            title: 'Get Crop Recommendations',
            description: 'Discover suitable agricultural opportunities.',
            icon: 'sprout',
          },
        ],
      },
      ctaSection: {
        heading: 'Ready to Make Smarter Farming Decisions?',
        description: 'Connect real-world agricultural conditions with climate-aware intelligence.',
        buttonText: 'Start Your Prediction',
      },
    };
  }
}

/**
 * Fetch crop showcase cards
 * GET /api/crops
 */
export async function fetchCropsShowcase() {
  try {
    const res = await fetch(`${API_BASE_URL}/crops`);
    const result = await handleResponse(res);
    return result.data || [];
  } catch (err) {
    console.warn('API crops showcase failed, using verified catalog fallback:', err.message);
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
        category: 'Perennial Sucrose & Biomass Crop',
        description: 'Robust perennial grass with massive sucrose accumulation and renewable biofuel potential.',
        imageUrl: 'https://images.unsplash.com/photo-1596706059298-25f0a3e9c606?auto=format&fit=crop&w=1200&q=80',
      },
    ];
  }
}

/**
 * Fetch 3D map configuration and markers
 * GET /api/map/config
 */
export async function fetchMapConfig() {
  try {
    const res = await fetch(`${API_BASE_URL}/map/config`);
    const result = await handleResponse(res);
    return result.data;
  } catch (err) {
    console.warn('API map config failed, using default client configuration:', err.message);
    return {
      initialView: {
        center: [74.3587, 31.5204],
        zoom: 10.5,
        pitch: 62,
        bearing: -24,
      },
      markers: [
        {
          id: 'indus_basin',
          title: 'Indus Basin Agricultural Plains',
          region: 'Punjab, Pakistan',
          coordinates: [74.3587, 31.5204],
          crops: ['Wheat', 'Rice', 'Sugarcane', 'Cotton'],
          elevationMeters: 217,
          description: 'World’s largest contiguous canal irrigation network feeding fertile alluvial croplands.',
        },
        {
          id: 'nile_delta',
          title: 'Nile Delta Cropland Belt',
          region: 'Lower Egypt',
          coordinates: [31.5085, 30.5852],
          crops: ['Cotton', 'Rice', 'Wheat', 'Maize'],
          elevationMeters: 14,
          description: 'Centuries of silt-rich river deposition sustaining intensive agricultural cycles.',
        },
        {
          id: 'corn_belt',
          title: 'Midwestern Corn Belt',
          region: 'Iowa, United States',
          coordinates: [-93.6208, 41.5868],
          crops: ['Maize', 'Soybean'],
          elevationMeters: 290,
          description: 'Prime agricultural mollisols supporting high-yield mechanized grain farming.',
        },
      ],
    };
  }
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

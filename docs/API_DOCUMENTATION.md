# AgriShift — Backend API Documentation

**Author & Maintainer:** Talha (Project Lead & Backend Architect)  
**Base URL (Local):** `http://localhost:5000/api` (Root Health: `http://localhost:5000/health`)  
**Specification Standard:** RESTful JSON  
**Server Architecture:** Express 4 on Node.js with MongoDB Atlas Mongoose ORM

---

## 1. System Health Check

### `GET /health` & `GET /api/health`

Verifies that the Express server instance is running and responsive.

- **Method:** `GET`
- **URL:** `/health` or `/api/health`
- **Authentication:** None
- **Query Parameters:** None
- **Success Response (200 OK):**
```json
{
  "status": "ok",
  "service": "AgriShift Backend API",
  "version": "1.0.0",
  "timestamp": "2026-11-14T18:15:23.456Z"
}
```

---

## 2. Recommendation Engine & Assessment Endpoints

These endpoints power the Farmer Assessment Wizard ([Shahzaman](file:///d:/Uni%20projects/AgrShift/project_division.md#2-shahzaman--agricultural-data-engineering--assessment-wizard)) and the Crop Recommendation Dashboard ([Faiza](file:///d:/Uni%20projects/AgrShift/project_division.md#3-faiza--recommendation-dashboard--data-visualization)).

### A. List Sovereign Countries

Retrieves the list of all unique sovereign countries available in the database (aggregated from FAO/IIASA GAEZ v5).

- **Method:** `GET`
- **URL:** `/api/recommendations/countries`
- **Headers:** None required
- **Query Parameters:** None
- **Success Response (200 OK):**
```json
{
  "success": true,
  "count": 188,
  "data": [
    {
      "iso3": "AFG",
      "name": "Afghanistan",
      "availableSlices": 32
    },
    {
      "iso3": "EGY",
      "name": "Egypt",
      "availableSlices": 32
    },
    {
      "iso3": "PAK",
      "name": "Pakistan",
      "availableSlices": 32
    },
    {
      "iso3": "USA",
      "name": "United States",
      "availableSlices": 32
    }
  ]
}
```

---

### B. List Available Crop Rotation Catalog

Retrieves the 8 core agricultural crops evaluated in the AgriShift rotational suitability engine.

- **Method:** `GET`
- **URL:** `/api/recommendations/crops`
- **Headers:** None required
- **Query Parameters:** None
- **Success Response (200 OK):**
```json
{
  "success": true,
  "count": 8,
  "data": [
    {
      "cropId": "cotton",
      "displayName": "Cotton",
      "scientificName": "Gossypium hirsutum",
      "category": "Cash / Fiber Crop"
    },
    {
      "cropId": "maize",
      "displayName": "Maize (Corn)",
      "scientificName": "Zea mays",
      "category": "C4 Cereal / Summer Grain"
    },
    {
      "cropId": "potato",
      "displayName": "Potato",
      "scientificName": "Solanum tuberosum",
      "category": "Root & Tuber"
    },
    {
      "cropId": "rice",
      "displayName": "Rice",
      "scientificName": "Oryza sativa",
      "category": "Cereal / Kharif Grain"
    },
    {
      "cropId": "sorghum",
      "displayName": "Sorghum",
      "scientificName": "Sorghum bicolor",
      "category": "C4 Cereal / Coarse Grain"
    },
    {
      "cropId": "soybean",
      "displayName": "Soybean",
      "scientificName": "Glycine max",
      "category": "Legume / Oilseed"
    },
    {
      "cropId": "sugarcane",
      "displayName": "Sugarcane",
      "scientificName": "Saccharum officinarum",
      "category": "Cash / High Water Demand"
    },
    {
      "cropId": "wheat",
      "displayName": "Wheat",
      "scientificName": "Triticum aestivum",
      "category": "Cereal / Rabi Grain"
    }
  ]
}
```

---

### C. Evaluate Land & Generate Recommendations

> [!IMPORTANT]
> **Exact Verified URL:** `POST /api/recommendations`  
> In Express, `backend/src/app.js` mounts `recommendationRoutes` at `/api/recommendations`, where `router.post('/', ...)` handles the evaluation request.

Executes the hybrid multi-criteria recommendation engine, synthesizing three distinct pathways (Economic Return, Soil Restoration, Water Resilience) with rotation transition explanations.

- **Method:** `POST`
- **URL:** `/api/recommendations`
- **Headers:** `Content-Type: application/json`

#### Request Body Parameters

| Field | Type | Required | Default | Description | Valid Values / Example |
|---|---|---|---|---|---|
| `country` | `string` | **Yes** | — | 3-letter sovereign ISO3 code | `"PAK"`, `"USA"`, `"EGY"`, `"KEN"` |
| `currentCrop` | `string` | No | `null` | Current or previous crop identifier | `"wheat"`, `"rice"`, `"cotton"`, etc. |
| `waterRegime` | `string` | No | `"irrigated"` | Water management regime | `"irrigated"`, `"rainfed"` |
| `managementLevel` | `string` | No | `"high"` | Agricultural input intensity | `"high"`, `"low"` |
| `climateArchetype` | `string` | No | Auto-mapped | Optional regional archetype override | `"punjab_indus_basin"` |

#### Example Request Body
```json
{
  "country": "PAK",
  "currentCrop": "wheat",
  "waterRegime": "irrigated",
  "managementLevel": "high"
}
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "data": {
    "status": "SUCCESS",
    "assessmentSummary": {
      "country": {
        "iso3": "PAK",
        "name": "Pakistan"
      },
      "currentCrop": {
        "cropId": "wheat",
        "displayName": "Wheat",
        "category": "Cereal / Rabi Grain"
      },
      "waterRegime": "irrigated",
      "managementLevel": "high",
      "evaluatedRegimeCode": "irrigated_high",
      "climateProfileApplied": {
        "archetypeId": "punjab_indus_basin",
        "locationName": "Indus Basin Agricultural Plains (Punjab / Sindh)",
        "isRegionalArchetype": true,
        "confidenceRating": "REGIONAL_ARCHETYPE",
        "annualMeanTempC": 24.8,
        "annualPrecipitationEstimateMmYear": 485.2,
        "disclosure": "Evaluated using regional NASA POWER profile for Indus Basin Agricultural Plains. Reflects regional climatology, not unmeasured field-level microclimate."
      }
    },
    "pathways": {
      "economicReturn": {
        "pathwayKey": "economicReturn",
        "title": "Economic Return Pathway",
        "primaryGoal": "Maximize agro-climatic yield potential and attainable harvest output index.",
        "recommendedCrop": {
          "cropId": "sugarcane",
          "displayName": "Sugarcane",
          "scientificName": "Saccharum officinarum",
          "category": "Cash / High Water Demand",
          "compositeScore": 87,
          "attainableYieldKgHa": 78420,
          "suitableLandFraction": 0.82
        },
        "scoreBreakdown": {
          "yieldScore": 92,
          "climateScore": 81,
          "rotationScore": 100,
          "compositeScore": 87
        },
        "rotationTransition": {
          "transitionType": "DIVERSITY_ROTATION",
          "description": "Rotating from Wheat to Sugarcane diversifies cropping family and breaks seasonal monoculture pressures.",
          "benefits": ["Spreads harvest labor and market volatility risk."],
          "precautions": ["High water demand; verify irrigation canal schedules."]
        }
      },
      "soilRestoration": {
        "pathwayKey": "soilRestoration",
        "title": "Soil Restoration Pathway",
        "primaryGoal": "Prioritize biological nitrogen fixation and soil health regeneration.",
        "recommendedCrop": {
          "cropId": "soybean",
          "displayName": "Soybean",
          "scientificName": "Glycine max",
          "category": "Legume / Oilseed",
          "compositeScore": 84,
          "attainableYieldKgHa": 2410,
          "suitableLandFraction": 0.76
        },
        "scoreBreakdown": {
          "yieldScore": 79,
          "climateScore": 89,
          "rotationScore": 100,
          "compositeScore": 84
        },
        "rotationTransition": {
          "transitionType": "CEREAL_TO_LEGUME_BREAK",
          "description": "Rotating from Wheat to legume Soybean provides biological nitrogen fixation via Rhizobium symbiosis, breaking cereal pathogen cycles.",
          "benefits": [
            "Biological atmospheric nitrogen fixation enriches root-zone nitrogen for subsequent crops.",
            "Interrupts cereal-specific nematode and foliar disease cycles."
          ],
          "precautions": [
            "Ensure proper Rhizobium inoculant is applied at planting.",
            "Expected soil health benefits are based on established agronomic principles; in-situ soil nutrients are unmeasured in this observation dataset."
          ]
        }
      },
      "waterResilience": {
        "pathwayKey": "waterResilience",
        "title": "Water Resilience Pathway",
        "primaryGoal": "Optimize drought resilience and minimize water deficit penalty.",
        "recommendedCrop": {
          "cropId": "sorghum",
          "displayName": "Sorghum",
          "scientificName": "Sorghum bicolor",
          "category": "C4 Cereal / Coarse Grain",
          "compositeScore": 83,
          "attainableYieldKgHa": 3150,
          "suitableLandFraction": 0.88
        },
        "scoreBreakdown": {
          "yieldScore": 81,
          "climateScore": 91,
          "rotationScore": 100,
          "compositeScore": 83
        },
        "rotationTransition": {
          "transitionType": "DIVERSITY_ROTATION",
          "description": "Rotating from Wheat to Sorghum introduces high drought and thermal tolerance.",
          "benefits": ["Exceptional C4 water-use efficiency under thermal stress."]
        }
      }
    },
    "rankedAlternatives": [
      {
        "cropId": "soybean",
        "displayName": "Soybean",
        "compositeScore": 84
      },
      {
        "cropId": "sorghum",
        "displayName": "Sorghum",
        "compositeScore": 83
      }
    ],
    "eligibilityAudit": {
      "totalCropsEvaluated": 8,
      "eligibleCount": 6,
      "ineligibleCount": 2,
      "ineligibleDetails": []
    },
    "provenance": {
      "engine": "AgriShift Hybrid Recommendation & Rotation Engine",
      "version": "1.0.0",
      "dataSources": [
        {
          "name": "FAO/IIASA GAEZ v5",
          "theme": "Theme 3: Agro-Ecological Crop Suitability & Attainable Yields",
          "scenario": "Historical Baseline (1981-2010, AgERA5)"
        },
        {
          "name": "NASA POWER Climatology API",
          "community": "Agroclimatology (AG)",
          "variables": ["T2M", "T2M_MAX", "T2M_MIN", "PRECTOTCORR", "ALLSKY_SFC_SW_DWN", "RH2M"]
        }
      ],
      "processingTimeMs": 28,
      "limitations": [
        "Attainable yields are modeled agro-ecological potential benchmarks, not guaranteed harvest projections.",
        "Soil fertility benefits are inferred from biological nitrogen fixation agronomy; field-level soil nutrient and moisture sensors are not directly measured in these observation layers."
      ]
    }
  }
}
```

#### Validation & Error Responses

- **Missing or Invalid Country (HTTP 400 Bad Request):**
```json
{
  "success": false,
  "error": "Invalid input: \"country\" is required and must be a 3-letter ISO3 code (e.g. \"PAK\", \"USA\")."
}
```

- **Invalid Water Regime (HTTP 400 Bad Request):**
```json
{
  "success": false,
  "error": "Invalid input: \"waterRegime\" must be either \"irrigated\" or \"rainfed\"."
}
```

- **Country Not Found in GAEZ Dataset (HTTP 404 Not Found):**
```json
{
  "success": false,
  "error": "Country code 'XYZ' was not found in the official GAEZ v5 dataset."
}
```

- **No Eligible Crops Viable (HTTP 200 OK with `status: NO_ELIGIBLE_CROPS`):**
When a country possesses zero agro-ecologically viable crops under severe climatic conditions (e.g. high-latitude permafrost):
```json
{
  "success": true,
  "data": {
    "status": "NO_ELIGIBLE_CROPS",
    "message": "No crops met the agro-ecological viability thresholds in ISL under rainfed_low conditions.",
    "pathways": null,
    "eligibilityAudit": {
      "totalCropsEvaluated": 8,
      "eligibleCount": 0,
      "ineligibleCount": 8
    }
  }
}
```

---

## 3. Landing Page & Map Visualization Endpoints

These endpoints power the public landing view ([Talha](file:///d:/Uni%20projects/AgrShift/project_division.md#1-talha--project-lead-backend-recommendation-engine--frontend-foundation)).

### A. Landing Page Static Content
- **Method:** `GET`
- **URL:** `/api/landing`
- **Purpose:** Supplies marketing copy, feature cards, and challenge details for [HeroSection.jsx](file:///d:/Uni%20projects/AgrShift/frontend/src/components/landing/HeroSection.jsx) and [HowItWorksSection.jsx](file:///d:/Uni%20projects/AgrShift/frontend/src/components/landing/HowItWorksSection.jsx).
- **Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "platform": {
      "name": "AgriShift",
      "tagline": "Global Agricultural Intelligence & Explainable Crop Rotation"
    },
    "hero": { ... },
    "howItWorks": { ... },
    "ctaSection": { ... }
  }
}
```

### B. Crops Showcase Carousel
- **Method:** `GET`
- **URL:** `/api/crops`
- **Purpose:** Returns high-resolution imagery and descriptions for five highlighted crops (Rice, Wheat, Maize, Cotton, Sugarcane) on the landing page showcase.
- **Success Response (200 OK):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "cropId": "rice",
      "name": "Rice",
      "scientificName": "Oryza sativa",
      "category": "Wetland Cereal Grain",
      "imageUrl": "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=1200&q=80"
    }
  ]
}
```

### C. 3D Map Viewport Configuration
- **Method:** `GET`
- **URL:** `/api/map/config`
- **Purpose:** Supplies MapLibre 3D terrain defaults, satellite imagery tile endpoints, and initial camera coordinates (pitch, bearing, zoom).
- **Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "initialView": {
      "center": [74.3587, 31.5204],
      "zoom": 10,
      "pitch": 62,
      "bearing": -20
    },
    "terrain": {
      "elevationExaggeration": 1.5
    }
  }
}
```

---

## 4. Planned & Future Scope Endpoints

The following endpoints are **NOT** yet implemented on the server and are planned for post-hackathon releases:

- `[PLANNED]` `POST /api/auth/register` — Farmer authentication and profile management.
- `[PLANNED]` `POST /api/farms` — Save localized field boundaries and historic soil records.
- `[PLANNED]` `GET /api/reports/:id/pdf` — Export formal agricultural extension recommendation dossiers.

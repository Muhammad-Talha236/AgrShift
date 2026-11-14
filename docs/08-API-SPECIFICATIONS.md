# 08 — REST API Specifications & Contracts 📡

---

## 1. Global API Standards

- **Protocol**: HTTP/1.1 (or HTTP/2 over TLS)
- **Base Route**: `/api/v1`
- **Default Content-Type**: `application/json; charset=utf-8`
- **Standard Success Response Shape**:
```json
{
  "success": true,
  "timestamp": "2026-11-14T11:00:00.000Z",
  "data": {}
}
```
- **Standard Error Response Shape**:
```json
{
  "success": false,
  "timestamp": "2026-11-14T11:00:00.000Z",
  "error": {
    "code": "ERROR_CODE_STRING",
    "message": "Human-readable explanation of error",
    "details": []
  }
}
```

---

## 2. Granular Endpoint Specifications

### 2.1 System Health & Service Status
- **Method**: `GET`
- **Route**: `/api/v1/health`
- **Purpose**: Verifies operational readiness of Express server, MongoDB connection, and NASA POWER integration reachability.
- **Request Parameters**: None.
- **Request Example**:
```http
GET /api/v1/health HTTP/1.1
Host: localhost:5000
```
- **Response Example (200 OK)**:
```json
{
  "success": true,
  "timestamp": "2026-11-14T11:00:00.000Z",
  "data": {
    "status": "healthy",
    "service": "AgriShift Backend API",
    "version": "1.0.0",
    "uptimeSeconds": 312.4,
    "database": {
      "status": "connected",
      "name": "agrishift"
    },
    "integrations": {
      "nasaPowerApi": "reachable"
    }
  }
}
```
- **Error Response (503 Service Unavailable)**:
```json
{
  "success": false,
  "timestamp": "2026-11-14T11:00:00.000Z",
  "error": {
    "code": "DATABASE_UNAVAILABLE",
    "message": "Primary MongoDB persistence is currently disconnected",
    "details": ["Mongoose connection state: disconnected"]
  }
}
```

---

### 2.2 Climate Data Retrieval (NASA POWER)
- **Method**: `GET`
- **Route**: `/api/v1/climate`
- **Purpose**: Ingests and processes 30-year climatological baseline from NASA Langley Research Center POWER API for specified coordinates.
- **Query Parameters**:
  - `latitude` (float, required): Range `-90.0` to `90.0`.
  - `longitude` (float, required): Range `-180.0` to `180.0`.
  - `temporal` (string, optional): `"climatology"` (default).
- **Request Example**:
```http
GET /api/v1/climate?latitude=31.5204&longitude=74.3587 HTTP/1.1
Host: localhost:5000
```
- **Validation**:
  - `latitude` must be numeric between -90 and 90.
  - `longitude` must be numeric between -180 and 180.
- **Response Example (200 OK)**:
```json
{
  "success": true,
  "timestamp": "2026-11-14T11:00:00.000Z",
  "data": {
    "source": "NASA Langley Research Center POWER Project",
    "attribution": "NASA POWER Agroclimatology Methodology (v2.0)",
    "coordinates": {
      "latitude": 31.5204,
      "longitude": 74.3587
    },
    "climatologySummary": {
      "annualMeanTempC": 24.8,
      "annualPrecipitationMm": 628.4,
      "solarRadiationAvg": 18.2,
      "humidityAvg": 54.3,
      "aridityClassification": "Semi-Arid"
    },
    "monthlySeries": [
      {
        "month": "Jan",
        "tempMeanC": 12.4,
        "tempMaxC": 19.8,
        "tempMinC": 5.9,
        "precipMm": 23.0,
        "solarRadiation": 11.8,
        "relativeHumidity": 68.0
      },
      {
        "month": "Jul",
        "tempMeanC": 32.1,
        "tempMaxC": 38.6,
        "tempMinC": 27.2,
        "precipMm": 182.5,
        "solarRadiation": 21.4,
        "relativeHumidity": 72.0
      }
    ],
    "isFallbackData": false
  }
}
```
- **Error Response (400 Bad Request)**:
```json
{
  "success": false,
  "timestamp": "2026-11-14T11:00:00.000Z",
  "error": {
    "code": "INVALID_COORDINATES",
    "message": "Latitude must be between -90 and 90; Longitude between -180 and 180",
    "details": ["Provided latitude: 104.2 is out of bounds"]
  }
}
```

---

### 2.3 Field Assessment Submission
- **Method**: `POST`
- **Route**: `/api/v1/assessment`
- **Purpose**: Validates and stores a farmer's field profile in MongoDB.
- **Request Body**:
```json
{
  "country": "Pakistan",
  "region": "Punjab",
  "coordinates": {
    "latitude": 31.5204,
    "longitude": 74.3587
  },
  "landSize": 5,
  "landUnit": "acres",
  "soilType": "Loam",
  "currentCrop": "Wheat",
  "previousCrop": "Rice",
  "waterAvailability": "Moderate (Tubewell)",
  "farmingSeason": "Summer / Kharif",
  "primaryObjective": "Soil Restoration & Fertility"
}
```
- **Validation**:
  - `country`, `region`, `soilType`, `currentCrop`, `waterAvailability`, `farmingSeason`, `primaryObjective` are required strings.
  - `landSize` must be a positive number $> 0$.
  - `coordinates.latitude` and `coordinates.longitude` must be valid numbers.
- **Response Example (201 Created)**:
```json
{
  "success": true,
  "timestamp": "2026-11-14T11:00:00.000Z",
  "data": {
    "assessmentId": "6735a123f8b1c40012e34567",
    "status": "persisted",
    "completenessScore": 1.0,
    "missingOptionalFields": [],
    "createdAt": "2026-11-14T11:00:00.000Z"
  }
}
```

---

### 2.4 Hybrid Recommendation Execution
- **Method**: `POST`
- **Route**: `/api/v1/recommendations`
- **Purpose**: Executes NASA data ingestion, Stage 1 filtering, Stage 2 weighted scoring, and 3-strategy compilation.
- **Request Body**:
```json
{
  "assessment": {
    "country": "Pakistan",
    "region": "Punjab",
    "coordinates": {
      "latitude": 31.5204,
      "longitude": 74.3587
    },
    "landSize": 5,
    "landUnit": "acres",
    "soilType": "Loam",
    "currentCrop": "Wheat",
    "previousCrop": "Rice",
    "waterAvailability": "Moderate (Tubewell)",
    "farmingSeason": "Summer / Kharif",
    "primaryObjective": "Soil Restoration & Fertility"
  }
}
```
- **Response Example (200 OK)**:
```json
{
  "success": true,
  "timestamp": "2026-11-14T11:00:00.000Z",
  "data": {
    "reportId": "rep_6735b456e9c2d10045f67890",
    "locationSummary": {
      "country": "Pakistan",
      "region": "Punjab",
      "coordinates": { "latitude": 31.5204, "longitude": 74.3587 }
    },
    "climateContext": {
      "annualMeanTempC": 24.8,
      "seasonalRainfallMm": 320.5,
      "aridityClassification": "Semi-Arid",
      "source": "NASA POWER Agroclimatology (v2.0)",
      "isFallbackData": false
    },
    "eligibleCropsEvaluated": 16,
    "strategies": [
      {
        "id": "baseline_continuation",
        "title": "Baseline Continuation Strategy",
        "tagline": "Conventional rotation with standard regional market familiarity",
        "recommendedNextCrop": "Cotton",
        "subsequentSequence": ["Wheat", "Cotton", "Wheat"],
        "overallScore": 77.2,
        "scoreBreakdown": {
          "climateMatch": 88,
          "waterMatch": 70,
          "soilRegeneration": 64,
          "rotationSynergy": 76,
          "objectiveAlignment": 75
        },
        "soilImpact": "Neutral to slight nutrient depletion; requires supplemental nitrogen",
        "waterConsideration": "Moderate to high irrigation demand (~650-750 mm)",
        "climateCompatibility": "Tolerates high summer temperatures (32°C - 42°C)",
        "risks": ["Vulnerable to whitefly and bollworm infestation"],
        "evidenceSummary": "Follows standard regional cotton-wheat rotation cycle.",
        "confidenceLevel": "High",
        "limitations": "Requires dependable tubewell energy availability during flowering."
      },
      {
        "id": "soil_restoration",
        "title": "Soil Biological Restoration Strategy",
        "tagline": "Maximizes biological nitrogen fixation and increases soil organic matter",
        "recommendedNextCrop": "Mungbean (Green Gram)",
        "subsequentSequence": ["Wheat", "Chickpea", "Sorghum"],
        "overallScore": 93.8,
        "scoreBreakdown": {
          "climateMatch": 92,
          "waterMatch": 90,
          "soilRegeneration": 98,
          "rotationSynergy": 96,
          "objectiveAlignment": 98
        },
        "soilImpact": "Fixes 45-60 kg N/ha into soil rhizosphere, revitalizing soil microbiome",
        "waterConsideration": "Low water requirement (250-350 mm); thrives on residual moisture",
        "climateCompatibility": "Short duration (65-70 days); escapes late-summer monsoon floods",
        "risks": ["Vulnerable to pod shattering if harvest is delayed"],
        "evidenceSummary": "Cereal-legume rotation supported by FAO-56 soil health guidelines.",
        "confidenceLevel": "High",
        "limitations": "Requires Rhizobium inoculum if legumes not grown in last 3 years."
      },
      {
        "id": "water_resilience",
        "title": "Water Resilience & Drought Defense Strategy",
        "tagline": "Optimizes crop water productivity and minimizes irrigation risk",
        "recommendedNextCrop": "Pearl Millet (Bajra)",
        "subsequentSequence": ["Mustard", "Cowpea", "Barley"],
        "overallScore": 89.5,
        "scoreBreakdown": {
          "climateMatch": 95,
          "waterMatch": 98,
          "soilRegeneration": 78,
          "rotationSynergy": 88,
          "objectiveAlignment": 85
        },
        "soilImpact": "Fibrous root architecture reduces erosion and aerates compacted topsoil",
        "waterConsideration": "Exceptional water-use efficiency (C4 photosynthesis); needs 200-300 mm",
        "climateCompatibility": "Withstands ambient heat up to 45°C without pollen abortion",
        "risks": ["Lower market spot price without pre-established fodder/grain buyer"],
        "evidenceSummary": "NASA precipitation records indicate high rainfall variability; C4 cereal reduces failure risk.",
        "confidenceLevel": "High",
        "limitations": "Susceptible to seed rot if planted during standing water."
      }
    ]
  }
}
```

---

### 2.5 Crop Catalog Directory
- **Method**: `GET`
- **Route**: `/api/v1/crops`
- **Purpose**: Lists all crops cataloged in AgriShift knowledge base with environmental bounds.
- **Query Parameters**:
  - `category` (string, optional): `"Cereal"`, `"Legume"`, `"Oilseed"`, `"Fiber"`.
- **Response Example (200 OK)**:
```json
{
  "success": true,
  "timestamp": "2026-11-14T11:00:00.000Z",
  "data": {
    "totalCrops": 30,
    "crops": [
      {
        "cropId": "mungbean",
        "commonName": "Mungbean (Green Gram)",
        "botanicalName": "Vigna radiata",
        "family": "Fabaceae",
        "category": "Legume",
        "idealTempRangeC": [25, 38],
        "waterNeedMm": [250, 400],
        "nitrogenFixationKgPerHa": 50,
        "waterUseEfficiency": "High"
      }
    ]
  }
}
```

---

### 2.6 Strategy Comparison Endpoint
- **Method**: `POST`
- **Route**: `/api/v1/compare-strategies`
- **Purpose**: Generates a standardized comparison matrix comparing the three rotation pathways across key indicators.
- **Request Body**:
```json
{
  "strategyIds": ["baseline_continuation", "soil_restoration", "water_resilience"]
}
```
- **Response Example (200 OK)**:
```json
{
  "success": true,
  "timestamp": "2026-11-14T11:00:00.000Z",
  "data": {
    "comparisonMatrix": [
      {
        "metric": "Estimated Net Nitrogen Balance",
        "baseline": "-35 kg N/ha (Synthetic N needed)",
        "soilRestoration": "+50 kg N/ha (Biological fixation)",
        "waterResilience": "+5 kg N/ha (Biomass neutral)"
      },
      {
        "metric": "Seasonal Water Requirement",
        "baseline": "650 - 750 mm",
        "soilRestoration": "250 - 350 mm",
        "waterResilience": "200 - 300 mm"
      },
      {
        "metric": "Soil Organic Matter Addition",
        "baseline": "Low",
        "soilRestoration": "Very High",
        "waterResilience": "Moderate"
      },
      {
        "metric": "Drought Failure Risk",
        "baseline": "Moderate to High",
        "soilRestoration": "Low",
        "waterResilience": "Minimal"
      }
    ]
  }
}
```

# 11 — Team Responsibilities & Module Ownership 👥

To enable four developers to work simultaneously without code collisions or integration bottlenecks during the hackathon, **AgriShift** is divided into four strictly decoupled modules with clear ownership and API contracts.

---

## 1. Team Ownership Matrix

```mermaid
flowchart TD
    subgraph M1 ["Member 1: Frontend Developer"]
        F1["React 19 & Vite UI"]
        F2["Tailwind CSS System"]
        F3["Assessment Wizard"]
        F4["Recharts Dashboards"]
        F5["Strategy Cards & Comparison UI"]
    end

    subgraph M2 ["Member 2: Backend Developer"]
        B1["Express.js Server Core"]
        B2["REST API Routing (/api/v1)"]
        B3["MongoDB Mongoose Models"]
        B4["Input Validation & Sanitization"]
        B5["Centralized Error Middleware"]
    end

    subgraph M3 ["Member 3: NASA Data Engineer"]
        N1["NASA POWER API Client"]
        N2["Climatology Parser & Units"]
        N3["Missing Value Filter (-999.0)"]
        N4["Regional Fallback Baseline Cache"]
        N5["NASA Attribution Tracking"]
    end

    subgraph M4 ["Member 4: Recommendation Engineer"]
        R1["30+ Crop Ontology Database"]
        R2["Family Rotation Rule Matrix"]
        R3["Stage 1 Hard Eligibility Filter"]
        R4["Stage 2 Multi-Factor Weighted Scoring"]
        R5["3-Pathway Strategy Synthesizer"]
    end

    M1 <-->|REST API Contract (JSON)| M2
    M2 -->|Service Invocation| M3
    M2 -->|Service Invocation| M4
    M3 -->|Climate Context Object| M4
```

---

## 2. Granular Member Profiles

### Member 1 — Frontend Developer (Client Experience & Visuals)
- **Primary Ownership**: Entire client application in `frontend/`.
- **Core Responsibilities**:
  - Implement modern SaaS layout (Navbar, Footer, Container) using Tailwind CSS.
  - Build multi-step Farmer Field Assessment wizard (`frontend/src/components/forms/`).
  - Implement interactive Recharts climatology charts (temperature envelope, rainfall vs radiation).
  - Build 3-Strategy comparison cards, expandable drawers, and side-by-side comparison matrix.
  - Implement printable assessment report view (`/report/:id`).
  - Handle client-side error states, loading skeletons, and satellite telemetry animations.
- **Key Deliverables**:
  - `frontend/src/components/` (`common`, `layout`, `dashboard`, `forms`, `charts`).
  - `frontend/src/pages/` (`LandingPage.jsx`, `AssessmentPage.jsx`, `DashboardPage.jsx`, `ComparisonPage.jsx`, `MethodologyPage.jsx`, `ReportPage.jsx`).
  - `frontend/src/services/api.js` (Axios service calling backend).
- **Dependencies**: Depends on Member 2's REST endpoints (`docs/08-API-SPECIFICATIONS.md`). Can mock responses locally during early development.
- **Integration Requirement**: Connect Axios client to `http://localhost:5000/api/v1`.

---

### Member 2 — Backend Developer (API Core & Persistence)
- **Primary Ownership**: Express server, database persistence, and API gateway in `backend/`.
- **Core Responsibilities**:
  - Maintain `backend/src/app.js` and `backend/src/server.js`.
  - Configure CORS, Helmet security headers, and request body parsers.
  - Implement input validation middleware for coordinates, soil types, and assessment fields.
  - Implement Mongoose schemas and models (`FieldAssessment.js`, `RecommendationReport.js`).
  - Implement centralized error-handling middleware (`errorHandler.js`).
  - Coordinate service invocations between Member 3 (NASA Service) and Member 4 (Recommendation Engine).
- **Key Deliverables**:
  - `backend/src/routes/` (`healthRoutes.js`, `climateRoutes.js`, `assessmentRoutes.js`, `recommendationRoutes.js`).
  - `backend/src/controllers/` (`healthController.js`, `climateController.js`, `assessmentController.js`, `recommendationController.js`).
  - `backend/src/models/` (`FieldAssessment.js`, `RecommendationReport.js`).
  - `backend/src/middleware/` (`validator.js`, `errorHandler.js`).
- **Dependencies**: Depends on Member 3's `nasaPowerService.js` and Member 4's `recommendationService.js`.
- **Integration Requirement**: Deliver stable, tested endpoints matching `docs/08-API-SPECIFICATIONS.md`.

---

### Member 3 — NASA Data Engineer (Earth Observations & Telemetry)
- **Primary Ownership**: NASA POWER integration and climate processing in `backend/src/services/nasa/`.
- **Core Responsibilities**:
  - Build robust Axios client querying NASA POWER Agroclimatology API (`https://power.larc.nasa.gov/api/temporal/climatology/point`).
  - Extract and normalize `T2M`, `T2M_MAX`, `T2M_MIN`, `PRECTOTCORR`, `ALLSKY_SFC_SW_DWN`, and `RH2M`.
  - Convert precipitation daily rates ($mm/\text{day}$) to cumulative monthly depths ($mm/\text{month}$).
  - Detect and repair `-999.0` missing observation flags.
  - Calculate aridity classification ($P/PET$), annual temperature averages, and seasonal rainfall totals.
  - Build verified regional agroclimatic fallback cache (`fallbackCache.js`) for seamless offline operation.
- **Key Deliverables**:
  - `backend/src/services/nasa/nasaPowerService.js`.
  - `backend/src/services/nasa/climateAnalytics.js`.
  - `backend/src/data/fallbackCache.js`.
- **Dependencies**: None. Can be developed and tested in total isolation using coordinate test scripts.
- **Integration Requirement**: Export `getClimatology(lat, lon)` returning standardized `ClimateContext` object.

---

### Member 4 — Recommendation Systems Engineer (Agronomy & Algorithms)
- **Primary Ownership**: Curated crop ontology, rotation rules, and hybrid recommendation engine in `backend/src/services/recommendation/` and `backend/src/data/`.
- **Core Responsibilities**:
  - Author comprehensive agronomic dataset for 30+ major global crops (`cropDatabase.js`).
  - Author botanical family rotation compatibility and soil impact matrix (`rotationRules.js`).
  - Implement Stage 1: Hard eligibility filters (Thermal comfort, water threshold, soil texture, botanical break).
  - Implement Stage 2: Multi-factor weighted scoring equations ($S_{\text{climate}}$, $S_{\text{water}}$, $S_{\text{soil}}$, $S_{\text{rotation}}$, $S_{\text{objective}}$).
  - Implement Stage 3: Strategic pathway compilation (*Baseline*, *Soil Restoration*, *Water Resilience*).
  - Synthesize transparent evidence dossiers, expected benefits, and operational limitations.
- **Key Deliverables**:
  - `backend/src/data/cropDatabase.js` (30+ crops with validated parameters).
  - `backend/src/data/rotationRules.js` (Phytosanitary compatibility matrix).
  - `backend/src/services/recommendation/recommendationEngine.js`.
  - `backend/src/services/recommendation/strategyCompiler.js`.
- **Dependencies**: Consumes `ClimateContext` generated by Member 3 and assessment profile from Member 2.
- **Integration Requirement**: Export `generateRecommendations(assessment, climateContext)` returning structured 3-strategy response.

---

## 3. Communication & Code Integration Rules

1. **API Contract Invariance**: No developer may alter an API route or field name in `docs/08-API-SPECIFICATIONS.md` without consensus from both Member 1 and Member 2.
2. **Feature Branch Isolation**: Each member works on their designated feature branch (`feat/frontend-*`, `feat/backend-*`, `feat/nasa-*`, `feat/recommendation-*`).
3. **Mocking for Parallelism**: Frontend develops against mock responses defined in the API contract; Backend tests service logic using unit tests before connecting to live services.

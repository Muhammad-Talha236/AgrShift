# 06 — System Architecture & Technical Design 🏛️

---

## 1. High-Level Architectural Blueprint

**AgriShift** employs a decoupled client-server architecture organized into distinct functional tiers. The frontend client (React + Vite) communicates with the backend API gateway (Node.js + Express) over secure REST protocols. The backend coordinates external NASA Earth Observation satellite services, executes the hybrid recommendation engine, and interfaces with the persistence layer.

```mermaid
flowchart TD
    subgraph ClientTier ["Client Presentation Tier (React 19 + Vite)"]
        UI["Tailwind CSS UI / Modern SaaS Shell"]
        Router["React Router v6 Client Engine"]
        Wizard["Farmer Assessment Wizard"]
        Charts["Recharts Agroclimatology Visualizer"]
        Dashboard["Intelligence Dashboard & Strategy Cards"]
        Comparator["Interactive Strategy Comparison Matrix"]
        Export["Print & Export Dossier Renderer"]
    end

    subgraph SecurityGateway ["API Gateway & Security Layer"]
        CORS["CORS Middleware (Configurable Origins)"]
        Helmet["Helmet Security Headers"]
        Sanitizer["Input Sanitization & Bounds Checker"]
        RateLimiter["Rate Limiting Middleware"]
    end

    subgraph BackendCore ["Application Core (Node.js & Express)"]
        APIRouter["API Router (/api/v1)"]
        HealthCtrl["Health Controller"]
        ClimateCtrl["Climate Controller"]
        AssessmentCtrl["Assessment Controller"]
        RecCtrl["Recommendation Controller"]

        subgraph ServiceLayer ["Service & Business Logic Tier"]
            NASAService["NASA POWER Agroclimatology Service"]
            ClimateAnalytics["Climate Metrics & Anomaly Engine"]
            HybridEngine["Two-Stage Hybrid Recommendation Engine"]
            StrategyCompiler["3-Pathway Strategy Synthesizer"]
        end

        subgraph KnowledgeBase ["Agronomic Knowledge Base (Curated)"]
            CropDB[("Crop Profiles Database: 30+ Crops")]
            RotationMatrix[("Family Rotation Rules & Compatibility")]
            SoilRules[("Soil Texture & pH Tolerance Rules")]
            FallbackCache[("Regional Agroclimatic Baseline Cache")]
        end
    end

    subgraph ExternalServices ["External Satellite Services"]
        NASA_POWER["NASA Langley Research Center POWER API\n(v2.0 Agroclimatology Climatology Endpoint)"]
    end

    subgraph PersistenceTier ["Data Persistence Tier (MongoDB / Atlas)"]
        AssessmentsCollection[("field_assessments")]
        ReportsCollection[("recommendation_reports")]
    end

    %% Wiring
    UI --> Router
    Router --> Wizard & Charts & Dashboard & Comparator & Export
    Wizard -->|HTTP POST JSON| CORS
    Dashboard -->|HTTP GET / POST| CORS

    CORS --> Helmet --> Sanitizer --> RateLimiter --> APIRouter

    APIRouter --> HealthCtrl
    APIRouter --> ClimateCtrl
    APIRouter --> AssessmentCtrl
    APIRouter --> RecCtrl

    ClimateCtrl --> NASAService
    RecCtrl --> NASAService
    RecCtrl --> HybridEngine

    NASAService -->|HTTPS GET Request| NASA_POWER
    NASA_POWER -->|Raw Agroclimatology JSON| NASAService
    NASAService -.->|On Network Timeout / Failure| FallbackCache
    NASAService --> ClimateAnalytics

    HybridEngine --> CropDB
    HybridEngine --> RotationMatrix
    HybridEngine --> SoilRules
    HybridEngine --> ClimateAnalytics
    HybridEngine --> StrategyCompiler

    AssessmentCtrl --> AssessmentsCollection
    RecCtrl --> ReportsCollection
    StrategyCompiler --> RecCtrl
    RecCtrl -->|Synthesized Strategies + Evidence| Dashboard
```

---

## 2. Frontend / Backend Interaction Sequence

The following sequence details how the React frontend interacts with the Express backend during a complete assessment:

```mermaid
sequenceDiagram
    autonumber
    participant UI as React Client (Frontend)
    participant API as Express API (/api/v1)
    participant NASA as NASA POWER Service
    participant Engine as Hybrid Recommendation Engine
    participant DB as MongoDB Persistence

    UI->>API: POST /api/v1/recommendations (Farmer Assessment Payload)
    Note over API: Request validated (Coordinates, Soil, Crops)
    
    API->>NASA: getClimatology(lat, lon)
    alt NASA API Available
        NASA->>NASA: Fetch from power.larc.nasa.gov
        NASA-->>API: Returns 30-year monthly observations (T2M, PRECTOTCORR, etc.)
    else NASA API Timeout / Error
        NASA->>NASA: Load local regional agroclimatic baseline
        NASA-->>API: Returns verified baseline with { isFallbackData: true }
    end

    API->>Engine: evaluateRecommendations(assessment, climateData)
    Note over Engine: Stage 1: Hard eligibility filtering (Thermal, Water, Soil, Family)
    Note over Engine: Stage 2: Multi-factor weighted scoring (5 dimensions)
    Note over Engine: Stage 3: Compiles 3 strategies (Baseline, Soil, Water)
    Engine-->>API: Returns 3 strategies, score breakdowns, and evidence

    API->>DB: Save assessment & recommendation report
    DB-->>API: Saved successfully with reportId

    API-->>UI: HTTP 200 OK { success: true, data: { reportId, climate, strategies } }
    UI->>UI: Renders Climatology Charts & Strategy Cards
```

---

## 3. Module Responsibilities & Decoupling

The codebase is organized into isolated modules with clear boundaries to ensure that all 4 team members can develop, test, and maintain their code independently:

| Module / Layer | Primary Technologies | Key Files / Paths | Team Ownership | Core Invariants |
| :--- | :--- | :--- | :--- | :--- |
| **Frontend UI & Visuals** | React 19, Vite, Tailwind v4, Recharts, Lucide | `frontend/src/` | **Member 1 (Frontend)** | Never queries NASA API directly; routes all operations through backend gateway. |
| **Backend REST & Gateway** | Node.js, Express, Helmet, CORS, dotenv | `backend/src/app.js`, `backend/src/routes/`, `backend/src/middleware/` | **Member 2 (Backend)** | Validates all inputs; centralized error catching; standard JSON envelope. |
| **NASA Data Ingestion** | Axios, NASA POWER REST API | `backend/src/services/nasa/`, `backend/src/data/fallbackCache.js` | **Member 3 (NASA Data)** | Filters `-999.0` missing flags; standardizes units; transparent attribution. |
| **Recommendation Engine**| Pure Modular JavaScript Algorithms | `backend/src/services/recommendation/`, `backend/src/data/cropDatabase.js` | **Member 4 (Rec Engine)** | Stateless pure scoring function; outputs mathematical evidence for every recommendation. |

---

## 4. Graceful Degradation & Network Resilience Architecture

To prevent system lockups during unreliable network conditions, remote field deployments, or NASA server maintenance windows, AgriShift employs a multi-tiered resilience pattern:

```mermaid
flowchart TD
    A[NASA Climate Request] --> B{Check Network Connectivity}
    B -->|Offline| C[Load Offline Regional Cache]
    B -->|Online| D[Dispatch Axios GET with 8000ms Timeout]
    
    D --> E{Response Status}
    E -->|200 OK & Valid JSON| F[Parse Live Observations]
    E -->|Timeout / 4xx / 5xx| G[Trigger Fallback Circuit Breaker]
    
    G --> H[Retrieve Nearest Agro-Ecological Baseline Cache]
    H --> I[Tag Payload: isFallbackData = true]
    F --> J[Tag Payload: isFallbackData = false]
    
    I & J --> K[Feed to Recommendation Engine]
    K --> L[Display Contextual Alert Badge on Frontend UI]
```

1. **Timeout Circuit Breaker**: External NASA HTTP requests are wrapped with a strict 8-second timeout.
2. **Offline Regional Agroclimatic Baseline**: Pre-compiled, verified monthly profiles for major global agro-ecological zones (Semi-Arid Tropics, Subtropical Humid, Mediterranean, Continental Temperate).
3. **UI Transparency**: Whenever fallback data is activated, an explicit amber badge informs the user: *"Notice: Running on verified regional agroclimatic baseline (NASA POWER Live Telemetry Unreachable)"*.

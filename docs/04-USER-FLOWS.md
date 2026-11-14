# 04 — User Flows & Interaction Models 🔀

This document maps out the end-to-end user journeys, decision nodes, and system interaction flows across **AgriShift**.

---

## 1. End-to-End User Journey Overview

```mermaid
flowchart TD
    Start([Farmer Visits AgriShift]) --> Landing[Landing Page: Vision, Problem & Value Prop]
    Landing --> Action{User Action}
    
    Action -->|Learn Methodology| About[Methodology & NASA Data Sources Page]
    Action -->|Start Evaluation| Wizard[Farmer Field Assessment Wizard]
    About --> Wizard
    
    subgraph InputStage ["Assessment Input (FEAT-01)"]
        Wizard --> Step1[Step 1: Location & Coordinates]
        Step1 --> Step2[Step 2: Land Size & Soil Type]
        Step2 --> Step3[Step 3: Crop History & Current Crop]
        Step3 --> Step4[Step 4: Water Availability & Season]
        Step4 --> Step5[Step 5: Primary Farming Objective]
    end
    
    Step5 --> Submit[Submit Assessment Form]
    
    subgraph ProcessingPipeline ["Asynchronous Processing Pipeline"]
        Submit --> LoadingScreen[NASA Telemetry & Ingestion Screen]
        LoadingScreen --> APICall[POST /api/v1/recommendations]
        APICall --> FetchNASA[Fetch NASA POWER Climatology]
        FetchNASA --> FilterStage[Stage 1: Rule-Based Eligibility Filter]
        FilterStage --> ScoreStage[Stage 2: Weighted Multi-Factor Scoring]
        ScoreStage --> SynthStage[Stage 3: 3-Strategy Pathway Synthesis]
        SynthStage --> SaveReport[Persist to MongoDB Report Store]
    end
    
    SaveReport --> Dashboard[AgriShift Intelligence Dashboard]
    
    subgraph DashboardExperience ["Interactive Dashboard & Decision Support"]
        Dashboard --> ViewClimate[Inspect NASA Climate Trends & Recharts]
        Dashboard --> ViewStrategies[Examine 3 Strategy Pathway Cards]
        ViewStrategies --> Compare[Open Side-by-Side Comparison Matrix]
        ViewStrategies --> InspectEvidence[Open Explainability & Evidence Modal]
        Dashboard --> PrintReport[Export / Print Formal Assessment Dossier]
    end
    
    PrintReport --> Done([Farmer Takes Informed Action in Field])
```

---

## 2. Assessment Wizard Flow & Client Validation

```mermaid
sequenceDiagram
    autonumber
    actor Farmer as Farmer / Extension Worker
    participant Client as React Client (Vite)
    participant Gateway as Express API Gateway
    participant Validator as Input Validator Middleware

    Farmer->>Client: Clicks "Start Field Assessment"
    Client->>Farmer: Renders Multi-Step Wizard (Step 1 of 5)
    
    Farmer->>Client: Enters Location (or clicks "Detect My GPS Location")
    alt Browser GPS Allowed
        Client->>Client: Resolves Latitude & Longitude automatically
    else Manual Entry
        Farmer->>Client: Inputs Latitude & Longitude manually
    end
    
    Farmer->>Client: Inputs Soil Type (e.g. "Loam") & Land Size
    Farmer->>Client: Inputs Current Crop (e.g. "Wheat") & Previous Crop
    Farmer->>Client: Selects Water Source & Primary Objective
    Farmer->>Client: Clicks "Generate Crop Rotation Intelligence"
    
    Client->>Client: Client-side validation check (Bounds, non-empty)
    alt Client Validation Fails
        Client-->>Farmer: Highlights invalid fields with helper text
    else Client Validation Passes
        Client->>Gateway: POST /api/v1/recommendations { assessment payload }
        Gateway->>Validator: Inspects coordinate bounds & field values
        alt Backend Validator Fails
            Validator-->>Gateway: HTTP 400 Bad Request
            Gateway-->>Client: Returns JSON error with field details
            Client-->>Farmer: Displays error alert banner
        else Validation Passes
            Validator->>Gateway: Passes to Recommendation Controller
        end
    end
```

---

## 3. NASA Climate Data Retrieval & Graceful Fallback Flow

```mermaid
flowchart TD
    A[Recommendation Controller] --> B[Call nasaPowerService.getClimatology]
    B --> C{Verify Coordinates}
    C -->|Invalid Bounds| D[Throw Bad Coordinates Error]
    C -->|Valid Bounds| E[Dispatch HTTPS GET to NASA POWER API]
    
    E --> F{Response Received within 8000ms?}
    
    F -->|Yes, HTTP 200 OK| G[Inspect Response for -999.0 flags]
    G --> H{Any Corrupted Values?}
    H -->|Clean Observations| I[Parse & Convert to Standard Units]
    H -->|Partial Missing| J[Apply Neighboring-Month Interpolation & Flag Warning]
    I --> K[Construct Climate Context Object: isFallbackData = false]
    J --> K
    
    F -->|No: Timeout, 500, or Network Down| L[Log NASA API Latency/Error Warning]
    L --> M[Look up Regional Agroclimatic Baseline from Fallback Cache]
    M --> N[Construct Climate Context Object: isFallbackData = true]
    
    K --> O[Forward Climate Context to Recommendation Engine]
    N --> O
```

---

## 4. Hybrid Recommendation Engine Flow

```mermaid
flowchart TD
    A[Assessment + Climate Context] --> B[Load Curated Crop Knowledge Database: 30+ Crops]
    B --> C[Stage 1: Hard Eligibility Filter]
    
    subgraph Gate1 ["Thermal Gate"]
        C --> D1{Local Mean/Max Temp within Crop Thermal Window?}
        D1 -->|No| R1[Disqualify: Heat or Frost Lethality]
    end
    
    subgraph Gate2 ["Hydrological Gate"]
        C --> D2{Water Available >= 0.5 * Crop ET Demand?}
        D2 -->|No & Rainfed| R2[Disqualify: Severe Moisture Deficit]
    end
    
    subgraph Gate3 ["Edaphic Gate"]
        C --> D3{Soil Type Compatible with Crop Root System?}
        D3 -->|No| R3[Disqualify: Drainage / Compaction Hazard]
    end
    
    subgraph Gate4 ["Phytosanitary Gate"]
        C --> D4{Same Botanical Family as Current Crop?}
        D4 -->|Yes| R4[Disqualify: Monoculture Pathogen Accumulation]
    end
    
    D1 & D2 & D3 & D4 -->|All Gates Passed| E[Eligible Candidate Pool]
    
    E --> F[Stage 2: Multi-Factor Weighted Scoring]
    F --> F1[Compute Climate Suitability: 0 - 100]
    F --> F2[Compute Water-Use Efficiency: 0 - 100]
    F --> F3[Compute Soil Regeneration Score: 0 - 100]
    F --> F4[Compute Rotation Synergy Score: 0 - 100]
    F --> F5[Compute Objective Alignment Score: 0 - 100]
    
    F1 & F2 & F3 & F4 & F5 --> G[Calculate Composite Score: S_total]
    G --> H[Stage 3: Strategic Pathway Synthesizer]
    
    H --> S1[Pathway 1: Baseline Continuation]
    H --> S2[Pathway 2: Soil Biological Restoration]
    H --> S3[Pathway 3: Water Resilience & Drought Defense]
    
    S1 & S2 & S3 --> FinalReport[Synthesize Evidence, Risks & Limitations]
```

---

## 5. Strategy Comparison & Report Export Flow

```mermaid
flowchart LR
    A[Dashboard Active] --> B{User Selection}
    
    B -->|Click Strategy Card| C[Expand Strategy Details Drawer]
    C --> C1[Inspect 3-Season Sequence]
    C --> C2[View Agronomic Rationale & Risks]
    
    B -->|Click 'Compare All'| D[Open Side-by-Side Comparison Matrix]
    D --> D1[Review Net Nitrogen Balance]
    D --> D2[Review Seasonal Water Consumption]
    D --> D3[Review Soil Organic Carbon Impact]
    D --> D4[Review Drought Failure Risk Index]
    
    B -->|Click 'Export Dossier'| E[Trigger Report View]
    E --> E1[Format Printable Dossier Layout]
    E1 --> E2[Render Official NASA Attribution Badge]
    E2 --> E3[Browser Native Print / Save to PDF Dialog]
```

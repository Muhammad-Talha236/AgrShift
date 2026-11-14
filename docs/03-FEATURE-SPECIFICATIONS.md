# 03 — Feature Specifications 📋

This document outlines the granular engineering specifications for every functional component of **AgriShift**.

---

## 1. Feature Specification Index

| Feature ID | Feature Name | Primary Purpose | Priority |
| :--- | :--- | :--- | :--- |
| **FEAT-01** | Farmer Field Assessment System | Collects field characteristics and agricultural context | **Must Have (P0)** |
| **FEAT-02** | NASA POWER Agroclimatology Ingestion | Retrieves authentic 30-year NASA Earth Observations | **Must Have (P0)** |
| **FEAT-03** | Two-Stage Hybrid Recommendation Engine | Prunes invalid crops and scores candidates objectively | **Must Have (P0)** |
| **FEAT-04** | Three Strategic Rotation Pathways | Generates Baseline, Soil Restoration, and Water Resilience plans | **Must Have (P0)** |
| **FEAT-05** | Climate Insights & Climatology Dashboard | Visualizes temperature, rainfall, radiation, and humidity | **Must Have (P0)** |
| **FEAT-06** | Interactive Strategy Comparison Matrix | Provides side-by-side metric trade-off evaluation | **Must Have (P0)** |
| **FEAT-07** | Explainability & Evidence Inspector | Itemizes biological reasons, limitations, and citations | **Must Have (P0)** |
| **FEAT-08** | Downloadable / Printable Assessment Dossier | Generates professional client-side export for field use | **Must Have (P0)** |

---

## 2. Granular Feature Specifications

### FEAT-01: Farmer Field Assessment System
- **Feature ID**: `FEAT-01`
- **Name**: Farmer Field Assessment Wizard
- **Purpose**: Collects comprehensive edaphic, geographical, and operational data from the farmer to customize recommendations.
- **User Interaction**: Multi-step wizard with visual progress indicator. Supports browser geolocation detection or manual latitude/longitude entry alongside common country/region selections.
- **Input Data**:
  - `country` (string, required): e.g., "Pakistan", "United States", "Kenya".
  - `region` (string, required): e.g., "Punjab", "Iowa", "Rift Valley".
  - `latitude` (number, required): `-90.0000` to `90.0000`.
  - `longitude` (number, required): `-180.0000` to `180.0000`.
  - `landSize` (number, required): $> 0$.
  - `landUnit` (string, required): "acres" | "hectares" | "kanals" | "bighas".
  - `soilType` (string, required): "Clay" | "Clay Loam" | "Loam" | "Sandy Loam" | "Sandy" | "Silt Loam".
  - `currentCrop` (string, required): Current standing or immediately harvested crop.
  - `previousCrop` (string, optional): Prior rotation history (defaults to null if unknown).
  - `waterAvailability` (string, required): "Abundant (Canal + Tubewell)" | "Moderate (Tubewell)" | "Constrained (Rationed)" | "Rainfed Only".
  - `farmingSeason` (string, required): Target planting season (e.g. "Kharif / Summer", "Rabi / Winter", "Spring").
  - `primaryObjective` (string, required): "Maximum Yield & Economic Profit" | "Soil Restoration & Fertility" | "Water Conservation & Drought Defense".
- **Processing Logic**: Validates ranges, computes assessment completeness ratio, prepares structured JSON payload, and posts to `/api/v1/assessment` and `/api/v1/recommendations`.
- **Output**: Validated assessment object with assigned unique `assessmentId` and confidence weight factor.
- **Validation Rules**: Geo-coordinates must be within valid Earth bounds; non-numeric land size rejected; mandatory fields must be non-empty.
- **Error States**: Inline form error highlights on invalid fields; toast notifications on payload validation rejection.
- **Acceptance Criteria**: Form submits cleanly within 300ms; missing optional fields do not block submission but decrease confidence factor by 15%.
- **Priority**: Must Have (P0).

---

### FEAT-02: NASA POWER Agroclimatology Ingestion
- **Feature ID**: `FEAT-02`
- **Name**: NASA POWER Climate Retrieval & Processing
- **Purpose**: Retrieves multi-decadal satellite observations from NASA Langley Research Center POWER Project for the given field coordinates.
- **User Interaction**: Automated background trigger upon assessment submission; accompanied by an informative NASA telemetry spinner.
- **Input Data**: `latitude`, `longitude`, `temporal=climatology`, `community=AG`.
- **Processing Logic**:
  - Ingests parameters: `T2M`, `T2M_MAX`, `T2M_MIN`, `PRECTOTCORR`, `ALLSKY_SFC_SW_DWN`, `RH2M`.
  - Scans for missing value flags (`-999.0`).
  - Converts daily precipitation rates ($mm/\text{day}$) to standard monthly cumulative depths ($mm/\text{month}$).
  - Calculates annual average temperature, seasonal rainfall totals, and aridity index ($P / PET$).
  - If NASA API fails or times out (> 8000ms), seamlessly loads verified regional agroclimatic baseline from local cache with explicit `"isFallbackData": true` flag.
- **Output**: Structured climate profile containing 12-month series, aggregated metrics, and data provenance attribution.
- **Validation Rules**: Coordinates must hit valid land surface cells; returned JSON must conform to NASA POWER v2.0 schema.
- **Error States**: Network unreachable $\rightarrow$ activate fallback baseline + amber status pill on UI.
- **Acceptance Criteria**: Live NASA API queries complete under 2.5 seconds on standard connections; zero crashing if external API is unreachable.
- **Priority**: Must Have (P0).

---

### FEAT-03: Two-Stage Hybrid Recommendation Engine
- **Feature ID**: `FEAT-03`
- **Name**: Hybrid Crop Filtering & Multi-Factor Scoring
- **Purpose**: Eliminates biologically unviable crops and computes normalized suitability scores across 5 agronomic dimensions.
- **User Interaction**: Automated server computation; users can adjust importance sliders on dashboard to reweight priorities.
- **Input Data**: Farmer assessment profile + NASA climate summary + Curated Crop Database.
- **Processing Logic**:
  - **Stage 1**: Checks 4 hard gates (Thermal tolerance, Water threshold vs irrigation, Soil texture suitability, Botanical family break). Disqualified crops are logged with rejection reasons.
  - **Stage 2**: Scores surviving crops using:
    $$S_{\text{composite}} = 0.30 S_{\text{climate}} + 0.25 S_{\text{water}} + 0.20 S_{\text{soil}} + 0.15 S_{\text{rotation}} + 0.10 S_{\text{objective}}$$
  - Dynamically shifts weights if the farmer chose "Soil Restoration" ($w_s \rightarrow 0.35$) or "Water Resilience" ($w_w \rightarrow 0.40$).
- **Output**: Ranked list of scored crops with granular sub-score breakdowns.
- **Validation Rules**: Surviving crop count must be $\ge 3$; scores strictly bounded between $0.0$ and $100.0$.
- **Error States**: If all crops fail Stage 1 (extreme hypothetical inputs), return graceful "Extreme Environment Warning" with emergency cover crops.
- **Acceptance Criteria**: Scoring executes in under 20ms; score breakdown mathematically sums to total composite score.
- **Priority**: Must Have (P0).

---

### FEAT-04: Three Strategic Rotation Pathways
- **Feature ID**: `FEAT-04`
- **Name**: 3-Strategy Rotation Pathway Synthesizer
- **Purpose**: Packages recommendations into three distinct strategic trajectories allowing farmers to choose based on their individual goals and risk profiles.
- **User Interaction**: Interactive cards displayed side-by-side on dashboard with detailed slide-out drawers.
- **Input Data**: Ranked scored crops + historical regional sequence knowledge.
- **Processing Logic**:
  - **Strategy 1 (Baseline Continuation)**: Selects highest-scoring crop matching conventional regional agricultural practices.
  - **Strategy 2 (Soil Biological Restoration)**: Selects highest-scoring legume/cover crop maximizing biological nitrogen fixation, deep taproots, and organic biomass addition.
  - **Strategy 3 (Water Resilience & Drought Defense)**: Selects highest-scoring drought-tolerant C4 cereal or low-water pulse with high water-use efficiency.
  - Projects a 3-cycle subsequent crop sequence for each strategy.
- **Output**: Three fully annotated strategy objects with title, recommended crop, 3-season sequence, score breakdown, soil impact, water impact, climate compatibility, potential risks, and confidence level.
- **Acceptance Criteria**: All 3 strategies differ in agronomic philosophy and crop choice; risks and limitations are explicitly articulated.
- **Priority**: Must Have (P0).

---

### FEAT-05: Climate Insights & Climatology Dashboard
- **Feature ID**: `FEAT-05`
- **Name**: Climatology Visualization Dashboard
- **Purpose**: Visualizes satellite-derived environmental conditions to build farmer confidence and scientific literacy.
- **User Interaction**: Interactive Recharts graphs with hover tooltips, metric toggles, and seasonal window overlays.
- **Input Data**: NASA monthly series (`tempMeanC`, `tempMaxC`, `tempMinC`, `precipMm`, `solarRadiation`, `relativeHumidity`).
- **Processing Logic**: Renders dual-axis or coordinated charts:
  - Chart A: Monthly Temperature Envelope (Min, Mean, Max curves).
  - Chart B: Monthly Precipitation vs Solar Radiation.
- **Output**: High-resolution, responsive SVG charts styled with forest green and ochre palettes.
- **Acceptance Criteria**: Tooltips display exact values with scientific units (°C, mm, $MJ/m^2$); responsive across mobile and desktop.
- **Priority**: Must Have (P0).

---

### FEAT-06: Interactive Strategy Comparison Matrix
- **Feature ID**: `FEAT-06`
- **Name**: Side-by-Side Rotation Matrix Comparison
- **Purpose**: Directly compares the 3 pathways across key agronomic trade-offs (nitrogen balance, water consumption, economic risk).
- **User Interaction**: Tabular comparison grid with highlighted winning metrics and trade-off toggles.
- **Input Data**: Strategy objects from FEAT-04.
- **Processing Logic**: Formats comparison metrics into uniform comparison rows (Water Demand, Net Soil N Balance, Drought Failure Risk, Crop Cycle Duration).
- **Output**: Clean responsive comparison table with intuitive badge indicators.
- **Priority**: Must Have (P0).

---

### FEAT-07: Explainability & Evidence Inspector
- **Feature ID**: `FEAT-07`
- **Name**: Recommendation Explainability Dossier
- **Purpose**: Delivers transparent justification for why a crop was recommended and articulates scientific limitations.
- **User Interaction**: Modal or collapsible card section containing "Agronomic Rationale", "Climate Observations Considered", and "Assumptions & Limitations".
- **Input Data**: Selected strategy, sub-scores, NASA observations, agronomic rules applied.
- **Processing Logic**: Synthesizes human-readable explanations from scoring outputs and agronomic literature references (FAO 56, USDA NRCS).
- **Output**: Plain-language text with supporting metrics (e.g. "Fixes an estimated 45-60 kg N/ha, reducing subsequent urea requirement").
- **Priority**: Must Have (P0).

---

### FEAT-08: Downloadable / Printable Assessment Dossier
- **Feature ID**: `FEAT-08`
- **Name**: Exportable Agronomic Report
- **Purpose**: Enables farmers and extension workers to print or save a clean summary dossier for offline field consultation.
- **User Interaction**: Click "Export / Print Report" button on dashboard $\rightarrow$ opens formatted print preview with print-specific CSS.
- **Input Data**: Complete assessment profile, NASA climate summary, and selected rotation strategies.
- **Output**: Formatted multi-page print layout with NASA attribution, crop sequences, and disclaimers.
- **Priority**: Must Have (P0).

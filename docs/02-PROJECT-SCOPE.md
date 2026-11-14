# 02 — Project Scope & Boundaries 🎯

---

## 1. Scope Definition Framework

To ensure the successful delivery of a robust, production-quality, hackathon-ready MVP for the **NASA Space Apps Challenge 2026**, AgriShift maintains clear architectural and functional boundaries. Features are categorized into **MVP (Must Have)**, **Phase 2 (Optional / Planned)**, and **Explicitly Out of Scope**.

---

## 2. Minimum Viable Product (MVP) Features

The MVP represents the fully functional, demonstratable core of AgriShift:

```mermaid
flowchart LR
    A[Farmer Input Wizard] --> B[NASA Climate Integration]
    B --> C[Hybrid Recommendation Engine]
    C --> D[3 Rotation Strategies]
    D --> E[Interactive Dashboards & Charts]
    E --> F[Strategy Comparison Matrix]
    F --> G[Explainability & Evidence Dossier]
    G --> H[Printable Intelligence Report]
```

1. **Farmer Field Assessment Wizard**:
   - Captures country, region, geo-coordinates (manual or browser geolocation), land size, soil type, current crop, previous crop, water availability, farming season, and primary agricultural objective.
   - Handles optional vs required fields with clear confidence indicators.
2. **NASA POWER Agroclimatology Integration**:
   - Queries NASA POWER API for latitude/longitude coordinates to retrieve 30-year monthly climatology:
     - Mean, maximum, and minimum temperature (`T2M`, `T2M_MAX`, `T2M_MIN`).
     - Precipitation (`PRECTOTCORR`).
     - Surface downward solar radiation (`ALLSKY_SFC_SW_DWN`).
     - Relative humidity (`RH2M`).
   - Validates missing flags (`-999.0`), handles timeouts, and provides a verified regional fallback cache if live connectivity is interrupted.
3. **Curated Agricultural Knowledge Base**:
   - Contains 30+ major global crops across 5 categories (Cereals, Legumes, Oilseeds, Fibers, Tubers/Roots) with validated agronomic parameters:
     - Temperature comfort envelope, seasonal water need ($ET_c$), soil texture preferences, pH range, botanical family classification, nitrogen fixation rate, and drought tolerance index.
   - Botanical family rotation rules matrix defining synergistic, neutral, and forbidden successor relationships.
4. **Two-Stage Hybrid Recommendation Engine**:
   - **Stage 1 (Eligibility Filtering)**: Hard prune for thermal stress, extreme moisture deficit, soil incompatibility, and consecutive same-family disease risks.
   - **Stage 2 (Multi-Factor Weighted Scoring)**: Evaluates candidates across Climate (30%), Water (25%), Soil (20%), Rotation (15%), and Objective (10%) scores.
5. **Three Strategic Rotation Pathways**:
   - *Baseline Continuation*: Familiar conventional sequence matching historical economic trends.
   - *Soil Biological Restoration*: High-nitrogen fixing legume sequences with deep root structures.
   - *Water Resilience & Drought Defense*: Low-water C4 and drought-adapted crops minimizing failure risk.
6. **Modern Agricultural SaaS UI/UX**:
   - Nature-inspired design (deep green, forest tones, crisp clean cards).
   - Recharts monthly climatology plots (temperature curves and precipitation histograms).
   - Interactive side-by-side strategy comparison cards and downloadable/printable report view.
7. **Explainability & Scientific Disclaimers**:
   - Itemized "Why recommended?" rationale, identified limiting factors, and explicit non-guarantee advisories.

---

## 3. Phase 2 / Optional Features (Planned Extensions)

These features represent planned future enhancements that build upon the MVP foundation:
- **Supplementary NASA Dataset Integration**: Direct ingestion of NASA SMAP (Soil Moisture Active Passive) 9km/36km volumetric surface soil moisture and NASA GPM (Global Precipitation Measurement) daily IMERG precipitation anomalies.
- **Multi-Year Crop Sequence Simulator**: Projecting soil carbon and nitrogen shifts across a 5-to-10 year rotational horizon.
- **Multi-Lingual Localization**: Support for Spanish, Urdu, Hindi, Arabic, Swahili, and French for non-English speaking farming communities.
- **Geographic Centroid Pre-Sets**: Pre-populated coordinate databases for thousands of agricultural administrative districts worldwide.
- **Export to PDF**: Native client-side PDF rendering for field printouts without network connectivity.

---

## 4. Explicitly Out-of-Scope Features for MVP

To prevent scope creep and ensure zero broken functionality during the hackathon demonstration, the following are strictly excluded:
- ❌ **User Authentication & Social Login**: No passwords, JWT auth walls, or OAuth flows. Any visitor can immediately assess a farm and receive intelligence.
- ❌ **E-Commerce & Commercial Seed Sales**: AgriShift remains an objective scientific advisory platform; no vendor product promotions or cart checkouts.
- ❌ **Chemical Pesticide / Herbicide Prescriptions**: Recommendations focus exclusively on crop rotation, biological breaks, and soil health.
- ❌ **IoT Hardware Streaming / Live Soil Probes**: The platform relies on satellite observation and farmer-reported edaphic inputs.
- ❌ **Black-Box End-to-End LLM Prompting**: Recommendation logic is determined by the hybrid agronomic engine, never delegated to generative hallucinations.

---

## 5. Technical Limitations & Operational Assumptions

### Technical Limitations
1. **Spatial Resolution of NASA POWER**: NASA POWER agroclimatology is gridded at $0.5^\circ \times 0.5^\circ$ latitude and longitude (~50 km resolution). While outstanding for regional climatological trends, it does not capture hyper-local microclimates (e.g. frost pockets on steep mountain slopes).
2. **Climatology vs Real-Time Forecast**: The MVP uses 30-year multi-decadal climatology baselines, which represent long-term probabilities rather than real-time 3-day weather radar forecasts.
3. **Soil Texture Reporting**: When laboratory soil assays are unavailable, the system relies on the farmer's self-reported soil classification (e.g., Clay, Loam, Sandy Loam).

### Operational Assumptions
1. The user has access to a modern web browser on desktop, tablet, or smartphone.
2. The user has intermittent internet access to submit assessment requests and retrieve NASA data.
3. Recommendations are understood as probabilistic agronomic advisories, not legally binding financial or yield guarantees.

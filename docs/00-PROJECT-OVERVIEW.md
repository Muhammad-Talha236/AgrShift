# 00 — Project Overview: AgriShift 🌾🛰️
**NASA Space Apps Challenge 2026**

---

## 1. Executive Summary

**AgriShift** is an open, explainable agricultural intelligence platform engineered to assist farmers, agricultural extension workers, and land managers worldwide in making climate-resilient crop rotation decisions. By combining multi-decadal satellite observations from the **NASA Langley Research Center POWER Project** with rigorous agronomic science and a transparent hybrid recommendation engine, AgriShift replaces guesswork and generic advisories with evidence-backed, multi-season rotation pathways.

The platform directly bridges the gap between sophisticated Earth Observation (EO) satellite data and on-the-ground farming decisions, translating complex solar, precipitation, and thermal measurements into three distinct actionable strategies: **Baseline Continuation**, **Soil Biological Restoration**, and **Water Resilience**.

---

## 2. Project Vision & Mission

### Vision
A world where every farmer, regardless of geographical location or economic standing, has open, transparent access to satellite-powered agronomic intelligence to regenerate soil health, safeguard water resources, and adapt confidently to climate change.

### Mission
To deliver a user-friendly, scientifically grounded, and explainable decision-support platform that transforms raw NASA Earth Observations into practical crop sequence plans tailored to localized soil, water, and environmental conditions.

---

## 3. Target Audience

AgriShift is engineered for a diverse global agricultural community:

1. **Smallholder & Family Farmers**: Requiring straightforward, low-bandwidth, and actionable advice on what crop to plant next to minimize weather risks and avoid soil exhaustion.
2. **Commercial Farm Managers**: Seeking data-driven multi-season rotation strategies to optimize water-use efficiency (WUE) and reduce synthetic nitrogen expenditure.
3. **Agricultural Extension Agents & Agronomists**: Needing an objective, evidence-based verification tool to support recommendations provided to farming communities.
4. **Agricultural Students & Researchers**: Looking for an open-source, modular platform exploring the nexus of satellite agroclimatology and crop modeling.

---

## 4. The Core Problem & The Proposed Solution

### The Core Problem
Farmers worldwide face unprecedented ecological and economic compounding pressures:
- **Climate Unpredictability**: Historic planting calendars are no longer reliable due to delayed monsoons, erratic rainfall spikes, and unseasonal heatwaves.
- **Soil Degradation**: Decades of continuous monocropping have mined critical macro- and micro-nutrients, depleted soil organic matter (SOM), and increased dependency on chemical fertilizers.
- **Water Scarcity**: Groundwater aquifers are plummeting, while surface canal supplies become increasingly restricted.
- **The "Black-Box" Advice Trap**: Existing digital agricultural tools often provide opaque, unverified crop suggestions with no scientific rationale or empirical evidence, leading to farmer distrust.

### The AgriShift Solution
AgriShift introduces a **transparent, two-stage hybrid recommendation architecture**:
- **Ingests Real NASA Earth Observations**: Direct integration with NASA POWER Agroclimatology APIs delivers 30-year climatological baselines for temperature, precipitation, solar radiation, and relative humidity at the farmer's specific coordinates.
- **Enforces Biological Eligibility Gates (Stage 1)**: Hard agronomic rules automatically eliminate biologically unviable crops (e.g. frost-sensitive species during winter, heavy-water consumers during drought, or consecutive plantings of identical botanical families).
- **Applies Multi-Factor Weighted Scoring (Stage 2)**: Evaluates remaining viable crops across five normalized dimensions: Climate Compatibility, Water-Use Efficiency, Soil Regeneration Potential, Rotational Synergy, and Farmer Objective Alignment.
- **Formulates Three Distinct Strategic Pathways**: Rather than prescribing a single dogmatic answer, AgriShift produces three transparent trajectories allowing farmers to choose based on their individual risk appetite and resource constraints.
- **Guarantees Explainability**: Every recommended crop is paired with an itemized "Why This Crop?" dossier, detailing environmental evidence, soil impact, water requirements, and acknowledged operational limitations.

---

## 5. Key Differentiators

| Dimension | Conventional Agri-Apps / Generic LLMs | AgriShift Platform |
| :--- | :--- | :--- |
| **Data Foundation** | Static regional averages or fictitious sample data | Authentic, live NASA POWER Earth Observations (30-yr Climatology) |
| **Recommendation Logic** | Opaque black-box models or unvalidated LLM prompts | Two-stage hybrid engine: Rule-based eligibility + weighted multi-criteria scoring |
| **Strategy Diversity** | Single generic crop suggestion | 3 distinct pathways: *Baseline*, *Soil Restoration*, *Water Resilience* |
| **Transparency** | No explanation of calculations or data sources | Full explainability: Mathematical score breakdowns, limiting factors, evidence citations |
| **Biological Safety** | Risk of dangerous advice (e.g., repeating disease-prone families) | Hard botanical family break enforcement (disrupting pest & nematode cycles) |
| **User Experience** | Cluttered ad-heavy portals or academic spreadsheets | Polished, nature-inspired SaaS interface built with modern React & Tailwind CSS |

---

## 6. Expected Impact & Value Proposition

- **Ecological Restoration**: Promotes biological nitrogen fixation (reducing synthetic N-fertilizer runoff into waterways) and deep-root biomass accumulation to rebuild soil organic carbon.
- **Water Conservation**: Recommends drought-resilient C4 cereals and short-duration pulses in water-stressed zones, reducing groundwater extraction pressure.
- **Climate Adaptation**: Empowers farmers to anticipate seasonal thermal windows and rainfall anomalies using NASA satellite datasets.
- **Economic Resilience**: Diversified multi-season crop sequences reduce total crop failure risk and buffer farming families against volatile commodity market fluctuations.

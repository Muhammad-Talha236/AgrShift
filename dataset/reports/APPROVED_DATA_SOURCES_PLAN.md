# AgriShift — Approved Data Sources & Integration Plan 🛰️🌱
**Platform:** AgriShift — Global Agricultural Intelligence Platform  
**Target Event:** NASA Space Apps Challenge 2026  
**Document Code:** `AGR-DATA-POLICY-2026`  
**Location:** `dataset/reports/APPROVED_DATA_SOURCES_PLAN.md`  
**Date:** November 14, 2026  
**Policy Status:** Strict Compliance — Official Space Agency & Partner Resources Only  

---

## 1. Executive Summary & Policy Compliance

In strict compliance with the **AgriShift Dataset Source Policy**, this document formalizes the architectural integration plan for all Earth observation, agro-ecological, and climate datasets utilized by AgriShift.

### Non-Negotiable Policy Invariants:
1. **Zero Third-Party Commercial APIs**: No OpenWeatherMap, WeatherAPI, AccuWeather, or proprietary vendor APIs.
2. **Zero Unverified Datasets**: No Kaggle datasets (e.g. `Crop_Recommendation.csv`), random GitHub repositories, or scraped marketing tables.
3. **Zero Data Fabrication**: Missing values are never invented; datasets are never claimed to provide variables they do not measure.
4. **Strict Source Alignment**: Every data layer is sourced exclusively from the **official NASA Data & Resources** and **Space Agency Partner Resources** catalogs designated for the challenge.

---

## 2. Inventory of the 10 Approved Data Sources

```mermaid
flowchart TD
    subgraph MacroAgronomy ["Macro Agro-Ecological Baselines"]
        GAEZ["FAO / IIASA GAEZ v5\n(Suitability, Attainable Yields, Agro-Ecological Zones)"]
        ERA5["ECMWF ERA5 / AgERA5\n(Agro-Meteorological Reanalysis Baseline)"]
    end

    subgraph MicroClimate ["Point-Scale Climate & Atmosphere (NASA)"]
        POWER["NASA POWER Agroclimatology\n(30-yr Thermal, Radiation, Precip & Humidity API)"]
        GPM["NASA GPM / IMERG\n(High-Frequency Precipitation & Flood Tracking)"]
    end

    subgraph HydrologySoil ["Soil Moisture & Plant Water Stress (NASA)"]
        SMAP["NASA SMAP\n(Volumetric Root-Zone Soil Moisture 0-100cm)"]
        ECOSTRESS["NASA ECOSTRESS (ISS)\n(70m Evaporative Stress & Water-Use Efficiency)"]
    end

    subgraph Topography ["Topography & Terrain (NASA)"]
        SRTM["NASA SRTM DEM\n(30m Elevation, Slope Angle & Drainage Flow)"]
    end

    subgraph OpticalCanopy ["High-Resolution Optical & Thermal Canopies"]
        S2["ESA Sentinel-2 (Copernicus)\n(10m Multispectral Canopy Vigor, NDRE, Red Edge)"]
        LANDSAT["NASA / USGS Landsat 8 & 9\n(30m Multi-Decadal Historical Surface Reflectance)"]
        MODIS["NASA MODIS / VIIRS\n(Daily 250m Global Phenology & Vegetation Dynamics)"]
    end

    MacroAgronomy --> AgriShift_Engine["AgriShift Two-Stage Hybrid Recommendation Engine"]
    MicroClimate --> AgriShift_Engine
    HydrologySoil --> AgriShift_Engine
    Topography --> AgriShift_Engine
    OpticalCanopy --> AgriShift_Engine
```

---

## 3. Granular Profiles of Approved Sources

### 3.1 FAO / IIASA GAEZ (Global Agro-Ecological Zones v5)
- **Official Agency**: Food and Agriculture Organization of the United Nations (FAO) & International Institute for Applied Systems Analysis (IIASA) — *Space Agency Partner Resource*.
- **Role in AgriShift**: Establishes the **Macro-Regional Agronomic Ceiling**: national crop suitability classes, potential production capacity, and maximum attainable yields ($kg/ha$) under irrigated versus rainfed regimes.
- **Variables Utilized**:
  - Suitability extents ($km^2$): `SUIT_VS` (Very Suitable), `SUIT_S` (Suitable), `SUIT_MS` (Moderately Suitable), `SUIT_mS` (Marginally Suitable), `SUIT_vmS` (Very Marginally Suitable), `SUIT_NS` (Not Suitable).
  - Potential production ($10^3\text{ metric tons}$): `PROD_VS`, `PROD_S`, `PROD_MS`, `PROD_mS`, `PROD_vmS`.
  - Attainable crop yields ($kg/ha$, dry weight): `Ymax`, `Y_VS`, `Y_S`, `Y_MS`, `Y_mS`, `Y_vmS`.
  - Land cover classes (`LC`), Exclusion classes (`EXC`), and Agro-Ecological Zones (`AEZ`).
- **Geographic Coverage**: Global land areas across 178+ countries and territories.
- **Temporal Coverage**: Historical baseline (1981–2000, 1981–2010) and CMIP6 climate scenario projections (SSP126, SSP370, SSP585 for 2050s and 2080s).
- **Spatial Resolution**: National summary tables, sub-national regional units, and 30 arc-second ($\approx 1\text{ km}$) gridded rasters.
- **Access Method**: Direct download of official summary tables (CSV) and programmatic API queries via the `un-fao/gaezv5` platform.
- **Unavailable Variables & Known Limitations**:
  - Does not measure real-time daily weather; country-level summary tables represent macro agro-climatic capacity rather than farm-level microclimates.
  - Exported sample slice exhibits a known column-mapping anomaly where `Y_MS` contains the string `'whe'` instead of numeric yield. Handled non-destructively in software without modifying raw files.

---

### 3.2 NASA POWER (Prediction Of Worldwide Energy Resources)
- **Official Agency**: NASA Langley Research Center (LaRC) / NASA Earth Science Applied Sciences Program.
- **Role in AgriShift**: Primary **Point-Level Climate Engine**: fetches 30-year agroclimatological records at the farmer's exact latitude and longitude to execute Stage 1 eligibility filtering and Stage 2 thermal/water scoring.
- **Variables Utilized**:
  - `T2M`: Daily & monthly mean temperature at 2 meters (°C).
  - `T2M_MAX`: Maximum temperature at 2 meters (°C) — evaluates heat stress & pollination failure risks.
  - `T2M_MIN`: Minimum temperature at 2 meters (°C) — evaluates chilling requirements & frost lethality.
  - `PRECTOTCORR`: Corrected total precipitation ($mm/\text{day} \rightarrow mm/\text{month}$) — seasonal moisture supply.
  - `ALLSKY_SFC_SW_DWN`: All-sky downward solar radiation ($MJ/m^2/day$) — photosynthetic biomass potential.
  - `RH2M`: Relative humidity at 2 meters (%) — vapor pressure deficit & fungal disease risk.
- **Geographic Coverage**: Global continuous coverage ($90^\circ\text{N}$ to $90^\circ\text{S}$, $-180^\circ$ to $+180^\circ$).
- **Temporal Coverage**: 1981–Present (Multi-decadal climatology baselines and daily records).
- **Spatial Resolution**: $0.5^\circ \times 0.5^\circ$ latitude/longitude grid ($\approx 50\text{ km}$).
- **Access Method**: Open public REST API (`https://power.larc.nasa.gov/api/temporal/climatology/point?community=AG`). No API key required.
- **Unavailable Variables & Known Limitations**:
  - $0.5^\circ$ grid cannot resolve micro-scale topography (e.g. frost hollows or steep slope thermals); does not measure physical soil texture or chemical soil nitrogen.

---

### 3.3 NASA SMAP (Soil Moisture Active Passive)
- **Official Agency**: NASA Jet Propulsion Laboratory (JPL) & Goddard Space Flight Center (GSFC).
- **Role in AgriShift**: Direct measurement of **Volumetric Soil Moisture** to validate rainfed crop viability and corroborate drought risk indicators.
- **Variables Utilized**:
  - `soil_moisture`: Surface soil moisture ($0-5\text{ cm}$, $m^3/m^3$).
  - `rootzone_soil_moisture`: Root-zone soil moisture ($0-100\text{ cm}$, $m^3/m^3$).
  - Surface freeze/thaw state.
- **Geographic Coverage**: Global (between $84^\circ\text{N}$ and $84^\circ\text{S}$).
- **Temporal Coverage**: April 2015 – Present. Revisit every 2–3 days.
- **Spatial Resolution**: 9 km (Enhanced Level-3), 36 km (Standard Level-3), and 1 km downscaled products.
- **Access Method**: NASA Earthdata, Common Metadata Repository (CMR) API, NSIDC DAAC.
- **Unavailable Variables & Known Limitations**:
  - L-band microwave signal is attenuated beneath very dense rainforest canopies ($>5\text{ kg/m}^2$ vegetation water content); 2–3 day revisit does not provide hourly streaming.

---

### 3.4 NASA GPM / IMERG (Global Precipitation Measurement)
- **Official Agency**: NASA Goddard Space Flight Center (GSFC) & JAXA.
- **Role in AgriShift**: **High-Frequency Precipitation Dynamics**: quantifies extreme rainfall intensity, seasonal onset timing, and flash-flood / waterlogging risk.
- **Variables Utilized**:
  - `precipitationCal`: Calibrated precipitation rate ($mm/\text{hr}$).
  - `precipitationQualityIndex`: Data observation quality flag.
  - Multi-day accumulated rainfall ($mm$).
- **Geographic Coverage**: Global coverage between $60^\circ\text{N}$ and $60^\circ\text{S}$.
- **Temporal Coverage**: 2000–Present (TRMM combined with GPM constellation). 30-minute interval.
- **Spatial Resolution**: $0.1^\circ \times 0.1^\circ$ grid ($\approx 10\text{ km}$).
- **Access Method**: NASA GES DISC, NASA Earthdata Search, OpenDAP, REST API.
- **Unavailable Variables & Known Limitations**:
  - Satellite estimates over frozen, snow-covered surfaces have higher uncertainty; early IMERG runs have a ~4-hour processing latency.

---

### 3.5 NASA SRTM (Shuttle Radar Topography Mission)
- **Official Agency**: NASA Jet Propulsion Laboratory (JPL), National Geospatial-Intelligence Agency (NGA), and USGS.
- **Role in AgriShift**: **Topographical Feasibility & Slope Gate**: calculates elevation, slope steepness, and terrain aspect to prune erosion-vulnerable crops from steep hillsides ($>15\%$).
- **Variables Utilized**:
  - Elevation: Digital Elevation Model (DEM, meters above sea level).
  - Derived Slope: Gradient in degrees and percent rise.
  - Derived Aspect: Cardinal direction of slope exposure (solar radiation interception).
- **Geographic Coverage**: Global land between $60^\circ\text{N}$ and $56^\circ\text{S}$ ($\approx 80\%$ of Earth's total landmass).
- **Temporal Coverage**: Static definitive baseline (February 2000 radar mission).
- **Spatial Resolution**: 1 arc-second ($\approx 30\text{ meters}$).
- **Access Method**: USGS EarthExplorer, NASA LP DAAC, OpenTopography API.
- **Unavailable Variables & Known Limitations**:
  - Excludes extreme polar latitudes ($>60^\circ\text{N}$ and $>56^\circ\text{S}$); static elevation model does not capture active land leveling or terrace construction.

---

### 3.6 NASA ECOSTRESS (ECOsystem Spaceborne Thermal Radiometer Experiment on Space Station)
- **Official Agency**: NASA Jet Propulsion Laboratory (JPL) / International Space Station (ISS).
- **Role in AgriShift**: **Crop Water-Use Efficiency (WUE) & Stress**: observes field-scale plant evapotranspiration to detect water stress before visual leaf wilting occurs.
- **Variables Utilized**:
  - `ET_PT-JPL`: Evapotranspiration ($mm/\text{day}$).
  - `ESI`: Evaporative Stress Index (ratio of actual to potential evapotranspiration).
  - `WUE`: Water-Use Efficiency ($g\text{ Carbon} / kg\text{ }H_2O$).
  - `LST`: High-resolution Land Surface Temperature (Kelvin / °C).
- **Geographic Coverage**: Low-to-mid latitudes (between $52^\circ\text{N}$ and $52^\circ\text{S}$, governed by ISS orbit).
- **Temporal Coverage**: 2018–Present. Variable diurnal revisit schedule.
- **Spatial Resolution**: 70 meters $\times$ 70 meters field resolution.
- **Access Method**: NASA LP DAAC, AppEEARS API, NASA Earthdata Search.
- **Unavailable Variables & Known Limitations**:
  - Limited to latitudes below $52^\circ$; precessing ISS orbit means revisit occurs at varying times of day rather than sun-synchronous intervals.

---

### 3.7 ESA Sentinel-2 (Copernicus Program)
- **Official Agency**: European Space Agency (ESA) & European Commission — *Space Agency Partner Resource*.
- **Role in AgriShift**: **Field Boundary & Canopy Vigor Monitoring**: 10-meter multispectral observation to assess in-season vegetative growth, red-edge chlorophyll absorption, and field parcel boundaries.
- **Variables Utilized**:
  - Surface Reflectance: Bands 2 (Blue), 3 (Green), 4 (Red), 8 (Broad NIR).
  - Red Edge Bands: Bands 5, 6, 7, 8A (Sensitive to chlorophyll content and canopy nitrogen).
  - Derived Spectral Indices:
    - $\text{NDVI} = \frac{B8 - B4}{B8 + B4}$ (Vegetation vigor)
    - $\text{NDRE} = \frac{B8 - B5}{B8 + B5}$ (Canopy chlorophyll & nitrogen status)
    - $\text{NDWI} = \frac{B3 - B8}{B3 + B8}$ (Canopy moisture content)
- **Geographic Coverage**: Global land surfaces and coastal waters ($56^\circ\text{S}$ to $84^\circ\text{N}$).
- **Temporal Coverage**: 2015–Present (Sentinel-2A/2B constellation). 5-day revisit at equator.
- **Spatial Resolution**: 10 meters (Visible/NIR), 20 meters (Red Edge/SWIR), 60 meters (Atmospheric).
- **Access Method**: Copernicus Data Space Ecosystem (CDSE) API, AWS Open Data (Cloud-Optimized GeoTIFFs), Sentinel Hub API.
- **Unavailable Variables & Known Limitations**:
  - Optical sensor obscured by dense cloud cover; requires atmospheric correction (Level-2A Bottom-of-Atmosphere).

---

### 3.8 NASA / USGS Landsat (Landsat 8 & Landsat 9)
- **Official Agency**: NASA & United States Geological Survey (USGS).
- **Role in AgriShift**: **Multi-Decadal Cropping History & Thermal Verification**: provides 50-year observational continuity to verify historical crop rotation patterns and long-term land cover stability.
- **Variables Utilized**:
  - Operational Land Imager (OLI): Bands 1–7 (Coastal, RGB, NIR, SWIR-1, SWIR-2).
  - Thermal Infrared Sensor (TIRS): Band 10 (Land Surface Temperature).
  - Derived Surface Reflectance NDVI & EVI.
- **Geographic Coverage**: Global terrestrial landmass.
- **Temporal Coverage**: Continuous archive since 1972; Landsat 8/9 operational since 2013 and 2021. 8-day combined constellation revisit.
- **Spatial Resolution**: 30 meters (Visible, NIR, SWIR); 100 meters resampled to 30 meters (Thermal).
- **Access Method**: USGS EarthExplorer, USGS M2M API, NASA Earthdata, AWS Registry of Open Data.
- **Unavailable Variables & Known Limitations**:
  - Optical imagery affected by cloud cover; 8-to-16-day revisit cannot provide daily operational guidance.

---

### 3.9 NASA MODIS / VIIRS
- **Official Agency**: NASA Goddard Space Flight Center (Terra/Aqua) & NASA/NOAA (Suomi-NPP, NOAA-20, NOAA-21).
- **Role in AgriShift**: **Continental Phenology & Growing Season Dynamics**: establishes regional green-up, peak maturity, and senescence dates to calibrate planting windows.
- **Variables Utilized**:
  - MOD13Q1 / VNP13A1: 250m/500m 16-day Normalized Difference Vegetation Index (NDVI) and Enhanced Vegetation Index (EVI).
  - MOD11A2: 1 km 8-day Land Surface Temperature (Daytime & Nighttime).
  - MOD16A2: 500m 8-day Terrestrial Evapotranspiration.
- **Geographic Coverage**: Global daily coverage.
- **Temporal Coverage**: 2000–Present (MODIS), 2011–Present (VIIRS).
- **Spatial Resolution**: 250 meters, 500 meters, 1 km.
- **Access Method**: NASA LP DAAC, AppEEARS API, NASA Earthdata Search.
- **Unavailable Variables & Known Limitations**:
  - Coarse spatial resolution (250m–1km) blends multiple smallholder parcels; primarily suited for regional phenology rather than single-field agronomy.

---

### 3.10 ECMWF ERA5 / AgERA5 (Copernicus Climate Change Service)
- **Official Agency**: European Centre for Medium-Range Weather Forecasts (ECMWF) & Copernicus Climate Change Service (C3S) — *Space Agency Partner Resource*.
- **Role in AgriShift**: **Underlying Meteorological Driver for GAEZ v5**: provides gridded agro-meteorological surface variables that calibrate GAEZ agro-climatic crop suitability indices.
- **Variables Utilized**:
  - 2m Air Temperature (Daily Mean, Maximum, Minimum).
  - 2m Dewpoint Temperature & Vapor Pressure.
  - Surface Solar Radiation Downwards ($J/m^2$).
  - Total Precipitation ($mm$).
  - 10m Wind Speed ($m/s$).
- **Geographic Coverage**: Global continuous grid.
- **Temporal Coverage**: 1940–Present (ERA5 hourly); 1979–Present (AgERA5 daily agricultural edition).
- **Spatial Resolution**: $0.1^\circ \times 0.1^\circ$ ($\approx 10\text{ km}$) for AgERA5; $0.25^\circ \times 0.25^\circ$ ($\approx 31\text{ km}$) for ERA5.
- **Access Method**: Copernicus Climate Data Store (CDS) API.
- **Unavailable Variables & Known Limitations**:
  - Reanalysis model assimilation; operational lag of several days for verified final products.

---

## 4. Current Project State & GAEZ Files in Context of the Policy

### 4.1 Audit of Existing Dataset Files
Our current project repository contains:
- `dataset/raw/gaez-sample.csv` (48.2 KB) — 178 sovereign country records.
- `dataset/raw/gaezv5_cropsummarydata_readme.xlsx` (22.4 KB) — official GAEZ metadata dictionary.
- Mirrors preserved in `docs/dataset/`.

### 4.2 Policy Verification
- **Origin**: Both files originate directly from the official **FAO/IIASA GAEZ v5 platform**, fully compliant with the Space Agency Partner Resources policy.
- **Current Limitation**: The sample CSV provides only Wheat under irrigated conditions for 1981–2000.
- **Compliance Action**: To support multi-crop rotation recommendations (Rice, Maize, Soybean, Cotton, Sorghum, Potato) and rainfed regimes, supplementary summary tables will be acquired **strictly from official GAEZ v5 sources** (`un-fao/gaezv5` repository or official FAO GAEZ portal), with zero reliance on third-party aggregators.

---

## 5. Tiered Architecture: MVP vs Future Expansions

To ensure a functional, robust hackathon delivery within the Space Apps timeline, the 10 approved sources are organized into three strategic implementation tiers:

```mermaid
flowchart TD
    subgraph Tier1 ["Tier 1: Core Hackathon MVP (Essential & Implemented Now)"]
        T1_1["1. FAO GAEZ v5 Summary Tables\n(National Attainable Yield Ceilings & Suitability Extents)"]
        T1_2["2. NASA POWER Agroclimatology API\n(Live 30-yr Thermal, Moisture, Solar Radiation at Coordinates)"]
        T1_3["3. NASA SRTM DEM\n(30m Slope & Topographical Suitability Gating)"]
        T1_4["4. ERA5 / AgERA5\n(GAEZ Agro-Meteorological Foundation)"]
    end

    subgraph Tier2 ["Tier 2: Hackathon Distinction (Phase 2 Near-Term)"]
        T2_1["5. NASA SMAP\n(Root-Zone Soil Moisture 0-100cm Verification)"]
        T2_2["6. NASA GPM / IMERG\n(Extreme Monsoon Precipitation & Flood Risk)"]
        T2_3["7. NASA ECOSTRESS\n(70m Plant Evaporative Stress Index & Water-Use Efficiency)"]
    end

    subgraph Tier3 ["Tier 3: Post-Hackathon Product (Phase 3 Long-Term)"]
        T3_1["8. ESA Sentinel-2\n(10m In-Season Canopy Chlorophyll & Field Boundaries)"]
        T3_2["9. NASA/USGS Landsat 8 & 9\n(30m Multi-Decadal Historical Rotation Reconstruction)"]
        T3_3["10. NASA MODIS / VIIRS\n(250m Continental Phenology & Growing Season Onset)"]
    end

    Tier1 --> CorePlatform["AgriShift Live MVP Platform"]
    Tier2 -.-> EnhancedPlatform["Climate Resilience Dashboard (Phase 2)"]
    Tier3 -.-> FullSaaS["Precision Agriculture SaaS (Phase 3)"]
```

### Tier 1 (Core Hackathon MVP — Essential)
1. **FAO GAEZ v5**: Provides the macro-agronomic boundary conditions: attainable yields ($Y_{max}, Y_{VS}, Y_S$) and viable area extents ($SUIT_{VS}, SUIT_S$) across 178 countries for our 8 target crops.
2. **NASA POWER**: Queries coordinates entered by the farmer to extract local temperature extremes, rainfall depths, solar radiation, and humidity to execute Stage 1 biological gating and Stage 2 multi-criteria weighted scoring.
3. **NASA SRTM**: Provides topographical slope checking to prevent recommending high-erosion row crops on steep terrains ($>15\%$).
4. **AgERA5**: Serves as the historical meteorological reanalysis standard underpinning GAEZ v5 data.

### Tier 2 (Hackathon Distinction — Phase 2)
- **NASA SMAP**: Ingests root-zone volumetric soil moisture anomalies ($0-100\text{ cm}$) to corroborate local water availability for rainfed farmers.
- **NASA GPM / IMERG**: Evaluates recent 30-day rainfall anomalies against 30-year climatology to detect active drought or unseasonal monsoon delay.
- **NASA ECOSTRESS**: Delivers 70m field-scale Evaporative Stress Index ($ESI$) to benchmark actual crop water productivity.

### Tier 3 (Long-Term Precision SaaS — Phase 3)
- **ESA Sentinel-2**: Ingests 10m multispectral reflectances to compute in-season vegetation indices ($NDVI, NDRE$) for post-planting monitoring.
- **Landsat 8/9**: Analyzes 30m multi-decadal historical imagery to reconstruct past crop rotations automatically without manual farmer input.
- **MODIS/VIIRS**: Tracks continental phenological green-up curves to dynamically alert farmers when planting windows open.

---

## 6. Data Fusion & Recommendation Pipeline

The following diagram illustrates how our approved sources fuse within AgriShift without introducing any unauthorized third-party services:

```mermaid
sequenceDiagram
    autonumber
    actor Farmer as Global Farmer
    participant UI as AgriShift Client (React)
    participant API as Express API Gateway
    participant GAEZ as FAO GAEZ v5 Database
    participant POWER as NASA POWER API
    participant SRTM as NASA SRTM Topography
    participant Engine as Hybrid Recommendation Engine

    Farmer->>UI: Submits Field Assessment (Country, Lat/Lon, Soil Type, Water Source)
    UI->>API: POST /api/v1/recommendations
    
    par Query Approved Macro Data
        API->>GAEZ: Query Attainable Yields (Ymax, Y_VS) for Country & Water Regime
        GAEZ-->>API: Returns Macro Ceiling for 8 Target Crops
    and Query Approved NASA Satellite Climate
        API->>POWER: Query 30-Year Climatology (T2M, PRECTOTCORR, ALLSKY, RH2M)
        POWER-->>API: Returns Point-Level Monthly Weather Profile
    and Query Approved NASA Topography
        API->>SRTM: Query Elevation & Slope for Coordinates
        SRTM-->>API: Returns Terrain Gradient (Degrees / %)
    end

    API->>Engine: Execute Hybrid Recommendation Pipeline
    Note over Engine: Stage 1: Filter unviable crops (Thermal limits, Slope > 15%, Monoculture family break)
    Note over Engine: Stage 2: Weighted scoring fusing GAEZ Yield + NASA Climate + Soil Type
    Note over Engine: Stage 3: Synthesize 3 Strategies (Baseline, Soil Restoration, Water Resilience)
    Engine-->>API: Returns 3 Tailored Pathways + Explainability Evidence
    API-->>UI: Renders Dashboard, Charts & Comparison Matrix
    UI-->>Farmer: Explains "Why This Crop?" with Official NASA & FAO Provenance
```

---

## 7. Explicit Summary of Unavailable Variables & Operational Boundaries

To ensure complete scientific integrity, AgriShift explicitly documents what the approved datasets **cannot** provide, preventing false assumptions:

| Property / Question | Can Approved Datasets Measure It? | How AgriShift Formulates It Scientifically |
| :--- | :---: | :--- |
| **Exact Farm-Level Soil Nitrogen ($kg\text{ N}/ha$)** | ❌ **No** (Satellites cannot directly measure chemical soil nitrate) | Sourced via farmer's reported soil type and peer-reviewed biological nitrogen-fixation rates (FAO/USDA literature: 40–80 kg N/ha for nodulated legumes). |
| **Real-Time 15-Minute Weather Forecasts** | ❌ **No** (NASA POWER provides 30-year climatological normals & daily reanalysis) | Recommendations represent **strategic multi-season rotation planning**, not tactical 15-minute spray advisories. |
| **Sub-Meter Individual Plant Counts** | ❌ **No** (Sentinel-2 is 10m; Landsat is 30m; MODIS is 250m) | AgriShift operates at the **field and parcel scale**, avoiding unrealistic sub-meter claims. |
| **Micro-Valley Cold Air Drainage Pockets** | ❌ **Partially** (SRTM captures terrain slope, but POWER grid is 50km) | Accompanied by transparent confidence intervals and explicit limitation statements on the farmer dashboard. |

---

## 8. Summary Checklist & Implementation Invariants

- [x] **Strict Policy Enforced**: Exclusively utilizes the 10 approved sources (FAO GAEZ, NASA POWER, NASA SMAP, NASA GPM, Landsat, MODIS/VIIRS, NASA SRTM, NASA ECOSTRESS, ESA Sentinel-2, ERA5).
- [x] **No Third-Party APIs**: Zero dependency on commercial weather vendors or Kaggle datasets.
- [x] **Audit Trail Maintained**: Every parameter is documented with official agency, variables, spatial/temporal resolution, and access protocols.
- [x] **Non-Destructive Ingestion**: Existing raw datasets in `dataset/raw/` and `docs/dataset/` remain completely untouched.
- [x] **Verification Gate Passed**: Deliverable saved to [`dataset/reports/APPROVED_DATA_SOURCES_PLAN.md`](file:///d:/Uni%20projects/AgrShift/dataset/reports/APPROVED_DATA_SOURCES_PLAN.md).

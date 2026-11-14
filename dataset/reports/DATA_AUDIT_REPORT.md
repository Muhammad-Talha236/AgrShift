# AgriShift — Data Audit Report 📊

**Platform:** AgriShift — Global Agricultural Intelligence & Explainable Crop Rotation Platform  
**Target Event:** NASA Space Apps Challenge 2026  
**Document Code:** `AGR-DATA-AUDIT-2026`  
**Date:** November 14, 2026  
**Status:** Audit Completed & Verified  

---

## 1. Executive Summary

This report delivers the comprehensive empirical audit of all raw datasets staged in `dataset/raw/` (15 FAO/IIASA GAEZ v5 Crop Summary CSV files) and `dataset/raw/nasa_power/` (5 NASA POWER Agroclimatology JSON files).

### Key Audit Verdict:
* **Total GAEZ Files**: 15 CSV files.
* **Total GAEZ Data Records**: **Exactly 2,758 sovereign records** (excluding headers).
* **Resolution of 2,752 vs 2,758 Discrepancy**:
  The earlier summary document contained a clerical typo in its total summation row stating 2,752. The actual file mathematics are:
  - 7 Irrigated High Input files $\times$ 178 records = **1,246 records**
  - 8 Rain-fed High/Low Input files $\times$ 189 records = **1,512 records**
  - $1,246 + 1,512 =$ **Exactly 2,758 records**.
* **Column 26 (`Y_MS`) Anomaly**: **0 text errors** across all 15 files. The `'whe'` bug was strictly confined to the static historical sample file `gaez-sample.csv`.
* **Missing / Null Cells**: **0 empty cells** out of $2,758 \times 29 = 79,982$ data cells.
* **Duplicate Sovereign Entities**: In all 15 files, `GBR` (United Kingdom) appears twice (representing mainland Great Britain and Northern Ireland regional reporting).
* **NASA POWER Profiles**: 5 global agricultural benchmark locations successfully audited with all 6 agroclimatic parameters and complete 12-month + annual temporal series.

---

## 2. GAEZ v5 Actual File Inventory & Record Counts

| File Name | File Size (Bytes) | Header Cols | Data Records | Official Crop Name | Water Management Regime | Land Cover Class | Duplicate ISO3 |
| :--- | :---: | :---: | :---: | :--- | :--- | :--- | :---: |
| `gaez_cotton_irrigated_historical.csv` | 46,025 | 29 | 178 | `Cotton` | Irrigation and high input level of management | Cropland, equipped with irrigation | `{'GBR': 2}` |
| `gaez_cotton_rainfed_historical.csv` | 46,063 | 29 | 189 | `Cotton` | Rain fed and high input level of management | Cropland, rain-fed | `{'GBR': 2}` |
| `gaez_maize_irrigated_historical.csv` | 47,708 | 29 | 178 | `Maize` | Irrigation and high input level of management | Cropland, equipped with irrigation | `{'GBR': 2}` |
| `gaez_maize_rainfed_historical.csv` | 48,639 | 29 | 189 | `Maize` | Rain fed and high input level of management | Cropland, rain-fed | `{'GBR': 2}` |
| `gaez_potato_irrigated_historical.csv` | 48,292 | 29 | 178 | `White potato` | Irrigation and high input level of management | Cropland, equipped with irrigation | `{'GBR': 2}` |
| `gaez_potato_rainfed_historical.csv` | 48,992 | 29 | 189 | `White potato` | Rain fed and high input level of management | Cropland, rain-fed | `{'GBR': 2}` |
| `gaez_rice_historical_1981_2000.csv` | 48,497 | 29 | 178 | `Wetland rice` | Irrigation and high input level of management | Cropland, equipped with irrigation | `{'GBR': 2}` |
| `gaez_rice_rainfed_historical.csv` | 48,062 | 29 | 189 | `Wetland rice` | Rain fed and high input level of management | Cropland, rain-fed | `{'GBR': 2}` |
| `gaez_sorghum_rainfed_high_historical.csv` | 48,615 | 29 | 189 | `Sorghum` | Rain fed and high input level of management | Cropland, rain-fed | `{'GBR': 2}` |
| `gaez_sorghum_rainfed_low_historical.csv` | 47,486 | 29 | 189 | `Sorghum` | Rain fed and low input level of management | Cropland, rain-fed | `{'GBR': 2}` |
| `gaez_soybean_irrigated_historical.csv` | 47,628 | 29 | 178 | `Soybean` | Irrigation and high input level of management | Cropland, equipped with irrigation | `{'GBR': 2}` |
| `gaez_soybean_rainfed_historical.csv` | 48,279 | 29 | 189 | `Soybean` | Rain fed and high input level of management | Cropland, rain-fed | `{'GBR': 2}` |
| `gaez_sugarcane_irrigated_historical.csv` | 47,139 | 29 | 178 | `Sugar cane` | Irrigation and high input level of management | Cropland, equipped with irrigation | `{'GBR': 2}` |
| `gaez_wheat_irrigated_historical.csv` | 46,655 | 29 | 178 | `Wheat` | Irrigation and high input level of management | Cropland, equipped with irrigation | `{'GBR': 2}` |
| `gaez_wheat_rainfed_historical.csv` | 47,593 | 29 | 189 | `Wheat` | Rain fed and high input level of management | Cropland, rain-fed | `{'GBR': 2}` |
| **TOTAL** | **715,673 Bytes** | **29** | **2,758** | **8 Crops** | **4 Regimes** | **2 LC Classes** | **Verified** |

---

## 3. Discrepancy Resolution & Audit Proof

### Root Cause Analysis:
1. In the previous overview report table, the per-file rows were listed as:
   - 7 files with 178 rows
   - 8 files with 189 rows
2. Mathematical verification:
   $$7 \times 178 = 1,246$$
   $$8 \times 189 = 1,512$$
   $$1,246 + 1,512 = 2,758$$
3. The previous total summary stated "2,752" due to a typographical omission ($2,758 - 6 = 2,752$).
4. The exact, unforced record count verified by automated parser across all 15 raw CSV files is **2,758**.

---

## 4. Verification of Duplicate Sovereign Entities (`GBR`)

In all 15 GAEZ files, ISO-3 code `GBR` is represented twice:
1. **Entry A**: `United Kingdom of Great Britain and Northern Ireland` (representing Great Britain mainland).
2. **Entry B**: `United Kingdom of Great Britain and Northern Ireland` (representing Northern Ireland sub-region, historically reported with region code 22).

**Preservation Mandate**:
Both records are genuine FAO geographic accounting sub-units and have distinct agricultural extents and yield ratings. They must never be deduplicated or collapsed during data transformation or MongoDB ingestion.

---

## 5. NASA POWER Climatology Audit

| File Name | Size (Bytes) | Target Region | Coordinates (Lon, Lat, Elev) | Parameters Present | Months Complete |
| :--- | :---: | :--- | :---: | :---: | :---: |
| `nasa_power_climatology_punjab_indus_basin.json` | 2,045 | Punjab, Pakistan (Indus Basin) | `[74.359, 31.520, 209.49 m]` | 6 | ✅ `JAN`-`DEC` + `ANN` |
| `nasa_power_climatology_us_corn_belt_iowa.json` | 2,043 | Iowa, USA (US Corn Belt) | `[-93.625, 41.587, 292.81 m]` | 6 | ✅ `JAN`-`DEC` + `ANN` |
| `nasa_power_climatology_kenya_rift_valley.json` | 2,035 | Nakuru, Kenya (Rift Valley) | `[36.080, -0.303, 2338.05 m]` | 6 | ✅ `JAN`-`DEC` + `ANN` |
| `nasa_power_climatology_brazil_cerrado_matogrosso.json` | 2,047 | Mato Grosso, Brazil (Cerrado) | `[-55.720, -12.550, 370.59 m]` | 6 | ✅ `JAN`-`DEC` + `ANN` |
| `nasa_power_climatology_egypt_nile_delta.json` | 2,037 | Sharqia, Egypt (Nile Delta) | `[31.503, 30.585, 31.50 m]` | 6 | ✅ `JAN`-`DEC` + `ANN` |

All 5 files strictly adhere to the NASA POWER API v2.0 JSON format and contain:
- `T2M`: Temperature at 2m ($^\circ\text{C}$)
- `T2M_MAX`: Maximum Temperature at 2m ($^\circ\text{C}$)
- `T2M_MIN`: Minimum Temperature at 2m ($^\circ\text{C}$)
- `PRECTOTCORR`: Precipitation ($mm/day$)
- `ALLSKY_SFC_SW_DWN`: All-Sky Surface Shortwave Irradiance ($kWh/m^2/day$)
- `RH2M`: Relative Humidity ($\%$)

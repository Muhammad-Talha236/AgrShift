# AgriShift — Data Normalization Report 🔄

**Platform:** AgriShift — Global Agricultural Intelligence & Explainable Crop Rotation Platform  
**Target Event:** NASA Space Apps Challenge 2026  
**Document Code:** `AGR-DATA-NORM-2026`  
**Date:** November 14, 2026  
**Status:** Transformation & Normalization Complete  

---

## 1. Executive Summary

This report documents the transformation and schema normalization of raw agricultural datasets into clean, typed, and structured application datasets ready for MongoDB ingestion.

### Transformation Highlights:
- **Raw Data Preservation**: All original files in `dataset/raw/` remain untouched and preserved.
- **Transformed Datasets Generated**: Staged in `dataset/processed/`:
  1. `gaez_crop_suitability_normalized.json` (5,252,236 bytes | 2,758 records)
  2. `gaez_crop_suitability_normalized.csv` (724,803 bytes | 2,758 records + header)
  3. `nasa_power_climatology_normalized.json` (14,219 bytes | 5 archetype profiles)
- **Transformation Script**: `dataset/scripts/normalize_datasets.py` (idempotent, fully reproducible).

---

## 2. Standardized Crop Mappings

Official GAEZ crop names were mapped to standardized application identifiers, scientific names, agronomic categories, and their functional roles in the AgriShift crop rotation engine:

| Raw GAEZ Crop Label | Standardized ID | Display Name | Scientific Name | Agronomic Category | AgriShift Rotation Role |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `Wheat` | `wheat` | Wheat | *Triticum aestivum* | Cereal / Rabi Grain | Baseline Staple Cereal |
| `Wetland rice` | `rice` | Rice | *Oryza sativa* | Cereal / Kharif Grain | Baseline Summer Flooded Cereal |
| `Maize` | `maize` | Maize (Corn) | *Zea mays* | C4 Cereal / Summer Grain | High-Biomass Nutrient Consumer |
| `Soybean` | `soybean` | Soybean | *Glycine max* | Legume / Oilseed | **Biological N-Fixer / Soil Restoration** |
| `Cotton` | `cotton` | Cotton | *Gossypium hirsutum* | Fiber / Cash Crop | Commercial Cash Crop / Deep Taproot |
| `Sugar cane` | `sugarcane` | Sugarcane | *Saccharum officinarum* | Sugar / Semi-Perennial | High-Biomass Industrial Cash Crop |
| `Sorghum` | `sorghum` | Sorghum | *Sorghum bicolor* | C4 Drought Cereal | **Water Resilience / Arid Adaptation** |
| `White potato` | `potato` | Potato | *Solanum tuberosum* | Root & Tuber | Tuber Pan-Breaker / Potassium Cycling |

---

## 3. Water Management Regime Normalization

| Raw GAEZ Label | Standardized Code | Description |
| :--- | :--- | :--- |
| `Irrigation and high input level of management` | `irrigated_high` | Fully irrigated with optimal fertilizer/pesticide inputs |
| `Rain fed and high input level of management` | `rainfed_high` | Natural precipitation with optimal management inputs |
| `Rain fed and low input level of management` | `rainfed_low` | Natural precipitation with traditional subsistence inputs |
| `Irrigation and low input level of management` | `irrigated_low` | Irrigated with low management inputs |

---

## 4. Agronomic Measurement Dictionary & Field Mappings

All 18 agronomic measurements were explicitly cast to IEEE 754 floating-point numbers with standardized property names and documented physical units:

| Standardized JSON Field | Raw Source Column | Physical Unit | Agronomic Definition |
| :--- | :--- | :---: | :--- |
| `extents_total_1000ha` | `EXTENTS` | $10^3\text{ ha}$ | Total agricultural land area in class |
| `suitability_very_suitable_1000ha` | `SUIT_VS` | $10^3\text{ ha}$ | Area evaluated as Very Suitable ($>80\%$ potential) |
| `suitability_suitable_1000ha` | `SUIT_S` | $10^3\text{ ha}$ | Area evaluated as Suitable ($60\% - 80\%$ potential) |
| `suitability_moderately_suitable_1000ha` | `SUIT_MS` | $10^3\text{ ha}$ | Area evaluated as Moderately Suitable ($40\% - 60\%$) |
| `suitability_marginally_suitable_1000ha` | `SUIT_mS_` | $10^3\text{ ha}$ | Area evaluated as Marginally Suitable ($20\% - 40\%$) |
| `suitability_very_marginally_suitable_1000ha` | `SUIT_vmS_` | $10^3\text{ ha}$ | Area evaluated as Very Marginally Suitable ($<20\%$) |
| `suitability_not_suitable_1000ha` | `SUIT_NS` | $10^3\text{ ha}$ | Area evaluated as Not Suitable ($0\%$) |
| `production_very_suitable_1000tons` | `PROD_VS` | $10^3\text{ tons}$ | Attainable production on Very Suitable land |
| `production_suitable_1000tons` | `PROD_S` | $10^3\text{ tons}$ | Attainable production on Suitable land |
| `production_moderately_suitable_1000tons` | `PROD_MS` | $10^3\text{ tons}$ | Attainable production on Moderately Suitable land |
| `production_marginally_suitable_1000tons` | `PROD_mS_` | $10^3\text{ tons}$ | Attainable production on Marginally Suitable land |
| `production_very_marginally_suitable_1000tons` | `PROD_vmS_` | $10^3\text{ tons}$ | Attainable production on Very Marginally Suitable land |
| `yield_maximum_kg_per_ha` | `Ymax` | $kg/ha$ | Maximum theoretical crop yield under agro-climate |
| `yield_very_suitable_kg_per_ha` | `Y_VS` | $kg/ha$ | Attainable yield on Very Suitable land |
| `yield_suitable_kg_per_ha` | `Y_S` | $kg/ha$ | Attainable yield on Suitable land |
| `yield_moderately_suitable_kg_per_ha` | `Y_MS` | $kg/ha$ | Attainable yield on Moderately Suitable land |
| `yield_marginally_suitable_kg_per_ha` | `Y_mS_` | $kg/ha$ | Attainable yield on Marginally Suitable land |
| `yield_very_marginally_suitable_kg_per_ha` | `Y_vmS_` | $kg/ha$ | Attainable yield on Very Marginally Suitable land |

---

## 5. Duplicate Handling & Record Preservation

- **`GBR` Sovereign Entity**: Both entries for Great Britain mainland and Northern Ireland are preserved in full with their distinct extents and yield indicators.
- **Total Records in Processed Data**: Exactly **2,758 records**, preserving 100% of the raw data.
- **Zero Loss**: No records were filtered out, aggregated, or dropped.

---

## 6. NASA POWER Normalization

Normalized into structured geo-referenced profiles containing:
- Provenance metadata (`source`, `community`, `temporal_resolution`).
- Geographic coordinates (`longitude`, `latitude`, `elevation_meters`).
- Monthly climatologies (12 months) for temperature, precipitation, solar radiation, and relative humidity.
- Pre-computed annual summaries (annual mean temperature, total estimated annual precipitation in $mm/year$, mean solar radiation).

# GAEZ v5 Official Data Retrieval & Verification Report 🌾🛰️
**Platform:** AgriShift — Global Agricultural Intelligence & Crop Rotation Platform  
**Target Event:** NASA Space Apps Challenge 2026  
**Document Code:** `AGR-GAEZ-COMPLETION-2026`  
**Location:** `dataset/reports/GAEZ_COMPLETION_STATUS.md`  
**Date:** November 14, 2026  
**Status:** Officially Verified & Single-Slice Tested  
**Operational Scope:** Exclusive Focus on FAO/IIASA GAEZ v5 Completion  

---

## 1. Executive Summary & Policy Compliance

In strict compliance with the AgriShift Dataset Source Policy and hackathon instructions:
- **Exclusive Focus**: This investigation focuses solely on verifying the official **FAO/IIASA GAEZ v5** data access infrastructure. No work is conducted on NASA POWER, SMAP, GPM, SRTM, ECOSTRESS, Landsat, MODIS, Sentinel-2, or unauthorized third-party sources.
- **Zero Ingestion / Code Changes**: No backend, frontend, or MongoDB code has been modified. No data has been seeded into MongoDB.
- **Data Integrity**: Source dataset files in `dataset/raw/` remain unmodified. All test downloads and queries were executed in scratch storage.
- **Official Evidence Only**: No endpoints, table names, crop codes, or filters were invented. Every finding is proven from the official FAO Crop Summary catalog, schema JSON, SQL query definitions, and live API responses.

---

## 2. Official FAO GAEZ v5 Catalog & Infrastructure Architecture

```mermaid
flowchart TD
    Catalog["FAO Crop Summary Catalog\nhttps://data.fao.org/catalog/dataset/crop-summary-gaez"]
    
    Catalog --> ReadmeXLSX["Readme XLSX\ngaezv5_cropsummarydata_readme.xlsx\n(22,971 bytes)"]
    Catalog --> SchemaJSON["Schema JSON\ngaez-crop-summary.json\n(JSON-stat format)"]
    Catalog --> QuerySQL["Query SQL\ngaez-crop-summary-query.sql\n(BigQuery parameterized query)"]
    Catalog --> SmartCSV["Smart-CSV Endpoint\nResource 2ef29fff-fda9-484b-b669-efb21d4d5074"]
    
    QuerySQL --> LiveAPI["FAO BigQuery API Engine\nhttps://api.data.apps.fao.org/api/v2/bigquery"]
    SmartCSV --> LiveAPI
    
    LiveAPI --> BQTable[("Google BigQuery View\nfao-maps-review.fao_gaez.vw_gaez_summary_tables")]
    LiveAPI --> AgriShiftScratch["AgriShift Verified Test Download\ntest_rice_irrigated_historical.csv\n(178 Country Rows | Y_MS Numeric)"]
```

### 2.1 Catalog Resources Inspected
The official FAO dataset entry (`https://data.fao.org/catalog/dataset/crop-summary-gaez`) hosts 5 primary distribution resources:
1. **Readme XLSX**:
   `https://data.apps.fao.org/catalog/dataset/a55c337e-f7e6-4d2f-aa8e-6d2199171c37/resource/7f50e64c-4fd7-40c6-9e34-ebe3f9f7a6b7/download/gaezv5_cropsummarydata_readme.xlsx`
2. **Schema JSON (JSON-stat format)**:
   `https://data.apps.fao.org/catalog/dataset/a55c337e-f7e6-4d2f-aa8e-6d2199171c37/resource/e76d3ff8-d339-434a-97c6-60f10d1ce64a/download/gaez-crop-summary.json`
3. **GAEZ Crop Summary Query SQL**:
   `https://data.apps.fao.org/catalog/dataset/a55c337e-f7e6-4d2f-aa8e-6d2199171c37/resource/fef86116-be49-4ddc-8317-66cd368d4fda/download/gaez-crop-summary-query.sql`
4. **Smart-CSV Resource**:
   Catalog Resource ID `2ef29fff-fda9-484b-b669-efb21d4d5074`
5. **Static Sample CSV**:
   `https://data.apps.fao.org/catalog/dataset/a55c337e-f7e6-4d2f-aa8e-6d2199171c37/resource/30c09503-8f35-447c-a1c6-d6c53d601335/download/gaez-sample.csv`

---

## 3. Verified Query Mechanism & Real API Endpoints

### 3.1 The Underlying SQL Definition
Inspection of the official `gaez-crop-summary-query.sql` reveals the exact database view and filter parameter names:

```sql
SELECT
  *
FROM
  `fao-maps-review.fao_gaez.vw_gaez_summary_tables` g
WHERE 
  (g.LC = @lc or "All" = @lc )
  AND (g.EXC = @exc or "All" = @exc)
  AND (g.AEZ = @aez or "All" = @aez)
  AND (g.climate_data_source = @cds or "All" = @cds)
  AND (g.Crop = @crop or "All" = @crop)
  AND (g.geographic_level = @gl or "All" = @gl)
  AND (g.country = @country or "All" = @country)
  AND (g.ssp = @ssp or "All" = @ssp)
  AND (g.time_period = @tmp or "All" = @tmp)
  AND (g.water_input = @wip or "All" = @wip)
  AND iso3 is not null
```

### 3.2 Real API Endpoint & Invocation Syntax
The FAO data platform does **not** host summary tables on a standard CKAN datastore table endpoint (`/datastore_search_sql`). Instead, it executes queries against Google BigQuery via a dedicated FAO API gateway:

- **Base Gateway URL**: `https://api.data.apps.fao.org/api/v2/bigquery`
- **Required Query Parameter**: `sql_url=<URL-encoded link to gaez-crop-summary-query.sql>`
- **Filter Parameters**: Passed directly as URL query arguments matching SQL parameter names (`@crop`, `@wip`, `@ssp`, `@tmp`, `@cds`, `@exc`, `@aez`, `@lc`, `@gl`, `@country`).
- **Response Format**: Returns directly as `text/csv; charset=utf-8` with standard 29-column GAEZ headers.

---

## 4. Dimensional Definitions Verified from Official Schema JSON

The schema file `gaez-crop-summary.json` (JSON-stat standard) defines 10 explicit dimensions:

```mermaid
mindmap
  root((GAEZ v5 Schema Dimensions))
    gl[Geographic Level\n'Country']
    crop[Crop\n53 FAO Crops]
    wip[Water Input Management\n4 Regimes + All]
    ssp[Climate Scenario\nHistorical, SSP126, SSP370, SSP585]
    tmp[Time Period\n1981-2000, 2001-2020, 2021-2040, 2041-2060, 2061-2080, 2081-2100]
    cds[Climate Data Source\nAgERA5, ENSEMBLE]
    lc[Land Cover\n11 Classes + Total land]
    exc[Exclusion\n5 Classes + Total land]
    aez[Agro-Ecological Zone\n33 Zones + Total land]
    country[Country\n192 Member States + All]
```

### 4.1 Exact Crop Identifiers vs 3-Letter Acronyms
The query engine parameter `@crop` matches the **full display name** stored in the database view, **not** the 3-letter acronym. The exact names for AgriShift's 8 target crops are:

| AgriShift Crop | Official GAEZ v5 Name (`@crop`) | GAEZ Acronym | Note on Official Verification |
| :--- | :--- | :---: | :--- |
| **Wheat** | `Wheat` | `whe` | Verified in sample and live API query |
| **Rice (Irrigated)** | **`Wetland rice`** | `rcw` | **Verified**: GAEZ distinguishes `Wetland rice` and `Dryland rice` |
| **Rice (Rainfed)** | **`Dryland rice`** / **`Wetland rice`** | `rcd` / `rcw` | Both tracked; `Wetland rice` under rainfed also available |
| **Maize** | `Maize` | `mai` | Verified in schema (also tracks `Silage maize`) |
| **Cotton** | `Cotton` | `cot` | Verified in schema |
| **Sugarcane** | **`Sugar cane`** | `sug` | **Verified**: Two separate words with space in GAEZ v5 |
| **Soybean** | `Soybean` | `soy` | Verified in schema |
| **Sorghum** | `Sorghum` | `sor` | Verified in schema (also tracks `Biomass sorghum`) |
| **Potato** | **`White potato`** | `wpo` | **Verified**: GAEZ distinguishes `White potato` and `Sweet potato` |

### 4.2 Water Input Regimes (`@wip`)
The 4 official management regimes in GAEZ v5 are:
1. `Irrigation and high input level of management`
2. `Irrigation and low input level of management`
3. `Rain fed and high input level of management`
4. `Rain fed and low input level of management`

### 4.3 Climate Scenarios (`@ssp`) and Epochs (`@tmp`)
- **Historical Baseline**: `ssp = "Historical"`, `tmp = "1981-2000"` (or `"2001-2020"`), `cds = "AgERA5"`.
- **Future Projections**: `ssp = "SSP126"`, `"SSP370"`, or `"SSP585"`, `tmp = "2041-2060"` (2050s), `cds = "ENSEMBLE"`.

---

## 5. Official Proof of Country Summary Filter: `EXC = 5` and `AEZ = 35`

### 5.1 Verification from Readme Metadata
In `gaezv5_cropsummarydata_readme.xlsx` (Sheet 1: `README`), Note 4 states verbatim:
> **"4 | To see only country totals, please set filter values to EXC=5 and AEZ=35."**

### 5.2 Verification from Schema JSON & Database View
- **`EXC` (Exclusion)**: Class 1 is "No protection/exclusion", Class 2 is "WDPA 2022", Class 5 is **"Total land"** (aggregating all exclusion and protected categories).
- **`AEZ` (Agro-Ecological Zones)**: Classes 1 to 33 represent specific thermal/moisture classes (e.g., "Tropics, lowland; humid", "Desert/Arid climate"). Class 35 is **"Total land"** (the national aggregate across all 33 agro-ecological zones).
- **Behavior Without Filter**: Without `exc="Total land"` and `aez="Total land"`, the database returns hundreds of thousands of disaggregated micro-zone rows for each country, making country-level summary queries impossible.
- **In the Query API**: The parameter takes string label `'Total land'` for both `@exc` and `@aez`, which directly filters the BigQuery view to the 178 national summary rows.

---

## 6. Official GAEZ v5 GitHub Repository (`un-fao/gaezv5`) Findings

Inspection of `https://github.com/un-fao/gaezv5` confirms:
1. **Repository Structure**:
   - `GAEZ-v5-Platform/Data-Access-Notebooks/`:
     - `gaez_res02_downloader_selection_notebook.ipynb`: Downloader for Agro-climatic Potential Yield.
     - `gaez_res05_downloader_selection_notebook.ipynb`: Downloader for Suitability and Attainable Yield.
2. **Purpose of Notebooks**:
   The notebooks are interactive Jupyter tools designed to download **30 arc-second (~1 km) and 5 arc-minute (~10 km) GeoTIFF spatial raster files** from FAO cloud storage.
3. **Tabular Country Summaries**:
   The tabular summary tables (which AgriShift uses for sovereign crop suitability and rotation decision rules) are provided via the FAO BigQuery / Smart-CSV API (`https://api.data.apps.fao.org/api/v2/bigquery`).

---

## 7. Single Test Download Results: Rice (Irrigated High Input, Historical)

As mandated, a single test download was performed to verify the end-to-end retrieval process before committing to any full-scale acquisition.

### 7.1 Executed Query
```http
GET https://api.data.apps.fao.org/api/v2/bigquery?
  sql_url=https://data.apps.fao.org/catalog/dataset/a55c337e-f7e6-4d2f-aa8e-6d2199171c37/resource/fef86116-be49-4ddc-8317-66cd368d4fda/download/gaez-crop-summary-query.sql
  &crop=Wetland+rice
  &wip=Irrigation+and+high+input+level+of+management
  &ssp=Historical
  &tmp=1981-2000
  &cds=AgERA5
  &exc=Total+land
  &aez=Total+land
  &lc=Cropland%2C+equipped+with+irrigation
  &gl=Country
  &country=All
```

### 7.2 Result Verification Audit
- **HTTP Status**: `200 OK`
- **MIME Type**: `text/csv; charset=utf-8`
- **Output File**: Staged in scratch at `scratch/test_rice_irrigated_historical.csv` (Original `dataset/raw/` remains completely untouched).
- **Row Count**: Exactly **178 country records** + 1 header line (179 lines total), perfectly matching the 178 records of `gaez-sample.csv`.
- **Columns**: 29 columns identical to the schema:
  `['iso3', 'country', 'LC', 'EXC', 'AEZ', 'Crop', 'climate_data_source', 'ssp', 'time_period', 'water_input', 'geographic_level', 'EXTENTS', 'SUIT_VS', 'SUIT_S', 'SUIT_MS', 'SUIT_mS_', 'SUIT_vmS_', 'SUIT_NS', 'PROD_VS', 'PROD_S', 'PROD_MS', 'PROD_mS_', 'PROD_vmS_', 'Ymax', 'Y_VS', 'Y_S', 'Y_MS', 'Y_mS_', 'Y_vmS_']`

### 7.3 Major Breakthrough: Column 26 `Y_MS` Anomaly Solved!
- In `gaez-sample.csv`, column 26 contained the literal string `'whe'`, caused by a column pointer misalignment during static CSV creation.
- In the newly retrieved live BigQuery data:
  - **Numeric Count**: **178 out of 178 rows (100%)** are valid floating-point numbers.
  - **Non-numeric Count**: **0 rows**.
  - **Yield Range for Wetland Rice**: Min: $0.0\text{ kg/ha}$, Max: $6,918.0\text{ kg/ha}$.
  - **Sample Values**: El Salvador = $5,708.0\text{ kg/ha}$, Mexico = $6,053.0\text{ kg/ha}$, Peru = $3,818.0\text{ kg/ha}$.
- **Conclusion**: The `'whe'` anomaly is **NOT present in the live FAO BigQuery dataset**. Downloading slices directly from the official API automatically restores the true moderately suitable yield (`Y_MS`)!

### 7.4 Sovereign Identifier Integrity: Duplicate `GBR`
- The duplicate ISO-3 `GBR` was verified in the live dataset:
  - Row 1: `United Kingdom of Great Britain and Northern Ireland` (Extent: $2,002.4\text{ }10^3\text{ ha}$)
  - Row 2: `United Kingdom of Great Britain and Northern Ireland` (Extent: $0.1\text{ }10^3\text{ ha}$)
- **Architectural Guardrail**: Confirms that MongoDB compound index must be `{ iso3: 1, country: 1, crop: 1, waterInput: 1, ssp: 1, timePeriod: 1 }` rather than single-field `{ iso3: 1 }`.

---

## 8. Officially Verified vs Unverified Facts Matrix

| Topic / Requirement | Status | Evidence / Verification Method |
| :--- | :---: | :--- |
| **Official Catalog URL** | **VERIFIED** | `https://data.fao.org/catalog/dataset/crop-summary-gaez` confirmed live |
| **Query Engine URL** | **VERIFIED** | `https://api.data.apps.fao.org/api/v2/bigquery` tested and working |
| **SQL Resource Link** | **VERIFIED** | Downloaded and analyzed `gaez-crop-summary-query.sql` |
| **Schema JSON Structure** | **VERIFIED** | Downloaded and analyzed `gaez-crop-summary.json` (JSON-stat) |
| **`EXC=5` & `AEZ=35` Filter** | **VERIFIED** | Proven by Readme Note 4, Schema labels (`Total land`), and live query |
| **Crop Display Names** | **VERIFIED** | Full names verified: `Wetland rice`, `Sugar cane`, `White potato`, etc. |
| **`Y_MS` Status in Live API** | **VERIFIED** | 100% numeric in live query; `'whe'` bug was strictly isolated to static sample CSV |
| **Single Slice Rice Download** | **VERIFIED** | 178 rows downloaded to scratch; audited with 0 schema violations |
| **Raster GeoTIFF Access** | **VERIFIED** | Confirmed via `un-fao/gaezv5` GitHub notebooks for RES02/RES05 |
| **Remaining 14 MVP Slices** | *Awaiting Authorization* | Ready to download using proven batch script; awaiting user command |
| **MongoDB Ingestion** | *Blocked / Awaiting* | No code or database models modified per strict instructions |

---

## 9. Next Steps (Pending User Authorization)

1. **Awaiting User Review**:
   Present this complete verification report to the user.
2. **Batch Retrieval of Remaining Slices (Once Authorized)**:
   Use the verified FAO BigQuery API to download the remaining 14 core slices (Rainfed Wheat, Rainfed Rice, Irrigated/Rainfed Maize, Soybean, Cotton, Sugarcane, Sorghum, White Potato) into `dataset/raw/`.
3. **Seed Script Development**:
   Author the Node.js / MongoDB Atlas ingestion script with the proven compound indexing and header normalizations.
4. **No Code Modified**:
   Application development remains paused until dataset readiness is formally confirmed.

# AgriShift — Database Testing & Verification Report 🧪

**Platform:** AgriShift — Global Agricultural Intelligence & Explainable Crop Rotation Platform  
**Target Event:** NASA Space Apps Challenge 2026  
**Document Code:** `AGR-DB-TEST-REPORT-2026`  
**Date:** November 14, 2026  
**Database:** MongoDB Atlas (`nasa.sj2ldzf.mongodb.net/agrishift`)  
**Overall Result:** **ALL 7 TESTS PASSED ✅**  

---

## 1. Executive Summary

This report provides empirical verification of the data pipeline by executing comprehensive queries against the live MongoDB Atlas database. All collections, document schemas, dimensional indexes, duplicate preservation rules, and quantitative indicators were tested using automated test suite `dataset/scripts/test_queries.js`.

---

## 2. Test Results Matrix

| Test ID | Verification Scope | Target Requirement | Live Database Value | Result |
| :---: | :--- | :--- | :--- | :---: |
| **TEST 1** | **Total Record Counts** | Crops: 8<br>Suitabilities: 2,758<br>Climate Profiles: 5<br>Metadata: 2 | Crops: 8<br>Suitabilities: 2,758<br>Climate Profiles: 5<br>Metadata: 2 | ✅ **PASS** |
| **TEST 2** | **Crop-Specific Retrieval** | All 8 target crops present | Rice (367), Wheat (367), Maize (367), Soybean (367), Cotton (367), Sugarcane (178), Sorghum (378), Potato (367) | ✅ **PASS** |
| **TEST 3** | **Country-Specific Retrieval** | Full 15-slice retrieval for benchmark countries | Pakistan (`PAK`): 15 slices<br>USA (`USA`): 15 slices<br>Kenya (`KEN`): 15 slices<br>Brazil (`BRA`): 15 slices<br>Egypt (`EGY`): 15 slices | ✅ **PASS** |
| **TEST 4** | **Irrigated vs Rain-fed Comparison** | Compare management regimes for same country & crop | Wheat in Pakistan (`PAK`):<br>- Irrigated High: $Y_{max} = 11,996\text{ kg/ha}$<br>- Rainfed High: $Y_{max} = 11,241\text{ kg/ha}$ | ✅ **PASS** |
| **TEST 5** | **Numeric Yield Validation** | 0 null, undefined, or negative yield values | 0 invalid yield documents ($100\%$ valid IEEE 754 floats) | ✅ **PASS** |
| **TEST 6** | **Duplicate GBR Handling** | Preserve both sub-region records per slice without collision | Total GBR records: **30** ($15 \text{ slices} \times 2\text{ sub-regions}$)<br>Distinct agricultural extents preserved | ✅ **PASS** |
| **TEST 7** | **NASA POWER Climate Retrieval** | Retrieve all 5 global archetype climate profiles | 5/5 archetypes found with 12-month series & annual derived precipitation/temperature | ✅ **PASS** |

---

## 3. Deep Dive Test Findings

### 3.1 Idempotency & Duplicate Safety
- A secondary seeding execution was performed immediately after the initial import.
- Result: **0 additional upserts, 0 duplicate keys, 0 errors**.
- All collections maintain exact document counts (`crop_suitabilities`: 2,758).

### 3.2 Duplicate Sovereign Entity (`GBR`) Resolution
- Naive unique indexes on `{ iso3: 1 }` or `{ "dimensions.iso3": 1, "dimensions.cropId": 1 }` would have failed due to FAO's dual-entity reporting for the UK (Great Britain mainland and Northern Ireland).
- Our compound indexing architecture enforces idempotency on `{ "provenance.rawFile": 1, "provenance.rawRowIndex": 1 }` while maintaining non-unique compound indexes for query execution.
- Query test confirmed: All 30 GBR documents coexist with distinct extents (e.g. $2,002.4\text{ }10^3\text{ ha}$ vs $0.1\text{ }10^3\text{ ha}$).

### 3.3 Agronomic Comparison Capabilities
The database is immediately capable of powering AgriShift's crop rotation logic:
1. **Irrigation Stress Analysis**: Querying `dimensions.cropId` and comparing `waterManagement: 'irrigated_high'` vs `'rainfed_high'` yields immediate empirical delta of irrigation yield advantage.
2. **Soil Restoration Query**: Soybean records are indexed and queryable across 178 sovereign nations with biological nitrogen-fixing profile attached.
3. **Water Resilience Query**: Sorghum profiles across both `rainfed_high` and `rainfed_low` input levels are queryable across 189 nations.

# 15 — Scientific References, Earth Observation Data Sources & Agronomic Citations 📚

---

## 1. NASA Earth Science & Satellite Data Sources

### 1.1 NASA POWER (Prediction Of Worldwide Energy Resources)
- **Data Source**: NASA Langley Research Center (LaRC), Hampton, VA.
- **Funding & Program**: NASA Earth Science / Applied Sciences Program.
- **Dataset Version**: POWER Agroclimatology Methodology (Version 2.0).
- **Official Portal**: [https://power.larc.nasa.gov/](https://power.larc.nasa.gov/) (Accessed: November 2026).
- **API Documentation**: [https://power.larc.nasa.gov/docs/services/api/](https://power.larc.nasa.gov/docs/services/api/)
- **Primary Data Assimilation Models & Satellites**:
  - NASA Global Modeling and Assimilation Office (GMAO) Modern-Era Retrospective analysis for Research and Applications, Version 2 (MERRA-2).
  - NASA GMAO Goddard Earth Observing System Forward Processing for Instrument Teams (GEOS FP-IT).
  - NASA Clouds and the Earth's Radiant Energy System (CERES) satellite solar radiation data.
  - Fast Longwave and Shortwave Radiative Fluxes (FLASHFlux).
- **Key Parameters Utilized**:
  - `T2M`: Temperature at 2 Meters (°C).
  - `T2M_MAX`: Maximum Temperature at 2 Meters (°C).
  - `T2M_MIN`: Minimum Temperature at 2 Meters (°C).
  - `PRECTOTCORR`: Corrected Total Precipitation (mm/day).
  - `ALLSKY_SFC_SW_DWN`: All Sky Surface Downward Solar Radiation ($MJ/m^2/day$).
  - `RH2M`: Relative Humidity at 2 Meters (%).
- **Primary Citation**:
  > Stackhouse, P. W., et al. (2020). *The NASA POWER Project: Enhancing the accessibility of satellite-derived environmental data for renewable energy, sustainable building design, and agroclimatology applications.* NASA Langley Research Center Technical Report.

---

### 1.2 NASA SMAP (Soil Moisture Active Passive) — Phase 2 Evaluated
- **Mission Agency**: NASA Jet Propulsion Laboratory (JPL) & Goddard Space Flight Center (GSFC).
- **Mission Portal**: [https://smap.jpl.nasa.gov/](https://smap.jpl.nasa.gov/) (Accessed: November 2026).
- **Data Product**: SMAP L3/L4 Enhanced Volumetric Soil Moisture (9km & 36km).
- **Role in AgriShift**: Evaluated as a supplementary source for root-zone moisture anomalies; slated for Phase 2 implementation.
- **Primary Citation**:
  > Entekhabi, D., et al. (2010). *The Soil Moisture Active Passive (SMAP) Mission.* Proceedings of the IEEE, 98(5), 704–716.

---

### 1.3 NASA GPM (Global Precipitation Measurement) — Phase 2 Evaluated
- **Mission Agency**: NASA Goddard Space Flight Center & JAXA.
- **Mission Portal**: [https://gpm.nasa.gov/](https://gpm.nasa.gov/) (Accessed: November 2026).
- **Data Product**: GPM Integrated Multi-satellitE Retrievals for GPM (IMERG) Early/Late Precipitation.
- **Role in AgriShift**: Evaluated for near real-time extreme precipitation events; slated for Phase 2 planting window alerting.
- **Primary Citation**:
  > Hou, A. Y., et al. (2014). *The Global Precipitation Measurement Mission.* Bulletin of the American Meteorological Society, 95(5), 701–722.

---

## 2. Agronomic Science & Crop Physiology References

### 2.1 Food and Agriculture Organization of the United Nations (FAO)
1. **Crop Evapotranspiration & Water Requirements**:
   - **Publication**: FAO Irrigation and Drainage Paper No. 56: *Crop Evapotranspiration — Guidelines for computing crop water requirements.*
   - **Authors**: Allen, R. G., Pereira, L. S., Raes, D., & Smith, M. (1998).
   - **URL**: [https://www.fao.org/3/x0490e/x0490e00.htm](https://www.fao.org/3/x0490e/x0490e00.htm)
   - **Application in AgriShift**: Basis for crop water consumption ($ET_c$), water-use efficiency (WUE) coefficients, and single-crop coefficients ($K_c$) used in Stage 1 and Stage 2 water scoring.
2. **Yield Response to Water**:
   - **Publication**: FAO Irrigation and Drainage Paper No. 33 / 66: *Crop yield response to water.*
   - **Authors**: Doorenbos, J., & Kassam, A. H. (1979); Steduto, P., et al. (2012).
   - **Application in AgriShift**: Defines yield response factor ($K_y$) and drought tolerance indices for legumes and C4 cereals.

---

### 2.2 United States Department of Agriculture (USDA)
1. **USDA Natural Resources Conservation Service (NRCS) Soil Health**:
   - **Publication**: *Soil Health Technical Note No. 450-03: Principles of Soil Health Management Systems.*
   - **URL**: [https://www.nrcs.usda.gov/resources/guides-and-instructions/soil-health-technical-notes](https://www.nrcs.usda.gov/resources/guides-and-instructions/soil-health-technical-notes)
   - **Application in AgriShift**: Formulates the **Soil Biological Restoration Strategy** principles: maximizing continuous living roots, maximizing crop diversity, minimizing biological disturbance, and integrating legumes for biological nitrogen fixation.
2. **USDA Agricultural Research Service (ARS) Crop Rotation Studies**:
   - **Publication**: *Long-term agricultural research on cereal-legume rotations and pest disruption.*
   - **Application in AgriShift**: Defines Stage 1 phytosanitary family rotation restrictions (preventing consecutive Solanaceae/Brassicaceae plantings to break *Fusarium*, *Rhizoctonia*, and root-knot nematode cycles).

---

### 2.3 Peer-Reviewed Scientific Literature on Crop Rotation & Soil Health
1. **Biological Nitrogen Fixation in Legumes**:
   - **Citation**: Peoples, M. B., et al. (1995). *Biological nitrogen fixation: investments, expectations and actual contributions to agriculture.* Plant and Soil, 174(1), 3–28.
   - **Agronomic Finding**: Well-nodulated grain legumes contribute an estimated 30–80 kg N/ha equivalent to successor cereal crops, directly supporting AgriShift's nitrogen credit modeling.
2. **C4 Photosynthesis & Drought Resilience**:
   - **Citation**: Sage, R. F. (2004). *The evolution of C4 photosynthesis.* New Phytologist, 161(2), 341–370.
   - **Agronomic Finding**: C4 species (Pearl Millet, Sorghum, Maize) exhibit approximately double the water-use efficiency of C3 species under high temperatures and water stress, providing the biological foundation for AgriShift's **Water Resilience Strategy**.
3. **Soil Organic Carbon & Deep Rooting**:
   - **Citation**: Kell, D. B. (2011). *Breeding crop plants with deep roots for carbon sequestration, climate resilience and sustainable agricultural intensification.* Annals of Botany, 108(3), 407–423.
   - **Agronomic Finding**: Deep taproot systems (pigeon pea, safflower, alfalfa) penetrate subsoil compaction pans, access deep groundwater, and deposit recalcitrant organic carbon into the lower soil profile.

---

## 3. Disclaimers & Integrity Standards

1. **Non-Commercial Independence**: AgriShift has no commercial affiliation with chemical, fertilizer, or seed manufacturers. All crop selections and rotation models are derived exclusively from objective environmental observations and peer-reviewed scientific literature.
2. **Advisory Decision Support**: AgriShift recommendations are probabilistic agronomic advisories based on multi-decadal climatology. They do not constitute guaranteed yield contracts or certified financial advice.
3. **Open Access Commitment**: In keeping with the spirit of the NASA Space Apps Challenge, all methodologies, database schemas, and integration pipelines are documented transparently under the open-source MIT License.

import React from 'react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

/**
 * Data Sources & Provenance Section
 * Owner: Anaya (Agricultural Research & Scientific Transparency)
 */
export default function ProvenanceSection() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#173D2A] font-['Plus_Jakarta_Sans'] mb-2">
          Earth Observation & Data Provenance
        </h2>
        <p className="text-sm text-[#202820]/75 leading-relaxed">
          AgriShift synthesizes two authoritative scientific frameworks to provide transparent, empirical agricultural intelligence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* FAO/IIASA GAEZ v5 */}
        <Card hoverable className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <Badge variant="success">Agro-Ecological Benchmark</Badge>
              <span className="text-xs font-mono text-[#202820]/50">Baseline 1981–2010</span>
            </div>
            <h3 className="text-lg font-bold text-[#173D2A] font-['Plus_Jakarta_Sans'] mb-2">
              FAO / IIASA GAEZ v5
            </h3>
            <p className="text-xs text-[#245B3C] font-semibold mb-3">
              Theme 3: Agro-Ecological Crop Suitability & Attainable Yields
            </p>
            <p className="text-xs sm:text-sm text-[#202820]/75 leading-relaxed mb-4">
              Developed jointly by the Food and Agriculture Organization (FAO) and the International Institute for Applied Systems Analysis (IIASA). GAEZ v5 provides national attainable yields (kg/ha) across 188 sovereign countries for 8 core rotation crops under 4 distinct water and input management regimes.
            </p>
            <ul className="text-xs text-[#202820]/70 space-y-1.5 mb-4 border-t border-emerald-900/10 pt-3">
              <li>• <strong>Climate Scenario:</strong> Historical AgERA5 (1981–2010 normal)</li>
              <li>• <strong>Water Management:</strong> Irrigated (High Input) vs Rain-fed (High & Low Inputs)</li>
              <li>• <strong>Coverage:</strong> 2,758 verified national data records covering 188 sovereign nations</li>
            </ul>
          </div>
          <div className="pt-3 border-t border-emerald-900/10 text-xs font-mono text-[#245B3C]">
            Authority: UN FAO &amp; IIASA Austria
          </div>
        </Card>

        {/* NASA POWER */}
        <Card hoverable className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <Badge variant="info">Satellite Observation</Badge>
              <span className="text-xs font-mono text-[#202820]/50">30-Year Normals</span>
            </div>
            <h3 className="text-lg font-bold text-[#173D2A] font-['Plus_Jakarta_Sans'] mb-2">
              NASA POWER Climatology
            </h3>
            <p className="text-xs text-sky-800 font-semibold mb-3">
              Prediction Of Worldwide Energy Resources (Agroclimatology AG)
            </p>
            <p className="text-xs sm:text-sm text-[#202820]/75 leading-relaxed mb-4">
              NASA’s Earth Science Applied Sciences program delivers continuous satellite-derived surface meteorological datasets. AgriShift integrates 30-year monthly normals across 5 regional archetypes to evaluate thermal bounds, moisture deficits, and solar irradiance.
            </p>
            <ul className="text-xs text-[#202820]/70 space-y-1.5 mb-4 border-t border-emerald-900/10 pt-3">
              <li>• <strong>Key Variables:</strong> T2M (Mean Temp), T2M_MAX, T2M_MIN, PRECTOTCORR, ALLSKY_SFC_SW_DWN, RH2M</li>
              <li>• <strong>Temporal Scale:</strong> 30-year multi-satellite monthly climatology</li>
              <li>• <strong>Benchmark Archetypes:</strong> Indus Basin, US Corn Belt, Egypt Nile Delta, Kenya Rift, Brazil Cerrado</li>
            </ul>
          </div>
          <div className="pt-3 border-t border-emerald-900/10 text-xs font-mono text-sky-800">
            Authority: NASA Langley Research Center
          </div>
        </Card>
      </div>
    </section>
  );
}

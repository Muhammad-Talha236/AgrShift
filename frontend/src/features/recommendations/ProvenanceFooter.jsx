import React from 'react';
import Card from '../../components/common/Card';

/**
 * Provenance & Data Sources Footer
 * Shows engine version, data sources, and limitations.
 */
export default function ProvenanceFooter({ provenance }) {
  if (!provenance) return null;

  return (
    <Card className="bg-[#F8FAF7]">
      <h3 className="text-sm font-bold text-[#173D2A] uppercase tracking-wider mb-3">
        Data Provenance & Engine Info
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-[10px] font-semibold text-[#202820]/40 uppercase tracking-wider">Engine</p>
          <p className="text-xs font-medium text-[#173D2A]">{provenance.engine}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-[#202820]/40 uppercase tracking-wider">Version</p>
          <p className="text-xs font-medium text-[#173D2A]">{provenance.version}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-[#202820]/40 uppercase tracking-wider">Processing Time</p>
          <p className="text-xs font-medium text-[#173D2A]">{provenance.processingTimeMs}ms</p>
        </div>
      </div>

      {/* Data Sources */}
      {provenance.dataSources?.length > 0 && (
        <div className="mb-4">
          <p className="text-[10px] font-semibold text-[#202820]/40 uppercase tracking-wider mb-2">Data Sources</p>
          <div className="space-y-2">
            {provenance.dataSources.map((ds, i) => (
              <div key={i} className="bg-white rounded-xl px-3 py-2 border border-emerald-900/8">
                <p className="text-xs font-semibold text-[#173D2A]">{ds.name}</p>
                {ds.theme && <p className="text-[11px] text-[#202820]/50">{ds.theme}</p>}
                {ds.scenario && <p className="text-[11px] text-[#202820]/50">{ds.scenario}</p>}
                {ds.community && <p className="text-[11px] text-[#202820]/50">Community: {ds.community}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Limitations */}
      {provenance.limitations?.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold text-amber-700 uppercase tracking-wider mb-2">
            Scientific Limitations
          </p>
          <ul className="space-y-1.5">
            {provenance.limitations.map((lim, i) => (
              <li key={i} className="text-[11px] text-[#202820]/50 leading-relaxed pl-3 border-l-2 border-amber-300">
                {lim}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}

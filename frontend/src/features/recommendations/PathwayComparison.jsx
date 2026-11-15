import React from 'react';
import Card from '../../components/common/Card';

/**
 * Side-by-side Pathway Comparison Chart
 * Owner: Faiza — Recommendation Dashboard
 * Horizontal bar comparison of three pathways.
 */

const PATHWAYS_META = [
  { key: 'economicReturn', label: 'Economic Return', color: '#245B3C', icon: '💰' },
  { key: 'soilRestoration', label: 'Soil Restoration', color: '#92400E', icon: '🌱' },
  { key: 'waterResilience', label: 'Water Resilience', color: '#1E40AF', icon: '💧' },
];

export default function PathwayComparison({ pathways }) {
  if (!pathways) return null;

  const entries = PATHWAYS_META.map((meta) => {
    const pw = pathways[meta.key];
    return {
      ...meta,
      score: pw?.compositeScore || 0,
      crop: pw?.recommendedCrop?.displayName || 'N/A',
      yieldScore: pw?.scoreBreakdown?.totalYieldScore || 0,
      climateScore: pw?.scoreBreakdown?.totalClimateScore || 0,
    };
  });

  const maxScore = Math.max(...entries.map((e) => e.score), 1);

  return (
    <Card>
      <h3 className="text-sm font-bold text-[#173D2A] uppercase tracking-wider mb-5">
        Pathway Comparison
      </h3>

      <div className="space-y-4">
        {entries.map((entry) => (
          <div key={entry.key}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-base">{entry.icon}</span>
                <span className="text-xs font-semibold text-[#173D2A]">{entry.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#202820]/50">{entry.crop}</span>
                <span className="text-sm font-bold" style={{ color: entry.color }}>
                  {entry.score}
                </span>
              </div>
            </div>
            <div className="h-3 bg-[#EAF2E9] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${(entry.score / maxScore) * 100}%`,
                  backgroundColor: entry.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Sub-score comparison mini-table */}
      <div className="mt-6 pt-4 border-t border-emerald-900/10">
        <div className="grid grid-cols-4 gap-2 text-[10px] font-bold text-[#202820]/40 uppercase tracking-wider mb-2">
          <span>Pathway</span>
          <span className="text-center">Yield</span>
          <span className="text-center">Climate</span>
          <span className="text-center">Composite</span>
        </div>
        {entries.map((entry) => (
          <div key={entry.key} className="grid grid-cols-4 gap-2 py-1.5 border-b border-emerald-900/5 last:border-0">
            <span className="text-xs font-medium text-[#173D2A] flex items-center gap-1">
              <span>{entry.icon}</span>
              <span className="hidden sm:inline">{entry.label}</span>
            </span>
            <span className="text-xs font-semibold text-center text-[#202820]/70">{entry.yieldScore.toFixed(1)}</span>
            <span className="text-xs font-semibold text-center text-[#202820]/70">{entry.climateScore.toFixed(1)}</span>
            <span className="text-xs font-bold text-center" style={{ color: entry.color }}>
              {entry.score}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

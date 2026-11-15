import React from 'react';
import Card from '../../components/common/Card';

/**
 * Ranked Alternatives Table
 * Displays all eligible crops ranked by composite score.
 */
export default function RankedAlternativesTable({ alternatives }) {
  if (!alternatives || alternatives.length === 0) return null;

  return (
    <Card>
      <h3 className="text-sm font-bold text-[#173D2A] uppercase tracking-wider mb-4">
        All Ranked Alternatives
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-emerald-900/10">
              <th className="text-[10px] font-bold text-[#202820]/50 uppercase tracking-wider py-2 pr-3">#</th>
              <th className="text-[10px] font-bold text-[#202820]/50 uppercase tracking-wider py-2 pr-3">Crop</th>
              <th className="text-[10px] font-bold text-[#202820]/50 uppercase tracking-wider py-2 pr-3 text-right">Composite</th>
              <th className="text-[10px] font-bold text-[#202820]/50 uppercase tracking-wider py-2 pr-3 text-right hidden sm:table-cell">Yield Score</th>
              <th className="text-[10px] font-bold text-[#202820]/50 uppercase tracking-wider py-2 pr-3 text-right hidden sm:table-cell">Climate Score</th>
              <th className="text-[10px] font-bold text-[#202820]/50 uppercase tracking-wider py-2 text-right hidden md:table-cell">Yield (kg/ha)</th>
            </tr>
          </thead>
          <tbody>
            {alternatives.map((crop, idx) => (
              <tr
                key={crop.cropId}
                className={`border-b border-emerald-900/5 ${idx === 0 ? 'bg-emerald-50/50' : ''}`}
              >
                <td className="py-2.5 pr-3 text-xs font-bold text-[#202820]/40">{idx + 1}</td>
                <td className="py-2.5 pr-3">
                  <span className="text-sm font-semibold text-[#173D2A]">{crop.displayName}</span>
                </td>
                <td className="py-2.5 pr-3 text-right">
                  <span className="text-sm font-bold text-[#245B3C]">{crop.compositeScore}</span>
                </td>
                <td className="py-2.5 pr-3 text-right hidden sm:table-cell">
                  <span className="text-xs font-medium text-[#202820]/70">{crop.totalYieldScore?.toFixed(1)}</span>
                </td>
                <td className="py-2.5 pr-3 text-right hidden sm:table-cell">
                  <span className="text-xs font-medium text-[#202820]/70">{crop.totalClimateScore?.toFixed(1)}</span>
                </td>
                <td className="py-2.5 text-right hidden md:table-cell">
                  <span className="text-xs font-medium text-[#202820]/60">
                    {crop.attainableYieldKgHa ? crop.attainableYieldKgHa.toLocaleString() : '—'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

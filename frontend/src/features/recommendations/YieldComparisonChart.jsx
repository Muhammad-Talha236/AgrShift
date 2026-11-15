import React from 'react';
import Card from '../../components/common/Card';

/**
 * Yield Comparison Bar Chart (pure CSS/SVG)
 * Owner: Faiza — Recommendation Dashboard
 * Visual bar chart of attainable yields across ranked alternatives.
 */
export default function YieldComparisonChart({ alternatives }) {
  if (!alternatives || alternatives.length === 0) return null;

  // Take top 6 crops for display
  const crops = alternatives.slice(0, 6).filter((c) => c.attainableYieldKgHa > 0);
  if (crops.length === 0) return null;

  const maxYield = Math.max(...crops.map((c) => c.attainableYieldKgHa));

  const COLORS = ['#245B3C', '#2D7A4E', '#3A9962', '#4DB876', '#65CC8A', '#85DCA3'];

  return (
    <Card>
      <h3 className="text-sm font-bold text-[#173D2A] uppercase tracking-wider mb-5">
        Attainable Yield Comparison
      </h3>

      <div className="space-y-3">
        {crops.map((crop, idx) => {
          const pct = (crop.attainableYieldKgHa / maxYield) * 100;
          return (
            <div key={crop.cropId}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-[#173D2A]">{crop.displayName}</span>
                <span className="text-xs font-bold text-[#202820]/70">
                  {crop.attainableYieldKgHa.toLocaleString()} kg/ha
                </span>
              </div>
              <div className="h-4 bg-[#EAF2E9] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: COLORS[idx % COLORS.length],
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[10px] text-[#202820]/40 mt-4 leading-relaxed">
        Attainable yield benchmarks from FAO/IIASA GAEZ v5 — modeled agro-ecological potential, not guaranteed harvest.
      </p>
    </Card>
  );
}

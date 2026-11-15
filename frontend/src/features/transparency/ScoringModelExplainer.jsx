import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

/**
 * Composite Scoring Formula Explainer
 */
export default function ScoringModelExplainer() {
  const [sampleYield, setSampleYield] = useState(85);
  const [sampleClimate, setSampleClimate] = useState(80);
  const [sampleRotation, setSampleRotation] = useState(100);

  // Formula: 0.50 * Yield + 0.35 * Climate + 0.15 * Rotation
  const calculatedComposite = Math.round(
    sampleYield * 0.5 + sampleClimate * 0.35 + sampleRotation * 0.15
  );

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#173D2A] font-['Plus_Jakarta_Sans'] mb-2">
          Mathematical Scoring Model & Weighting
        </h2>
        <p className="text-sm text-[#202820]/75 leading-relaxed">
          Every crop recommendation is evaluated through an open, deterministic mathematical formula that guarantees reproducible, explainable outcomes.
        </p>
      </div>

      {/* Primary Mathematical Formula */}
      <Card className="bg-[#173D2A] text-white border-none shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <Badge variant="success">Standardized Equation</Badge>
          <span className="text-xs font-mono text-emerald-200/70">Sum of Weights = 1.00 (100%)</span>
        </div>
        <div className="p-4 sm:p-6 bg-white/10 rounded-2xl backdrop-blur-xs font-mono text-sm sm:text-lg text-center tracking-wide overflow-x-auto text-emerald-100">
          S_composite = (0.50 &times; S_yield) + (0.35 &times; S_climate) + (0.15 &times; S_rotation)
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 text-xs sm:text-sm text-emerald-100/90">
          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <span className="font-bold text-white block mb-1">50% — Attainable Yield (S_yield)</span>
            GAEZ v5 national yield percentiles and proportion of cropland classified as suitable.
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <span className="font-bold text-white block mb-1">35% — Climate Bounds (S_climate)</span>
            NASA POWER ambient thermal compatibility (T_min &le; T_mean &le; T_max) &amp; moisture deficit index.
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <span className="font-bold text-white block mb-1">15% — Rotation Diversity (S_rotation)</span>
            Botanical family diversification bonus (100 pts for diverse rotation vs 30 pts for continuous monoculture).
          </div>
        </div>
      </Card>

      {/* Interactive Scoring Simulator */}
      <Card>
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-emerald-900/10">
          <h3 className="text-base sm:text-lg font-bold text-[#173D2A] font-['Plus_Jakarta_Sans']">
            Interactive Score Simulator
          </h3>
          <span className="text-xs text-[#202820]/60">Adjust sliders to see composite score recalculation</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="text-xs font-bold text-[#173D2A] uppercase block mb-1">
              Yield Score: {sampleYield}/100 (50%)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={sampleYield}
              onChange={(e) => setSampleYield(Number(e.target.value))}
              className="w-full accent-[#245B3C] cursor-pointer"
            />
            <span className="text-xs text-[#202820]/60 mt-1 block">Contributes: {(sampleYield * 0.5).toFixed(1)} pts</span>
          </div>

          <div>
            <label className="text-xs font-bold text-[#173D2A] uppercase block mb-1">
              Climate Score: {sampleClimate}/100 (35%)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={sampleClimate}
              onChange={(e) => setSampleClimate(Number(e.target.value))}
              className="w-full accent-[#245B3C] cursor-pointer"
            />
            <span className="text-xs text-[#202820]/60 mt-1 block">Contributes: {(sampleClimate * 0.35).toFixed(1)} pts</span>
          </div>

          <div>
            <label className="text-xs font-bold text-[#173D2A] uppercase block mb-1">
              Rotation Score: {sampleRotation}/100 (15%)
            </label>
            <select
              value={sampleRotation}
              onChange={(e) => setSampleRotation(Number(e.target.value))}
              className="w-full text-xs p-2 bg-[#F8FAF7] border border-emerald-900/15 rounded-lg"
            >
              <option value={100}>Diverse Botanical Family (100 pts)</option>
              <option value={30}>Monoculture Continuation (30 pts)</option>
            </select>
            <span className="text-xs text-[#202820]/60 mt-1 block">Contributes: {(sampleRotation * 0.15).toFixed(1)} pts</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#EAF2E9] border border-emerald-900/10 flex items-center justify-between">
          <span className="font-bold text-sm text-[#173D2A]">Simulated Composite Score:</span>
          <span className="text-2xl font-extrabold text-[#245B3C] font-mono">{calculatedComposite} / 100</span>
        </div>
      </Card>
    </section>
  );
}

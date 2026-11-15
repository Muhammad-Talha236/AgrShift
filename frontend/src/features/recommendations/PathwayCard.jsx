import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import ScoreBreakdownBar from './ScoreBreakdownBar';

/**
 * Pathway Recommendation Card
 * Owner: Faiza — Recommendation Dashboard
 * Displays one recommendation pathway (Economic Return / Soil Restoration / Water Resilience).
 */

const PATHWAY_CONFIG = {
  ECONOMIC_RETURN: {
    icon: '💰',
    color: '#245B3C',
    badgeVariant: 'success',
    label: 'Economic Return',
    accent: 'emerald',
  },
  SOIL_RESTORATION: {
    icon: '🌱',
    color: '#92400E',
    badgeVariant: 'warning',
    label: 'Soil Restoration',
    accent: 'amber',
  },
  WATER_RESILIENCE: {
    icon: '💧',
    color: '#1E40AF',
    badgeVariant: 'info',
    label: 'Water Resilience',
    accent: 'sky',
  },
};

export default function PathwayCard({ pathway }) {
  const [expanded, setExpanded] = useState(false);

  if (!pathway) return null;

  const config = PATHWAY_CONFIG[pathway.strategyKey] || PATHWAY_CONFIG.ECONOMIC_RETURN;
  const crop = pathway.recommendedCrop;
  const breakdown = pathway.scoreBreakdown;
  const metrics = pathway.keyMetrics;
  const rotation = pathway.rotationRationale;

  return (
    <Card className="relative overflow-hidden">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl" style={{ backgroundColor: config.color }} />

      {/* Header */}
      <div className="flex items-start justify-between mb-4 pt-2">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{config.icon}</span>
          <div>
            <h3 className="text-sm font-bold text-[#173D2A] uppercase tracking-wider">{config.label}</h3>
            <p className="text-xs text-[#202820]/60 mt-0.5 line-clamp-2">{pathway.summary}</p>
          </div>
        </div>
        <div className="flex flex-col items-center shrink-0 ml-3">
          <span className="text-2xl font-extrabold" style={{ color: config.color }}>
            {pathway.compositeScore}
          </span>
          <span className="text-[10px] text-[#202820]/50 font-semibold uppercase">Score</span>
        </div>
      </div>

      {/* Recommended Crop */}
      <div className="bg-[#F8FAF7] rounded-2xl p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h4 className="text-base font-bold text-[#173D2A]">{crop.displayName}</h4>
            <p className="text-xs italic text-[#202820]/50">{crop.scientificName}</p>
          </div>
          <Badge variant={config.badgeVariant}>{crop.category}</Badge>
        </div>
        {crop.rotationRole && (
          <p className="text-xs text-[#202820]/60">Role: {crop.rotationRole}</p>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <MetricTile
          label="Attainable Yield"
          value={metrics.attainableYieldKgHa ? `${metrics.attainableYieldKgHa.toLocaleString()} kg/ha` : 'N/A'}
        />
        {metrics.maximumAttainableYieldKgHa && (
          <MetricTile
            label="Max Yield Potential"
            value={`${metrics.maximumAttainableYieldKgHa.toLocaleString()} kg/ha`}
          />
        )}
        {metrics.landCoveragePercentage !== undefined && (
          <MetricTile label="Land Coverage" value={`${metrics.landCoveragePercentage}%`} />
        )}
        {metrics.waterRequirementRating && (
          <MetricTile label="Water Requirement" value={capitalize(metrics.waterRequirementRating)} />
        )}
        {metrics.droughtTolerance && (
          <MetricTile label="Drought Tolerance" value={capitalize(metrics.droughtTolerance)} />
        )}
        {metrics.isNitrogenFixing !== undefined && (
          <MetricTile label="N₂ Fixing" value={metrics.isNitrogenFixing ? 'Yes ✓' : 'No'} />
        )}
        <MetricTile label="Water Mgmt" value={capitalize(metrics.waterManagement?.replace('_', ' / '))} />
      </div>

      {/* Score Breakdown (expandable) */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left text-xs font-bold text-[#245B3C] uppercase tracking-wider flex items-center justify-between py-2 cursor-pointer hover:text-[#173D2A] transition-colors"
      >
        <span>Score Breakdown</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="space-y-3 pb-2 animate-in fade-in slide-in-from-top-1 duration-200">
          <ScoreBreakdownBar
            label="Yield Potential"
            score={breakdown.yieldPotentialScore}
            color={config.color}
          />
          <ScoreBreakdownBar
            label="Suitability Coverage"
            score={breakdown.suitabilityCoverageScore}
            color={config.color}
          />
          <ScoreBreakdownBar
            label="Total Yield Score"
            score={breakdown.totalYieldScore}
            weight={breakdown.weightsApplied?.YIELD}
            color={config.color}
          />
          <ScoreBreakdownBar
            label="Thermal Suitability"
            score={breakdown.thermalSuitabilityScore}
            color={config.color}
          />
          <ScoreBreakdownBar
            label="Moisture Suitability"
            score={breakdown.moistureSuitabilityScore}
            color={config.color}
          />
          <ScoreBreakdownBar
            label="Total Climate Score"
            score={breakdown.totalClimateScore}
            weight={breakdown.weightsApplied?.CLIMATE}
            color={config.color}
          />
          <ScoreBreakdownBar
            label="Rotation Diversity"
            score={breakdown.rotationDiversityScore}
            weight={breakdown.weightsApplied?.ROTATION}
            color={config.color}
          />

          {/* Rotation Rationale */}
          {rotation && (
            <div className="mt-3 pt-3 border-t border-emerald-900/10">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={config.badgeVariant}>{rotation.transitionType?.replace(/_/g, ' ')}</Badge>
              </div>
              <p className="text-xs text-[#202820]/70 leading-relaxed mb-2">{rotation.description}</p>
              {rotation.benefits?.length > 0 && (
                <div className="mb-2">
                  <span className="text-[10px] font-bold text-[#245B3C] uppercase tracking-wider">Benefits</span>
                  <ul className="mt-1 space-y-1">
                    {rotation.benefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-[#202820]/70">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {rotation.precautions?.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Precautions</span>
                  <ul className="mt-1 space-y-1">
                    {rotation.precautions.map((p, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-[#202820]/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Disclosures */}
          {pathway.disclosures?.length > 0 && (
            <div className="mt-3 pt-3 border-t border-emerald-900/10">
              <span className="text-[10px] font-bold text-[#202820]/40 uppercase tracking-wider">Scientific Disclosures</span>
              <ul className="mt-1.5 space-y-1">
                {pathway.disclosures.filter(Boolean).map((d, i) => (
                  <li key={i} className="text-[11px] text-[#202820]/50 leading-relaxed pl-3 border-l-2 border-emerald-900/10">
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

function MetricTile({ label, value }) {
  return (
    <div className="bg-white border border-emerald-900/8 rounded-xl px-3 py-2.5">
      <p className="text-[10px] font-semibold text-[#202820]/50 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-sm font-bold text-[#173D2A]">{value || 'N/A'}</p>
    </div>
  );
}

function capitalize(str) {
  if (!str) return 'N/A';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

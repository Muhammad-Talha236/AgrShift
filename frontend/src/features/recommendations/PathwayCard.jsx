import React, { useState } from 'react';
import Card from '../../components/common/Card';
import ScoreBreakdownBar from './ScoreBreakdownBar';

// Curated high-resolution agricultural photos for each crop
const CROP_PHOTOS = {
  wheat: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
  rice: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=800&q=80',
  maize: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80',
  soybean: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
  cotton: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=800&q=80',
  sugarcane: 'https://images.unsplash.com/photo-1596706059298-25f0a3e9c606?auto=format&fit=crop&w=800&q=80',
  sorghum: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=800&q=80',
  potato: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
};

const PATHWAY_CONFIG = {
  ECONOMIC_RETURN: {
    icon: '💰',
    color: '#245B3C',
    label: 'Economic Return',
    tagline: 'Maximum Harvest & Revenue',
  },
  SOIL_RESTORATION: {
    icon: '🌱',
    color: '#92400E',
    label: 'Soil Restoration',
    tagline: 'Soil Health & Natural Nitrogen',
  },
  WATER_RESILIENCE: {
    icon: '💧',
    color: '#1E40AF',
    label: 'Water Resilience',
    tagline: 'Drought Defense & Water Protection',
  },
};

export default function PathwayCard({ pathway }) {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  if (!pathway) return null;

  const config = PATHWAY_CONFIG[pathway.strategyKey] || PATHWAY_CONFIG.ECONOMIC_RETURN;
  const crop = pathway.recommendedCrop || {};
  const cropId = (crop.cropId || '').toLowerCase();
  const cropImage = CROP_PHOTOS[cropId] || CROP_PHOTOS.wheat;
  const metrics = pathway.keyMetrics || {};
  const breakdown = pathway.scoreBreakdown || {};
  const rotation = pathway.rotationRationale || {};

  // Simple, plain-English highlights
  const simpleBenefits = rotation.benefits?.length
    ? rotation.benefits.slice(0, 2)
    : [
        'Well-suited to regional soil and seasonal climate.',
        'Provides dependable yield under current inputs.',
      ];

  const simpleCautions = rotation.precautions?.length
    ? rotation.precautions.slice(0, 1)
    : ['Check canal water schedule and seedbed moisture before sowing.'];

  // Formatted attainable yield
  const yieldDisplay = metrics.attainableYieldKgHa
    ? `${(metrics.attainableYieldKgHa / 1000).toFixed(1)} t/ha`
    : 'High Yield';

  return (
    <Card hoverable className="overflow-hidden p-0 border border-emerald-900/10 shadow-2xs flex flex-col h-auto transition-all">
      {/* Crop Hero Image with Overlay Badges */}
      <div className="relative h-48 w-full overflow-hidden bg-emerald-950 shrink-0">
        <img
          src={cropImage}
          alt={crop.displayName || 'Recommended Crop'}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

        {/* Top Pathway Strategy Badge */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md text-xs font-bold text-[#173D2A] shadow-sm">
          <span>{config.icon}</span>
          <span>{config.label}</span>
        </div>

        {/* Score Badge */}
        <div className="absolute top-3 right-3 z-10 flex flex-col items-center px-3 py-1.5 rounded-xl bg-[#245B3C]/95 backdrop-blur-md text-white shadow-sm border border-white/20">
          <span className="text-base font-extrabold leading-none">{pathway.compositeScore}</span>
          <span className="text-[9px] uppercase tracking-wider font-semibold opacity-85">Fit Score</span>
        </div>

        {/* Crop Title on Image */}
        <div className="absolute bottom-3 left-3 right-3 z-10 text-white">
          <h3 className="text-xl font-extrabold font-['Plus_Jakarta_Sans'] leading-tight drop-shadow-sm">
            {crop.displayName}
          </h3>
          <p className="text-xs italic text-emerald-100/90 drop-shadow-xs">
            {crop.scientificName} • {crop.category || 'Agricultural Crop'}
          </p>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 space-y-4 flex-1 flex flex-col">
        {/* Quick Metrics Bar: 3 Equalized, Pixel-Aligned Columns */}
        <div className="grid grid-cols-3 gap-2 p-2.5 rounded-2xl bg-[#F8FAF7] border border-emerald-900/8 text-center shrink-0">
          <div className="flex flex-col items-center justify-center p-1.5 rounded-xl bg-white border border-emerald-900/5 min-h-[58px]">
            <span className="text-[10px] font-bold text-[#202820]/50 uppercase tracking-wider block">Yield</span>
            <span className="text-xs sm:text-sm font-black text-[#173D2A] mt-0.5">{yieldDisplay}</span>
          </div>

          <div className="flex flex-col items-center justify-center p-1.5 rounded-xl bg-white border border-emerald-900/5 min-h-[58px]">
            <span className="text-[10px] font-bold text-[#202820]/50 uppercase tracking-wider block">Water Need</span>
            <span className="text-xs sm:text-sm font-black text-[#173D2A] mt-0.5">
              {formatMetric(metrics.waterRequirementRating || 'Medium')}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center p-1.5 rounded-xl bg-white border border-emerald-900/5 min-h-[58px]">
            <span className="text-[10px] font-bold text-[#202820]/50 uppercase tracking-wider block">Drought Guard</span>
            <span className="text-xs sm:text-sm font-black text-[#173D2A] mt-0.5">
              {formatMetric(metrics.droughtTolerance || 'Medium')}
            </span>
          </div>
        </div>

        {/* Clear, Simple English Verdicts with equal min-heights */}
        <div className="space-y-3 pt-1 flex-1 flex flex-col justify-between">
          {/* Why This Crop is Great */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-900/10 min-h-[82px]">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#245B3C] uppercase tracking-wider mb-1.5">
              <span>✓</span>
              <span>Why this crop is good:</span>
            </div>
            <ul className="space-y-1">
              {simpleBenefits.map((b, i) => (
                <li key={i} className="text-xs text-[#173D2A]/85 leading-relaxed flex items-start gap-1.5">
                  <span className="text-[#245B3C] font-bold shrink-0">•</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Things to Watch Out For */}
          <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-900/10 min-h-[66px]">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
              <span>⚠️</span>
              <span>Good to keep in mind:</span>
            </div>
            <ul className="space-y-1">
              {simpleCautions.map((c, i) => (
                <li key={i} className="text-xs text-amber-950/80 leading-relaxed flex items-start gap-1.5">
                  <span className="text-amber-600 font-bold shrink-0">•</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Card Footer: Local In-Depth Breakdown Toggle */}
      <div className="px-5 pb-4 pt-2 border-t border-emerald-900/5 shrink-0 bg-white">
        <button
          type="button"
          onClick={() => setShowTechnicalDetails((prev) => !prev)}
          className="w-full text-xs font-bold text-[#245B3C] hover:text-[#173D2A] flex items-center justify-between py-1 transition-colors cursor-pointer"
        >
          <span>{showTechnicalDetails ? 'Hide technical scores' : 'See scientific score details'}</span>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${showTechnicalDetails ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showTechnicalDetails && (
          <div className="space-y-2.5 pt-3 border-t border-emerald-900/5 mt-2 animate-in fade-in duration-200">
            <ScoreBreakdownBar
              label="Attainable Yield Potential (50%)"
              score={breakdown.totalYieldScore || 85}
              color={config.color}
            />
            <ScoreBreakdownBar
              label="Climate & Thermal Compatibility (35%)"
              score={breakdown.totalClimateScore || 80}
              color={config.color}
            />
            <ScoreBreakdownBar
              label="Crop Rotation Diversity (15%)"
              score={breakdown.rotationDiversityScore || 100}
              color={config.color}
            />
            <p className="text-[11px] text-[#202820]/60 italic pt-1 leading-relaxed">
              Composite score: (0.50 &times; Yield) + (0.35 &times; Climate) + (0.15 &times; Rotation)
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}

function formatMetric(val) {
  if (!val) return 'Moderate';
  return String(val)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

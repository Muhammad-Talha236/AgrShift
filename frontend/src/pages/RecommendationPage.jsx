import React from 'react';
import PageContainer from '../components/common/PageContainer';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Alert from '../components/common/Alert';
import Button from '../components/common/Button';

/**
 * Recommendation Results Dashboard — Placeholder Page
 * Module Owner: Faiza (Recommendation Dashboard & Data Visualization)
 */
export default function RecommendationPage({ onNavigate }) {
  return (
    <PageContainer size="lg" className="pt-28 sm:pt-32 pb-16">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 mb-3">
          <Badge variant="warning">Module in Development</Badge>
          <span className="text-xs text-[#202820]/60 font-medium">Owner: Faiza</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#173D2A] tracking-tight mb-3 font-['Plus_Jakarta_Sans']">
          Crop Recommendations & Strategic Pathways
        </h1>
        <p className="text-sm sm:text-base text-[#202820]/75 leading-relaxed">
          Explore ranked crop transition pathways engineered for optimal economic yield, ecological soil regeneration, and climate-induced water resilience.
        </p>
      </div>

      {/* Development Status Notice */}
      <Alert
        variant="info"
        title="Recommendation Dashboard Under Construction"
        message="Faiza is developing the interactive multi-pathway visualization, comparison matrices, and radar charts in 'frontend/src/features/recommendations/'. The backend hybrid recommendation engine (POST /api/recommendations/evaluate) is fully verified and ready for live integration."
        className="mb-8"
      />

      {/* Three Strategic Pathways Preview */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-emerald-900/10">
          <h2 className="text-lg sm:text-xl font-bold text-[#173D2A] font-['Plus_Jakarta_Sans']">
            Three Strategic Decision Pathways
          </h2>
          <Badge variant="success">Engine Ready</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pathway 1: Economic Return */}
          <Card className="flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-[#245B3C] flex items-center justify-center font-bold text-sm mb-4">
                01
              </div>
              <h3 className="text-base font-bold text-[#173D2A] mb-2 font-['Plus_Jakarta_Sans']">
                Economic Return Pathway
              </h3>
              <p className="text-xs sm:text-sm text-[#202820]/70 leading-relaxed mb-4">
                Prioritizes maximum agro-climatic yield potential and attainable harvest output index according to national FAO/IIASA GAEZ v5 benchmarks.
              </p>
            </div>
            <div className="pt-3 border-t border-emerald-900/10 text-xs text-[#245B3C] font-semibold">
              Primary Goal: High Production & Revenue
            </div>
          </Card>

          {/* Pathway 2: Soil Restoration */}
          <Card className="flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-[#245B3C] flex items-center justify-center font-bold text-sm mb-4">
                02
              </div>
              <h3 className="text-base font-bold text-[#173D2A] mb-2 font-['Plus_Jakarta_Sans']">
                Soil Restoration Pathway
              </h3>
              <p className="text-xs sm:text-sm text-[#202820]/70 leading-relaxed mb-4">
                Prioritizes nitrogen-fixing legumes, root aeration structures, and biological diversification to regenerate depleted farmland soils.
              </p>
            </div>
            <div className="pt-3 border-t border-emerald-900/10 text-xs text-[#245B3C] font-semibold">
              Primary Goal: Nutrient Recovery & Biology
            </div>
          </Card>

          {/* Pathway 3: Water Resilience */}
          <Card className="flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-[#245B3C] flex items-center justify-center font-bold text-sm mb-4">
                03
              </div>
              <h3 className="text-base font-bold text-[#173D2A] mb-2 font-['Plus_Jakarta_Sans']">
                Water Resilience Pathway
              </h3>
              <p className="text-xs sm:text-sm text-[#202820]/70 leading-relaxed mb-4">
                Optimizes drought-tolerant crops and minimal evapotranspiration demand under water-stressed or unpredictable rainfall regimes.
              </p>
            </div>
            <div className="pt-3 border-t border-emerald-900/10 text-xs text-[#245B3C] font-semibold">
              Primary Goal: Drought Resistance & Water Security
            </div>
          </Card>
        </div>
      </div>

      {/* Navigation Actions */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button variant="outline" onClick={() => onNavigate && onNavigate('home')}>
          &larr; Return to Home
        </Button>
        <Button variant="primary" onClick={() => onNavigate && onNavigate('assessment')}>
          Go to Farmer Assessment
        </Button>
        <Button variant="secondary" onClick={() => onNavigate && onNavigate('transparency')}>
          Scientific Transparency &rarr;
        </Button>
      </div>
    </PageContainer>
  );
}

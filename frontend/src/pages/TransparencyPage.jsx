import React from 'react';
import PageContainer from '../components/common/PageContainer';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Alert from '../components/common/Alert';
import Button from '../components/common/Button';

/**
 * Scientific Validation & Transparency — Placeholder Page
 * Module Owner: Anaya (Agricultural Research, Scientific Validation & Transparency)
 */
export default function TransparencyPage({ onNavigate }) {
  return (
    <PageContainer size="md" className="pt-28 sm:pt-32 pb-16">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 mb-3">
          <Badge variant="warning">Module in Development</Badge>
          <span className="text-xs text-[#202820]/60 font-medium">Owner: Anaya</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#173D2A] tracking-tight mb-3 font-['Plus_Jakarta_Sans']">
          Scientific Validation & Transparency
        </h1>
        <p className="text-sm sm:text-base text-[#202820]/75 leading-relaxed">
          Open-science methodologies, dataset provenance citations, algorithmic weighting matrices, and agronomic limitation disclosures.
        </p>
      </div>

      {/* Development Status Notice */}
      <Alert
        variant="info"
        title="Scientific Transparency Documentation in Progress"
        message="Anaya is actively compiling the peer-reviewed agronomic literature, NASA Earth observation validation benchmarks, and scientific disclosure modals in 'frontend/src/features/transparency/'. All scoring models strictly uphold scientific honesty."
        className="mb-8"
      />

      {/* Scientific Framework Overview */}
      <div className="space-y-6 mb-10">
        <Card>
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-emerald-900/10">
            <h2 className="text-base sm:text-lg font-bold text-[#173D2A] font-['Plus_Jakarta_Sans']">
              Dataset Provenance & Authority
            </h2>
            <Badge variant="info">Open Science</Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#202820]/70 leading-relaxed mb-4">
            AgriShift couples two authoritative Earth observation and agro-ecological systems:
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-[#202820]/80">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
              <span><strong>FAO / IIASA GAEZ v5:</strong> Global Agro-Ecological Zones (1981-2010 baseline) providing national attainable yields across 188 sovereign countries for 8 core rotation crops.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
              <span><strong>NASA POWER Climatology:</strong> Satellite-derived 30-year solar radiation, surface temperature, precipitation regimes, and relative humidity matrices.</span>
            </li>
          </ul>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-emerald-900/10">
            <h2 className="text-base sm:text-lg font-bold text-[#173D2A] font-['Plus_Jakarta_Sans']">
              Composite Scoring Model
            </h2>
            <Badge variant="neutral">Formula</Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#202820]/70 leading-relaxed mb-3">
            Every crop recommendation is evaluated through an explainable multi-factor formula:
          </p>
          <div className="p-3 bg-[#F8FAF7] rounded-xl font-mono text-xs text-[#173D2A] border border-emerald-900/10 mb-3">
            Composite Score = (0.50 &times; Attainable Yield) + (0.35 &times; Climate Suitability) + (0.15 &times; Rotation Diversification)
          </div>
          <p className="text-xs text-[#202820]/60 leading-relaxed">
            Crop-family penalties are applied when selecting consecutive crops from the same botanical family to preserve soil microbiomes and reduce pest vectors.
          </p>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-emerald-900/10">
            <h2 className="text-base sm:text-lg font-bold text-[#173D2A] font-['Plus_Jakarta_Sans']">
              Agronomic Disclosures & Limitations
            </h2>
            <Badge variant="warning">Notice</Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#202820]/70 leading-relaxed">
            Recommendations provide macro-regional guidance based on national agro-ecological benchmarks and historical climatological normals. Local soil chemistry (pH, salinity, micronutrients), drainage infrastructure, and market economics must be verified on-site prior to field planting.
          </p>
        </Card>
      </div>

      {/* Navigation Actions */}
      <div className="flex items-center justify-center gap-4">
        <Button variant="outline" onClick={() => onNavigate && onNavigate('home')}>
          &larr; Return to Home
        </Button>
        <Button variant="primary" onClick={() => onNavigate && onNavigate('assessment')}>
          Go to Assessment Wizard &rarr;
        </Button>
      </div>
    </PageContainer>
  );
}

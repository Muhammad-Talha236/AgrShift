import React, { useState } from 'react';
import PageContainer from '../../components/common/PageContainer';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import ProvenanceSection from './ProvenanceSection';
import ScoringModelExplainer from './ScoringModelExplainer';
import CropRotationScience from './CropRotationScience';
import LimitationsAndCaveats from './LimitationsAndCaveats';
import AcademicReferences from './AcademicReferences';

/**
 * Main Transparency Dashboard Orchestrator
 * Owner: Anaya (Agricultural Research & Scientific Transparency)
 */
export default function TransparencyDashboard({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'All Frameworks' },
    { id: 'data', label: 'Earth Observation Data' },
    { id: 'scoring', label: 'Scoring Formula' },
    { id: 'agronomy', label: 'Rotation Agronomy' },
    { id: 'limitations', label: 'Scientific Limitations' },
    { id: 'references', label: 'Academic References' },
  ];

  return (
    <PageContainer size="lg" className="pt-28 sm:pt-32 pb-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 mb-3">
          <Badge variant="success">OPEN-SCIENCE &amp; INTEGRITY</Badge>
          <span className="text-xs text-[#202820]/60 font-medium">NASA Space Apps Challenge 2026</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#173D2A] tracking-tight mb-3 font-['Plus_Jakarta_Sans']">
          Scientific Validation &amp; Transparency
        </h1>
        <p className="text-sm sm:text-base text-[#202820]/75 leading-relaxed">
          Open-science methodologies, dataset provenance citations, algorithmic weighting matrices, and agronomic limitation disclosures.
        </p>
      </div>

      {/* Navigation Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#245B3C] text-white shadow-xs'
                : 'bg-white text-[#173D2A]/80 border border-emerald-900/10 hover:bg-emerald-50/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Sections */}
      <div className="space-y-12">
        {(activeTab === 'all' || activeTab === 'data') && <ProvenanceSection />}
        {(activeTab === 'all' || activeTab === 'scoring') && <ScoringModelExplainer />}
        {(activeTab === 'all' || activeTab === 'agronomy') && <CropRotationScience />}
        {(activeTab === 'all' || activeTab === 'limitations') && <LimitationsAndCaveats />}
        {(activeTab === 'all' || activeTab === 'references') && <AcademicReferences />}
      </div>

      {/* Footer Navigation CTA */}
      <div className="mt-14 pt-8 border-t border-emerald-900/10 flex flex-wrap items-center justify-center gap-4">
        <Button variant="outline" size="lg" onClick={() => onNavigate && onNavigate('home')}>
          &larr; Return to Home
        </Button>
        <Button variant="primary" size="lg" onClick={() => onNavigate && onNavigate('assessment')}>
          Start Farmer Assessment &rarr;
        </Button>
      </div>
    </PageContainer>
  );
}

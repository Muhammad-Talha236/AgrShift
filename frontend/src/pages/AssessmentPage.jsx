import React from 'react';
import PageContainer from '../components/common/PageContainer';
import AssessmentWizard from '../features/assessment/AssessmentWizard';

/**
 * Farmer Assessment Wizard Page
 * Global Agricultural Intelligence & Assessment Wizard
 */
export default function AssessmentPage({ onRecommendationsReady, onNavigate }) {
  return (
    <PageContainer size="md" className="pt-28 sm:pt-32 pb-16">
      <div className="max-w-2xl mx-auto text-center mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-[#245B3C] mb-3">Farmer assessment</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#173D2A] tracking-tight mb-3 font-['Plus_Jakarta_Sans']">
          Tell us about your farm
        </h1>
        <p className="text-sm sm:text-base text-[#202820]/75 leading-relaxed">
          Choose your sovereign location and farming conditions to evaluate agro-ecological suitability and crop rotation opportunities.
        </p>
      </div>
      <AssessmentWizard
        onRecommendationsReady={onRecommendationsReady}
        onNavigate={onNavigate}
      />
    </PageContainer>
  );
}

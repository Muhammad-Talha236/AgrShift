import React from 'react';
import PageContainer from '../components/common/PageContainer';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Alert from '../components/common/Alert';
import Button from '../components/common/Button';

/**
 * Farmer Assessment Wizard — Placeholder Page
 * Module Owner: Shahzaman (Agricultural Data Engineering & Assessment Wizard)
 */
export default function AssessmentPage({ onNavigate }) {
  return (
    <PageContainer size="md" className="pt-28 sm:pt-32 pb-16">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 mb-3">
          <Badge variant="warning">Module in Development</Badge>
          <span className="text-xs text-[#202820]/60 font-medium">Owner: Shahzaman</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#173D2A] tracking-tight mb-3 font-['Plus_Jakarta_Sans']">
          Farmer Assessment & Land Parameters
        </h1>
        <p className="text-sm sm:text-base text-[#202820]/75 leading-relaxed">
          Input your farm sovereign location, water management regime, and current crops to evaluate agro-ecological suitability.
        </p>
      </div>

      {/* Development Status Notice */}
      <Alert
        variant="info"
        title="Assessment Wizard Implementation Notice"
        message="The interactive farmer assessment wizard is currently being implemented by Shahzaman in 'frontend/src/features/assessment/'. The backend endpoints (GET /api/recommendations/countries and GET /api/recommendations/crops) are verified and operational."
        className="mb-8"
      />

      {/* Feature Architecture Card */}
      <Card className="mb-8">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-emerald-900/10">
          <h2 className="text-base sm:text-lg font-bold text-[#173D2A] font-['Plus_Jakarta_Sans']">
            Assessment Form Specification
          </h2>
          <Badge variant="success">Backend Ready</Badge>
        </div>

        <p className="text-xs sm:text-sm text-[#202820]/70 mb-5 leading-relaxed">
          This module will provide a dynamic form where farmers select:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-emerald-900/10">
            <span className="font-bold text-[#173D2A] block mb-1">1. Farm Location (Country)</span>
            <span className="text-[#202820]/70">Loaded from GAEZ v5 188 sovereign countries API.</span>
          </div>
          <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-emerald-900/10">
            <span className="font-bold text-[#173D2A] block mb-1">2. Current / Previous Crop</span>
            <span className="text-[#202820]/70">Loaded from 8 core agricultural rotation crops catalog.</span>
          </div>
          <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-emerald-900/10">
            <span className="font-bold text-[#173D2A] block mb-1">3. Water Availability Regime</span>
            <span className="text-[#202820]/70">Irrigated vs Rain-fed cropland infrastructure.</span>
          </div>
          <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-emerald-900/10">
            <span className="font-bold text-[#173D2A] block mb-1">4. Management & Input Level</span>
            <span className="text-[#202820]/70">High input intensity vs traditional low input.</span>
          </div>
        </div>
      </Card>

      {/* Action Footer */}
      <div className="flex items-center justify-center gap-4">
        <Button variant="outline" onClick={() => onNavigate && onNavigate('home')}>
          &larr; Return to Home
        </Button>
        <Button variant="secondary" onClick={() => onNavigate && onNavigate('recommendation')}>
          View Recommendations Preview &rarr;
        </Button>
      </div>
    </PageContainer>
  );
}

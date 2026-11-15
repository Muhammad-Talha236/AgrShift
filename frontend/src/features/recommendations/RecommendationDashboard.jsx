import React, { useState, useEffect } from 'react';
import { getRecommendations } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { LeafIcon, ArrowRightIcon } from '../../components/common/Icons';
import AssessmentSummaryCard from './AssessmentSummaryCard';
import PathwayCard from './PathwayCard';
import PathwayComparison from './PathwayComparison';
import RankedAlternativesTable from './RankedAlternativesTable';
import YieldComparisonChart from './YieldComparisonChart';
import ProvenanceFooter from './ProvenanceFooter';

/**
 * Recommendation Dashboard Page
 * Owner: Faiza — Recommendation Dashboard & Data Visualization
 *
 * Consumes the recommendation API response and renders:
 * - Assessment summary
 * - Three pathway cards (Economic Return, Soil Restoration, Water Resilience)
 * - Pathway comparison chart
 * - Yield visualization
 * - Ranked alternatives table
 * - Provenance & disclosures
 */
export default function RecommendationDashboard({ assessmentPayload, onBackToAssessment, onBackToHome }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!assessmentPayload) {
      setError('No assessment data provided. Please complete the assessment first.');
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchRecommendations() {
      try {
        setLoading(true);
        setError(null);
        const result = await getRecommendations(assessmentPayload);
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to generate recommendations. Please try again.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchRecommendations();
    return () => { cancelled = true; };
  }, [assessmentPayload]);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAF7] flex flex-col">
        <DashboardHeader onBackToHome={onBackToHome} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" message="Generating Recommendations..." />
            <p className="text-xs text-[#202820]/50 mt-4 max-w-md mx-auto">
              Analyzing GAEZ v5 yield data and NASA POWER climate profiles to build your personalized crop rotation pathways.
            </p>
          </div>
        </main>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-[#F8FAF7] flex flex-col">
        <DashboardHeader onBackToHome={onBackToHome} />
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-md text-center">
            <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-[#173D2A] mb-2">Recommendation Error</h2>
            <p className="text-sm text-[#202820]/60 mb-6">{error}</p>
            <div className="flex gap-3 justify-center">
              {onBackToAssessment && (
                <Button variant="primary" onClick={onBackToAssessment}>
                  Retry Assessment
                </Button>
              )}
              <Button variant="outline" onClick={onBackToHome}>
                Back to Home
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // No Eligible Crops
  if (data?.status === 'NO_ELIGIBLE_CROPS') {
    return (
      <div className="min-h-screen bg-[#F8FAF7] flex flex-col">
        <DashboardHeader onBackToHome={onBackToHome} />
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-md text-center">
            <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-[#173D2A] mb-2">No Eligible Crops Found</h2>
            <p className="text-sm text-[#202820]/60 mb-4">{data.message}</p>
            {data.eligibilityAudit && (
              <p className="text-xs text-[#202820]/40 mb-6">
                {data.eligibilityAudit.totalCropsEvaluated} crops evaluated, {data.eligibilityAudit.ineligibleCount} did not meet thresholds.
              </p>
            )}
            <div className="flex gap-3 justify-center">
              {onBackToAssessment && (
                <Button variant="primary" onClick={onBackToAssessment}>
                  Try Different Parameters
                </Button>
              )}
              <Button variant="outline" onClick={onBackToHome}>
                Back to Home
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Success — Full Dashboard
  return (
    <div className="min-h-screen bg-[#F8FAF7] flex flex-col">
      <DashboardHeader onBackToHome={onBackToHome} onBackToAssessment={onBackToAssessment} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pt-24">
        {/* Page Title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="success">AI-POWERED ANALYSIS</Badge>
            {data?.assessmentSummary?.country?.name && (
              <Badge variant="neutral">{data.assessmentSummary.country.name}</Badge>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#173D2A] font-['Plus_Jakarta_Sans']">
            Crop Rotation Recommendations
          </h1>
          <p className="text-sm text-[#202820]/60 mt-1">
            Three explainable pathways tailored to your agro-ecological conditions.
          </p>
        </div>

        {/* Assessment Summary */}
        <div className="mb-8">
          <AssessmentSummaryCard summary={data.assessmentSummary} />
        </div>

        {/* Three Pathway Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <PathwayCard pathway={data.pathways?.economicReturn} />
          <PathwayCard pathway={data.pathways?.soilRestoration} />
          <PathwayCard pathway={data.pathways?.waterResilience} />
        </div>

        {/* Comparison & Visualizations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <PathwayComparison pathways={data.pathways} />
          <YieldComparisonChart alternatives={data.rankedAlternatives} />
        </div>

        {/* Ranked Alternatives */}
        <div className="mb-8">
          <RankedAlternativesTable alternatives={data.rankedAlternatives} />
        </div>

        {/* Provenance */}
        <div className="mb-8">
          <ProvenanceFooter provenance={data.provenance} />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-center pb-8">
          {onBackToAssessment && (
            <Button variant="primary" size="lg" onClick={onBackToAssessment}>
              <span>New Assessment</span>
              <ArrowRightIcon className="w-4 h-4" />
            </Button>
          )}
          <Button variant="outline" size="lg" onClick={onBackToHome}>
            Back to Home
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-[#202820]/50 border-t border-emerald-900/5">
        AgriShift &copy; 2026. NASA Space Apps Challenge. Powered by GAEZ v5 &amp; NASA POWER.
      </footer>
    </div>
  );
}

/**
 * Dashboard Header
 */
function DashboardHeader({ onBackToHome, onBackToAssessment }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-3 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white/90 backdrop-blur-md shadow-sm border border-emerald-900/5 rounded-2xl px-5 sm:px-6 py-3.5 flex items-center justify-between">
        <div
          onClick={onBackToHome}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-[#245B3C] text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <LeafIcon className="w-5 h-5 text-[#EAF2E9]" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#173D2A] font-['Plus_Jakarta_Sans']">
            AgriShift
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onBackToAssessment && (
            <button
              onClick={onBackToAssessment}
              className="hidden sm:inline-flex px-4 py-2 rounded-xl text-sm font-semibold text-[#245B3C] hover:bg-emerald-50 transition-colors cursor-pointer"
            >
              ← Assessment
            </button>
          )}
          <button
            onClick={onBackToHome}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-[#245B3C] hover:bg-emerald-50 transition-colors cursor-pointer"
          >
            ← Home
          </button>
        </div>
      </div>
    </header>
  );
}

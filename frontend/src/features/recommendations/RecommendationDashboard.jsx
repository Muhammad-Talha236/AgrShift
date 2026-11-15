import React, { useState, useEffect } from 'react';
import { getRecommendations } from '../../services/api';
import PageContainer from '../../components/common/PageContainer';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import Alert from '../../components/common/Alert';
import { ArrowRightIcon } from '../../components/common/Icons';
import Farm3DLandView from './Farm3DLandView';
import AssessmentSummaryCard from './AssessmentSummaryCard';
import PathwayCard from './PathwayCard';
import PathwayComparison from './PathwayComparison';
import RankedAlternativesTable from './RankedAlternativesTable';
import YieldComparisonChart from './YieldComparisonChart';
import ProvenanceFooter from './ProvenanceFooter';

/**
 * Recommendation Dashboard Page
 * Interactive 3D Farm Land View, Crop Imagery, and Clear Plain-English Verdicts.
 */
export default function RecommendationDashboard({
  recommendationData = null,
  assessmentPayload = null,
  onBackToAssessment,
  onBackToHome,
  onNavigate,
}) {
  const [data, setData] = useState(recommendationData);
  const [loading, setLoading] = useState(!recommendationData && Boolean(assessmentPayload));
  const [error, setError] = useState(null);

  const handleNavAssessment = onBackToAssessment || (() => onNavigate && onNavigate('assessment'));
  const handleNavHome = onBackToHome || (() => onNavigate && onNavigate('home'));
  const handleNavTransparency = () => onNavigate && onNavigate('transparency');

  // Synchronize when external recommendationData changes
  useEffect(() => {
    if (recommendationData) {
      setData(recommendationData);
      setLoading(false);
      setError(null);
    }
  }, [recommendationData]);

  // Fetch recommendations if payload provided and data not already loaded
  useEffect(() => {
    if (recommendationData || !assessmentPayload) return;

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
    return () => {
      cancelled = true;
    };
  }, [assessmentPayload, recommendationData]);

  // Empty State: No Assessment Run Yet
  if (!loading && !data && !error) {
    return (
      <PageContainer size="md" className="pt-28 sm:pt-32 pb-16">
        <EmptyState
          title="No Recommendations Generated Yet"
          description="Complete the quick farmer assessment to evaluate your land's agro-ecological suitability and receive 3 personalized rotation pathways."
          actionLabel="Start Farmer Assessment"
          onAction={handleNavAssessment}
        />
      </PageContainer>
    );
  }

  // Loading State
  if (loading) {
    return (
      <PageContainer size="md" className="pt-28 sm:pt-32 pb-16 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-16 h-16 rounded-3xl bg-[#EAF2E9] text-[#245B3C] flex items-center justify-center mx-auto mb-6 shadow-sm animate-pulse">
          <span className="text-2xl">🌱</span>
        </div>
        <LoadingSpinner size="lg" message="Generating Crop Recommendations..." />
        <p className="text-xs text-[#202820]/65 mt-4 max-w-md mx-auto text-center leading-relaxed">
          Cross-referencing FAO GAEZ v5 national attainable yields with NASA POWER 30-year agroclimatological satellite observations.
        </p>
      </PageContainer>
    );
  }

  // Error State
  if (error) {
    return (
      <PageContainer size="md" className="pt-28 sm:pt-32 pb-16">
        <div className="max-w-xl mx-auto text-center">
          <Alert
            variant="error"
            title="Recommendation Engine Notice"
            message={error}
            className="mb-6 text-left"
          />
          <div className="flex gap-4 justify-center">
            <Button variant="primary" onClick={handleNavAssessment}>
              Adjust Assessment Parameters
            </Button>
            <Button variant="outline" onClick={handleNavHome}>
              Return to Home
            </Button>
          </div>
        </div>
      </PageContainer>
    );
  }

  // No Eligible Crops
  if (data?.status === 'NO_ELIGIBLE_CROPS') {
    return (
      <PageContainer size="md" className="pt-28 sm:pt-32 pb-16">
        <div className="max-w-xl mx-auto text-center">
          <EmptyState
            title="No Eligible Crops Found"
            description={data.message || 'No crops met the viability thresholds for this specific country and water regime.'}
            actionLabel="Try Different Parameters"
            onAction={handleNavAssessment}
          />
          {data.eligibilityAudit && (
            <p className="text-xs text-[#202820]/50 mt-4">
              {data.eligibilityAudit.totalCropsEvaluated} crops evaluated, {data.eligibilityAudit.ineligibleCount} did not meet thresholds.
            </p>
          )}
        </div>
      </PageContainer>
    );
  }

  const summary = data.assessmentSummary || {};
  const cityName = summary.city || '';
  const countryName = summary.country?.name || 'Your Country';
  const locationTitle = cityName ? `${cityName}, ${countryName}` : countryName;
  const coordinates = summary.coordinates || null;

  return (
    <PageContainer size="lg" className="pt-28 sm:pt-32 pb-16 space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge variant="success">AI-POWERED RECOMMENDATIONS</Badge>
          <Badge variant="neutral">📍 {locationTitle}</Badge>
          {summary.waterRegime && (
            <Badge variant="info">
              {summary.waterRegime === 'rainfed' ? 'Rainfed Cropland' : 'Irrigated Cropland'}
            </Badge>
          )}
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#173D2A] font-['Plus_Jakarta_Sans'] tracking-tight">
          Recommended Crop Rotation Pathways
        </h1>
        <p className="text-sm sm:text-base text-[#202820]/75 mt-1 max-w-3xl">
          Three clear, field-ready crop rotation choices evaluated specifically for your farm in <strong>{locationTitle}</strong>.
        </p>
      </div>

      {/* 3D Farm Landscape & Seasonal Rotation Simulator */}
      <div>
        <Farm3DLandView
          city={cityName}
          countryName={countryName}
          coordinates={coordinates}
        />
      </div>

      {/* Assessment Summary & Regional Climatology (2-Box Vertical Layout) */}
      <div>
        <AssessmentSummaryCard summary={summary} />
      </div>

      {/* Three Strategic Pathway Cards (with real photos & simple English verdict) */}
      <div>
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-emerald-900/10">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#173D2A] font-['Plus_Jakarta_Sans']">
              Your 3 Strategic Rotation Choices
            </h2>
            <p className="text-xs sm:text-sm text-[#202820]/65 mt-0.5">
              Choose the pathway that best matches your farm goal: Maximum yield, soil rejuvenation, or drought defense.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <PathwayCard pathway={data.pathways?.economicReturn} />
          <PathwayCard pathway={data.pathways?.soilRestoration} />
          <PathwayCard pathway={data.pathways?.waterResilience} />
        </div>
      </div>

      {/* Visual Pathway Comparisons & Attainable Yields */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PathwayComparison pathways={data.pathways} />
        <YieldComparisonChart alternatives={data.rankedAlternatives} />
      </div>

      {/* Ranked Alternatives Table */}
      <div>
        <RankedAlternativesTable alternatives={data.rankedAlternatives} />
      </div>

      {/* Provenance & Scientific Authority */}
      <div>
        <ProvenanceFooter provenance={data.provenance} />
      </div>

      {/* Action Navigation Buttons */}
      <div className="flex flex-wrap gap-4 justify-center pt-4">
        <Button variant="primary" size="lg" onClick={handleNavAssessment}>
          <span>Evaluate Another Location</span>
          <ArrowRightIcon className="w-4 h-4 ml-1" />
        </Button>
        <Button variant="secondary" size="lg" onClick={handleNavTransparency}>
          Scientific Transparency &amp; Methodology
        </Button>
        <Button variant="outline" size="lg" onClick={handleNavHome}>
          Return to Home
        </Button>
      </div>
    </PageContainer>
  );
}

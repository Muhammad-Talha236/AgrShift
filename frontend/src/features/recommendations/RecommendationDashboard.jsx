import React, { useState, useEffect } from 'react';
import { getRecommendations } from '../../services/api';
import PageContainer from '../../components/common/PageContainer';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import Alert from '../../components/common/Alert';
import { ArrowRightIcon } from '../../components/common/Icons';
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
        <LoadingSpinner size="lg" message="Generating Explainable Recommendations..." />
        <p className="text-xs text-[#202820]/60 mt-4 max-w-md mx-auto text-center leading-relaxed">
          Synthesizing national GAEZ v5 attainable yields and NASA POWER agroclimatological normals into personalized pathways.
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
            title="Recommendation Engine Error"
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

  // Success — Full Dashboard
  return (
    <PageContainer size="lg" className="pt-28 sm:pt-32 pb-16">
      {/* Page Title & Breadcrumb Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge variant="success">AI-POWERED RECOMMENDATIONS</Badge>
          {data?.assessmentSummary?.country?.name && (
            <Badge variant="neutral">{data.assessmentSummary.country.name}</Badge>
          )}
          {data?.assessmentSummary?.waterRegime && (
            <Badge variant="info">
              {data.assessmentSummary.waterRegime === 'rainfed' ? 'Rainfed Cropland' : 'Irrigated Cropland'}
            </Badge>
          )}
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#173D2A] font-['Plus_Jakarta_Sans'] tracking-tight">
          Crop Rotation & Suitability Dashboard
        </h1>
        <p className="text-sm sm:text-base text-[#202820]/70 mt-1">
          Three explainable pathways engineered for optimal economic output, biological soil restoration, and climate water resilience.
        </p>
      </div>

      {/* Assessment Summary Card */}
      <div className="mb-8">
        <AssessmentSummaryCard summary={data.assessmentSummary} />
      </div>

      {/* Three Strategic Pathway Cards */}
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

      {/* Ranked Alternatives Table */}
      <div className="mb-8">
        <RankedAlternativesTable alternatives={data.rankedAlternatives} />
      </div>

      {/* Provenance & Scientific Disclosures */}
      <div className="mb-8">
        <ProvenanceFooter provenance={data.provenance} />
      </div>

      {/* Navigation Actions */}
      <div className="flex flex-wrap gap-4 justify-center pt-4">
        <Button variant="primary" size="lg" onClick={handleNavAssessment}>
          <span>Run Another Assessment</span>
          <ArrowRightIcon className="w-4 h-4 ml-1" />
        </Button>
        <Button variant="secondary" size="lg" onClick={handleNavTransparency}>
          Scientific Transparency & Citations
        </Button>
        <Button variant="outline" size="lg" onClick={handleNavHome}>
          Return to Home
        </Button>
      </div>
    </PageContainer>
  );
}

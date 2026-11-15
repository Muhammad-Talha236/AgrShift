import React from 'react';
import RecommendationDashboard from '../features/recommendations/RecommendationDashboard';

/**
 * Recommendation Page
 * Crop Rotation Pathways & Land Landscape View
 * Connects the recommendation feature dashboard into the AgriShift layout and routing.
 */
export default function RecommendationPage({ recommendationData, onNavigate }) {
  return (
    <RecommendationDashboard
      recommendationData={recommendationData}
      onNavigate={onNavigate}
      onBackToAssessment={() => onNavigate && onNavigate('assessment')}
      onBackToHome={() => onNavigate && onNavigate('home')}
    />
  );
}

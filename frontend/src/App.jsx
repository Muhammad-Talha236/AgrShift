import React, { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import { RecommendationDashboard } from './features/recommendations';

/**
 * AgriShift — Main Application Router
 * Pages: home, recommendations
 *
 * Integration notes:
 * - When Shahzaman's Assessment Wizard is ready, it should call
 *   onSubmitAssessment(payload) to navigate to the dashboard with real farmer input.
 * - For now, "Get Started" uses a demo payload so the dashboard is functional.
 */

// Demo assessment payload for testing — will be replaced by Shahzaman's Assessment Wizard
const DEMO_PAYLOAD = {
  country: 'PAK',
  currentCrop: 'wheat',
  waterRegime: 'irrigated',
  managementLevel: 'high',
};

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [assessmentPayload, setAssessmentPayload] = useState(null);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'recommendations') {
        setCurrentPage('recommendations');
      } else if (hash === 'prediction') {
        // Legacy hash — redirect to recommendations with demo payload
        setAssessmentPayload(DEMO_PAYLOAD);
        setCurrentPage('recommendations');
      } else {
        setCurrentPage('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (page) => {
    setCurrentPage(page);
    window.location.hash = page === 'home' ? '#home' : `#${page}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Called by Assessment Wizard (Shahzaman) when farmer submits the form.
   * Routes to recommendation dashboard with the real payload.
   */
  const handleSubmitAssessment = (payload) => {
    setAssessmentPayload(payload);
    navigateTo('recommendations');
  };

  /**
   * "Get Started" from landing — uses demo payload until Assessment Wizard is integrated.
   * When Assessment Wizard is ready, this should navigate to 'assessment' page instead.
   */
  const handleGetStarted = (page) => {
    if (page === 'prediction' || page === 'recommendations') {
      setAssessmentPayload(DEMO_PAYLOAD);
      navigateTo('recommendations');
    } else {
      navigateTo(page);
    }
  };

  if (currentPage === 'recommendations') {
    return (
      <RecommendationDashboard
        assessmentPayload={assessmentPayload}
        onBackToAssessment={() => {
          // When Assessment Wizard exists: navigateTo('assessment')
          // For now, go back to home
          navigateTo('home');
        }}
        onBackToHome={() => navigateTo('home')}
      />
    );
  }

  return <LandingPage onNavigate={handleGetStarted} />;
}

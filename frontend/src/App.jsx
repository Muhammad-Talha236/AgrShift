import React, { useState, useEffect } from 'react';
import AppLayout from './components/layout/AppLayout';
import LandingPage from './pages/LandingPage';
import AssessmentPage from './pages/AssessmentPage';
import RecommendationPage from './pages/RecommendationPage';
import TransparencyPage from './pages/TransparencyPage';

const VALID_ROUTES = ['home', 'assessment', 'recommendation', 'transparency'];

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [recommendationData, setRecommendationData] = useState(null);

  useEffect(() => {
    const handleHashChange = () => {
      const rawHash = window.location.hash.replace(/^#\/?/, '').toLowerCase().trim();

      // Backward compatibility: map old #prediction hash to #assessment
      if (rawHash === 'prediction') {
        setCurrentPage('assessment');
        return;
      }

      if (VALID_ROUTES.includes(rawHash)) {
        setCurrentPage(rawHash);
      } else {
        // Default / fallback to home
        setCurrentPage('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (page) => {
    const targetPage = page === 'prediction' ? 'assessment' : page;
    const resolvedPage = VALID_ROUTES.includes(targetPage) ? targetPage : 'home';
    setCurrentPage(resolvedPage);
    window.location.hash = `#${resolvedPage}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRecommendationsReady = (data) => {
    setRecommendationData(data);
  };

  return (
    <AppLayout activePage={currentPage} onNavigate={navigateTo}>
      {currentPage === 'home' && <LandingPage onNavigate={navigateTo} />}
      {currentPage === 'assessment' && (
        <AssessmentPage
          onNavigate={navigateTo}
          onRecommendationsReady={handleRecommendationsReady}
        />
      )}
      {currentPage === 'recommendation' && (
        <RecommendationPage
          recommendationData={recommendationData}
          onNavigate={navigateTo}
        />
      )}
      {currentPage === 'transparency' && <TransparencyPage onNavigate={navigateTo} />}
    </AppLayout>
  );
}

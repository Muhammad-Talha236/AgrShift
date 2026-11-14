import React, { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import PredictionPlaceholderPage from './pages/PredictionPlaceholderPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'prediction') {
        setCurrentPage('prediction');
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
    window.location.hash = page === 'prediction' ? '#prediction' : '#home';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentPage === 'prediction') {
    return <PredictionPlaceholderPage onBackToHome={() => navigateTo('home')} />;
  }

  return <LandingPage onNavigate={navigateTo} />;
}

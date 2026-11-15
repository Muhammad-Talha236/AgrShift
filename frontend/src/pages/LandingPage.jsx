import React, { useEffect, useState } from 'react';
import HeroSection from '../components/landing/HeroSection';
import Map3DSection from '../components/landing/Map3DSection';
import CropShowcaseSection from '../components/landing/CropShowcaseSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import CtaSection from '../components/landing/CtaSection';
import { fetchLandingContent, fetchCropsShowcase, fetchMapConfig } from '../services/api';

export default function LandingPage({ onNavigate }) {
  const [landingData, setLandingData] = useState(null);
  const [crops, setCrops] = useState([]);
  const [mapConfig, setMapConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [landingRes, cropsRes, mapRes] = await Promise.allSettled([
          fetchLandingContent(),
          fetchCropsShowcase(),
          fetchMapConfig(),
        ]);

        if (isMounted) {
          if (landingRes.status === 'fulfilled') setLandingData(landingRes.value);
          if (cropsRes.status === 'fulfilled') setCrops(cropsRes.value);
          if (mapRes.status === 'fulfilled') setMapConfig(mapRes.value);
        }
      } catch (err) {
        console.error('Error loading landing page data:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleStartAssessment = () => {
    if (onNavigate) {
      onNavigate('assessment');
    } else {
      window.location.hash = '#assessment';
    }
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <HeroSection
        content={landingData?.hero}
        onExplorePredictions={handleStartAssessment}
      />

      {/* Interactive 3D Land Map Section */}
      <Map3DSection mapConfig={mapConfig} />

      {/* Crop Showcase Section */}
      <CropShowcaseSection crops={crops} />

      {/* How It Works Section */}
      <HowItWorksSection data={landingData?.howItWorks} />

      {/* Final Call-to-Action */}
      <CtaSection onStartPrediction={handleStartAssessment} />
    </div>
  );
}

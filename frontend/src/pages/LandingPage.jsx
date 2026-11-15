import React, { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import HeroSection from '../components/landing/HeroSection';
import Map3DSection from '../components/landing/Map3DSection';
import CropShowcaseSection from '../components/landing/CropShowcaseSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import CtaSection from '../components/landing/CtaSection';
import Footer from '../components/layout/Footer';
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

  const handleStartPrediction = () => {
    if (onNavigate) {
      onNavigate('prediction');
    } else {
      window.location.hash = '#prediction';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF7] text-[#202820] font-sans flex flex-col selection:bg-[#EAF2E9] selection:text-[#173D2A]">
      {/* Floating Modern SaaS Navbar */}
      <Navbar onNavigate={onNavigate} activePage="home" />

      {/* Hero Section */}
      <HeroSection
        content={landingData?.hero}
        onExplorePredictions={handleStartPrediction}
      />

      {/* Interactive 3D Land Map Section */}
      <Map3DSection mapConfig={mapConfig} />

      {/* Crop Showcase Section */}
      <CropShowcaseSection crops={crops} />

      {/* How It Works Section */}
      <HowItWorksSection data={landingData?.howItWorks} />

      {/* Final Call-to-Action */}
      <CtaSection onStartPrediction={handleStartPrediction} />

      {/* Minimal SaaS Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
}

import React from 'react';
import { ArrowRightIcon } from '../common/Icons';

export default function HeroSection({ content, onExplorePredictions }) {
  const heroData = content || {
    badge: 'AI-POWERED AGRICULTURE',
    heading: 'Grow Smarter. Farm Better. Shape the Future.',
    description:
      'Transform agricultural decisions with intelligent crop predictions, real-world land insights, and climate-aware recommendations.',
    primaryCta: 'Explore Predictions',
    secondaryCta: 'Discover More',
    supportingLine: 'Data-driven insights for sustainable agriculture.',
    heroImage: {
      url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80',
      alt: 'Aerial view of expansive lush green farmland and agricultural fields bathed in sunlight',
    },
  };

  const scrollToLand = (e) => {
    e.preventDefault();
    const element = document.getElementById('explore-land');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Subtle background ambient gradient */}
      <div className="absolute inset-0 pointer-events-none -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(234,242,233,0.7),rgba(248,250,247,0))]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: SaaS Value Proposition */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            {/* Small Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF2E9] border border-emerald-900/10 text-xs font-semibold tracking-wider text-[#245B3C] uppercase mb-6 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#245B3C] animate-pulse" />
              {heroData.badge}
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#173D2A] tracking-tight leading-[1.12] mb-6 font-['Plus_Jakarta_Sans']">
              Grow Smarter.{' '}
              <span className="text-[#245B3C] block sm:inline">Farm Better.</span>{' '}
              <span className="text-[#173D2A] block">Shape the Future.</span>
            </h1>

            {/* Short Description */}
            <p className="text-lg sm:text-xl text-[#202820]/80 leading-relaxed mb-8 max-w-xl font-normal">
              {heroData.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto mb-6">
              <button
                onClick={onExplorePredictions}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#245B3C] hover:bg-[#173D2A] text-white text-base font-semibold tracking-wide shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 cursor-pointer"
              >
                <span>{heroData.primaryCta}</span>
                <ArrowRightIcon className="w-4 h-4" />
              </button>

              <a
                href="#explore-land"
                onClick={scrollToLand}
                className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-white hover:bg-emerald-50/50 text-[#173D2A] border border-emerald-900/15 text-base font-semibold transition-all duration-200 shadow-2xs hover:border-emerald-900/30 cursor-pointer"
              >
                {heroData.secondaryCta}
              </a>
            </div>

            {/* Supporting line */}
            <p className="text-xs sm:text-sm font-medium text-[#202820]/60 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#245B3C]/50" />
              {heroData.supportingLine}
            </p>
          </div>

          {/* Right Column: Real-life Agricultural Photography */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-2xl lg:max-w-none">
              {/* Subtle aesthetic backdrop border glow */}
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-[#245B3C]/20 via-[#EAF2E9]/40 to-transparent rounded-[2rem] blur-xs -z-10" />

              <div className="overflow-hidden rounded-3xl shadow-[0_20px_50px_rgba(23,61,42,0.12)] border border-white/60 bg-white">
                <img
                  src={heroData.heroImage?.url || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80'}
                  alt={heroData.heroImage?.alt || 'Real agricultural landscape'}
                  className="w-full h-[380px] sm:h-[460px] lg:h-[500px] object-cover object-center transform hover:scale-102 transition-transform duration-700 ease-out"
                  loading="eager"
                />

                {/* Subtle overlay badge for real-world photo authenticity */}
                <div className="absolute bottom-4 left-4 right-4 sm:right-auto bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-xs border border-white/80 flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping" />
                  <span className="text-xs font-semibold text-[#173D2A]">
                    Global Agro-Climatology & Soil Coverage
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

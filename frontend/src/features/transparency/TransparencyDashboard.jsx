import React, { useState } from 'react';
import PageContainer from '../../components/common/PageContainer';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import ProvenanceSection from './ProvenanceSection';
import ScoringModelExplainer from './ScoringModelExplainer';

/**
 * Clean, Simple & Attractive Scientific Transparency Dashboard
 * Explains AgriShift's data sources, scoring model, and rotation science
 * in simple, plain English without academic clutter.
 */
export default function TransparencyDashboard({ onNavigate }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [showAdvancedDocs, setShowAdvancedDocs] = useState(false);

  const faqs = [
    {
      q: 'Where does the agricultural data come from?',
      a: 'We use verified datasets from the United Nations FAO/IIASA (GAEZ v5) for attainable crop yields and NASA POWER for 30 years of satellite-measured rainfall, temperature, and solar radiation.',
    },
    {
      q: 'How does AgriShift score each crop?',
      a: 'Every crop receives a simple Fit Score out of 100 based on three balanced pillars: Expected Harvest Yield (50%), Climate & Water Safety (35%), and Soil Regeneration Benefits (15%).',
    },
    {
      q: 'Is there any commercial bias or sponsored seeds?',
      a: 'None. AgriShift is an open-science initiative created for the NASA Space Apps Challenge 2026. Recommendations are purely mathematical and agronomic—free from seed company or fertilizer sponsorships.',
    },
    {
      q: 'Should I still check my local soil and canal schedule?',
      a: 'Yes! AgriShift provides regional macro-benchmarks. We always recommend confirming local field soil pH and seasonal canal rotational rosters before final seed purchase.',
    },
  ];

  return (
    <PageContainer size="lg" className="pt-28 sm:pt-32 pb-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 mb-3">
          <Badge variant="success">OPEN SCIENCE &amp; INTEGRITY</Badge>
          <span className="text-xs text-[#202820]/60 font-medium">NASA Space Apps Challenge 2026</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#173D2A] tracking-tight mb-3 font-['Plus_Jakarta_Sans']">
          How AgriShift Works &amp; Why You Can Trust It
        </h1>
        <p className="text-sm sm:text-base text-[#202820]/75 leading-relaxed">
          Open-science methodologies and verified planetary datasets. Built to give farmers clear, trustworthy crop rotation insights.
        </p>
      </div>

      {/* 3 Core Trust Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card hoverable className="border border-emerald-900/10 p-6 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#245B3C] flex items-center justify-center text-2xl mb-4 border border-emerald-900/10">
              🛰️
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#245B3C] block mb-1">
              Data Source 01
            </span>
            <h3 className="text-lg font-bold text-[#173D2A] mb-2 font-['Plus_Jakarta_Sans']">
              NASA Satellite Climatology
            </h3>
            <p className="text-xs sm:text-sm text-[#202820]/70 leading-relaxed mb-4">
              Over 30 years of continuous Earth observations from NASA POWER agroclimatology satellites tracking rainfall, thermal degree days, solar radiation, and humidity patterns.
            </p>
          </div>
          <div className="pt-3 border-t border-emerald-900/5 text-[11px] font-semibold text-[#173D2A]/80 flex items-center gap-1.5">
            <span className="text-emerald-600 font-bold">✓</span>
            <span>NASA POWER AG Community API</span>
          </div>
        </Card>

        <Card hoverable className="border border-emerald-900/10 p-6 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center text-2xl mb-4 border border-amber-900/10">
              🌾
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800 block mb-1">
              Data Source 02
            </span>
            <h3 className="text-lg font-bold text-[#173D2A] mb-2 font-['Plus_Jakarta_Sans']">
              FAO / IIASA Yield Science
            </h3>
            <p className="text-xs sm:text-sm text-[#202820]/70 leading-relaxed mb-4">
              National attainable yield benchmarks from FAO GAEZ v5 calibrated across 180+ sovereign nations, distinguishing between commercial high-input and traditional rainfed farmlands.
            </p>
          </div>
          <div className="pt-3 border-t border-emerald-900/5 text-[11px] font-semibold text-[#173D2A]/80 flex items-center gap-1.5">
            <span className="text-amber-600 font-bold">✓</span>
            <span>GAEZ v5 Agro-Ecological Zones</span>
          </div>
        </Card>

        <Card hoverable className="border border-emerald-900/10 p-6 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-800 flex items-center justify-center text-2xl mb-4 border border-sky-900/10">
              ⚖️
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-sky-800 block mb-1">
              Scoring Integrity
            </span>
            <h3 className="text-lg font-bold text-[#173D2A] mb-2 font-['Plus_Jakarta_Sans']">
              100% Unbiased Algorithm
            </h3>
            <p className="text-xs sm:text-sm text-[#202820]/70 leading-relaxed mb-4">
              Scored strictly by mathematical suitability: 50% yield potential, 35% climate safety, and 15% soil regeneration. Zero commercial sponsorships or brand partnerships.
            </p>
          </div>
          <div className="pt-3 border-t border-emerald-900/5 text-[11px] font-semibold text-[#173D2A]/80 flex items-center gap-1.5">
            <span className="text-sky-600 font-bold">✓</span>
            <span>Zero Sponsor or Vendor Bias</span>
          </div>
        </Card>
      </div>

      {/* Why Crop Rotation Works (Visual 3-Step Benefit Bar) */}
      <Card className="border border-emerald-900/10 bg-gradient-to-br from-[#F8FAF7] to-white p-6 sm:p-8">
        <div className="max-w-2xl mb-6">
          <span className="text-xs uppercase font-extrabold text-[#245B3C] tracking-wider block mb-1">
            Agronomic Foundation
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#173D2A] font-['Plus_Jakarta_Sans']">
            Why Intelligent Crop Rotation Matters
          </h2>
          <p className="text-xs sm:text-sm text-[#202820]/70 mt-1">
            Planting the same monoculture crop repeatedly exhausts soil nutrients and invites pests. AgriShift prioritizes rotations that replenish the soil naturally:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-emerald-900/10 shadow-2xs">
            <span className="text-xl mb-2 block">🌱</span>
            <h4 className="text-sm font-bold text-[#173D2A] mb-1">Natural Nitrogen Replenishment</h4>
            <p className="text-xs text-[#202820]/65 leading-relaxed">
              Legumes (soybean, pulses) capture atmospheric nitrogen, fixing it into the root zone and reducing synthetic fertilizer expenses for subsequent crops.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-emerald-900/10 shadow-2xs">
            <span className="text-xl mb-2 block">🛡️</span>
            <h4 className="text-sm font-bold text-[#173D2A] mb-1">Disrupting Soil Pests &amp; Weeds</h4>
            <p className="text-xs text-[#202820]/65 leading-relaxed">
              Switching crop botanical families disrupts host cycles for nematodes, stem borers, and persistent weeds, naturally lowering pesticide requirements.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-emerald-900/10 shadow-2xs">
            <span className="text-xl mb-2 block">💧</span>
            <h4 className="text-sm font-bold text-[#173D2A] mb-1">Root Depth &amp; Moisture Resilience</h4>
            <p className="text-xs text-[#202820]/65 leading-relaxed">
              Alternating deep taproots (sorghum, cotton) with shallow fibrous roots (wheat, rice) breaks soil hardpan layers and optimizes underground moisture uptake.
            </p>
          </div>
        </div>
      </Card>

      {/* Simple Interactive FAQ Accordion */}
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-[#173D2A] font-['Plus_Jakarta_Sans']">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-[#202820]/70 mt-0.5">
            Quick, honest answers about our data and models.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-emerald-900/10 bg-white overflow-hidden shadow-2xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[#173D2A] hover:bg-emerald-50/40 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <span className={`text-base text-[#245B3C] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                    ▾
                  </span>
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-[#202820]/75 leading-relaxed border-t border-emerald-900/5 bg-[#F8FAF7]/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Optional Advanced Technical & Dataset Exploration */}
      <div className="max-w-3xl mx-auto pt-4 text-center">
        <button
          type="button"
          onClick={() => setShowAdvancedDocs((prev) => !prev)}
          className="text-xs font-bold text-[#245B3C] hover:text-[#173D2A] underline underline-offset-4 cursor-pointer"
        >
          {showAdvancedDocs ? '▲ Hide Advanced Technical & Mathematical Formulas' : '▼ View Advanced Mathematical Formulas & Dataset Provenance'}
        </button>

        {showAdvancedDocs && (
          <div className="mt-8 space-y-8 text-left animate-in fade-in duration-300">
            <ProvenanceSection />
            <ScoringModelExplainer />
          </div>
        )}
      </div>

      {/* Footer Navigation CTA */}
      <div className="pt-8 border-t border-emerald-900/10 flex flex-wrap items-center justify-center gap-4">
        <Button variant="outline" size="lg" onClick={() => onNavigate && onNavigate('home')}>
          &larr; Return to Home
        </Button>
        <Button variant="primary" size="lg" onClick={() => onNavigate && onNavigate('assessment')}>
          Start Farmer Assessment &rarr;
        </Button>
      </div>
    </PageContainer>
  );
}

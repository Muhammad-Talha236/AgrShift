import React from 'react';
import { LeafIcon, ArrowRightIcon } from '../components/common/Icons';

export default function PredictionPlaceholderPage({ onBackToHome }) {
  return (
    <div className="min-h-screen bg-[#F8FAF7] flex flex-col justify-between font-sans">
      {/* Header */}
      <header className="py-6 px-6 max-w-7xl mx-auto w-full flex items-center justify-between">
        <div
          onClick={onBackToHome}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-[#245B3C] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <LeafIcon className="w-5 h-5 text-[#EAF2E9]" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#173D2A] font-['Plus_Jakarta_Sans']">
            AgriShift
          </span>
        </div>

        <button
          onClick={onBackToHome}
          className="px-4 py-2 rounded-xl text-sm font-semibold text-[#245B3C] hover:bg-emerald-50 transition-colors"
        >
          &larr; Back to Home
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-16 text-center">
        <div className="w-16 h-16 rounded-3xl bg-[#EAF2E9] text-[#245B3C] flex items-center justify-center mx-auto mb-6 shadow-xs">
          <LeafIcon className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF2E9] text-xs font-semibold tracking-wider text-[#245B3C] uppercase mb-4">
          Prediction Engine Ready
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#173D2A] mb-4 font-['Plus_Jakarta_Sans']">
          AI-Powered Crop Prediction & Rotation
        </h1>

        <p className="text-base sm:text-lg text-[#202820]/75 leading-relaxed mb-8 max-w-xl mx-auto">
          The AgriShift recommendation engine is fully initialized on the backend, connecting FAO/IIASA GAEZ v5 national attainable yields with NASA POWER climatological indicators.
        </p>

        {/* Integration Readiness Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-900/10 shadow-sm text-left max-w-lg mx-auto mb-8">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#245B3C] mb-4">
            Engine Capabilities
          </h3>
          <ul className="space-y-3 text-sm text-[#202820]/80">
            <li className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
              <span>Multi-criteria hybrid scoring (50% Attainable Yield, 35% Climate Bounds, 15% Rotation Diversity).</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
              <span>Three independent pathways: Economic Return, Soil Restoration, Water Resilience.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
              <span>188 sovereign nations & 8 verified core rotational crops.</span>
            </li>
          </ul>
        </div>

        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#245B3C] hover:bg-[#173D2A] text-white text-sm font-semibold transition-all active:scale-95 shadow-sm"
        >
          <span>Return to Landing Page</span>
          <ArrowRightIcon className="w-4 h-4" />
        </button>
      </main>

      {/* Minimal Footer */}
      <footer className="py-6 text-center text-xs text-[#202820]/50 border-t border-emerald-900/5">
        AgriShift &copy; 2026. NASA Space Apps Challenge.
      </footer>
    </div>
  );
}

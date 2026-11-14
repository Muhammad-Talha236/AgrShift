import React from 'react';
import { ArrowRightIcon } from '../common/Icons';

export default function CtaSection({ onStartPrediction }) {
  return (
    <section className="py-20 md:py-28 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[2.5rem] bg-[#173D2A] text-white overflow-hidden shadow-2xl p-10 sm:p-14 md:p-20 text-center">
          {/* Subtle real-world agricultural image backdrop with dark overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-15 mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80')`,
            }}
          />

          {/* Ambient gradient glow */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#245B3C]/50 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
            <span className="inline-block px-3.5 py-1.5 rounded-full bg-white/10 text-xs font-semibold tracking-wider text-[#EAF2E9] uppercase mb-6 backdrop-blur-xs">
              Actionable Intelligence
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-6 font-['Plus_Jakarta_Sans'] leading-tight">
              Ready to Make Smarter Farming Decisions?
            </h2>

            <p className="text-base sm:text-lg text-emerald-100/80 mb-10 max-w-2xl leading-relaxed">
              Explore climate-smart crop suitability and sustainable rotation pathways tailored to your sovereign territory and water regime.
            </p>

            <button
              onClick={onStartPrediction}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-white hover:bg-[#EAF2E9] text-[#173D2A] text-base font-bold tracking-wide shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <span>Start Your Prediction</span>
              <ArrowRightIcon className="w-5 h-5 text-[#173D2A]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

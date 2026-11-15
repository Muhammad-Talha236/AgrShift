import React from 'react';
import { MapPinIcon, CpuIcon, SproutIcon } from '../common/Icons';

export default function HowItWorksSection({ data }) {
  const steps = [
    {
      number: '01',
      title: 'Explore Your Land',
      description: 'Understand geographical and environmental conditions.',
      icon: <MapPinIcon className="w-6 h-6 text-[#245B3C]" />,
    },
    {
      number: '02',
      title: 'AI-Powered Analysis',
      description: 'Analyze agricultural information through machine learning.',
      icon: <CpuIcon className="w-6 h-6 text-[#245B3C]" />,
    },
    {
      number: '03',
      title: 'Get Crop Recommendations',
      description: 'Discover suitable agricultural opportunities.',
      icon: <SproutIcon className="w-6 h-6 text-[#245B3C]" />,
    },
  ];

  return (
    <section id="about" className="py-20 md:py-28 bg-[#F8FAF7] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF2E9] text-xs font-semibold tracking-wider text-[#245B3C] uppercase mb-4">
            Workflow Overview
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#173D2A] tracking-tight mb-4 font-['Plus_Jakarta_Sans']">
            {data?.heading || 'From Farm Data to Smarter Decisions'}
          </h2>
          <p className="text-base sm:text-lg text-[#202820]/75 leading-relaxed">
            {data?.subheading ||
              'A streamlined approach connecting space-borne Earth observations with farm-gate agricultural decisions.'}
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => (
            <div
              key={step.title}
              className="bg-white rounded-3xl p-8 border border-emerald-900/10 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between relative group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#EAF2E9] flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                    {step.icon}
                  </div>
                  <span className="text-3xl font-extrabold text-[#245B3C]/20 font-['Plus_Jakarta_Sans']">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#173D2A] mb-3 font-['Plus_Jakarta_Sans']">
                  {step.title}
                </h3>

                <p className="text-base text-[#202820]/75 leading-relaxed font-normal">
                  {step.description}
                </p>
              </div>

              {/* Connecting subtle line on desktop */}
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10 text-emerald-900/20">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

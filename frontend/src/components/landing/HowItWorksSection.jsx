import React from 'react';
import { MapPinIcon, CpuIcon, SproutIcon } from '../common/Icons';

export default function HowItWorksSection({ data }) {
  const steps = [
    {
      number: '01',
      title: 'Explore Your Land',
      description: 'Understand geographical and environmental conditions across your farmland.',
      icon: <MapPinIcon className="w-5 h-5 text-[#245B3C]" />,
    },
    {
      number: '02',
      title: 'AI-Powered Analysis',
      description: 'Analyze agricultural information through machine learning models.',
      icon: <CpuIcon className="w-5 h-5 text-[#245B3C]" />,
    },
    {
      number: '03',
      title: 'Get Crop Recommendations',
      description: 'Discover suitable agricultural opportunities tailored to your location.',
      icon: <SproutIcon className="w-5 h-5 text-[#245B3C]" />,
    },
  ];

  return (
    <section id="about" className="py-16 sm:py-20 md:py-24 bg-[#F8FAF7] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF2E9] text-xs font-semibold tracking-wider text-[#245B3C] uppercase mb-3 shadow-2xs">
            Workflow Overview
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#173D2A] tracking-tight mb-3 font-['Plus_Jakarta_Sans']">
            {data?.heading || 'From Farm Data to Smarter Decisions'}
          </h2>
          <p className="text-sm sm:text-base text-[#202820]/75 leading-relaxed">
            {data?.subheading ||
              'A streamlined approach connecting space-borne Earth observations with farm-gate agricultural decisions.'}
          </p>
        </div>

        {/* Clean, Minimalist 3-Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-white rounded-2xl p-6 sm:p-7 border border-emerald-900/10 shadow-xs hover:shadow-md hover:border-[#245B3C]/25 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Top Row: Minimal Icon + Step Number */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-xl bg-[#EAF2E9] flex items-center justify-center">
                    {step.icon}
                  </div>
                  <span className="text-sm font-bold text-[#202820]/30 font-mono">
                    {step.number}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-[#173D2A] mb-2 font-['Plus_Jakarta_Sans']">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-[#202820]/70 leading-relaxed font-normal">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

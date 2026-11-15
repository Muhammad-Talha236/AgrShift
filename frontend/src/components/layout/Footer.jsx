import React from 'react';
import { LeafIcon } from '../common/Icons';

export default function Footer({ onNavigate }) {
  const links = [
    { label: 'Home', href: '#home' },
    { label: 'Explore Land', href: '#explore-land' },
    { label: 'Crop Insights', href: '#crop-insights' },
    { label: 'About', href: '#about' },
  ];

  return (
    <footer className="bg-[#173D2A] text-white border-t border-emerald-950/40 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start justify-between">
          {/* Brand Info */}
          <div className="md:col-span-6 lg:col-span-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#245B3C] text-white flex items-center justify-center">
                <LeafIcon className="w-5 h-5 text-[#EAF2E9]" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-['Plus_Jakarta_Sans']">
                AgriShift
              </span>
            </div>

            <p className="text-sm text-emerald-100/70 leading-relaxed max-w-sm mb-6">
              Global Agricultural Intelligence & Explainable Crop Rotation platform powered by NASA Earth observations and FAO/IIASA agro-ecological modeling.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              NASA Space Apps Challenge 2026
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-6 lg:col-span-7 flex flex-wrap md:justify-end gap-10">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-4">
                Navigation
              </div>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={() => onNavigate && onNavigate('home')}
                      className="text-sm text-emerald-100/80 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 mt-12 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-100/60">
          <div>
            &copy; 2026 AgriShift. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>Built for sustainable agriculture worldwide.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

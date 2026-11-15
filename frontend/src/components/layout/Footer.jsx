import React from 'react';
import { LeafIcon } from '../common/Icons';

export default function Footer({ onNavigate, activePage = 'home' }) {
  const links = [
    { label: 'Home', href: '#home', route: 'home' },
    { label: 'Assessment', href: '#assessment', route: 'assessment' },
    { label: 'Recommendations', href: '#recommendation', route: 'recommendation' },
    { label: 'Transparency', href: '#transparency', route: 'transparency' },
  ];

  const handleLinkClick = (e, link) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(link.route);
    } else {
      window.location.hash = '#' + link.route;
    }
  };

  return (
    <footer className="bg-[#173D2A] text-white py-10 sm:py-12 border-t border-emerald-950/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Content Row: Brand & Horizontal Nav */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 sm:gap-8">
          {/* Brand Info */}
          <div>
            <div
              onClick={(e) => handleLinkClick(e, { route: 'home' })}
              className="flex items-center gap-2.5 mb-2 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-xl bg-[#245B3C] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <LeafIcon className="w-4 h-4 text-[#EAF2E9]" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-['Plus_Jakarta_Sans']">
                AgriShift
              </span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-100/70 max-w-md font-normal leading-relaxed">
              Intelligent crop rotation and climate-aware land insights powered by NASA Earth observations and FAO/IIASA modeling.
            </p>
          </div>

          {/* Clean Horizontal Links */}
          <nav className="flex flex-wrap items-center gap-6 sm:gap-8">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link)}
                className={`text-xs sm:text-sm font-medium transition-colors duration-150 cursor-pointer ${
                  activePage === link.route ? 'text-emerald-300 font-bold' : 'text-emerald-100/75 hover:text-white'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Bottom Hairline Bar */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-emerald-100/60 font-normal">
          <div>
            &copy; 2026 AgriShift. NASA Space Apps Challenge 2026.
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Data-driven insights for sustainable agriculture.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

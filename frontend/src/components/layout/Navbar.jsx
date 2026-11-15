import React, { useState, useEffect } from 'react';
import { LeafIcon, MenuIcon, CloseIcon } from '../common/Icons';

export default function Navbar({ onNavigate, activePage = 'home' }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
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
    setMobileMenuOpen(false);
  };

  const handleGetStarted = () => {
    if (onNavigate) {
      onNavigate('assessment');
    } else {
      window.location.hash = '#assessment';
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-3 px-4 sm:px-6 lg:px-8">
      <div
        className={`max-w-7xl mx-auto rounded-2xl transition-all duration-300 px-5 sm:px-6 py-3.5 flex items-center justify-between ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border border-emerald-900/10'
            : 'bg-white/85 backdrop-blur-sm shadow-[0_4px_20px_-4px_rgba(23,61,42,0.06)] border border-emerald-900/5'
        }`}
      >
        {/* Left: Brand Logo & Title */}
        <a
          href="#home"
          onClick={(e) => handleLinkClick(e, { route: 'home' })}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-[#245B3C] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform duration-200">
            <LeafIcon className="w-5 h-5 text-[#EAF2E9]" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-[#173D2A] font-['Plus_Jakarta_Sans']">
              AgriShift
            </span>
          </div>
        </a>

        {/* Center: Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => {
            const isActive = activePage === link.route;
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link)}
                className={`relative text-xs sm:text-sm font-semibold transition-colors duration-200 py-1 cursor-pointer ${
                  isActive
                    ? 'text-[#245B3C]'
                    : 'text-[#202820]/75 hover:text-[#245B3C]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#245B3C] rounded-full" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Right: Get Started CTA (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={handleGetStarted}
            className="px-5 py-2.5 rounded-xl bg-[#245B3C] hover:bg-[#173D2A] text-white text-xs sm:text-sm font-semibold tracking-wide shadow-xs hover:shadow-md transition-all duration-200 active:scale-95 cursor-pointer"
          >
            Get Started
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#173D2A] hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <CloseIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 max-w-7xl mx-auto bg-white/98 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-emerald-900/10 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const isActive = activePage === link.route;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link)}
                  className={`text-sm font-semibold py-2.5 px-3 rounded-xl transition-colors cursor-pointer flex items-center justify-between ${
                    isActive
                      ? 'bg-emerald-50 text-[#245B3C]'
                      : 'text-[#202820]/80 hover:bg-emerald-50/50 hover:text-[#245B3C]'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#245B3C]" />}
                </a>
              );
            })}
          </nav>
          <div className="pt-2 border-t border-emerald-900/10">
            <button
              onClick={handleGetStarted}
              className="w-full py-3 rounded-xl bg-[#245B3C] text-white text-center text-xs sm:text-sm font-semibold tracking-wide shadow-xs hover:bg-[#173D2A] transition-colors cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

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
    { label: 'Home', href: '#home', page: 'home' },
    { label: 'Explore Land', href: '#explore-land', page: 'home' },
    { label: 'Crop Insights', href: '#crop-insights', page: 'home' },
    { label: 'About', href: '#about', page: 'home' },
  ];

  const handleLinkClick = (e, item) => {
    if (onNavigate && activePage !== 'home') {
      onNavigate('home');
    }
    setMobileMenuOpen(false);
  };

  const handleGetStarted = () => {
    if (onNavigate) {
      onNavigate('prediction');
    } else {
      window.location.hash = '#prediction';
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-3 px-4 sm:px-6 lg:px-8">
      <div
        className={`max-w-7xl mx-auto rounded-2xl transition-all duration-300 px-5 sm:px-6 py-3.5 flex items-center justify-between ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-md shadow-sm border border-emerald-900/5'
            : 'bg-white/80 backdrop-blur-sm shadow-[0_4px_20px_-4px_rgba(23,61,42,0.06)] border border-emerald-900/5'
        }`}
      >
        {/* Left: Brand Logo & Title */}
        <a
          href="#home"
          onClick={(e) => handleLinkClick(e, { page: 'home' })}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-[#245B3C] text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200">
            <LeafIcon className="w-5 h-5 text-[#EAF2E9]" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-[#173D2A] font-['Plus_Jakarta_Sans']">
              AgriShift
            </span>
          </div>
        </a>

        {/* Center: Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link)}
              className="text-sm font-medium text-[#202820]/80 hover:text-[#245B3C] transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right: Get Started CTA (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={handleGetStarted}
            className="px-5 py-2.5 rounded-xl bg-[#245B3C] hover:bg-[#173D2A] text-white text-sm font-semibold tracking-wide shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 cursor-pointer"
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
        <div className="md:hidden mt-2 max-w-7xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-emerald-900/10 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link)}
                className="text-base font-medium text-[#202820] hover:text-[#245B3C] py-2 px-3 rounded-lg hover:bg-emerald-50/50 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-2 border-t border-emerald-900/10">
            <button
              onClick={handleGetStarted}
              className="w-full py-3 rounded-xl bg-[#245B3C] text-white text-center text-sm font-semibold tracking-wide shadow-sm hover:bg-[#173D2A] transition-colors cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

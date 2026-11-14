import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

/**
 * Shared AppLayout Component
 * Developed by Talha (Frontend Foundation)
 * Wraps all application routes with consistent Navbar, main content viewport, and Footer.
 *
 * @param {React.ReactNode} children - Dynamic page view content
 * @param {string} [activePage='home'] - Current active route identifier ('home' | 'assessment' | 'recommendation' | 'transparency')
 * @param {Function} [onNavigate] - Navigation handler callback
 */
export default function AppLayout({ children, activePage = 'home', onNavigate }) {
  return (
    <div className="min-h-screen bg-[#F8FAF7] text-[#202820] font-sans flex flex-col selection:bg-[#EAF2E9] selection:text-[#173D2A]">
      {/* Universal Floating Navbar */}
      <Navbar activePage={activePage} onNavigate={onNavigate} />

      {/* Main Page Content Area */}
      <main className="flex-1 w-full">
        {children}
      </main>

      {/* Universal Clean SaaS Footer */}
      <Footer activePage={activePage} onNavigate={onNavigate} />
    </div>
  );
}

import React from 'react';

/**
 * Shared Card Container Component
 * Developed by Talha (Frontend Foundation)
 */
export default function Card({ children, className = '', hoverable = false, ...props }) {
  return (
    <div
      className={`bg-white rounded-3xl border border-emerald-900/10 shadow-xs p-6 sm:p-8 transition-all duration-300 ${
        hoverable ? 'hover:shadow-lg hover:-translate-y-1' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

import React from 'react';

/**
 * Shared Status Badge Component
 * Developed by Talha (Frontend Foundation)
 */
export default function Badge({ children, variant = 'success', className = '' }) {
  const variants = {
    success: 'bg-[#EAF2E9] text-[#245B3C] border-emerald-900/10',
    info: 'bg-sky-50 text-sky-800 border-sky-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    danger: 'bg-rose-50 text-rose-800 border-rose-200',
    neutral: 'bg-gray-100 text-gray-700 border-gray-200',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border shadow-2xs ${
        variants[variant] || variants.success
      } ${className}`}
    >
      {children}
    </span>
  );
}

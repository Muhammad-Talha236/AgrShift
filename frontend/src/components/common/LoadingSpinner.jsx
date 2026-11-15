import React from 'react';

/**
 * Shared Loading Spinner Component
 */
export default function LoadingSpinner({ message = 'Loading...', size = 'md' }) {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3">
      <div
        className={`${sizes[size] || sizes.md} border-[#245B3C] border-t-transparent rounded-full animate-spin`}
      />
      {message && <p className="text-xs font-semibold text-[#173D2A] uppercase tracking-wider">{message}</p>}
    </div>
  );
}

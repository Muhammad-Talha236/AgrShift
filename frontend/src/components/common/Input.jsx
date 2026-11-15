import React from 'react';

/**
 * Shared Input Field Component
 */
export default function Input({
  label,
  error,
  helperText,
  className = '',
  id,
  required = false,
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="text-xs font-bold text-[#173D2A] uppercase tracking-wider">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full px-4 py-2.5 bg-white text-sm text-[#202820] placeholder-[#202820]/40 rounded-xl border ${
          error ? 'border-red-500 focus:ring-red-300' : 'border-emerald-900/15 focus:ring-[#245B3C]/30 focus:border-[#245B3C]'
        } focus:outline-none focus:ring-2 transition-all ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-600 font-medium">{error}</span>}
      {helperText && !error && <span className="text-xs text-[#202820]/60">{helperText}</span>}
    </div>
  );
}

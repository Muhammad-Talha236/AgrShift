import React from 'react';

/**
 * Shared Select Dropdown Component
 */
export default function Select({
  label,
  options = [],
  value,
  onChange,
  error,
  helperText,
  placeholder = 'Select an option',
  className = '',
  id,
  required = false,
  ...props
}) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={selectId} className="text-xs font-bold text-[#173D2A] uppercase tracking-wider">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={onChange}
          className={`w-full appearance-none px-4 py-2.5 bg-white text-sm text-[#202820] rounded-xl border ${
            error ? 'border-red-500 focus:ring-red-300' : 'border-emerald-900/15 focus:ring-[#245B3C]/30 focus:border-[#245B3C]'
          } focus:outline-none focus:ring-2 transition-all pr-10 ${className}`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#245B3C]">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && <span className="text-xs text-red-600 font-medium">{error}</span>}
      {helperText && !error && <span className="text-xs text-[#202820]/60">{helperText}</span>}
    </div>
  );
}

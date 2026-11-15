import React from 'react';

/**
 * Shared Button Component
 */
export default function Button({
  children,
  variant = 'primary', // primary | secondary | outline | ghost
  size = 'md',        // sm | md | lg
  disabled = false,
  loading = false,
  onClick,
  className = '',
  type = 'button',
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none';

  const variants = {
    primary: 'bg-[#245B3C] hover:bg-[#173D2A] text-white shadow-xs hover:shadow-md',
    secondary: 'bg-[#EAF2E9] hover:bg-emerald-100 text-[#245B3C]',
    outline: 'border border-emerald-900/20 text-[#173D2A] hover:bg-emerald-50/50 bg-white',
    ghost: 'text-[#245B3C] hover:bg-emerald-50/60',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-7 py-3.5 gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
      )}
      {children}
    </button>
  );
}

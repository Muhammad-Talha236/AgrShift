import React from 'react';

/**
 * Shared PageContainer Component
 * Developed by Talha (Frontend Foundation)
 * Provides consistent maximum-width centering, responsive padding, and vertical spacing across all pages.
 *
 * @param {React.ReactNode} children - Page content to render
 * @param {'sm' | 'md' | 'lg' | 'xl' | 'full'} [size='lg'] - Width constraint
 * @param {string} [className] - Additional custom utility classes
 */
export default function PageContainer({
  children,
  size = 'lg',
  className = '',
  ...props
}) {
  const maxSizes = {
    sm: 'max-w-3xl', // Form wizards / single column forms
    md: 'max-w-5xl', // Standard content / article / documentation
    lg: 'max-w-7xl', // Dashboard views / multi-column grids (default)
    xl: 'max-w-[1400px]', // High-density comparison tables
    full: 'max-w-full',
  };

  const maxWidthClass = maxSizes[size] || maxSizes.lg;

  return (
    <div
      className={`w-full ${maxWidthClass} mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

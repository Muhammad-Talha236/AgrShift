import React from 'react';
import Button from './Button';

/**
 * Shared EmptyState Component
 * Used when no data is returned (e.g. NO_ELIGIBLE_CROPS in Iceland, empty search results, or uninitiated assessment).
 *
 * @param {string} title - Main heading for the empty state
 * @param {string} [description] - Explanatory message or guidance
 * @param {React.ReactNode} [icon] - Custom icon or illustration node
 * @param {string} [actionLabel] - Label for primary recovery action button
 * @param {Function} [onAction] - Callback fired when primary button is clicked
 * @param {React.ReactNode} [action] - Custom action node (e.g. multiple buttons or links)
 * @param {string} [className] - Additional styling classes
 */
export default function EmptyState({
  title = 'No Data Available',
  description = 'No records matched your selection or criteria.',
  icon,
  actionLabel,
  onAction,
  action,
  className = '',
  ...props
}) {
  const defaultIcon = (
    <svg className="w-8 h-8 text-[#245B3C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
      />
    </svg>
  );

  return (
    <div
      className={`bg-white rounded-3xl border border-emerald-900/10 shadow-xs p-8 sm:p-12 text-center max-w-xl mx-auto flex flex-col items-center justify-center transition-all ${className}`}
      {...props}
    >
      {/* Icon Capsule */}
      <div className="w-16 h-16 rounded-3xl bg-[#EAF2E9] text-[#245B3C] flex items-center justify-center mb-5 shadow-2xs">
        {icon || defaultIcon}
      </div>

      {/* Title */}
      <h3 className="text-xl sm:text-2xl font-bold text-[#173D2A] mb-2 font-['Plus_Jakarta_Sans']">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="text-sm sm:text-base text-[#202820]/70 leading-relaxed max-w-md mb-6 font-normal">
          {description}
        </p>
      )}

      {/* Action CTA */}
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}

      {/* Custom Action Element */}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

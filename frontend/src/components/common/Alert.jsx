import React, { useState } from 'react';

/**
 * Shared Alert Component
 * Developed by Talha (Frontend Foundation)
 * Used for form validation feedback, API errors, system notices, and scientific warnings.
 *
 * @param {'success' | 'warning' | 'error' | 'info'} variant - The alert style variant
 * @param {string} [title] - Optional alert heading
 * @param {string} [message] - Alert descriptive text (or pass via children)
 * @param {boolean} [dismissible=false] - Whether to show close button
 * @param {Function} [onDismiss] - Optional callback triggered on dismissal
 * @param {React.ReactNode} [children] - Content inside the alert
 * @param {string} [className] - Additional custom classes
 */
export default function Alert({
  variant = 'info',
  title,
  message,
  dismissible = false,
  onDismiss,
  children,
  className = '',
  ...props
}) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    if (onDismiss) onDismiss();
  };

  const variants = {
    success: {
      container: 'bg-[#EAF2E9] border-emerald-900/15 text-[#173D2A]',
      icon: (
        <svg className="w-5 h-5 text-[#245B3C] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
        </svg>
      ),
      closeBtn: 'text-[#245B3C] hover:bg-emerald-100/70',
    },
    warning: {
      container: 'bg-amber-50 border-amber-200 text-amber-950',
      icon: (
        <svg className="w-5 h-5 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      ),
      closeBtn: 'text-amber-700 hover:bg-amber-100/70',
    },
    error: {
      container: 'bg-rose-50 border-rose-200 text-rose-950',
      icon: (
        <svg className="w-5 h-5 text-rose-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      closeBtn: 'text-rose-700 hover:bg-rose-100/70',
    },
    info: {
      container: 'bg-sky-50 border-sky-200 text-sky-950',
      icon: (
        <svg className="w-5 h-5 text-sky-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      closeBtn: 'text-sky-700 hover:bg-sky-100/70',
    },
  };

  const current = variants[variant] || variants.info;

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`rounded-2xl p-4 sm:p-4.5 border shadow-2xs flex items-start justify-between gap-3.5 transition-all duration-200 ${current.container} ${className}`}
      {...props}
    >
      <div className="flex items-start gap-3 flex-1">
        <div className="mt-0.5">{current.icon}</div>
        <div className="flex-1">
          {title && (
            <h4 className="text-sm font-bold tracking-tight mb-1 font-['Plus_Jakarta_Sans']">
              {title}
            </h4>
          )}
          <div className="text-xs sm:text-sm leading-relaxed opacity-90">
            {message || children}
          </div>
        </div>
      </div>

      {dismissible && (
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss alert"
          className={`p-1 rounded-lg transition-colors cursor-pointer shrink-0 ${current.closeBtn}`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

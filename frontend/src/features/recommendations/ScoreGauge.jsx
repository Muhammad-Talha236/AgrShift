import React from 'react';

/**
 * Circular Score Gauge Component
 * Renders a circular SVG gauge for composite/sub-scores (0-100).
 */
export default function ScoreGauge({ score = 0, label = '', size = 100, strokeWidth = 8, color = '#245B3C' }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.max(0, Math.min(100, score));
  const offset = circumference - (clampedScore / 100) * circumference;
  const center = size / 2;

  // Color tiers
  const getColor = () => {
    if (color !== '#245B3C') return color;
    if (clampedScore >= 70) return '#245B3C';
    if (clampedScore >= 40) return '#D97706';
    return '#DC2626';
  };

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#EAF2E9"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={getColor()}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-[#173D2A]">{clampedScore.toFixed(1)}</span>
        </div>
      </div>
      {label && (
        <span className="text-[10px] font-semibold text-[#202820]/60 uppercase tracking-wider text-center leading-tight">
          {label}
        </span>
      )}
    </div>
  );
}

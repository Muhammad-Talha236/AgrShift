import React from 'react';

/**
 * Horizontal Score Breakdown Bar
 * Shows a labeled horizontal bar with score fill (0-100).
 */
export default function ScoreBreakdownBar({ label, score, weight, color = '#245B3C', maxScore = 100 }) {
  const percentage = Math.max(0, Math.min(100, (score / maxScore) * 100));

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[#202820]/70">{label}</span>
        <div className="flex items-center gap-2">
          {weight !== undefined && (
            <span className="text-[10px] text-[#202820]/40 font-medium">{(weight * 100).toFixed(0)}% weight</span>
          )}
          <span className="text-xs font-bold text-[#173D2A]">{score.toFixed(1)}</span>
        </div>
      </div>
      <div className="h-2 bg-[#EAF2E9] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

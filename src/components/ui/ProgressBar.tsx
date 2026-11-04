"use client";

import React from "react";

export interface ProgressBarProps {
  value: number; // Current progress value
  max?: number;  // Max progress value (default 100)
  segments?: number; // Total number of discrete square blocks (default 10)
  color?: "grass" | "sand" | "sky" | "red" | "gold";
  className?: string;
  ariaLabel?: string;
}

export function ProgressBar({
  value,
  max = 100,
  segments = 10,
  color = "grass",
  className = "",
  ariaLabel,
}: ProgressBarProps) {
  const safeSegments = Math.max(1, segments);
  const ratio = Math.max(0, Math.min(1, max > 0 ? value / max : 0));
  const filledCount = Math.round(ratio * safeSegments);

  const fillColors = {
    grass: "bg-[#6DB33F]",
    gold: "bg-[#F2C230]",
    sand: "bg-[#E8CF9C]",
    sky: "bg-[#78BDE8]",
    red: "bg-[#D1362B]",
  };

  const activeColor = fillColors[color] || fillColors.grass;

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={ariaLabel || "Progress"}
      className={`flex items-center gap-1 sm:gap-1.5 w-full ${className}`.trim()}
    >
      {Array.from({ length: safeSegments }).map((_, i) => {
        const isFilled = i < filledCount;
        return (
          <div
            key={i}
            className={`
              flex-1 h-3 sm:h-3.5
              border-2 border-[#1E1610] rounded-xs
              box-border
              ${isFilled
                ? `${activeColor} shadow-[inset_1px_1px_0px_rgba(243,227,188,0.6),inset_-1px_-1px_0px_rgba(30,22,16,0.4)]`
                : "bg-[#232634] shadow-[inset_1px_1px_0px_rgba(0,0,0,0.5)]"
              }
            `.trim()}
          />
        );
      })}
    </div>
  );
}

export default ProgressBar;

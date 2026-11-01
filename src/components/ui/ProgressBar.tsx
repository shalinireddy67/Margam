"use client";

import React from "react";

export interface ProgressBarProps {
  value: number; // Current progress value
  max?: number;  // Max progress value (default 100)
  segments?: number; // Total number of discrete square blocks (default 10)
  color?: "grass" | "sand" | "sky" | "red" | "darkgrass" | "gold" | "pixelgreen";
  className?: string;
  ariaLabel?: string;
}

export function ProgressBar({
  value,
  max = 100,
  segments = 10,
  color = "pixelgreen",
  className = "",
  ariaLabel,
}: ProgressBarProps) {
  const safeSegments = Math.max(1, segments);
  const ratio = Math.max(0, Math.min(1, max > 0 ? value / max : 0));
  const filledCount = Math.round(ratio * safeSegments);

  const fillColors = {
    pixelgreen: "bg-[#79B82A]",
    grass: "bg-[#4F8A24]",
    gold: "bg-[#E5B834]",
    sand: "bg-[#E5B834]",
    sky: "bg-[#79B82A]",
    red: "bg-[#D9453D]",
    darkgrass: "bg-[#315B2A]",
  };

  const activeColor = fillColors[color] || fillColors.pixelgreen;

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
              border-2 border-[#102610] rounded-none
              box-border
              ${isFilled ? `${activeColor} shadow-[inset_1px_1px_0px_rgba(255,255,255,0.5)]` : "bg-[#20251F]/70"}
            `.trim()}
          />
        );
      })}
    </div>
  );
}

export default ProgressBar;

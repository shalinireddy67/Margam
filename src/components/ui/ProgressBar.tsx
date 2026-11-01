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
  color = "grass",
  className = "",
  ariaLabel,
}: ProgressBarProps) {
  const safeSegments = Math.max(1, segments);
  const ratio = Math.max(0, Math.min(1, max > 0 ? value / max : 0));
  const filledCount = Math.round(ratio * safeSegments);

  const fillColors = {
    grass: "bg-[#5DAA3A]",
    pixelgreen: "bg-[#5DAA3A]",
    darkgrass: "bg-[#2F6B22]",
    gold: "bg-[#F4C542]",
    sand: "bg-[#FFE9A8]",
    sky: "bg-[#3FA7C9]",
    red: "bg-[#E04A3F]",
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
              border-2 border-[#422816] rounded-[2px]
              box-border
              ${isFilled
                ? `${activeColor} shadow-[inset_1px_1px_0px_rgba(255,255,255,0.6),inset_-1px_-1px_0px_rgba(0,0,0,0.3)]`
                : "bg-[#3F2615]/80 shadow-[inset_1px_1px_0px_rgba(0,0,0,0.5)]"
              }
            `.trim()}
          />
        );
      })}
    </div>
  );
}

export default ProgressBar;

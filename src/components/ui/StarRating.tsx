"use client";

import React from "react";

export interface StarRatingProps {
  rating: number;
  max?: number;
  size?: "sm" | "default" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "w-5 h-5",
  default: "w-7 h-7",
  lg: "w-9 h-9",
};

/**
 * Square star SVG on 16x16 grid with crispEdges
 */
function PixelStar({ filled, className }: { filled: boolean; className?: string }) {
  const fillColor = filled ? "#F2C230" : "#B9BCC0";
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      shapeRendering="crispEdges"
    >
      {/* Star fill base */}
      <rect x="6" y="2" width="4" height="3" fill={fillColor} />
      <rect x="1" y="5" width="14" height="3" fill={fillColor} />
      <rect x="4" y="8" width="8" height="3" fill={fillColor} />
      <rect x="2" y="11" width="4" height="3" fill={fillColor} />
      <rect x="10" y="11" width="4" height="3" fill={fillColor} />

      {/* Star ink outline */}
      {/* Top tip */}
      <rect x="7" y="1" width="2" height="1" fill="#1E1610" />
      <rect x="6" y="2" width="1" height="2" fill="#1E1610" />
      <rect x="9" y="2" width="1" height="2" fill="#1E1610" />

      {/* Shoulder to arm tops */}
      <rect x="1" y="4" width="5" height="1" fill="#1E1610" />
      <rect x="10" y="4" width="5" height="1" fill="#1E1610" />

      {/* Arm outer tips */}
      <rect x="0" y="5" width="1" height="3" fill="#1E1610" />
      <rect x="15" y="5" width="1" height="3" fill="#1E1610" />

      {/* Arm undercuts */}
      <rect x="1" y="8" width="3" height="1" fill="#1E1610" />
      <rect x="12" y="8" width="3" height="1" fill="#1E1610" />

      {/* Waist inner corners */}
      <rect x="3" y="9" width="1" height="2" fill="#1E1610" />
      <rect x="12" y="9" width="1" height="2" fill="#1E1610" />

      {/* Leg outers */}
      <rect x="1" y="11" width="1" height="3" fill="#1E1610" />
      <rect x="14" y="11" width="1" height="3" fill="#1E1610" />

      {/* Leg bottom feet */}
      <rect x="2" y="14" width="4" height="1" fill="#1E1610" />
      <rect x="10" y="14" width="4" height="1" fill="#1E1610" />

      {/* Crotch inner notch */}
      <rect x="5" y="11" width="1" height="3" fill="#1E1610" />
      <rect x="10" y="11" width="1" height="3" fill="#1E1610" />
      <rect x="6" y="10" width="4" height="1" fill="#1E1610" />
    </svg>
  );
}

export function StarRating({
  rating,
  max = 3,
  size = "default",
  className = "",
}: StarRatingProps) {
  const boundedRating = Math.max(0, Math.min(max, Math.round(rating)));

  return (
    <div
      role="meter"
      aria-valuenow={boundedRating}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={`Mastery rating: ${boundedRating} out of ${max} stars`}
      className={`inline-flex items-center gap-1.5 ${className}`.trim()}
    >
      {Array.from({ length: max }).map((_, i) => (
        <PixelStar
          key={i}
          filled={i < boundedRating}
          className={`${sizeClasses[size]} shrink-0`}
        />
      ))}
    </div>
  );
}

export default StarRating;

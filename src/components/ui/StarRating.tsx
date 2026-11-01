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
 * Square pixel star SVG on 16x16 grid with crispEdges
 */
function PixelStar({ filled, className }: { filled: boolean; className?: string }) {
  const fillColor = filled ? "#F2D16B" : "#FFFFFF";
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      shapeRendering="crispEdges"
    >
      {/* Pixel star fill base */}
      <rect x="6" y="2" width="4" height="3" fill={fillColor} />
      <rect x="1" y="5" width="14" height="3" fill={fillColor} />
      <rect x="4" y="8" width="8" height="3" fill={fillColor} />
      <rect x="2" y="11" width="4" height="3" fill={fillColor} />
      <rect x="10" y="11" width="4" height="3" fill={fillColor} />

      {/* Pixel star 1px ink outline */}
      {/* Top tip */}
      <rect x="7" y="1" width="2" height="1" fill="#111111" />
      <rect x="6" y="2" width="1" height="2" fill="#111111" />
      <rect x="9" y="2" width="1" height="2" fill="#111111" />

      {/* Shoulder to arm tops */}
      <rect x="1" y="4" width="5" height="1" fill="#111111" />
      <rect x="10" y="4" width="5" height="1" fill="#111111" />

      {/* Arm outer tips */}
      <rect x="0" y="5" width="1" height="3" fill="#111111" />
      <rect x="15" y="5" width="1" height="3" fill="#111111" />

      {/* Arm bottom lines */}
      <rect x="1" y="8" width="3" height="1" fill="#111111" />
      <rect x="12" y="8" width="3" height="1" fill="#111111" />

      {/* Waist indents */}
      <rect x="4" y="9" width="1" height="2" fill="#111111" />
      <rect x="11" y="9" width="1" height="2" fill="#111111" />

      {/* Outer legs */}
      <rect x="1" y="11" width="1" height="3" fill="#111111" />
      <rect x="14" y="11" width="1" height="3" fill="#111111" />

      {/* Feet bottoms */}
      <rect x="2" y="14" width="4" height="1" fill="#111111" />
      <rect x="10" y="14" width="4" height="1" fill="#111111" />

      {/* Inner legs & crotch */}
      <rect x="6" y="12" width="1" height="2" fill="#111111" />
      <rect x="9" y="12" width="1" height="2" fill="#111111" />
      <rect x="7" y="11" width="2" height="1" fill="#111111" />
    </svg>
  );
}

export function StarRating({
  rating,
  max = 3,
  size = "default",
  className = "",
}: StarRatingProps) {
  const safeRating = Math.max(0, Math.min(rating, max));

  return (
    <div
      className={`inline-flex items-center gap-1 ${className}`}
      role="img"
      aria-label={`Difficulty ${safeRating} of ${max}`}
    >
      {Array.from({ length: max }).map((_, index) => (
        <PixelStar
          key={index}
          filled={index < safeRating}
          className={sizeClasses[size]}
        />
      ))}
    </div>
  );
}

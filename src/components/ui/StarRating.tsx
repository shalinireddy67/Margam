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
 * Hand-drawn 5-pointed star SVG
 */
function HandStar({ filled, className }: { filled: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 28 28"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M14 2.5L17.4 9.5L25 10.6L19.5 16L20.8 23.5L14 20L7.2 23.5L8.5 16L3 10.6L10.6 9.5L14 2.5Z"
        fill={filled ? "#FFE14D" : "#FFFFFF"}
        stroke="#111111"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {filled && (
        <circle cx="11.5" cy="11.5" r="1" fill="#111111" />
      )}
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
        <HandStar
          key={index}
          filled={index < safeRating}
          className={sizeClasses[size]}
        />
      ))}
    </div>
  );
}

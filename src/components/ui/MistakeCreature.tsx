"use client";

import React from "react";

export type MistakeCreatureType =
  | "sign_slip"
  | "fraction_fumble"
  | "distribution_dodge"
  | "calculation_slip"
  | "general_glitch";

export interface MistakeCreatureProps {
  type: MistakeCreatureType | string;
  size?: "sm" | "default" | "lg";
  className?: string;
  alt?: string;
}

const sizeClasses = {
  sm: "w-14 h-14",
  default: "w-24 h-24",
  lg: "w-36 h-36",
};

export function MistakeCreature({
  type,
  size = "default",
  className = "",
  alt,
}: MistakeCreatureProps) {
  const containerSize = sizeClasses[size];

  switch (type) {
    case "sign_slip":
      return (
        <svg
          viewBox="0 0 100 100"
          className={`${containerSize} ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label={alt || "Sign Slip mistake creature: a cheeky pink blob juggling plus and minus signs"}
        >
          {/* Shadow */}
          <ellipse cx="50" cy="92" rx="36" ry="6" fill="#111111" />
          {/* Body */}
          <path
            d="M 22 75 C 16 55 18 32 35 20 C 50 10 70 14 80 30 C 88 44 86 66 76 80 C 64 88 34 88 22 75 Z"
            fill="#FF4F9A"
            stroke="#111111"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Uneven googly eyes */}
          <circle cx="38" cy="38" r="8" fill="#FFFFFF" stroke="#111111" strokeWidth="3" />
          <circle cx="40" cy="38" r="3.5" fill="#111111" />
          <circle cx="62" cy="40" r="10" fill="#FFFFFF" stroke="#111111" strokeWidth="3" />
          <circle cx="60" cy="42" r="4.5" fill="#111111" />
          {/* Cheeky mouth */}
          <path
            d="M 40 58 Q 50 68 62 58"
            stroke="#111111"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Horns / Hair tufts */}
          <path d="M 32 18 L 30 6 L 40 14" stroke="#111111" strokeWidth="3" fill="#FF4F9A" strokeLinejoin="round" />
          <path d="M 66 14 L 74 6 L 70 18" stroke="#111111" strokeWidth="3" fill="#FF4F9A" strokeLinejoin="round" />
          {/* Floating plus & minus signs */}
          <g transform="translate(10, 36) rotate(-12)">
            <rect x="0" y="0" width="16" height="16" rx="4" fill="#FFE14D" stroke="#111111" strokeWidth="2.5" />
            <path d="M 8 3 L 8 13 M 3 8 L 13 8" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" />
          </g>
          <g transform="translate(76, 42) rotate(15)">
            <rect x="0" y="0" width="16" height="16" rx="4" fill="#FFE14D" stroke="#111111" strokeWidth="2.5" />
            <path d="M 3 8 L 13 8" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        </svg>
      );

    case "fraction_fumble":
      return (
        <svg
          viewBox="0 0 100 100"
          className={`${containerSize} ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label={alt || "Fraction Fumble mistake creature: a split cyan creature balancing a fraction line"}
        >
          {/* Shadow */}
          <ellipse cx="50" cy="92" rx="34" ry="6" fill="#111111" />
          {/* Top Block (Numerator) */}
          <rect
            x="30"
            y="14"
            width="40"
            height="32"
            rx="8"
            fill="#4DD9E8"
            stroke="#111111"
            strokeWidth="3.5"
          />
          {/* Top Block Face */}
          <circle cx="43" cy="28" r="4" fill="#111111" />
          <circle cx="57" cy="28" r="4" fill="#111111" />
          <circle cx="50" cy="38" r="3" fill="#111111" />
          {/* Division Bar */}
          <rect
            x="14"
            y="49"
            width="72"
            height="8"
            rx="4"
            fill="#FFE14D"
            stroke="#111111"
            strokeWidth="3"
          />
          {/* Bottom Block (Denominator) */}
          <rect
            x="24"
            y="60"
            width="52"
            height="28"
            rx="8"
            fill="#4DD9E8"
            stroke="#111111"
            strokeWidth="3.5"
          />
          {/* Bottom Block Face (Dizzy eyes) */}
          <path d="M 38 70 L 46 76 M 46 70 L 38 76" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 54 70 L 62 76 M 62 70 L 54 76" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 44 82 Q 50 80 56 82" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </svg>
      );

    case "distribution_dodge":
      return (
        <svg
          viewBox="0 0 100 100"
          className={`${containerSize} ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label={alt || "Distribution Dodge mistake creature: a curious yellow blob peeking out from parentheses"}
        >
          {/* Shadow */}
          <ellipse cx="50" cy="92" rx="36" ry="6" fill="#111111" />
          {/* Body */}
          <path
            d="M 28 85 C 24 50 30 30 50 24 C 70 30 76 50 72 85 Z"
            fill="#FFE14D"
            stroke="#111111"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Eyes looking sideways */}
          <circle cx="44" cy="46" r="7" fill="#FFFFFF" stroke="#111111" strokeWidth="2.5" />
          <circle cx="46" cy="46" r="3.5" fill="#111111" />
          <circle cx="62" cy="46" r="7" fill="#FFFFFF" stroke="#111111" strokeWidth="2.5" />
          <circle cx="64" cy="46" r="3.5" fill="#111111" />
          {/* Cute tooth smirk */}
          <path d="M 46 64 Q 54 70 64 63" stroke="#111111" strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* Big Parentheses Shielding It */}
          <path
            d="M 20 20 C 8 38 8 66 20 84"
            stroke="#111111"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 80 20 C 92 38 92 66 80 84"
            stroke="#111111"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      );

    case "calculation_slip":
      return (
        <svg
          viewBox="0 0 100 100"
          className={`${containerSize} ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label={alt || "Calculation Slip mistake creature: a friendly orange monster with spiral energy"}
        >
          {/* Shadow */}
          <ellipse cx="50" cy="92" rx="32" ry="6" fill="#111111" />
          {/* Star-like bouncy body */}
          <path
            d="M 50 14 L 62 34 L 86 36 L 70 54 L 76 78 L 52 68 L 26 80 L 30 55 L 14 38 L 38 34 Z"
            fill="#FF8A3D"
            stroke="#111111"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Eyes with spiral/dizzy look */}
          <circle cx="42" cy="46" r="6" fill="#FFFFFF" stroke="#111111" strokeWidth="2.5" />
          <circle cx="42" cy="46" r="2.5" fill="#111111" />
          <circle cx="60" cy="46" r="6" fill="#FFFFFF" stroke="#111111" strokeWidth="2.5" />
          <circle cx="60" cy="46" r="2.5" fill="#111111" />
          {/* Open astonished mouth */}
          <ellipse cx="51" cy="58" rx="5" ry="4" fill="#111111" />
        </svg>
      );

    case "general_glitch":
    default:
      return (
        <svg
          viewBox="0 0 100 100"
          className={`${containerSize} ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label={alt || "Curious math helper creature"}
        >
          {/* Shadow */}
          <ellipse cx="50" cy="92" rx="34" ry="6" fill="#111111" />
          {/* Round bouncy green body */}
          <path
            d="M 24 60 C 20 34 38 18 52 18 C 72 18 82 36 78 62 C 74 86 32 86 24 60 Z"
            fill="#8DE86A"
            stroke="#111111"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Big happy eyes */}
          <circle cx="42" cy="42" r="8" fill="#FFFFFF" stroke="#111111" strokeWidth="2.5" />
          <circle cx="44" cy="42" r="4" fill="#111111" />
          <circle cx="62" cy="42" r="8" fill="#FFFFFF" stroke="#111111" strokeWidth="2.5" />
          <circle cx="64" cy="42" r="4" fill="#111111" />
          {/* Big happy smile */}
          <path d="M 40 56 Q 52 68 64 56" stroke="#111111" strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* Little spark antenna */}
          <path d="M 52 18 L 52 6" stroke="#111111" strokeWidth="3" strokeLinecap="round" />
          <circle cx="52" cy="4" r="3.5" fill="#FFE14D" stroke="#111111" strokeWidth="2" />
        </svg>
      );
  }
}

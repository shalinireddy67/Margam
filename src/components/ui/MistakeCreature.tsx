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
          viewBox="0 0 16 16"
          className={`${containerSize} ${className}`}
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label={alt || "Sign Slip mistake creature: a cheeky pink blob juggling plus and minus signs"}
          shapeRendering="crispEdges"
        >
          {/* Shadow / Base */}
          <rect x="4" y="14" width="8" height="1" fill="#111111" />

          {/* Body Outline */}
          <rect x="4" y="4" width="8" height="10" fill="#111111" />
          <rect x="3" y="5" width="10" height="8" fill="#111111" />
          <rect x="4" y="2" width="2" height="3" fill="#111111" />
          <rect x="10" y="2" width="2" height="3" fill="#111111" />

          {/* Redstone Red Body Fill */}
          <rect x="5" y="5" width="6" height="8" fill="#D9453D" />
          <rect x="4" y="6" width="8" height="6" fill="#D9453D" />
          <rect x="4" y="2" width="1" height="2" fill="#D9453D" />
          <rect x="11" y="2" width="1" height="2" fill="#D9453D" />

          {/* Googly Eyes */}
          <rect x="5" y="6" width="2" height="2" fill="#FFFFFF" />
          <rect x="6" y="7" width="1" height="1" fill="#111111" />
          <rect x="9" y="6" width="2" height="2" fill="#FFFFFF" />
          <rect x="9" y="7" width="1" height="1" fill="#111111" />

          {/* Cheeky Mouth */}
          <rect x="6" y="10" width="4" height="1" fill="#111111" />
          <rect x="9" y="9" width="1" height="1" fill="#111111" />

          {/* Juggling Plus Sign (Left) */}
          <rect x="1" y="4" width="3" height="1" fill="#111111" />
          <rect x="2" y="3" width="1" height="3" fill="#111111" />
          <rect x="1" y="4" width="3" height="1" fill="#F2D16B" />
          <rect x="2" y="3" width="1" height="3" fill="#F2D16B" />

          {/* Juggling Minus Sign (Right) */}
          <rect x="12" y="4" width="3" height="1" fill="#111111" />
          <rect x="12" y="4" width="3" height="1" fill="#F2D16B" />
        </svg>
      );

    case "fraction_fumble":
      return (
        <svg
          viewBox="0 0 16 16"
          className={`${containerSize} ${className}`}
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label={alt || "Fraction Fumble mistake creature: a split cyan creature balancing a fraction line"}
          shapeRendering="crispEdges"
        >
          {/* Top Block (Numerator) */}
          <rect x="4" y="1" width="8" height="6" fill="#111111" />
          <rect x="5" y="2" width="6" height="4" fill="#7EC8E3" />
          {/* Top Block Face */}
          <rect x="6" y="3" width="1" height="2" fill="#111111" />
          <rect x="9" y="3" width="1" height="2" fill="#111111" />
          <rect x="7" y="5" width="2" height="1" fill="#111111" />

          {/* Division Bar */}
          <rect x="1" y="7" width="14" height="3" fill="#111111" />
          <rect x="2" y="8" width="12" height="1" fill="#F2D16B" />

          {/* Bottom Block (Denominator) */}
          <rect x="3" y="10" width="10" height="5" fill="#111111" />
          <rect x="4" y="11" width="8" height="3" fill="#7EC8E3" />
          {/* Bottom Block Dizzy Cross Eyes */}
          <rect x="5" y="11" width="1" height="1" fill="#111111" />
          <rect x="6" y="12" width="1" height="1" fill="#111111" />
          <rect x="5" y="12" width="1" height="1" fill="#111111" />
          <rect x="6" y="11" width="1" height="1" fill="#111111" />
          <rect x="9" y="11" width="1" height="1" fill="#111111" />
          <rect x="10" y="12" width="1" height="1" fill="#111111" />
          <rect x="9" y="12" width="1" height="1" fill="#111111" />
          <rect x="10" y="11" width="1" height="1" fill="#111111" />
          {/* Wobbly mouth */}
          <rect x="7" y="13" width="2" height="1" fill="#111111" />
        </svg>
      );

    case "distribution_dodge":
      return (
        <svg
          viewBox="0 0 16 16"
          className={`${containerSize} ${className}`}
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label={alt || "Distribution Dodge mistake creature: a curious yellow blob peeking out from parentheses"}
          shapeRendering="crispEdges"
        >
          {/* Left Parenthesis Shield */}
          <rect x="2" y="2" width="2" height="2" fill="#111111" />
          <rect x="1" y="4" width="2" height="8" fill="#111111" />
          <rect x="2" y="12" width="2" height="2" fill="#111111" />

          {/* Right Parenthesis Shield */}
          <rect x="12" y="2" width="2" height="2" fill="#111111" />
          <rect x="13" y="4" width="2" height="8" fill="#111111" />
          <rect x="12" y="12" width="2" height="2" fill="#111111" />

          {/* Body Outline */}
          <rect x="4" y="4" width="8" height="10" fill="#111111" />
          <rect x="5" y="3" width="6" height="12" fill="#111111" />

          {/* Sand Yellow Body Fill */}
          <rect x="5" y="4" width="6" height="10" fill="#F2D16B" />
          <rect x="4" y="5" width="8" height="8" fill="#F2D16B" />

          {/* Sideways Looking Eyes */}
          <rect x="5" y="6" width="2" height="2" fill="#FFFFFF" />
          <rect x="6" y="6" width="1" height="2" fill="#111111" />
          <rect x="9" y="6" width="2" height="2" fill="#FFFFFF" />
          <rect x="10" y="6" width="1" height="2" fill="#111111" />

          {/* Smirk */}
          <rect x="6" y="10" width="3" height="1" fill="#111111" />
          <rect x="9" y="9" width="1" height="1" fill="#111111" />
        </svg>
      );

    case "calculation_slip":
      return (
        <svg
          viewBox="0 0 16 16"
          className={`${containerSize} ${className}`}
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label={alt || "Calculation Slip mistake creature: a friendly orange monster with spiral energy"}
          shapeRendering="crispEdges"
        >
          {/* Spiky Outline */}
          <rect x="7" y="1" width="2" height="3" fill="#111111" />
          <rect x="1" y="7" width="3" height="2" fill="#111111" />
          <rect x="12" y="7" width="3" height="2" fill="#111111" />
          <rect x="4" y="4" width="8" height="8" fill="#111111" />
          <rect x="3" y="5" width="10" height="6" fill="#111111" />
          <rect x="3" y="12" width="3" height="3" fill="#111111" />
          <rect x="10" y="12" width="3" height="3" fill="#111111" />

          {/* Dirt Brown Body Fill */}
          <rect x="4" y="5" width="8" height="6" fill="#8B5A2B" />
          <rect x="5" y="4" width="6" height="8" fill="#8B5A2B" />
          <rect x="7" y="2" width="2" height="2" fill="#8B5A2B" />
          <rect x="2" y="7" width="2" height="2" fill="#8B5A2B" />
          <rect x="12" y="7" width="2" height="2" fill="#8B5A2B" />
          <rect x="4" y="12" width="2" height="2" fill="#8B5A2B" />
          <rect x="10" y="12" width="2" height="2" fill="#8B5A2B" />

          {/* Astonished Eyes */}
          <rect x="5" y="6" width="2" height="2" fill="#FFFFFF" />
          <rect x="5" y="6" width="1" height="1" fill="#111111" />
          <rect x="9" y="6" width="2" height="2" fill="#FFFFFF" />
          <rect x="9" y="6" width="1" height="1" fill="#111111" />

          {/* Astonished Open Mouth */}
          <rect x="7" y="9" width="2" height="2" fill="#111111" />
        </svg>
      );

    case "general_glitch":
    default:
      return (
        <svg
          viewBox="0 0 16 16"
          className={`${containerSize} ${className}`}
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label={alt || "Curious math helper creature"}
          shapeRendering="crispEdges"
        >
          {/* Spark Antenna */}
          <rect x="7" y="0" width="2" height="2" fill="#F2D16B" />
          <rect x="7" y="2" width="2" height="2" fill="#111111" />

          {/* Body Outline */}
          <rect x="4" y="4" width="8" height="10" fill="#111111" />
          <rect x="3" y="5" width="10" height="8" fill="#111111" />
          <rect x="4" y="14" width="3" height="2" fill="#111111" />
          <rect x="9" y="14" width="3" height="2" fill="#111111" />

          {/* Grass Green Body Fill */}
          <rect x="5" y="5" width="6" height="8" fill="#5DB84A" />
          <rect x="4" y="6" width="8" height="6" fill="#5DB84A" />

          {/* Big Happy Eyes */}
          <rect x="5" y="6" width="2" height="2" fill="#FFFFFF" />
          <rect x="6" y="6" width="1" height="1" fill="#111111" />
          <rect x="9" y="6" width="2" height="2" fill="#FFFFFF" />
          <rect x="9" y="6" width="1" height="1" fill="#111111" />

          {/* Big Happy Smile */}
          <rect x="6" y="10" width="4" height="1" fill="#111111" />
          <rect x="5" y="9" width="1" height="1" fill="#111111" />
          <rect x="10" y="9" width="1" height="1" fill="#111111" />
        </svg>
      );
  }
}

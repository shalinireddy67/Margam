"use client";

import React from "react";

export interface LogoProps {
  className?: string;
  ariaLabel?: string;
}

export function Logo({
  className = "w-6 h-6",
  ariaLabel = "Margam Logo",
}: LogoProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={ariaLabel}
      shapeRendering="crispEdges"
    >
      {/* 16x16 Pixel Logo: Blocky pathway beacon */}
      {/* Outer block border */}
      <rect x="0" y="0" width="16" height="16" fill="#1E1610" />

      {/* Plank / Gold Block Field */}
      <rect x="2" y="2" width="12" height="12" fill="#F2C230" />

      {/* Stepped Pathway Motif */}
      <rect x="7" y="2" width="2" height="3" fill="#6DB33F" />
      <rect x="5" y="5" width="6" height="3" fill="#6DB33F" />
      <rect x="3" y="8" width="10" height="3" fill="#4B8B2E" />
      <rect x="2" y="11" width="12" height="3" fill="#1E1610" />

      {/* Center Beacon Core (Parchment) */}
      <rect x="7" y="6" width="2" height="2" fill="#F3E3BC" />
    </svg>
  );
}

export default Logo;

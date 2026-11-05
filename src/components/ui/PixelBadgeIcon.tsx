"use client";

import React from "react";

export type PixelBadgeIconType =
  | "star"
  | "award"
  | "trending"
  | "zap"
  | "shield"
  | "flame"
  | "crown"
  | "globe"
  | "lock";

interface PixelBadgeIconProps {
  type: PixelBadgeIconType | string;
  size?: number;
  className?: string;
  unlocked?: boolean;
}

export function PixelBadgeIcon({
  type,
  size = 32,
  className = "",
  unlocked = true,
}: PixelBadgeIconProps) {
  if (!unlocked) {
    return (
      <svg
        viewBox="0 0 16 16"
        width={size}
        height={size}
        className={`shrink-0 ${className}`}
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="crispEdges"
        role="img"
        aria-label="Locked badge"
      >
        {/* Shackle */}
        <rect x="5" y="2" width="6" height="2" fill="#2B1B0F" />
        <rect x="4" y="3" width="2" height="4" fill="#2B1B0F" />
        <rect x="10" y="3" width="2" height="4" fill="#2B1B0F" />
        <rect x="6" y="4" width="4" height="3" fill="#4A4744" />
        {/* Lock Body */}
        <rect x="3" y="7" width="10" height="8" fill="#2B1B0F" />
        <rect x="4" y="8" width="8" height="6" fill="#8C827A" />
        {/* Keyhole */}
        <rect x="7" y="10" width="2" height="2" fill="#2B1B0F" />
        <rect x="7.5" y="12" width="1" height="2" fill="#2B1B0F" />
      </svg>
    );
  }

  switch (type) {
    case "star":
      return (
        <svg
          viewBox="0 0 16 16"
          width={size}
          height={size}
          className={`shrink-0 ${className}`}
          xmlns="http://www.w3.org/2000/svg"
          shapeRendering="crispEdges"
          role="img"
          aria-label="Star badge"
        >
          <rect x="7" y="1" width="2" height="2" fill="#E5A823" />
          <rect x="6" y="3" width="4" height="2" fill="#F4C542" />
          <rect x="2" y="5" width="12" height="3" fill="#F4C542" />
          <rect x="4" y="8" width="8" height="2" fill="#F4C542" />
          <rect x="3" y="10" width="4" height="4" fill="#E5A823" />
          <rect x="9" y="10" width="4" height="4" fill="#E5A823" />
          <rect x="7" y="5" width="2" height="4" fill="#FFF3A8" />
        </svg>
      );

    case "award":
      return (
        <svg
          viewBox="0 0 16 16"
          width={size}
          height={size}
          className={`shrink-0 ${className}`}
          xmlns="http://www.w3.org/2000/svg"
          shapeRendering="crispEdges"
          role="img"
          aria-label="Medal badge"
        >
          {/* Medal Round Coin */}
          <rect x="4" y="1" width="8" height="8" fill="#E5A823" />
          <rect x="5" y="2" width="6" height="6" fill="#F4C542" />
          <rect x="7" y="3" width="2" height="4" fill="#FFF3A8" />
          {/* Ribbons */}
          <rect x="4" y="9" width="3" height="6" fill="#B8322B" />
          <rect x="9" y="9" width="3" height="6" fill="#3880FF" />
          <rect x="5" y="14" width="2" height="1" fill="#FFF7E6" />
          <rect x="9" y="14" width="2" height="1" fill="#FFF7E6" />
        </svg>
      );

    case "trending":
      return (
        <svg
          viewBox="0 0 16 16"
          width={size}
          height={size}
          className={`shrink-0 ${className}`}
          xmlns="http://www.w3.org/2000/svg"
          shapeRendering="crispEdges"
          role="img"
          aria-label="Progress badge"
        >
          {/* Step 1 */}
          <rect x="2" y="11" width="3" height="4" fill="#5DAA3A" />
          {/* Step 2 */}
          <rect x="6" y="7" width="3" height="8" fill="#5DAA3A" />
          {/* Step 3 */}
          <rect x="10" y="3" width="3" height="12" fill="#5DAA3A" />
          {/* Up arrow head */}
          <rect x="11" y="1" width="3" height="2" fill="#F4C542" />
          <rect x="12" y="0" width="1" height="2" fill="#F4C542" />
        </svg>
      );

    case "zap":
      return (
        <svg
          viewBox="0 0 16 16"
          width={size}
          height={size}
          className={`shrink-0 ${className}`}
          xmlns="http://www.w3.org/2000/svg"
          shapeRendering="crispEdges"
          role="img"
          aria-label="Focus bolt badge"
        >
          <rect x="8" y="1" width="3" height="4" fill="#F4C542" />
          <rect x="6" y="4" width="4" height="3" fill="#F4C542" />
          <rect x="4" y="7" width="8" height="2" fill="#E5A823" />
          <rect x="7" y="9" width="3" height="3" fill="#F4C542" />
          <rect x="6" y="12" width="2" height="3" fill="#E5A823" />
          <rect x="8" y="4" width="2" height="4" fill="#FFF3A8" />
        </svg>
      );

    case "shield":
      return (
        <svg
          viewBox="0 0 16 16"
          width={size}
          height={size}
          className={`shrink-0 ${className}`}
          xmlns="http://www.w3.org/2000/svg"
          shapeRendering="crispEdges"
          role="img"
          aria-label="Shield badge"
        >
          <rect x="3" y="1" width="10" height="8" fill="#8B5A2B" />
          <rect x="4" y="2" width="8" height="6" fill="#A57143" />
          <rect x="4" y="9" width="8" height="3" fill="#8B5A2B" />
          <rect x="5" y="12" width="6" height="2" fill="#8B5A2B" />
          <rect x="7" y="14" width="2" height="1" fill="#8B5A2B" />
          {/* Iron Boss */}
          <rect x="7" y="4" width="2" height="5" fill="#E8EDF0" />
          <rect x="5" y="5" width="6" height="2" fill="#E8EDF0" />
        </svg>
      );

    case "flame":
      return (
        <svg
          viewBox="0 0 16 16"
          width={size}
          height={size}
          className={`shrink-0 ${className}`}
          xmlns="http://www.w3.org/2000/svg"
          shapeRendering="crispEdges"
          role="img"
          aria-label="Daily streak badge"
        >
          <rect x="7" y="1" width="2" height="3" fill="#B8322B" />
          <rect x="5" y="4" width="6" height="5" fill="#E04A3F" />
          <rect x="3" y="7" width="10" height="6" fill="#B8322B" />
          <rect x="6" y="6" width="4" height="4" fill="#F4C542" />
          <rect x="7" y="7" width="2" height="3" fill="#FFF3A8" />
        </svg>
      );

    case "crown":
      return (
        <svg
          viewBox="0 0 16 16"
          width={size}
          height={size}
          className={`shrink-0 ${className}`}
          xmlns="http://www.w3.org/2000/svg"
          shapeRendering="crispEdges"
          role="img"
          aria-label="Crown badge"
        >
          <rect x="2" y="3" width="2" height="4" fill="#F4C542" />
          <rect x="7" y="1" width="2" height="6" fill="#F4C542" />
          <rect x="12" y="3" width="2" height="4" fill="#F4C542" />
          <rect x="2" y="7" width="12" height="6" fill="#E5A823" />
          <rect x="3" y="11" width="10" height="2" fill="#F4C542" />
          {/* Gems */}
          <rect x="4" y="9" width="2" height="2" fill="#B8322B" />
          <rect x="7" y="9" width="2" height="2" fill="#3FA7C9" />
          <rect x="10" y="9" width="2" height="2" fill="#B8322B" />
        </svg>
      );

    case "globe":
    default:
      return (
        <svg
          viewBox="0 0 16 16"
          width={size}
          height={size}
          className={`shrink-0 ${className}`}
          xmlns="http://www.w3.org/2000/svg"
          shapeRendering="crispEdges"
          role="img"
          aria-label="World badge"
        >
          <rect x="4" y="2" width="8" height="12" fill="#3880FF" />
          <rect x="2" y="4" width="12" height="8" fill="#3880FF" />
          {/* Continents */}
          <rect x="5" y="4" width="3" height="4" fill="#5DAA3A" />
          <rect x="9" y="6" width="3" height="4" fill="#5DAA3A" />
          <rect x="6" y="9" width="4" height="2" fill="#5DAA3A" />
        </svg>
      );
  }
}


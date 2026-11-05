"use client";

import React from "react";

export type AvatarPixelTier =
  | "wood_scholar"
  | "stone_scholar"
  | "iron_scholar"
  | "gold_scholar"
  | "diamond_scholar";

export interface AvatarPixelProps {
  avatar?: string | null;
  size?: number;
  className?: string;
  alt?: string;
  showBorder?: boolean;
}

export const AVATAR_TIERS = [
  { id: "wood_scholar", name: "Wood Scholar", minLevel: 1, rank: "Wood", color: "#8B5A2B" },
  { id: "stone_scholar", name: "Stone Scholar", minLevel: 5, rank: "Stone", color: "#5E5E5E" },
  { id: "iron_scholar", name: "Iron Scholar", minLevel: 10, rank: "Iron", color: "#949C9E" },
  { id: "gold_scholar", name: "Gold Scholar", minLevel: 15, rank: "Gold", color: "#F4C542" },
  { id: "diamond_scholar", name: "Diamond Scholar", minLevel: 20, rank: "Diamond", color: "#3FA7C9" },
] as const;

export function AvatarPixel({
  avatar = "wood_scholar",
  size = 36,
  className = "",
  alt,
  showBorder = true,
}: AvatarPixelProps) {
  const normalized = (avatar || "wood_scholar").toLowerCase();
  const tier: AvatarPixelTier =
    normalized.includes("diamond")
      ? "diamond_scholar"
      : normalized.includes("gold")
      ? "gold_scholar"
      : normalized.includes("iron")
      ? "iron_scholar"
      : normalized.includes("stone")
      ? "stone_scholar"
      : "wood_scholar";

  const altText = alt || `${tier.replace("_", " ")} avatar`;

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 ${
        showBorder ? "border-2 border-[#2B1B0F] shadow-[2px_2px_0px_#2B1B0F]" : ""
      } ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
      role="img"
      aria-label={altText}
    >
      <svg
        viewBox="0 0 16 16"
        width={size}
        height={size}
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="crispEdges"
      >
        {tier === "wood_scholar" && (
          <>
            {/* Background Base */}
            <rect x="0" y="0" width="16" height="16" fill="#FFF7E6" />
            {/* Wood Scholar Cap */}
            <rect x="2" y="1" width="12" height="3" fill="#5A3720" />
            <rect x="1" y="2" width="14" height="2" fill="#7A4B2A" />
            <rect x="7" y="0" width="2" height="1" fill="#F4C542" />
            <rect x="12" y="2" width="2" height="3" fill="#F4C542" />
            {/* Scholar Hair */}
            <rect x="2" y="4" width="12" height="2" fill="#3D2615" />
            <rect x="2" y="6" width="2" height="4" fill="#3D2615" />
            <rect x="12" y="6" width="2" height="4" fill="#3D2615" />
            {/* Face Skin */}
            <rect x="4" y="5" width="8" height="6" fill="#F3CE98" />
            {/* Eyes & Wooden Frame Glasses */}
            <rect x="4" y="6" width="3" height="3" fill="#5A3720" />
            <rect x="5" y="7" width="1" height="1" fill="#FFFFFF" />
            <rect x="9" y="6" width="3" height="3" fill="#5A3720" />
            <rect x="10" y="7" width="1" height="1" fill="#FFFFFF" />
            <rect x="7" y="7" width="2" height="1" fill="#5A3720" />
            {/* Smile */}
            <rect x="6" y="9" width="4" height="1" fill="#2B1B0F" />
            {/* Wooden Scholar Robe */}
            <rect x="3" y="11" width="10" height="5" fill="#8B5A2B" />
            <rect x="5" y="11" width="6" height="5" fill="#5A3720" />
            <rect x="7" y="12" width="2" height="4" fill="#FFE9A8" />
          </>
        )}

        {tier === "stone_scholar" && (
          <>
            {/* Background Base */}
            <rect x="0" y="0" width="16" height="16" fill="#E8E8E8" />
            {/* Stone Cowl / Circlet */}
            <rect x="2" y="1" width="12" height="4" fill="#383838" />
            <rect x="4" y="1" width="8" height="2" fill="#5E5E5E" />
            <rect x="6" y="2" width="4" height="1" fill="#8B8B8B" />
            {/* Sides */}
            <rect x="2" y="4" width="2" height="7" fill="#383838" />
            <rect x="12" y="4" width="2" height="7" fill="#383838" />
            {/* Face */}
            <rect x="4" y="4" width="8" height="7" fill="#F3CE98" />
            {/* Resolute Eyes */}
            <rect x="4" y="6" width="3" height="2" fill="#2B1B0F" />
            <rect x="5" y="6" width="1" height="1" fill="#FFFFFF" />
            <rect x="9" y="6" width="3" height="2" fill="#2B1B0F" />
            <rect x="10" y="6" width="1" height="1" fill="#FFFFFF" />
            <rect x="7" y="6" width="2" height="1" fill="#5E5E5E" />
            {/* Determined mouth */}
            <rect x="6" y="9" width="4" height="1" fill="#2B1B0F" />
            {/* Stone Scholar Robes */}
            <rect x="2" y="11" width="12" height="5" fill="#5E5E5E" />
            <rect x="6" y="11" width="4" height="5" fill="#383838" />
            <rect x="7" y="12" width="2" height="4" fill="#8B8B8B" />
          </>
        )}

        {tier === "iron_scholar" && (
          <>
            {/* Background Base */}
            <rect x="0" y="0" width="16" height="16" fill="#F0F4F8" />
            {/* Iron Visor / Headgear */}
            <rect x="2" y="1" width="12" height="3" fill="#6A7277" />
            <rect x="1" y="2" width="14" height="2" fill="#9DA7AD" />
            <rect x="4" y="1" width="8" height="1" fill="#E8EDF0" />
            <rect x="7" y="0" width="2" height="2" fill="#FFFFFF" />
            {/* Iron Sideguards */}
            <rect x="2" y="4" width="2" height="6" fill="#6A7277" />
            <rect x="12" y="4" width="2" height="6" fill="#6A7277" />
            {/* Face */}
            <rect x="4" y="4" width="8" height="7" fill="#F3CE98" />
            {/* Metallic Specs / Eyes */}
            <rect x="4" y="5" width="3" height="3" fill="#333A40" />
            <rect x="5" y="6" width="1" height="1" fill="#5BE5DE" />
            <rect x="9" y="5" width="3" height="3" fill="#333A40" />
            <rect x="10" y="6" width="1" height="1" fill="#5BE5DE" />
            <rect x="7" y="6" width="2" height="1" fill="#E8EDF0" />
            {/* Smile */}
            <rect x="6" y="9" width="4" height="1" fill="#2B1B0F" />
            {/* Iron Plate Robes */}
            <rect x="2" y="11" width="12" height="5" fill="#9DA7AD" />
            <rect x="5" y="11" width="6" height="5" fill="#6A7277" />
            <rect x="7" y="11" width="2" height="5" fill="#E8EDF0" />
          </>
        )}

        {tier === "gold_scholar" && (
          <>
            {/* Background Base */}
            <rect x="0" y="0" width="16" height="16" fill="#FFF9E6" />
            {/* Golden Scholar Crown */}
            <rect x="2" y="2" width="12" height="2" fill="#E5A823" />
            <rect x="2" y="0" width="2" height="3" fill="#F4C542" />
            <rect x="7" y="0" width="2" height="3" fill="#FFF3A8" />
            <rect x="12" y="0" width="2" height="3" fill="#F4C542" />
            <rect x="4" y="2" width="8" height="1" fill="#FFF3A8" />
            {/* Hair */}
            <rect x="2" y="4" width="12" height="1" fill="#8A5F0C" />
            <rect x="2" y="5" width="2" height="5" fill="#8A5F0C" />
            <rect x="12" y="5" width="2" height="5" fill="#8A5F0C" />
            {/* Face */}
            <rect x="4" y="4" width="8" height="7" fill="#F3CE98" />
            {/* Bright Golden Spectacles */}
            <rect x="4" y="5" width="3" height="3" fill="#E5A823" />
            <rect x="5" y="6" width="1" height="1" fill="#2B1B0F" />
            <rect x="9" y="5" width="3" height="3" fill="#E5A823" />
            <rect x="10" y="6" width="1" height="1" fill="#2B1B0F" />
            <rect x="7" y="6" width="2" height="1" fill="#FFF3A8" />
            {/* Joyful mouth */}
            <rect x="6" y="9" width="4" height="1" fill="#2B1B0F" />
            {/* Golden Robe with Embroidered Trim */}
            <rect x="2" y="11" width="12" height="5" fill="#F4C542" />
            <rect x="5" y="11" width="6" height="5" fill="#E5A823" />
            <rect x="7" y="11" width="2" height="5" fill="#FFF3A8" />
          </>
        )}

        {tier === "diamond_scholar" && (
          <>
            {/* Background Base */}
            <rect x="0" y="0" width="16" height="16" fill="#E6FAFC" />
            {/* Diamond Circlet & Diadem */}
            <rect x="2" y="1" width="12" height="2" fill="#18586E" />
            <rect x="3" y="1" width="10" height="2" fill="#3FA7C9" />
            <rect x="7" y="0" width="2" height="3" fill="#5BE5DE" />
            <rect x="7" y="0" width="1" height="1" fill="#FFFFFF" />
            <rect x="2" y="0" width="2" height="2" fill="#5BE5DE" />
            <rect x="12" y="0" width="2" height="2" fill="#5BE5DE" />
            {/* Hair */}
            <rect x="2" y="3" width="12" height="2" fill="#18586E" />
            <rect x="2" y="5" width="2" height="5" fill="#18586E" />
            <rect x="12" y="5" width="2" height="5" fill="#18586E" />
            {/* Face */}
            <rect x="4" y="4" width="8" height="7" fill="#F3CE98" />
            {/* Diamond Glint Glasses */}
            <rect x="4" y="5" width="3" height="3" fill="#18586E" />
            <rect x="5" y="6" width="1" height="1" fill="#5BE5DE" />
            <rect x="9" y="5" width="3" height="3" fill="#18586E" />
            <rect x="10" y="6" width="1" height="1" fill="#5BE5DE" />
            <rect x="7" y="6" width="2" height="1" fill="#C8F8F8" />
            {/* Confident Smile */}
            <rect x="6" y="9" width="4" height="1" fill="#2B1B0F" />
            {/* Diamond Robe */}
            <rect x="2" y="11" width="12" height="5" fill="#3FA7C9" />
            <rect x="5" y="11" width="6" height="5" fill="#18586E" />
            <rect x="7" y="11" width="2" height="5" fill="#5BE5DE" />
          </>
        )}
      </svg>
    </div>
  );
}


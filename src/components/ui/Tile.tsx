"use client";

import React from "react";
import Link from "next/link";

export type ChapterTileState = "available" | "in_progress" | "coming_soon";
export type LessonTileState = "available" | "in_progress" | "locked";
export type TileState = ChapterTileState | "locked";
export type TileKind = "chapter" | "lesson";
export type TileColor =
  | "yellow"
  | "cyan"
  | "green"
  | "sky"
  | "orange"
  | "grass"
  | "sand"
  | "dirt"
  | "stone";

export interface TileProps {
  title: string;
  subtitle?: string;
  state?: TileState;
  kind?: TileKind;
  color?: TileColor;
  diagnosticHref?: string;
  practiceHref?: string;
  lessonHref?: string;
  icon?: React.ReactNode;
  className?: string;
}

const colorMap: Record<TileColor, string> = {
  yellow: "bg-[#F2D16B] text-[#111111]",
  sand: "bg-[#F2D16B] text-[#111111]",
  cyan: "bg-[#7EC8E3] text-[#111111]",
  sky: "bg-[#7EC8E3] text-[#111111]",
  green: "bg-[#5DB84A] text-[#111111]",
  grass: "bg-[#5DB84A] text-[#111111]",
  orange: "bg-[#8B5A2B] text-[#FFFFFF]",
  dirt: "bg-[#8B5A2B] text-[#FFFFFF]",
  stone: "bg-[#9AA0A6] text-[#111111]",
};

export function Tile({
  title,
  subtitle,
  state = "available",
  color = "yellow",
  diagnosticHref,
  practiceHref,
  lessonHref,
  icon,
  className = "",
}: TileProps) {
  // Coming soon state
  if (state === "coming_soon") {
    return (
      <div
        className={`
          flex flex-col justify-between
          border-4 border-dashed border-[#111111] rounded-none
          bg-[#FFFFFF] p-4 sm:p-5
          ${className}
        `.trim()}
      >
        <div>
          <h3 className="font-heading font-extrabold text-base sm:text-lg text-[#111111] leading-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs font-bold text-[#444444] mt-1">
              {subtitle}
            </p>
          )}
        </div>
        <div className="mt-4">
          <span className="inline-block border-2 border-[#111111] rounded-none px-3 py-1 bg-[#F2D16B] text-xs font-heading font-bold text-[#111111]">
            Content coming soon
          </span>
        </div>
      </div>
    );
  }

  // Locked state
  if (state === "locked") {
    return (
      <div
        className={`
          flex flex-col justify-between
          border-4 border-[#111111] rounded-none
          bg-[#9AA0A6] shadow-[4px_4px_0px_#111111]
          p-4 sm:p-5 opacity-90
          ${className}
        `.trim()}
      >
        <div>
          <div className="flex items-center justify-between mb-2">
            <svg
              viewBox="0 0 16 16"
              className="w-6 h-6 text-[#111111]"
              role="img"
              aria-label="Locked"
              shapeRendering="crispEdges"
            >
              {/* Pixel lock shackle */}
              <rect x="5" y="2" width="6" height="2" fill="#111111" />
              <rect x="4" y="3" width="2" height="4" fill="#111111" />
              <rect x="10" y="3" width="2" height="4" fill="#111111" />
              {/* Pixel lock body */}
              <rect x="3" y="7" width="10" height="7" fill="#FFFFFF" stroke="#111111" strokeWidth="2" />
              {/* Pixel keyhole */}
              <rect x="7" y="9" width="2" height="2" fill="#111111" />
              <rect x="7" y="11" width="2" height="1" fill="#111111" />
            </svg>
          </div>
          <h3 className="font-heading font-extrabold text-base sm:text-lg text-[#111111] leading-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs font-bold text-[#444444] mt-1">
              {subtitle}
            </p>
          )}
        </div>
        <p className="text-xs font-bold text-[#222222] mt-4 font-heading">
          Locked
        </p>
      </div>
    );
  }

  // In-progress or available state
  const isDashed = state === "in_progress";
  const bgClass = colorMap[color] || colorMap.yellow;
  const isDarkFill = color === "orange" || color === "dirt";

  return (
    <div
      className={`
        flex flex-col justify-between
        border-4 ${isDashed ? "border-dashed" : "border-solid"} border-[#111111] rounded-none
        ${bgClass} shadow-[4px_4px_0px_#111111]
        p-4 sm:p-5
        ${className}
      `.trim()}
    >
      <div>
        {icon && <div className="mb-3 h-16 w-full flex items-center justify-center">{icon}</div>}
        <h3 className={`font-heading font-extrabold text-base sm:text-lg ${isDarkFill ? "text-[#FFFFFF]" : "text-[#111111]"} leading-tight`}>
          {title}
        </h3>
        {subtitle && (
          <p className={`text-xs font-bold ${isDarkFill ? "text-[#FFFFFF]/90" : "text-[#111111]/80"} mt-1`}>
            {subtitle}
          </p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {diagnosticHref && (
          <Link
            href={diagnosticHref}
            className="inline-flex items-center justify-center min-h-[48px] px-3.5 py-1.5 bg-[#FFFFFF] text-[#111111] border-4 border-[#111111] rounded-none font-heading font-bold text-xs shadow-[2px_2px_0px_#111111] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none no-underline select-none"
          >
            Diagnose
          </Link>
        )}
        {practiceHref && (
          <Link
            href={practiceHref}
            className="inline-flex items-center justify-center min-h-[48px] px-3.5 py-1.5 bg-[#FFFFFF] text-[#111111] border-4 border-[#111111] rounded-none font-heading font-bold text-xs shadow-[2px_2px_0px_#111111] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none no-underline select-none"
          >
            Practice
          </Link>
        )}
        {lessonHref && (
          <Link
            href={lessonHref}
            className="inline-flex items-center justify-center min-h-[48px] px-3.5 py-1.5 bg-[#111111] text-[#FFFFFF] border-4 border-[#111111] rounded-none font-heading font-bold text-xs shadow-[2px_2px_0px_#111111] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none no-underline select-none"
          >
            Learn
          </Link>
        )}
      </div>
    </div>
  );
}

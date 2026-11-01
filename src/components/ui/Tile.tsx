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
  | "stone"
  | "forest"
  | "pixelgreen";

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

export function Tile({
  title,
  subtitle,
  state = "available",
  color = "forest",
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
          border-4 border-dashed border-[#A06A3C] rounded-[2px]
          bg-[#5A3720]/60 p-4 sm:p-5 text-[#D9D9D9]
          shadow-[inset_2px_2px_0px_rgba(0,0,0,0.3),4px_4px_0px_rgba(0,0,0,0.35)]
          ${className}
        `.trim()}
      >
        <div>
          <h3 className="font-heading font-extrabold text-sm sm:text-base text-[#D9D9D9] leading-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs font-bold text-[#D9D9D9]/70 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        <div className="mt-4">
          <span className="inline-block border-2 border-[#3F3F3F] rounded-[2px] px-3 py-1 bg-[#5E5E5E] text-[10px] font-heading font-bold text-[#D9D9D9]">
            COMING SOON
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
          border-4 border-[#3F3F3F] rounded-[2px]
          bg-[#5E5E5E] shadow-[inset_2px_2px_0px_rgba(255,255,255,0.2),4px_4px_0px_rgba(0,0,0,0.35)]
          p-4 sm:p-5 text-[#D9D9D9]
          ${className}
        `.trim()}
      >
        <div>
          <div className="flex items-center justify-between mb-2">
            <svg
              viewBox="0 0 16 16"
              className="w-5 h-5 text-[#FFE9A8]"
              role="img"
              aria-label="Locked"
              shapeRendering="crispEdges"
            >
              <rect x="5" y="2" width="6" height="2" fill="#D9D9D9" />
              <rect x="4" y="3" width="2" height="4" fill="#D9D9D9" />
              <rect x="10" y="3" width="2" height="4" fill="#D9D9D9" />
              <rect x="3" y="7" width="10" height="7" fill="#7A4B2A" stroke="#422816" strokeWidth="2" />
              <rect x="7" y="9" width="2" height="2" fill="#FFE9A8" />
            </svg>
          </div>
          <h3 className="font-heading font-extrabold text-sm sm:text-base text-[#D9D9D9] leading-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs font-bold text-[#D9D9D9]/70 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        <p className="text-xs font-bold text-[#D9D9D9]/70 mt-4 font-heading">
          LOCKED
        </p>
      </div>
    );
  }

  // In-progress or available state
  const isDashed = state === "in_progress";

  return (
    <div
      className={`
        flex flex-col justify-between
        border-4 ${isDashed ? "border-[#F4C542] border-t-[8px] border-t-[#5DAA3A]" : "border-[#422816] border-t-[6px] border-t-[#5DAA3A]"} rounded-[2px]
        bg-[#7A4B2A] text-[#FFF7E6]
        shadow-[inset_2px_2px_0px_rgba(255,255,255,0.25),inset_-2px_-2px_0px_rgba(0,0,0,0.4),4px_4px_0px_rgba(0,0,0,0.35)]
        hover:border-[#FFE9A8] transition-all
        p-4 sm:p-5
        ${className}
      `.trim()}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          {state === "in_progress" ? (
            <span className="inline-flex items-center px-2 py-0.5 bg-[#5DAA3A] text-[#FFF7E6] border border-[#2F6B22] text-[9px] font-heading font-bold shadow-[1px_1px_0px_#2B1B0F]">
              IN PROGRESS
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 bg-[#5A3720] text-[#FFE9A8] border border-[#422816] text-[9px] font-heading font-bold shadow-[1px_1px_0px_#2B1B0F]">
              READY
            </span>
          )}
        </div>
        {icon && <div className="mb-3 h-12 w-full flex items-center justify-center">{icon}</div>}
        <h3 className="font-heading font-extrabold text-sm sm:text-base text-[#FFF7E6] leading-tight">
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs font-bold text-[#FFF7E6]/80 mt-1">
            {subtitle}
          </p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {diagnosticHref && (
          <Link
            href={diagnosticHref}
            className="inline-flex items-center justify-center min-h-[44px] px-3.5 py-1.5 bg-gradient-to-b from-[#5DAA3A] to-[#2F6B22] text-[#FFF7E6] border-2 border-[#204514] rounded-[2px] font-heading font-extrabold text-xs shadow-[inset_1px_1px_0px_rgba(255,255,255,0.4),2px_2px_0px_rgba(0,0,0,0.35)] active:translate-x-[1px] active:translate-y-[1px] no-underline select-none transition-colors"
          >
            Diagnose
          </Link>
        )}
        {practiceHref && (
          <Link
            href={practiceHref}
            className="inline-flex items-center justify-center min-h-[44px] px-3.5 py-1.5 bg-gradient-to-b from-[#FFE9A8] to-[#F4C542] text-[#2B1B0F] border-2 border-[#7A4B2A] rounded-[2px] font-heading font-extrabold text-xs shadow-[inset_1px_1px_0px_rgba(255,255,255,0.6),2px_2px_0px_rgba(0,0,0,0.35)] active:translate-x-[1px] active:translate-y-[1px] no-underline select-none transition-colors"
          >
            Practice
          </Link>
        )}
        {lessonHref && (
          <Link
            href={lessonHref}
            className="inline-flex items-center justify-center min-h-[44px] px-3.5 py-1.5 bg-gradient-to-b from-[#6EB5FF] to-[#3FA7C9] text-[#FFF7E6] border-2 border-[#1E6F8C] rounded-[2px] font-heading font-extrabold text-xs shadow-[inset_1px_1px_0px_rgba(255,255,255,0.4),2px_2px_0px_rgba(0,0,0,0.35)] active:translate-x-[1px] active:translate-y-[1px] no-underline select-none transition-colors"
          >
            Learn
          </Link>
        )}
      </div>
    </div>
  );
}

export default Tile;

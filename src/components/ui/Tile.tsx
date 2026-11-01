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
          border-3 border-dashed border-[#315B2A] rounded-none
          bg-[#173B19]/50 p-4 sm:p-5 text-[#D8D8D0]
          shadow-[4px_4px_0px_#102610]
          ${className}
        `.trim()}
      >
        <div>
          <h3 className="font-heading font-extrabold text-sm sm:text-base text-[#D8D8D0]/80 leading-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs font-bold text-[#D8D8D0]/60 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        <div className="mt-4">
          <span className="inline-block border-2 border-[#102610] rounded-none px-3 py-1 bg-[#20251F] text-[10px] font-heading font-bold text-[#D8D8D0]">
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
          border-3 border-[#102610] rounded-none
          bg-[#20251F] shadow-[4px_4px_0px_#102610]
          p-4 sm:p-5 opacity-80 text-[#D8D8D0]
          ${className}
        `.trim()}
      >
        <div>
          <div className="flex items-center justify-between mb-2">
            <svg
              viewBox="0 0 16 16"
              className="w-5 h-5 text-[#79B82A]"
              role="img"
              aria-label="Locked"
              shapeRendering="crispEdges"
            >
              <rect x="5" y="2" width="6" height="2" fill="#79B82A" />
              <rect x="4" y="3" width="2" height="4" fill="#79B82A" />
              <rect x="10" y="3" width="2" height="4" fill="#79B82A" />
              <rect x="3" y="7" width="10" height="7" fill="#173B19" stroke="#102610" strokeWidth="2" />
              <rect x="7" y="9" width="2" height="2" fill="#E5B834" />
            </svg>
          </div>
          <h3 className="font-heading font-extrabold text-sm sm:text-base text-[#D8D8D0] leading-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs font-bold text-[#D8D8D0]/60 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        <p className="text-xs font-bold text-[#D8D8D0]/60 mt-4 font-heading">
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
        border-3 ${isDashed ? "border-[#79B82A]" : "border-[#315B2A]"} rounded-none
        bg-[#173B19] text-[#F2F0DF] shadow-[4px_4px_0px_#102610]
        hover:border-[#79B82A] transition-all
        p-4 sm:p-5
        ${className}
      `.trim()}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          {state === "in_progress" ? (
            <span className="inline-flex items-center px-2 py-0.5 bg-[#4F8A24] text-[#F2F0DF] border border-[#102610] text-[9px] font-heading font-bold shadow-[1px_1px_0px_#102610]">
              IN PROGRESS
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 bg-[#20251F] text-[#79B82A] border border-[#102610] text-[9px] font-heading font-bold shadow-[1px_1px_0px_#102610]">
              READY
            </span>
          )}
        </div>
        {icon && <div className="mb-3 h-12 w-full flex items-center justify-center">{icon}</div>}
        <h3 className="font-heading font-extrabold text-sm sm:text-base text-[#F2F0DF] leading-tight">
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs font-bold text-[#D8D8D0]/80 mt-1">
            {subtitle}
          </p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {diagnosticHref && (
          <Link
            href={diagnosticHref}
            className="inline-flex items-center justify-center min-h-[44px] px-3.5 py-1.5 bg-[#79B82A] hover:bg-[#8CD033] text-[#102610] border-2 border-[#102610] rounded-none font-heading font-extrabold text-xs shadow-[2px_2px_0px_#102610] active:translate-x-[1px] active:translate-y-[1px] no-underline select-none transition-colors"
          >
            Diagnose
          </Link>
        )}
        {practiceHref && (
          <Link
            href={practiceHref}
            className="inline-flex items-center justify-center min-h-[44px] px-3.5 py-1.5 bg-[#E5B834] hover:bg-[#F2D16B] text-[#102610] border-2 border-[#102610] rounded-none font-heading font-extrabold text-xs shadow-[2px_2px_0px_#102610] active:translate-x-[1px] active:translate-y-[1px] no-underline select-none transition-colors"
          >
            Practice
          </Link>
        )}
        {lessonHref && (
          <Link
            href={lessonHref}
            className="inline-flex items-center justify-center min-h-[44px] px-3.5 py-1.5 bg-[#4F8A24] hover:bg-[#5E9E2C] text-[#F2F0DF] border-2 border-[#102610] rounded-none font-heading font-extrabold text-xs shadow-[2px_2px_0px_#102610] active:translate-x-[1px] active:translate-y-[1px] no-underline select-none transition-colors"
          >
            Learn
          </Link>
        )}
      </div>
    </div>
  );
}

export default Tile;

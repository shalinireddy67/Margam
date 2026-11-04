"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, Compass, Lock, Zap } from "lucide-react";

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
  | "wood"
  | "stone";

export interface TileProps {
  title: string;
  subtitle?: string;
  tooltip?: string;
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
  tooltip,
  state = "available",
  diagnosticHref,
  practiceHref,
  lessonHref,
  icon,
  className = "",
}: TileProps) {
  // Coming soon state
  if (state === "coming_soon") {
    const tooltipText =
      tooltip ||
      "This chapter is still being built. Try another chapter or come back soon.";

    return (
      <div
        title={tooltipText}
        aria-label={`${title} - Coming Soon (Locked)`}
        aria-disabled="true"
        data-panel="tile-coming-soon"
        className={`
          bg-[#B9BCC0]/82 text-[#1E1610] p-5 rounded-xs flex flex-col justify-between select-none
          border-[3px] border-dashed border-[#1E1610] shadow-[2px_2px_0px_#1E1610]
          cursor-not-allowed group relative
          ${className}
        `.trim()}
      >
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs bg-[#E8CF9C] text-[#1E1610] border border-[#1E1610] text-[10px] font-heading font-extrabold">
              <Lock className="w-3 h-3 text-[#1E1610]" />
              <span>COMING SOON</span>
            </span>
          </div>
          <h3 className="font-heading font-extrabold text-sm sm:text-base text-[#1E1610] leading-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs font-semibold text-[#5A3720] mt-1">
              {subtitle}
            </p>
          )}
        </div>
        <div className="mt-4 pt-2 border-t-2 border-[#1E1610]/20 flex items-center justify-between text-[11px] font-heading font-bold text-[#5A3720]">
          <span>Under Construction</span>
          <span className="text-[10px]">Questions in Forge</span>
        </div>
      </div>
    );
  }

  // Locked state
  if (state === "locked") {
    return (
      <div
        data-panel="tile-locked"
        className={`
          bg-[#B9BCC0]/82 text-[#1E1610] p-5 rounded-xs flex flex-col justify-between select-none
          border-[3px] border-[#1E1610] shadow-[2px_2px_0px_#1E1610]
          ${className}
        `.trim()}
      >
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs bg-[#E8CF9C] text-[#1E1610] border border-[#1E1610] text-[10px] font-heading font-extrabold">
              <Lock className="w-3 h-3 text-[#1E1610]" />
              <span>LOCKED</span>
            </span>
          </div>
          <h3 className="font-heading font-extrabold text-sm sm:text-base text-[#1E1610] leading-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs font-semibold text-[#5A3720] mt-1">
              {subtitle}
            </p>
          )}
        </div>
        <p className="text-xs font-extrabold text-[#D1362B] mt-4 font-heading">
          EARLIER TOPIC NEEDED
        </p>
      </div>
    );
  }

  // In-progress or available state
  const isInProgress = state === "in_progress";

  return (
    <div
      data-panel="tile"
      className={`
        bg-[#D9B87A]/82 text-[#1E1610] p-5 sm:p-6 rounded-xs flex flex-col justify-between
        border-[3px] border-[#1E1610] shadow-[3px_3px_0px_#1E1610] relative overflow-hidden
        ${isInProgress ? "border-t-[6px] border-t-[#F2C230]" : "border-t-[6px] border-t-[#6DB33F]"}
        ${className}
      `.trim()}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          {isInProgress ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xs bg-[#F2C230] text-[#1E1610] border border-[#1E1610] text-[10px] font-heading font-extrabold shadow-[1px_1px_0px_#1E1610]">
              <Zap className="w-3 h-3 text-[#1E1610]" />
              <span>IN PROGRESS</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xs bg-[#6DB33F] text-[#1E1610] border border-[#1E1610] text-[10px] font-heading font-extrabold shadow-[1px_1px_0px_#1E1610]">
              <BookOpen className="w-3 h-3 text-[#1E1610]" />
              <span>READY</span>
            </span>
          )}
        </div>

        {icon && <div className="mb-3 h-12 w-full flex items-center justify-center">{icon}</div>}

        <h3 className="font-heading font-extrabold text-sm sm:text-base text-[#1E1610] leading-snug">
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs font-semibold text-[#5A3720] mt-1.5 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      <div className="mt-5 pt-3 border-t-2 border-[#1E1610]/20 flex flex-wrap gap-2">
        {diagnosticHref && (
          <Link
            href={diagnosticHref}
            className="inline-flex items-center justify-center min-h-[40px] px-3.5 py-1.5 bg-[#6DB33F] hover:bg-[#8CCB55] text-[#1E1610] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] text-xs font-heading font-extrabold no-underline transition-all"
          >
            <Compass className="w-3.5 h-3.5 mr-1.5 text-[#1E1610]" />
            <span>Quick Check</span>
          </Link>
        )}
        {practiceHref && (
          <Link
            href={practiceHref}
            className="inline-flex items-center justify-center min-h-[40px] px-3.5 py-1.5 bg-[#F2C230] hover:bg-[#E8CF9C] text-[#1E1610] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] text-xs font-heading font-extrabold no-underline transition-all"
          >
            <span>Practice</span>
          </Link>
        )}
        {lessonHref && (
          <Link
            href={lessonHref}
            className="inline-flex items-center justify-center min-h-[40px] px-3.5 py-1.5 bg-[#E8CF9C] hover:bg-[#F3E3BC] text-[#1E1610] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] text-xs font-heading font-extrabold no-underline transition-all"
          >
            <span>Learn</span>
          </Link>
        )}
      </div>
    </div>
  );
}

export default Tile;

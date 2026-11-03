"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, BookOpen, Compass, Lock } from "lucide-react";

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
  color = "dirt",
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
        className={`
          glass-card p-5 rounded-2xl flex flex-col justify-between select-none
          border border-dashed border-slate-300/80 bg-white/50 text-slate-500
          shadow-xs cursor-not-allowed group relative
          ${className}
        `.trim()}
      >
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-heading font-bold">
              <Lock className="w-3 h-3 text-slate-500" />
              <span>COMING SOON</span>
            </span>
          </div>
          <h3 className="font-heading font-extrabold text-sm sm:text-base text-slate-700 leading-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs font-semibold text-slate-500 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        <div className="mt-4 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-heading text-slate-400">
          <span>Under Construction</span>
          <span className="text-[10px] text-slate-400">
            Questions in Forge
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
          glass-card p-5 rounded-2xl flex flex-col justify-between select-none
          border border-slate-200 bg-white/50 text-slate-500 shadow-xs
          ${className}
        `.trim()}
      >
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-heading font-bold">
              <Lock className="w-3 h-3 text-slate-500" />
              <span>LOCKED</span>
            </span>
          </div>
          <h3 className="font-heading font-extrabold text-sm sm:text-base text-slate-700 leading-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs font-semibold text-slate-500 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        <p className="text-xs font-bold text-slate-400 mt-4 font-heading">
          PREREQUISITES REQUIRED
        </p>
      </div>
    );
  }

  // In-progress or available state
  const isInProgress = state === "in_progress";

  return (
    <div
      className={`
        glass-card glass-card-hover p-5 sm:p-6 rounded-2xl flex flex-col justify-between
        border border-white/70 shadow-[0_8px_24px_rgba(16,42,18,0.06)] relative overflow-hidden
        ${isInProgress ? "border-t-4 border-t-amber-500" : "border-t-4 border-t-emerald-500"}
        ${className}
      `.trim()}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          {isInProgress ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-heading font-bold shadow-xs">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>IN PROGRESS</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-heading font-bold shadow-xs">
              <BookOpen className="w-3 h-3 text-emerald-600" />
              <span>READY</span>
            </span>
          )}
        </div>

        {icon && <div className="mb-3 h-12 w-full flex items-center justify-center">{icon}</div>}

        <h3 className="font-heading font-extrabold text-sm sm:text-base text-emerald-950 leading-snug">
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs font-medium text-emerald-900/75 mt-1.5 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      <div className="mt-5 pt-3 border-t border-emerald-950/10 flex flex-wrap gap-2">
        {diagnosticHref && (
          <Link
            href={diagnosticHref}
            className="glass-btn-primary inline-flex items-center justify-center min-h-[40px] px-3.5 py-1.5 text-xs font-heading font-bold no-underline transition-all"
          >
            <Compass className="w-3.5 h-3.5 mr-1.5" />
            <span>Diagnose</span>
          </Link>
        )}
        {practiceHref && (
          <Link
            href={practiceHref}
            className="glass-btn-accent inline-flex items-center justify-center min-h-[40px] px-3.5 py-1.5 text-xs font-heading font-bold no-underline transition-all"
          >
            <span>Practice</span>
          </Link>
        )}
        {lessonHref && (
          <Link
            href={lessonHref}
            className="glass-btn-secondary inline-flex items-center justify-center min-h-[40px] px-3.5 py-1.5 text-xs font-heading font-bold no-underline transition-all"
          >
            <span>Learn</span>
          </Link>
        )}
      </div>
    </div>
  );
}

export default Tile;

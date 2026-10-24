"use client";

import React from "react";
import Link from "next/link";

export type TileState = "available" | "in_progress" | "coming_soon" | "locked";
export type TileColor = "yellow" | "cyan" | "green" | "sky" | "orange";

export interface TileProps {
  title: string;
  subtitle?: string;
  state?: TileState;
  color?: TileColor;
  diagnosticHref?: string;
  practiceHref?: string;
  lessonHref?: string;
  icon?: React.ReactNode;
  className?: string;
}

const colorMap: Record<TileColor, string> = {
  yellow: "bg-[#FFE14D]",
  cyan: "bg-[#4DD9E8]",
  green: "bg-[#8DE86A]",
  sky: "bg-[#A9D8F0]",
  orange: "bg-[#FF8A3D]",
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
          border-[3px] border-dashed border-[#111111]
          rounded-[18px_14px_20px_15px/15px_20px_14px_18px]
          bg-[#FFFFFF] p-4 sm:p-5
          ${className}
        `.trim()}
      >
        <div>
          <h3 className="font-heading font-extrabold text-xl text-[#111111] leading-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs font-bold text-[#666666] mt-1">
              {subtitle}
            </p>
          )}
        </div>
        <div className="mt-4">
          <span className="inline-block border-[2px] border-[#111111] rounded-full px-3 py-1 bg-[#FFF8DC] text-xs font-heading font-bold text-[#111111]">
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
          border-[3px] border-[#111111]
          rounded-[18px_14px_20px_15px/15px_20px_14px_18px]
          bg-[#E8E8E8] shadow-[4px_4px_0px_#111111]
          p-4 sm:p-5 opacity-90
          ${className}
        `.trim()}
      >
        <div>
          <div className="flex items-center justify-between mb-2">
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 text-[#111111]"
              role="img"
              aria-label="Locked"
            >
              <rect x="4" y="10" width="16" height="11" rx="2" fill="#FFFFFF" stroke="#111111" strokeWidth="2.5" />
              <path d="M7 10V7a5 5 0 0 1 10 0v3" fill="none" stroke="#111111" strokeWidth="2.5" />
            </svg>
          </div>
          <h3 className="font-heading font-extrabold text-xl text-[#111111] leading-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs font-bold text-[#666666] mt-1">
              {subtitle}
            </p>
          )}
        </div>
        <p className="text-xs font-bold text-[#555555] mt-4">
          Locked
        </p>
      </div>
    );
  }

  // In-progress or available state
  const isDashed = state === "in_progress";
  const bgClass = colorMap[color];

  return (
    <div
      className={`
        flex flex-col justify-between
        border-[3px] ${isDashed ? "border-dashed" : "border-solid"} border-[#111111]
        rounded-[18px_14px_20px_15px/15px_20px_14px_18px]
        ${bgClass} shadow-[4px_4px_0px_#111111]
        p-4 sm:p-5
        ${className}
      `.trim()}
    >
      <div>
        {icon && <div className="mb-3 h-16 w-full flex items-center justify-center">{icon}</div>}
        <h3 className="font-heading font-extrabold text-xl text-[#111111] leading-tight">
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs font-bold text-[#111111]/80 mt-1">
            {subtitle}
          </p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {diagnosticHref && (
          <Link
            href={diagnosticHref}
            className="inline-flex items-center justify-center min-h-[44px] px-3.5 py-1.5 bg-[#FFFFFF] text-[#111111] border-[2px] border-[#111111] rounded-xl font-heading font-bold text-xs shadow-[2px_2px_0px_#111111] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none no-underline"
          >
            Diagnose
          </Link>
        )}
        {practiceHref && (
          <Link
            href={practiceHref}
            className="inline-flex items-center justify-center min-h-[44px] px-3.5 py-1.5 bg-[#FFFFFF] text-[#111111] border-[2px] border-[#111111] rounded-xl font-heading font-bold text-xs shadow-[2px_2px_0px_#111111] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none no-underline"
          >
            Practice
          </Link>
        )}
        {lessonHref && (
          <Link
            href={lessonHref}
            className="inline-flex items-center justify-center min-h-[44px] px-3.5 py-1.5 bg-[#111111] text-[#FFFFFF] border-[2px] border-[#111111] rounded-xl font-heading font-bold text-xs shadow-[2px_2px_0px_#111111] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none no-underline"
          >
            Learn
          </Link>
        )}
      </div>
    </div>
  );
}

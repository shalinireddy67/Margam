"use client";

import React from "react";

export type CardColor =
  | "white"
  | "yellow"
  | "cyan"
  | "pink"
  | "green"
  | "sky"
  | "orange"
  | "grass"
  | "darkgrass"
  | "pixelgreen"
  | "forest"
  | "warmwhite"
  | "charcoal"
  | "translucent"
  | "dirt"
  | "stone"
  | "sand"
  | "gold"
  | "red";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: CardColor;
  dashed?: boolean;
  interactive?: boolean;
  grassTrim?: boolean;
  children: React.ReactNode;
}

const colorStyles: Record<CardColor, string> = {
  // Frosted Glass Defaults
  forest: "bg-white/80 text-emerald-950 border-white/70 backdrop-blur-md shadow-[0_8px_32px_rgba(16,42,18,0.08)]",
  dirt: "bg-white/80 text-emerald-950 border-white/70 backdrop-blur-md shadow-[0_8px_32px_rgba(16,42,18,0.08)]",
  charcoal: "bg-white/85 text-slate-900 border-white/80 backdrop-blur-md shadow-[0_8px_32px_rgba(16,42,18,0.08)]",
  translucent: "bg-white/75 text-emerald-950 border-white/60 backdrop-blur-lg shadow-[0_8px_32px_rgba(16,42,18,0.08)]",

  // Light Parchment panels
  warmwhite: "bg-amber-50/85 text-emerald-950 border-amber-200/80 backdrop-blur-md",
  white: "bg-white/90 text-emerald-950 border-white/90 backdrop-blur-md",

  // Neutral Stone
  stone: "bg-slate-100/85 text-slate-800 border-slate-200/80 backdrop-blur-md",

  // Grass Accent
  grass: "bg-emerald-50/90 text-emerald-950 border-emerald-200/80 backdrop-blur-md",
  pixelgreen: "bg-emerald-50/90 text-emerald-950 border-emerald-200/80 backdrop-blur-md",
  darkgrass: "bg-emerald-800/90 text-white border-emerald-700 backdrop-blur-md",
  green: "bg-emerald-50/90 text-emerald-950 border-emerald-200/80 backdrop-blur-md",

  // Highlights
  gold: "bg-amber-50/90 text-amber-950 border-amber-200/80 backdrop-blur-md",
  sand: "bg-amber-50/90 text-amber-950 border-amber-200/80 backdrop-blur-md",
  yellow: "bg-amber-50/90 text-amber-950 border-amber-200/80 backdrop-blur-md",
  orange: "bg-orange-50/90 text-orange-950 border-orange-200/80 backdrop-blur-md",

  // Water / Sky
  sky: "bg-sky-50/90 text-sky-950 border-sky-200/80 backdrop-blur-md",
  cyan: "bg-cyan-50/90 text-cyan-950 border-cyan-200/80 backdrop-blur-md",

  // Flower Red / Pink
  red: "bg-rose-50/90 text-rose-950 border-rose-200/80 backdrop-blur-md",
  pink: "bg-pink-50/90 text-pink-950 border-pink-200/80 backdrop-blur-md",
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      color = "forest",
      dashed = false,
      interactive = false,
      grassTrim = false,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`
          border rounded-2xl
          p-4 sm:p-5
          box-border
          ${grassTrim ? "border-t-4 border-t-emerald-500" : ""}
          ${interactive
            ? "cursor-pointer transition-all hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(16,42,18,0.12)] active:translate-y-0"
            : ""
          }
          ${dashed ? "border-dashed" : "border-solid"}
          ${colorStyles[color] || colorStyles.forest}
          ${className}
        `.trim()}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export default Card;

"use client";

import React from "react";

export type CardColor =
  | "white"
  | "cream"
  | "yellow"
  | "cyan"
  | "pink"
  | "green"
  | "sky"
  | "orange"
  | "grass"
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
  // Semi-opaque plank panel (canonical replacement for white cards)
  white: "bg-[#D9B87A]/90 text-[#1E1610] border-[#1E1610]",
  cream: "bg-[#E8CF9C]/92 text-[#1E1610] border-[#1E1610]",

  // Neutral Stone
  stone: "bg-[#B9BCC0]/90 text-[#1E1610] border-[#1E1610]",

  // Grass Accent (Success)
  grass: "bg-[#6DB33F]/90 text-[#1E1610] border-[#1E1610]",
  green: "bg-[#6DB33F]/90 text-[#1E1610] border-[#1E1610]",

  // Highlights
  gold: "bg-[#F2C230]/90 text-[#1E1610] border-[#1E1610]",
  sand: "bg-[#E8CF9C]/92 text-[#1E1610] border-[#1E1610]",
  yellow: "bg-[#F2C230]/90 text-[#1E1610] border-[#1E1610]",
  orange: "bg-[#F2C230]/90 text-[#1E1610] border-[#1E1610]",

  // Water / Sky (Hints and Info)
  sky: "bg-[#78BDE8]/90 text-[#1E1610] border-[#1E1610]",
  cyan: "bg-[#4EDBD3]/90 text-[#1E1610] border-[#1E1610]",

  // Ground Wood & Dirt / HUD Night panels
  dirt: "bg-[#8B5A2B]/92 text-[#F3E3BC] border-[#1E1610]",
  charcoal: "bg-[#232634]/92 text-[#F3E3BC] border-[#1E1610]",
  translucent: "bg-[#232634]/92 text-[#F3E3BC] border-[#1E1610]",

  // Gaps and Mistakes ONLY
  red: "bg-[#D1362B]/92 text-[#F3E3BC] border-[#1E1610]",
  pink: "bg-[#E8CF9C]/92 text-[#1E1610] border-[#1E1610]",
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      color = "white",
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
        data-panel="card"
        className={`
          border-[3px] rounded-xs
          p-4 sm:p-5
          box-border
          ${grassTrim ? "border-t-[6px] border-t-[#6DB33F]" : ""}
          ${interactive
            ? "cursor-pointer transition-transform hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5"
            : ""
          }
          ${dashed ? "border-dashed" : "border-solid"}
          ${colorStyles[color] || colorStyles.white}
          shadow-[3px_3px_0px_#1E1610]
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

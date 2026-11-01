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
  | "red";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: CardColor;
  dashed?: boolean;
  interactive?: boolean;
  grassTrim?: boolean;
  children: React.ReactNode;
}

const colorStyles: Record<CardColor, string> = {
  forest: "bg-[#173B19] text-[#F2F0DF] border-[#315B2A]",
  grass: "bg-[#4F8A24] text-[#F2F0DF] border-[#102610]",
  pixelgreen: "bg-[#79B82A] text-[#102610] border-[#102610]",
  darkgrass: "bg-[#315B2A] text-[#F2F0DF] border-[#102610]",
  warmwhite: "bg-[#F2F0DF] text-[#20251F] border-[#20251F]",
  charcoal: "bg-[#20251F] text-[#F2F0DF] border-[#102610]",
  translucent: "bg-[#173B19]/90 text-[#F2F0DF] border-[#4F8A24] backdrop-blur-md",

  // Backward compatible aliases
  white: "bg-[#F2F0DF] text-[#20251F] border-[#20251F]",
  sand: "bg-[#E5B834] text-[#102610] border-[#102610]",
  yellow: "bg-[#E5B834] text-[#102610] border-[#102610]",
  sky: "bg-[#173B19] text-[#F2F0DF] border-[#4F8A24]",
  cyan: "bg-[#79B82A] text-[#102610] border-[#102610]",
  green: "bg-[#4F8A24] text-[#F2F0DF] border-[#102610]",
  dirt: "bg-[#8B5A2B] text-[#FFFFFF] border-[#102610]",
  orange: "bg-[#E5B834] text-[#102610] border-[#102610]",
  stone: "bg-[#9AA0A6] text-[#102610] border-[#102610]",
  red: "bg-[#D9453D] text-[#FFFFFF] border-[#102610]",
  pink: "bg-[#D9453D] text-[#FFFFFF] border-[#102610]",
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
          border-3 rounded-none
          p-4 sm:p-5
          box-border
          ${grassTrim ? "border-t-[6px] border-t-[#79B82A]" : ""}
          ${interactive
            ? "cursor-pointer transition-transform hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5"
            : ""
          }
          ${dashed ? "border-dashed" : "border-solid"}
          ${colorStyles[color] || colorStyles.forest}
          shadow-[4px_4px_0px_#102610]
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

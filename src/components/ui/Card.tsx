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
  // White card with Ink border (Canonical)
  white: "bg-[#FFFFFF] text-[#2B1B0F] border-[#2B1B0F]",
  cream: "bg-[#FFF7E6] text-[#2B1B0F] border-[#2B1B0F]",

  // Neutral Stone
  stone: "bg-[#8B8B8B] text-[#FFF7E6] border-[#3F3F3F]",

  // Grass Accent
  grass: "bg-[#5DAA3A] text-[#2B1B0F] border-[#2B1B0F]",
  green: "bg-[#5DAA3A] text-[#2B1B0F] border-[#2B1B0F]",

  // Highlights
  gold: "bg-[#F4C542] text-[#2B1B0F] border-[#2B1B0F]",
  sand: "bg-[#FFE9A8] text-[#2B1B0F] border-[#2B1B0F]",
  yellow: "bg-[#F4C542] text-[#2B1B0F] border-[#2B1B0F]",
  orange: "bg-[#FFB36B] text-[#2B1B0F] border-[#2B1B0F]",

  // Water / Sky
  sky: "bg-[#6EB5FF] text-[#2B1B0F] border-[#2B1B0F]",
  cyan: "bg-[#3FA7C9] text-[#2B1B0F] border-[#2B1B0F]",

  // Ground Wood & Dirt panels
  dirt: "bg-[#7A4B2A] text-[#FFF7E6] border-[#422816]",
  charcoal: "bg-[#5A3720] text-[#FFF7E6] border-[#422816]",
  translucent: "bg-[#5A3720]/90 text-[#FFF7E6] border-[#7A4B2A] backdrop-blur-md",

  // Flower Red / Pink
  red: "bg-[#E04A3F] text-[#FFFFFF] border-[#701A13]",
  pink: "bg-[#FF8FA3] text-[#2B1B0F] border-[#2B1B0F]",
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
        className={`
          border-[3px] rounded-[2px]
          p-4 sm:p-5
          box-border
          ${grassTrim ? "border-t-[8px] border-t-[#5DAA3A]" : ""}
          ${interactive
            ? "cursor-pointer transition-transform hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5"
            : ""
          }
          ${dashed ? "border-dashed" : "border-solid"}
          ${colorStyles[color] || colorStyles.white}
          shadow-[4px_4px_0px_#2B1B0F]
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

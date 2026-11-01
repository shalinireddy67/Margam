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
  // Wood & Dirt panels
  forest: "bg-[#7A4B2A] text-[#FFF7E6] border-[#422816]",
  dirt: "bg-[#7A4B2A] text-[#FFF7E6] border-[#422816]",
  charcoal: "bg-[#5A3720] text-[#FFF7E6] border-[#422816]",
  translucent: "bg-[#5A3720]/90 text-[#FFF7E6] border-[#7A4B2A] backdrop-blur-md",

  // Light Parchment panels
  warmwhite: "bg-[#FFF7E6] text-[#2B1B0F] border-[#5A3720]",
  white: "bg-[#FFF7E6] text-[#2B1B0F] border-[#5A3720]",

  // Neutral Stone
  stone: "bg-[#8B8B8B] text-[#FFF7E6] border-[#3F3F3F]",

  // Grass Accent
  grass: "bg-[#5DAA3A] text-[#FFF7E6] border-[#2F6B22]",
  pixelgreen: "bg-[#5DAA3A] text-[#FFF7E6] border-[#2F6B22]",
  darkgrass: "bg-[#2F6B22] text-[#FFF7E6] border-[#1C4514]",
  green: "bg-[#5DAA3A] text-[#FFF7E6] border-[#2F6B22]",

  // Highlights
  gold: "bg-[#FFE9A8] text-[#2B1B0F] border-[#7A4B2A]",
  sand: "bg-[#FFE9A8] text-[#2B1B0F] border-[#7A4B2A]",
  yellow: "bg-[#FFE9A8] text-[#2B1B0F] border-[#7A4B2A]",
  orange: "bg-[#FFB36B] text-[#2B1B0F] border-[#7A4B2A]",

  // Water / Sky
  sky: "bg-[#3FA7C9] text-[#FFF7E6] border-[#1E6F8C]",
  cyan: "bg-[#3FA7C9] text-[#FFF7E6] border-[#1E6F8C]",

  // Flower Red / Pink
  red: "bg-[#E04A3F] text-[#FFFFFF] border-[#701A13]",
  pink: "bg-[#FF8FA3] text-[#2B1B0F] border-[#7A4B2A]",
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
          border-4 rounded-[2px]
          p-4 sm:p-5
          box-border
          ${grassTrim ? "border-t-[8px] border-t-[#5DAA3A]" : ""}
          ${interactive
            ? "cursor-pointer transition-transform hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5"
            : ""
          }
          ${dashed ? "border-dashed" : "border-solid"}
          ${colorStyles[color] || colorStyles.forest}
          shadow-[inset_2px_2px_0px_rgba(255,255,255,0.25),inset_-2px_-2px_0px_rgba(0,0,0,0.4),4px_4px_0px_rgba(0,0,0,0.35)]
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

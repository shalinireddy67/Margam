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
  | "dirt"
  | "stone"
  | "sand"
  | "red";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: CardColor;
  dashed?: boolean;
  interactive?: boolean;
  children: React.ReactNode;
}

const colorStyles: Record<CardColor, string> = {
  white: "bg-[#FFFFFF] text-[#111111]",
  sand: "bg-[#F2D16B] text-[#111111]",
  yellow: "bg-[#F2D16B] text-[#111111]",
  sky: "bg-[#7EC8E3] text-[#111111]",
  cyan: "bg-[#7EC8E3] text-[#111111]",
  grass: "bg-[#5DB84A] text-[#111111]",
  green: "bg-[#5DB84A] text-[#111111]",
  darkgrass: "bg-[#3C8A2E] text-[#FFFFFF]",
  dirt: "bg-[#8B5A2B] text-[#FFFFFF]",
  orange: "bg-[#8B5A2B] text-[#FFFFFF]",
  stone: "bg-[#9AA0A6] text-[#111111]",
  red: "bg-[#D9453D] text-[#FFFFFF]",
  pink: "bg-[#D9453D] text-[#FFFFFF]",
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      color = "white",
      dashed = false,
      interactive = false,
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
          border-4 border-[#111111] rounded-none
          p-4 sm:p-5
          ${dashed ? "border-dashed shadow-none" : "border-solid shadow-[4px_4px_0px_#111111]"}
          ${interactive ? "cursor-pointer active:translate-x-[4px] active:translate-y-[4px] active:shadow-none select-none" : ""}
          ${colorStyles[color] || colorStyles.white}
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

"use client";

import React from "react";

export type CardColor =
  | "white"
  | "yellow"
  | "cyan"
  | "pink"
  | "green"
  | "sky"
  | "orange";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: CardColor;
  dashed?: boolean;
  interactive?: boolean;
  children: React.ReactNode;
}

const colorStyles: Record<CardColor, string> = {
  white: "bg-[#FFFFFF] text-[#111111]",
  yellow: "bg-[#FFE14D] text-[#111111]",
  cyan: "bg-[#4DD9E8] text-[#111111]",
  pink: "bg-[#FF4F9A] text-[#111111]",
  green: "bg-[#8DE86A] text-[#111111]",
  sky: "bg-[#A9D8F0] text-[#111111]",
  orange: "bg-[#FF8A3D] text-[#111111]",
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
          border-[3px] border-[#111111]
          rounded-[18px_14px_20px_15px/15px_20px_14px_18px]
          p-4 sm:p-5
          ${dashed ? "border-dashed shadow-none" : "border-solid shadow-[4px_4px_0px_#111111]"}
          ${interactive ? "cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#111111] transition-transform" : ""}
          ${colorStyles[color]}
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

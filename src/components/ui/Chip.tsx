"use client";

import React from "react";

export interface ChipProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  children: React.ReactNode;
}

export const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  ({ selected = false, className = "", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={selected}
        className={`
          inline-flex items-center justify-center
          min-h-[48px] px-4 py-2
          border-4 border-[#111111] rounded-none
          font-heading font-extrabold text-xs sm:text-sm
          box-border cursor-pointer select-none
          active:translate-x-[4px] active:translate-y-[4px]
          ${selected
            ? "bg-[#111111] text-[#FFFFFF] shadow-[inset_2px_2px_0px_rgba(255,255,255,0.3),2px_2px_0px_#111111] active:shadow-none"
            : "bg-[#FFFFFF] text-[#111111] shadow-[4px_4px_0px_#111111] hover:bg-[#F2D16B] active:shadow-none"
          }
          ${className}
        `.trim()}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Chip.displayName = "Chip";

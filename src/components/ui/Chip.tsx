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
          border-[3px] border-[#111111] rounded-full
          font-heading font-extrabold text-base
          box-border cursor-pointer select-none
          transition-transform active:translate-x-[2px] active:translate-y-[2px]
          ${selected
            ? "bg-[#111111] text-[#FFFFFF] shadow-[2px_2px_0px_#111111]"
            : "bg-[#FFFFFF] text-[#111111] shadow-[4px_4px_0px_#111111] hover:bg-[#F9F9F9]"
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

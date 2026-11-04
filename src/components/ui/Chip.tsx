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
          border-[3px] border-[#1E1610] rounded-xs
          font-heading font-extrabold text-xs sm:text-sm
          box-border cursor-pointer select-none
          active:translate-x-[2px] active:translate-y-[2px]
          ${selected
            ? "bg-[#6DB33F] text-[#1E1610] shadow-[2px_2px_0px_#1E1610]"
            : "bg-[#E8CF9C] text-[#1E1610] shadow-[3px_3px_0px_#1E1610] hover:bg-[#F3E3BC]"
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
export default Chip;

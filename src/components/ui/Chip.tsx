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
          border-3 border-[#422816] rounded-[2px]
          font-heading font-extrabold text-xs sm:text-sm
          box-border cursor-pointer select-none
          active:translate-x-[2px] active:translate-y-[2px]
          ${selected
            ? "bg-gradient-to-b from-[#5DAA3A] to-[#2F6B22] text-[#FFF7E6] border-[#204514] shadow-[inset_1px_1px_0px_rgba(255,255,255,0.4),2px_2px_0px_rgba(0,0,0,0.35)]"
            : "bg-[#FFF7E6] text-[#2B1B0F] shadow-[inset_1px_1px_0px_#FFFFFF,4px_4px_0px_rgba(0,0,0,0.35)] hover:bg-[#FFE9A8]"
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

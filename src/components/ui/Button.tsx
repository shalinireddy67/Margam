"use client";

import React from "react";

export type ButtonVariant =
  | "primary"
  | "outline"
  | "yellow"
  | "cyan"
  | "pink"
  | "green"
  | "sky"
  | "orange"
  | "white"
  | "ink"
  | "grass"
  | "darkgrass"
  | "pixelgreen"
  | "forest"
  | "gold"
  | "warmwhite"
  | "charcoal"
  | "dirt"
  | "stone"
  | "sand"
  | "red";

export type ButtonSize = "sm" | "default" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  wobble?: boolean;
  bounce?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  // Primary Grass/Emerald CTA
  primary: "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white border-emerald-400/50 shadow-sm hover:from-emerald-500 hover:to-emerald-400 hover:shadow-md",
  grass: "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white border-emerald-400/50 shadow-sm hover:from-emerald-500 hover:to-emerald-400 hover:shadow-md",
  pixelgreen: "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white border-emerald-400/50 shadow-sm hover:from-emerald-500 hover:to-emerald-400 hover:shadow-md",
  green: "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white border-emerald-400/50 shadow-sm hover:from-emerald-500 hover:to-emerald-400 hover:shadow-md",
  darkgrass: "bg-gradient-to-r from-emerald-800 to-emerald-700 text-white border-emerald-600/50 shadow-sm hover:from-emerald-700 hover:to-emerald-600",
  forest: "bg-gradient-to-r from-emerald-700 to-emerald-600 text-white border-emerald-500/50 shadow-sm hover:from-emerald-600 hover:to-emerald-500",

  // Outline / Secondary Light
  outline: "bg-white/80 text-emerald-950 border-white/80 hover:bg-white shadow-xs hover:shadow-sm",
  white: "bg-white/90 text-emerald-950 border-white/90 hover:bg-white shadow-xs",
  warmwhite: "bg-amber-50/90 text-amber-950 border-amber-200/80 hover:bg-amber-100 shadow-xs",

  // Secondary Stone
  stone: "bg-slate-200/90 text-slate-800 border-slate-300 hover:bg-slate-300/90 shadow-xs",
  charcoal: "bg-slate-700 text-white border-slate-600 hover:bg-slate-600 shadow-xs",

  // Highlight Gold CTA
  gold: "bg-gradient-to-r from-amber-500 to-amber-400 text-white border-amber-300/50 shadow-sm hover:from-amber-400 hover:to-amber-300",
  yellow: "bg-gradient-to-r from-amber-500 to-amber-400 text-white border-amber-300/50 shadow-sm hover:from-amber-400 hover:to-amber-300",
  sand: "bg-gradient-to-r from-amber-500 to-amber-400 text-white border-amber-300/50 shadow-sm hover:from-amber-400 hover:to-amber-300",
  orange: "bg-gradient-to-r from-orange-500 to-orange-400 text-white border-orange-300/50 shadow-sm hover:from-orange-400 hover:to-orange-300",

  // Earth / Dirt
  dirt: "bg-amber-900/80 text-white border-amber-800 hover:bg-amber-800/90 shadow-xs",
  ink: "bg-slate-900 text-white border-slate-800 hover:bg-slate-800 shadow-xs",

  // Water / Info Links
  sky: "bg-gradient-to-r from-sky-500 to-cyan-500 text-white border-sky-300/50 shadow-sm hover:from-sky-400 hover:to-cyan-400",
  cyan: "bg-gradient-to-r from-sky-500 to-cyan-500 text-white border-sky-300/50 shadow-sm hover:from-sky-400 hover:to-cyan-400",

  // Flower Red / Accent
  red: "bg-gradient-to-r from-rose-600 to-rose-500 text-white border-rose-400/50 shadow-sm hover:from-rose-500 hover:to-rose-400",
  pink: "bg-gradient-to-r from-pink-500 to-rose-400 text-white border-pink-300/50 shadow-sm hover:from-pink-400 hover:to-rose-300",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "min-h-[40px] px-3.5 py-1.5 text-xs font-heading",
  default: "min-h-[44px] px-4 py-2 text-xs sm:text-sm font-heading",
  lg: "min-h-[50px] px-5 py-2.5 text-sm sm:text-base font-heading",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "grass",
      size = "default",
      wobble = false,
      bounce = false,
      className = "",
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`
          inline-flex items-center justify-center
          font-bold tracking-wide rounded-xl border
          cursor-pointer select-none transition-all duration-200
          hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]
          disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500
          ${sizeStyles[size]}
          ${variantStyles[variant] || variantStyles.grass}
          ${className}
        `.trim()}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;

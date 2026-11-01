"use client";

import React from "react";

export type ButtonVariant =
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
  // Minecraft pixel palette
  pixelgreen: "bg-[#79B82A] text-[#102610] hover:bg-[#8CD033]",
  grass: "bg-[#4F8A24] text-[#F2F0DF] hover:bg-[#5E9E2C]",
  darkgrass: "bg-[#315B2A] text-[#F2F0DF] hover:bg-[#3E7234]",
  forest: "bg-[#173B19] text-[#F2F0DF] hover:bg-[#214E23]",
  gold: "bg-[#E5B834] text-[#102610] hover:bg-[#F2D16B]",
  warmwhite: "bg-[#F2F0DF] text-[#20251F] hover:bg-[#FFFFFF]",
  charcoal: "bg-[#20251F] text-[#F2F0DF] hover:bg-[#315B2A]",

  // Backward compatible aliases
  sand: "bg-[#E5B834] text-[#102610] hover:bg-[#F2D16B]",
  yellow: "bg-[#E5B834] text-[#102610] hover:bg-[#F2D16B]",
  sky: "bg-[#79B82A] text-[#102610] hover:bg-[#8CD033]",
  cyan: "bg-[#79B82A] text-[#102610] hover:bg-[#8CD033]",
  green: "bg-[#4F8A24] text-[#F2F0DF] hover:bg-[#5E9E2C]",
  dirt: "bg-[#8B5A2B] text-[#FFFFFF] hover:bg-[#774B22]",
  orange: "bg-[#E5B834] text-[#102610] hover:bg-[#F2D16B]",
  stone: "bg-[#9AA0A6] text-[#102610] hover:bg-[#858C92]",
  red: "bg-[#D9453D] text-[#FFFFFF] hover:bg-[#C2362E]",
  pink: "bg-[#D9453D] text-[#FFFFFF] hover:bg-[#C2362E]",
  white: "bg-[#F2F0DF] text-[#20251F] hover:bg-[#FFFFFF]",
  ink: "bg-[#20251F] text-[#F2F0DF] hover:bg-[#315B2A]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "min-h-[44px] px-3.5 py-1.5 text-xs",
  default: "min-h-[48px] px-4 py-2.5 text-xs sm:text-sm",
  lg: "min-h-[54px] px-5 py-3 text-sm sm:text-base",
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
          inline-flex items-center justify-center text-center font-heading
          border-3 border-[#102610] rounded-none
          box-border select-none cursor-pointer
          ${disabled
            ? "bg-[#9AA0A6] text-[#444444] border-[#102610] shadow-none cursor-not-allowed opacity-75"
            : `shadow-[inset_2px_2px_0px_rgba(255,255,255,0.35),inset_-2px_-2px_0px_rgba(0,0,0,0.4),3px_3px_0px_#102610]
               active:translate-x-[2px] active:translate-y-[2px] active:shadow-[inset_2px_2px_0px_rgba(0,0,0,0.5)]`
          }
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

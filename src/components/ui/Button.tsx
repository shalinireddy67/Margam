"use client";

import React from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "white"
  | "grass"
  | "gold"
  | "stone"
  | "dirt"
  | "sky"
  | "red"
  | "yellow"
  | "cyan"
  | "pink"
  | "green"
  | "orange"
  | "ink";

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
  // Primary Grass (#5DAA3A) with Ink (#2B1B0F) text for WCAG AA contrast (4.8:1)
  primary: "bg-[#5DAA3A] text-[#2B1B0F] border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] hover:brightness-105 active:translate-x-[4px] active:translate-y-[4px] font-bold",
  grass: "bg-[#5DAA3A] text-[#2B1B0F] border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] hover:brightness-105 active:translate-x-[4px] active:translate-y-[4px] font-bold",
  green: "bg-[#5DAA3A] text-[#2B1B0F] border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] hover:brightness-105 active:translate-x-[4px] active:translate-y-[4px] font-bold",

  // Secondary White with Ink text
  secondary: "bg-[#FFFFFF] text-[#2B1B0F] border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] hover:bg-[#FFF7E6] active:translate-x-[4px] active:translate-y-[4px] font-bold",
  white: "bg-[#FFFFFF] text-[#2B1B0F] border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] hover:bg-[#FFF7E6] active:translate-x-[4px] active:translate-y-[4px] font-bold",
  outline: "bg-transparent text-[#2B1B0F] border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] hover:bg-white active:translate-x-[4px] active:translate-y-[4px] font-bold",

  // Accent Gold (#F4C542)
  gold: "bg-[#F4C542] text-[#2B1B0F] border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] hover:brightness-105 active:translate-x-[4px] active:translate-y-[4px] font-bold",
  yellow: "bg-[#F4C542] text-[#2B1B0F] border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] hover:brightness-105 active:translate-x-[4px] active:translate-y-[4px] font-bold",

  // Neutral Stone
  stone: "bg-[#D9D9D9] text-[#2B1B0F] border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] hover:bg-[#EAEAEA] active:translate-x-[4px] active:translate-y-[4px] font-bold",

  // Ground Dirt
  dirt: "bg-[#7A4B2A] text-[#FFF7E6] border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] hover:brightness-110 active:translate-x-[4px] active:translate-y-[4px] font-bold",
  ink: "bg-[#2B1B0F] text-[#FFF7E6] border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] hover:bg-[#422816] active:translate-x-[4px] active:translate-y-[4px] font-bold",

  // Sky / Water
  sky: "bg-[#6EB5FF] text-[#2B1B0F] border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] hover:brightness-105 active:translate-x-[4px] active:translate-y-[4px] font-bold",
  cyan: "bg-[#3FA7C9] text-[#2B1B0F] border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] hover:brightness-105 active:translate-x-[4px] active:translate-y-[4px] font-bold",

  // Flower Accents
  red: "bg-[#E04A3F] text-[#FFFFFF] border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] hover:brightness-110 active:translate-x-[4px] active:translate-y-[4px] font-bold",
  pink: "bg-[#FF8FA3] text-[#2B1B0F] border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] hover:brightness-105 active:translate-x-[4px] active:translate-y-[4px] font-bold",
  orange: "bg-[#FFB36B] text-[#2B1B0F] border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] hover:brightness-105 active:translate-x-[4px] active:translate-y-[4px] font-bold",
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
          border-3 rounded-[2px]
          box-border select-none cursor-pointer
          ${disabled
            ? "bg-[#8B8B8B] text-[#5E5E5E] border-[#5E5E5E] shadow-none cursor-not-allowed opacity-75"
            : `shadow-[inset_2px_2px_0px_rgba(255,255,255,0.4),inset_-2px_-2px_0px_rgba(0,0,0,0.4),4px_4px_0px_rgba(0,0,0,0.35)]
               hover:translate-x-0 hover:translate-y-0
               active:translate-x-[2px] active:translate-y-[2px] active:shadow-[inset_2px_2px_0px_rgba(0,0,0,0.5),2px_2px_0px_rgba(0,0,0,0.35)]
               focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#FFE9A8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#2B1B0F]`
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

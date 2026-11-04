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
  // Primary Grass (#6DB33F) with Ink (#1E1610) text
  primary: "bg-[#6DB33F] text-[#1E1610] border-[3px] border-[#1E1610] shadow-[3px_3px_0px_#1E1610] hover:bg-[#8CCB55] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#1E1610] font-heading font-extrabold",
  grass: "bg-[#6DB33F] text-[#1E1610] border-[3px] border-[#1E1610] shadow-[3px_3px_0px_#1E1610] hover:bg-[#8CCB55] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#1E1610] font-heading font-extrabold",
  green: "bg-[#6DB33F] text-[#1E1610] border-[3px] border-[#1E1610] shadow-[3px_3px_0px_#1E1610] hover:bg-[#8CCB55] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#1E1610] font-heading font-extrabold",

  // Secondary Plank (#D9B87A) with Ink text (replaces white)
  secondary: "bg-[#D9B87A] text-[#1E1610] border-[3px] border-[#1E1610] shadow-[3px_3px_0px_#1E1610] hover:bg-[#E8CF9C] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#1E1610] font-heading font-extrabold",
  white: "bg-[#D9B87A] text-[#1E1610] border-[3px] border-[#1E1610] shadow-[3px_3px_0px_#1E1610] hover:bg-[#E8CF9C] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#1E1610] font-heading font-extrabold",
  outline: "bg-transparent text-[#1E1610] border-[3px] border-[#1E1610] shadow-[3px_3px_0px_#1E1610] hover:bg-[#E8CF9C] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#1E1610] font-heading font-extrabold",

  // Accent Gold (#F2C230)
  gold: "bg-[#F2C230] text-[#1E1610] border-[3px] border-[#1E1610] shadow-[3px_3px_0px_#1E1610] hover:brightness-105 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#1E1610] font-heading font-extrabold",
  yellow: "bg-[#F2C230] text-[#1E1610] border-[3px] border-[#1E1610] shadow-[3px_3px_0px_#1E1610] hover:brightness-105 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#1E1610] font-heading font-extrabold",

  // Neutral Stone
  stone: "bg-[#B9BCC0] text-[#1E1610] border-[3px] border-[#1E1610] shadow-[3px_3px_0px_#1E1610] hover:bg-[#D9B87A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#1E1610] font-heading font-extrabold",

  // Ground Dirt
  dirt: "bg-[#8B5A2B] text-[#F3E3BC] border-[3px] border-[#1E1610] shadow-[3px_3px_0px_#1E1610] hover:brightness-110 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#1E1610] font-heading font-extrabold",
  ink: "bg-[#1E1610] text-[#F3E3BC] border-[3px] border-[#1E1610] shadow-[3px_3px_0px_#1E1610] hover:bg-[#232634] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#1E1610] font-heading font-extrabold",

  // Sky / Water
  sky: "bg-[#78BDE8] text-[#1E1610] border-[3px] border-[#1E1610] shadow-[3px_3px_0px_#1E1610] hover:brightness-105 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#1E1610] font-heading font-extrabold",
  cyan: "bg-[#4EDBD3] text-[#1E1610] border-[3px] border-[#1E1610] shadow-[3px_3px_0px_#1E1610] hover:brightness-105 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#1E1610] font-heading font-extrabold",

  // Mistakes and gaps ONLY
  red: "bg-[#D1362B] text-[#F3E3BC] border-[3px] border-[#1E1610] shadow-[3px_3px_0px_#1E1610] hover:brightness-110 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#1E1610] font-heading font-extrabold",
  pink: "bg-[#E8CF9C] text-[#1E1610] border-[3px] border-[#1E1610] shadow-[3px_3px_0px_#1E1610] hover:brightness-105 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#1E1610] font-heading font-extrabold",
  orange: "bg-[#F2C230] text-[#1E1610] border-[3px] border-[#1E1610] shadow-[3px_3px_0px_#1E1610] hover:brightness-105 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#1E1610] font-heading font-extrabold",
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
          inline-flex items-center justify-center text-center font-heading font-extrabold
          border-3 rounded-xs
          box-border select-none cursor-pointer
          ${disabled
            ? "bg-[#6B6F76] text-[#B9BCC0] border-[#1E1610] shadow-none cursor-not-allowed opacity-75"
            : `shadow-[3px_3px_0px_#1E1610]
               active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#1E1610]
               focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#2F4FB5]`
          }
          ${sizeStyles[size]}
          ${variantStyles[variant]}
          ${className}
        `}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;

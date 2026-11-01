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
  // Pixel palette aliases
  sand: "bg-[#F2D16B] text-[#111111] hover:bg-[#E5C254]",
  yellow: "bg-[#F2D16B] text-[#111111] hover:bg-[#E5C254]",
  sky: "bg-[#7EC8E3] text-[#111111] hover:bg-[#68B7D4]",
  cyan: "bg-[#7EC8E3] text-[#111111] hover:bg-[#68B7D4]",
  grass: "bg-[#5DB84A] text-[#111111] hover:bg-[#4EA33D]",
  green: "bg-[#5DB84A] text-[#111111] hover:bg-[#4EA33D]",
  darkgrass: "bg-[#3C8A2E] text-[#FFFFFF] hover:bg-[#2F7323]",
  dirt: "bg-[#8B5A2B] text-[#FFFFFF] hover:bg-[#774B22]",
  orange: "bg-[#8B5A2B] text-[#FFFFFF] hover:bg-[#774B22]",
  stone: "bg-[#9AA0A6] text-[#111111] hover:bg-[#858C92]",
  red: "bg-[#D9453D] text-[#FFFFFF] hover:bg-[#C2362E]",
  pink: "bg-[#D9453D] text-[#FFFFFF] hover:bg-[#C2362E]",
  white: "bg-[#FFFFFF] text-[#111111] hover:bg-[#EAEAEA]",
  ink: "bg-[#111111] text-[#FFFFFF] hover:bg-[#222222]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "min-h-[48px] px-3.5 py-2 text-xs",
  default: "min-h-[50px] px-4 py-2.5 text-xs sm:text-sm",
  lg: "min-h-[54px] px-5 py-3 text-sm sm:text-base",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "yellow",
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
          border-4 border-[#111111] rounded-none
          box-border select-none
          ${disabled
            ? "bg-[#9AA0A6] text-[#444444] border-[#111111] shadow-none cursor-not-allowed opacity-75"
            : `shadow-[inset_3px_3px_0px_rgba(255,255,255,0.45),inset_-3px_-3px_0px_rgba(0,0,0,0.35),4px_4px_0px_#111111]
               active:translate-x-[4px] active:translate-y-[4px]
               active:shadow-[inset_3px_3px_0px_rgba(0,0,0,0.4),inset_-3px_-3px_0px_rgba(255,255,255,0.2),0px_0px_0px_#111111]
               cursor-pointer`
          }
          ${variantStyles[variant] || variantStyles.yellow}
          ${sizeStyles[size]}
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

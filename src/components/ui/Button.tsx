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
  yellow: "bg-[#FFE14D] text-[#111111] hover:bg-[#FFD71A]",
  cyan: "bg-[#4DD9E8] text-[#111111] hover:bg-[#32D0E1]",
  pink: "bg-[#FF4F9A] text-[#111111] hover:bg-[#FF358B]",
  green: "bg-[#8DE86A] text-[#111111] hover:bg-[#77E44D]",
  sky: "bg-[#A9D8F0] text-[#111111] hover:bg-[#8ECDEF]",
  orange: "bg-[#FF8A3D] text-[#111111] hover:bg-[#FF771F]",
  white: "bg-[#FFFFFF] text-[#111111] hover:bg-[#F5F5F5]",
  ink: "bg-[#111111] text-[#FFFFFF] hover:bg-[#222222]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "min-h-[48px] px-4 py-2 text-base font-bold",
  default: "min-h-[52px] px-5 py-3 text-lg font-extrabold",
  lg: "min-h-[56px] px-6 py-3.5 text-xl font-extrabold",
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
          border-[3px] border-[#111111] rounded-[18px_14px_20px_15px/15px_20px_14px_18px]
          box-border select-none transition-transform
          ${disabled
            ? "bg-[#E0E0E0] text-[#777777] border-[#888888] shadow-none cursor-not-allowed opacity-70"
            : "shadow-[4px_4px_0px_#111111] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#111111] cursor-pointer"
          }
          ${wobble ? "wobble" : ""}
          ${bounce ? "bounce" : ""}
          ${variantStyles[variant]}
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

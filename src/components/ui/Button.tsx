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
  // Primary Grass-top look
  grass: "bg-gradient-to-b from-[#5DAA3A] via-[#4F8A24] to-[#2F6B22] text-[#FFF7E6] border-[#204514] hover:brightness-110",
  pixelgreen: "bg-gradient-to-b from-[#5DAA3A] via-[#4F8A24] to-[#2F6B22] text-[#FFF7E6] border-[#204514] hover:brightness-110",
  green: "bg-gradient-to-b from-[#5DAA3A] via-[#4F8A24] to-[#2F6B22] text-[#FFF7E6] border-[#204514] hover:brightness-110",
  darkgrass: "bg-[#2F6B22] text-[#FFF7E6] border-[#1C4514] hover:bg-[#3D822D]",
  forest: "bg-[#2F6B22] text-[#FFF7E6] border-[#1C4514] hover:bg-[#3D822D]",

  // Secondary Stone look
  stone: "bg-gradient-to-b from-[#9E9E9E] via-[#8B8B8B] to-[#5E5E5E] text-[#FFF7E6] border-[#3F3F3F] hover:brightness-110",
  charcoal: "bg-[#5E5E5E] text-[#FFF7E6] border-[#3F3F3F] hover:bg-[#707070]",

  // Highlight Gold CTA
  gold: "bg-gradient-to-b from-[#FFE9A8] via-[#F4C542] to-[#C6961E] text-[#2B1B0F] border-[#7A4B2A] hover:brightness-105",
  yellow: "bg-gradient-to-b from-[#FFE9A8] via-[#F4C542] to-[#C6961E] text-[#2B1B0F] border-[#7A4B2A] hover:brightness-105",
  sand: "bg-gradient-to-b from-[#FFE9A8] via-[#F4C542] to-[#C6961E] text-[#2B1B0F] border-[#7A4B2A] hover:brightness-105",
  orange: "bg-gradient-to-b from-[#FFE9A8] via-[#FFB36B] to-[#D47E30] text-[#2B1B0F] border-[#7A4B2A] hover:brightness-105",

  // Wood & Dirt
  dirt: "bg-gradient-to-b from-[#A06A3C] via-[#7A4B2A] to-[#5A3720] text-[#FFF7E6] border-[#422816] hover:brightness-110",
  ink: "bg-[#5A3720] text-[#FFF7E6] border-[#422816] hover:bg-[#7A4B2A]",

  // Water / Info Links
  sky: "bg-gradient-to-b from-[#6EB5FF] via-[#3FA7C9] to-[#1E6F8C] text-[#FFF7E6] border-[#134D63] hover:brightness-110",
  cyan: "bg-gradient-to-b from-[#6EB5FF] via-[#3FA7C9] to-[#1E6F8C] text-[#FFF7E6] border-[#134D63] hover:brightness-110",

  // Flower Red / Accent
  red: "bg-gradient-to-b from-[#FF756B] via-[#E04A3F] to-[#A32B22] text-[#FFFFFF] border-[#701A13] hover:brightness-110",
  pink: "bg-gradient-to-b from-[#FFB36B] via-[#FF8FA3] to-[#D65F76] text-[#2B1B0F] border-[#7A4B2A] hover:brightness-105",

  // Parchment Light
  white: "bg-[#FFF7E6] text-[#2B1B0F] border-[#5A3720] hover:bg-[#FFFFFF]",
  warmwhite: "bg-[#FFF7E6] text-[#2B1B0F] border-[#5A3720] hover:bg-[#FFFFFF]",
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

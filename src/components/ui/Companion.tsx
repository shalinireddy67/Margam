"use client";

import React from "react";

export type CompanionPose = "greet" | "read" | "think" | "cheer" | "oops" | "sleepy";

export interface CompanionProps {
  pose?: CompanionPose;
  size?: number | "sm" | "default" | "lg" | "xl";
  className?: string;
  alt?: string;
  sticker?: boolean;
  simplified?: boolean;
  withShadow?: boolean;
}

/**
 * Margam Learning Companion (Minecraft-inspired Chicken Jockey mascot).
 * Faithful to authentic voxel identity, balanced proportions, and transparent rendering.
 */
export function Companion({
  pose = "greet",
  size = "default",
  className = "",
  alt,
  sticker = false,
  withShadow = false,
}: CompanionProps) {
  let dimension = 140;
  if (typeof size === "number") {
    dimension = size;
  } else if (size === "sm") {
    dimension = 64;
  } else if (size === "default") {
    dimension = 140;
  } else if (size === "lg") {
    dimension = 220;
  } else if (size === "xl") {
    dimension = 280;
  }

  // Mascot aspect ratio: width is ~0.52 of height
  const mascotHeight = dimension;
  const mascotWidth = Math.round(dimension * 0.52);

  const defaultAlt = {
    greet: "Margam learning companion greeting you",
    read: "Margam learning companion reading math lessons",
    think: "Margam learning companion thinking carefully",
    cheer: "Margam learning companion celebrating your victory!",
    oops: "Margam learning companion offering encouragement",
    sleepy: "Margam learning companion resting peacefully at night",
  }[pose];

  const animationClass =
    pose === "cheer"
      ? "animate-companion-bounce"
      : "animate-companion-gentle-float";

  return (
    <div
      data-testid="learning-companion"
      data-testid-companion="chicken-jockey"
      data-pose={pose}
      role="img"
      aria-label={alt || defaultAlt}
      style={{ width: mascotWidth + (sticker ? 16 : 0), height: mascotHeight + (withShadow ? 12 : 0) }}
      className={`relative inline-flex flex-col items-center justify-center shrink-0 select-none ${className}`}
    >
      {/* Optional Sticker / Block Backing */}
      {sticker && (
        <div className="absolute inset-0 bg-[#5A3720] border-2 border-[#422816] shadow-[3px_3px_0px_rgba(0,0,0,0.4)] -z-10" />
      )}

      {/* Mascot Container with Smooth Gentle Float Animation */}
      <div className={`relative w-full h-full flex items-center justify-center ${animationClass} motion-reduce:animate-none`}>
        <img
          src="/images/companion/mascot-trimmed.png"
          alt={alt || defaultAlt}
          width={mascotWidth}
          height={mascotHeight}
          className="object-contain drop-shadow-[2px_4px_0px_rgba(30,22,16,0.65)]"
          style={{
            maxHeight: "100%",
            maxWidth: "100%",
            imageRendering: "pixelated",
          }}
        />

        {/* Pose Badges & Expressions */}
        {pose === "think" && (
          <div className="absolute -top-1 -right-2 bg-[#FFE9A8] text-[#2B1B0F] border-2 border-[#422816] shadow-[2px_2px_0px_rgba(0,0,0,0.4)] px-1.5 py-0.5 text-[9px] font-heading font-extrabold animate-bounce">
            ?
          </div>
        )}

        {pose === "cheer" && (
          <div className="absolute -top-2 -right-2 flex gap-0.5">
            <span className="text-sm select-none animate-pulse">⭐</span>
            <span className="text-xs select-none">✨</span>
          </div>
        )}

        {pose === "oops" && (
          <div className="absolute -top-1 -right-2 bg-[#5DAA3A] text-[#FFF7E6] border-2 border-[#422816] shadow-[2px_2px_0px_rgba(0,0,0,0.4)] px-1 py-0.5 text-[8px] font-heading font-bold">
            🛡️
          </div>
        )}

        {pose === "read" && (
          <div className="absolute -bottom-1 -right-1 bg-[#5A3720] text-[#FFE9A8] border border-[#7A4B2A] px-1 py-0.5 text-[8px] font-heading">
            📖
          </div>
        )}

        {pose === "greet" && (
          <div className="absolute -top-1.5 -left-1.5 text-xs animate-pulse">
            👋
          </div>
        )}

        {pose === "sleepy" && (
          <div className="absolute -top-2 -right-1 flex gap-0.5 items-center select-none font-pixel text-[10px] text-[#6EB5FF] animate-pulse">
            <span>z</span>
            <span className="text-xs">Z</span>
            <span className="text-sm">z</span>
          </div>
        )}
      </div>

      {/* Subtle Grounding Shadow that breathes in sync with the float */}
      {withShadow && (
        <div
          aria-hidden="true"
          className="w-[65%] h-2 bg-[#1E1610]/35 rounded-full blur-[1px] -mt-1 animate-companion-shadow motion-reduce:animate-none pointer-events-none"
        />
      )}
    </div>
  );
}

// Aliases for clean semantic naming
export const LearningCompanion = Companion;
export const ChickenJockey = Companion;

export default Companion;

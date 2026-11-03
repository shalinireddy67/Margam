"use client";

import React from "react";
import Image from "next/image";

export type WitchCatPose = "greet" | "read" | "think" | "cheer" | "oops" | "sleepy";
export type CompanionPose = WitchCatPose;

export interface WitchCatProps {
  pose?: WitchCatPose;
  size?: number | "sm" | "default" | "lg";
  className?: string;
  alt?: string;
  sticker?: boolean;
  simplified?: boolean;
}

/**
 * Margam Learning Companion: Maru the companion (block-world character).
 */
export function WitchCat({
  pose = "greet",
  size = "default",
  className = "",
  alt,
  sticker = false,
}: WitchCatProps) {
  let dimension = 120;
  if (typeof size === "number") {
    dimension = size;
  } else if (size === "sm") {
    dimension = 64;
  } else if (size === "default") {
    dimension = 120;
  } else if (size === "lg") {
    dimension = 220;
  }

  // Mascot aspect ratio: width is ~0.51 of height (328 x 640)
  const mascotHeight = dimension;
  const mascotWidth = Math.round(dimension * 0.52);

  const defaultAlt = {
    greet: "Margam companion greeting you",
    read: "Margam companion reading math lessons",
    think: "Margam companion thinking carefully",
    cheer: "Margam companion celebrating your progress",
    oops: "Margam companion offering encouragement",
    sleepy: "Margam companion resting peacefully",
  }[pose];

  const animationClass =
    pose === "cheer"
      ? "animate-companion-bounce"
      : pose === "greet"
        ? "animate-companion-hop"
        : "animate-companion-float";

  return (
    <div
      data-testid="witch-cat"
      data-testid-companion="chicken-jockey"
      data-pose={pose}
      role="img"
      aria-label={alt || defaultAlt}
      style={{ width: mascotWidth + (sticker ? 16 : 0), height: mascotHeight }}
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
    >
      {/* Optional Sticker / Block Backing */}
      {sticker && (
        <div className="absolute inset-0 bg-[#5A3720] border-2 border-[#422816] shadow-[3px_3px_0px_rgba(0,0,0,0.4)] -z-10" />
      )}

      {/* Mascot Container with Subtle Block Animation */}
      <div className={`relative w-full h-full flex items-center justify-center ${animationClass} motion-reduce:animate-none`}>
        <img
          src="/images/companion/mascot-trimmed.png"
          alt={alt || defaultAlt}
          width={mascotWidth}
          height={mascotHeight}
          className="object-contain drop-shadow-[2px_3px_0px_rgba(43,27,15,0.7)]"
          style={{
            maxHeight: "100%",
            maxWidth: "100%",
            imageRendering: "pixelated",
          }}
        />

        {/* Pose Badges & Expressions without altering mascot */}
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
      </div>
    </div>
  );
}

// Aliases for clear semantic naming across the codebase
export const Companion = WitchCat;
export const ChickenJockey = WitchCat;
export const LearningCompanion = WitchCat;

export default WitchCat;

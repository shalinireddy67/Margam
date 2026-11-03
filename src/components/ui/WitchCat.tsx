"use client";

import React from "react";

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
 * Cat companion disabled per design requirements ("No cat companion").
 * Returns null to eliminate rendering and asset loading overhead.
 */
export function WitchCat(_props: WitchCatProps) {
  return null;
}

export const Companion = WitchCat;
export const ChickenJockey = WitchCat;
export const LearningCompanion = WitchCat;
export default WitchCat;

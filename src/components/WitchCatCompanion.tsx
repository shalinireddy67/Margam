"use client";

import React from "react";
import { type WitchCatPose } from "@/components/ui/WitchCat";

export type CompanionContext =
  | "greeting"
  | "lesson_start"
  | "correct"
  | "incorrect"
  | "completed"
  | "locked"
  | "welcome_back";

interface WitchCatCompanionProps {
  studentName?: string;
  context?: CompanionContext;
  customMessage?: string;
  className?: string;
  mode?: "floating" | "inline";
  pose?: WitchCatPose;
  sticker?: boolean;
}

/**
 * Cat companion widget disabled per design requirements ("No cat companion").
 * Returns null to eliminate rendering overhead.
 */
export default function WitchCatCompanion(_props: WitchCatCompanionProps) {
  return null;
}

export const LearningCompanionWidget = WitchCatCompanion;

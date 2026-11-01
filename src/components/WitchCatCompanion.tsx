"use client";

import React, { useState, useEffect } from "react";
import { X, Sparkles } from "lucide-react";
import { WitchCat, type WitchCatPose } from "@/components/ui/WitchCat";

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

export default function WitchCatCompanion({
  studentName = "Learner",
  context = "greeting",
  customMessage,
  className = "",
  mode = "floating",
  pose: propPose,
  sticker = false,
}: WitchCatCompanionProps) {
  const [bubbleDismissed, setBubbleDismissed] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");

  const poseMap: Record<CompanionContext, WitchCatPose> = {
    greeting: "greet",
    lesson_start: "read",
    correct: "cheer",
    incorrect: "oops",
    completed: "cheer",
    locked: "think",
    welcome_back: "greet",
  };
  const activePose: WitchCatPose = propPose || poseMap[context] || "greet";

  useEffect(() => {
    if (customMessage) {
      setCurrentMessage(customMessage);
      setBubbleDismissed(false);
      return;
    }

    switch (context) {
      case "greeting":
        setCurrentMessage(`Hey ${studentName}! Ready to build your math realm today?`);
        break;
      case "lesson_start":
        setCurrentMessage("Let's break down this concept block by block. Read carefully!");
        break;
      case "correct":
        setCurrentMessage("Spot on! That's how we master it!");
        break;
      case "incorrect":
        setCurrentMessage("Don't worry, every mistake shows where our foundation needs support.");
        break;
      case "completed":
        setCurrentMessage(`Quest cleared! Great job strengthening your path, ${studentName}!`);
        break;
      case "locked":
        setCurrentMessage("Complete the previous block to unlock this new lesson!");
        break;
      case "welcome_back":
        setCurrentMessage(`Welcome back to your realm, ${studentName}! Let's pick up where we left off.`);
        break;
      default:
        setCurrentMessage("Ready to conquer new math concepts? Let's go!");
    }
    setBubbleDismissed(false);
  }, [context, customMessage, studentName]);

  const toggleBubble = () => {
    setBubbleDismissed((prev) => !prev);
  };

  if (mode === "inline") {
    return (
      <aside
        aria-label="Study companion greeting"
        className={`flex items-start gap-4 p-4 bg-[#5A3720] border-4 border-[#422816] shadow-[4px_4px_0px_rgba(0,0,0,0.4)] text-[#FFF7E6] ${className}`}
      >
        <div className="relative shrink-0 w-16 h-24 flex items-center justify-center">
          <WitchCat
            pose={activePose}
            size={90}
            sticker={sticker}
            alt="Margam Learning Companion"
          />
        </div>

        <div className="flex-1 space-y-1.5 pt-1">
          <div className="flex items-center gap-1.5 text-xs font-heading font-extrabold text-[#FFE9A8]">
            <Sparkles className="w-3.5 h-3.5 text-[#FFE9A8]" />
            <span>LEARNING COMPANION</span>
          </div>
          <p className="text-xs sm:text-sm text-[#FFF7E6] font-medium leading-relaxed">
            {currentMessage}
          </p>
        </div>
      </aside>
    );
  }

  // Floating Mode: Positioned in bottom corner
  return (
    <aside
      aria-label="Floating study companion"
      className={`fixed bottom-4 right-4 z-40 flex flex-col items-end pointer-events-none ${className}`}
    >
      {/* Speech Bubble (Dismissible) */}
      {!bubbleDismissed && currentMessage && (
        <div className="pointer-events-auto max-w-[270px] sm:max-w-[310px] mb-2 p-3 bg-[#FFF7E6] border-3 border-[#422816] shadow-[4px_4px_0px_rgba(0,0,0,0.4)] text-[#2B1B0F] text-xs sm:text-sm font-medium leading-snug relative animate-in fade-in slide-in-from-bottom-2 duration-200 motion-reduce:animate-none">
          <div className="flex items-center justify-between pb-1 mb-1 border-b border-[#422816]/20 text-[10px] font-heading font-bold text-[#5A3720]">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#5DAA3A]" />
              COMPANION
            </span>
            <button
              type="button"
              onClick={() => setBubbleDismissed(true)}
              aria-label="Dismiss speech bubble"
              className="text-[#2B1B0F]/60 hover:text-[#2B1B0F] p-0.5 border-0 bg-transparent cursor-pointer font-bold"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="font-semibold text-xs text-[#2B1B0F]">{currentMessage}</p>
          {/* Minecraft block tail */}
          <div className="absolute -bottom-2 right-6 w-3 h-3 bg-[#FFF7E6] border-b-2 border-r-2 border-[#422816] rotate-45" />
        </div>
      )}

      {/* Mascot Avatar (Clickable to re-open bubble) */}
      <button
        type="button"
        onClick={toggleBubble}
        aria-label="Learning Companion - Click for message"
        title="Click to hear from your learning companion"
        className="pointer-events-auto group relative w-16 h-24 sm:w-20 sm:h-28 flex items-center justify-center p-1 cursor-pointer bg-transparent border-0 outline-none focus-visible:ring-2 focus-visible:ring-[#FFE9A8]"
      >
        <WitchCat
          pose={activePose}
          size={100}
          sticker={sticker}
          alt="Margam Learning Companion"
          className="transition-transform group-hover:scale-105 motion-reduce:transform-none"
        />
      </button>
    </aside>
  );
}

export const LearningCompanionWidget = WitchCatCompanion;

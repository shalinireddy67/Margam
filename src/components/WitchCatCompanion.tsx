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
  sticker = true,
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
        setCurrentMessage(`Hey, ${studentName}! Ready for today's learning journey?`);
        break;
      case "lesson_start":
        setCurrentMessage("Let's explore this idea together. Take your time reading!");
        break;
      case "correct":
        setCurrentMessage("You got it! Nicely done!");
        break;
      case "incorrect":
        setCurrentMessage("Not quite yet. Let's understand why from the steps.");
        break;
      case "completed":
        setCurrentMessage("One more step on your path! Well done, " + studentName + "!");
        break;
      case "locked":
        setCurrentMessage("Let's finish the previous lesson first, then this one opens!");
        break;
      case "welcome_back":
        setCurrentMessage(`Welcome back, ${studentName}! Let's continue where you left off.`);
        break;
      default:
        setCurrentMessage("Ready to begin? Let's take it one step at a time!");
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
        className={`flex items-start gap-4 p-4 rounded-3xl bg-peach-light/80 border border-peach-border ${className}`}
      >
        <div className="relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 animate-gentle-float">
          <WitchCat
            pose={activePose}
            size={80}
            sticker={sticker}
            alt="Margam Witch Cat Study Companion"
          />
        </div>

        <div className="flex-1 space-y-1 pt-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-plum">
            <Sparkles className="w-3.5 h-3.5 text-berry" />
            <span>Study Companion</span>
          </div>
          <p className="text-xs sm:text-sm text-plum font-medium leading-relaxed">
            {currentMessage}
          </p>
        </div>
      </aside>
    );
  }

  // Floating Mode: Positioned in non-obstructive bottom corner
  return (
    <aside
      aria-label="Floating study companion"
      className={`fixed bottom-4 right-4 z-30 flex flex-col items-end pointer-events-none ${className}`}
    >
      {/* Speech Bubble (Dismissible) */}
      {!bubbleDismissed && currentMessage && (
        <div className="pointer-events-auto max-w-[260px] sm:max-w-[290px] mb-2 p-3.5 rounded-2xl bg-white border border-peach-border shadow-soft text-plum text-xs sm:text-sm font-medium leading-snug relative animate-in fade-in slide-in-from-bottom-2 duration-200">
          <button
            type="button"
            onClick={() => setBubbleDismissed(true)}
            aria-label="Dismiss speech bubble"
            className="absolute -top-4 -right-4 min-w-[48px] min-h-[48px] flex items-center justify-center cursor-pointer transition-colors bg-transparent border-0"
          >
            <span className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 text-grey hover:text-plum flex items-center justify-center border border-slate-200 shadow-xs">
              <X className="w-3.5 h-3.5" />
            </span>
          </button>
          <p>{currentMessage}</p>
          {/* Bubble tail pointing to cat */}
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white border-b border-r border-peach-border rotate-45" />
        </div>
      )}

      {/* Cat Avatar (Clickable to re-open bubble) */}
      <button
        type="button"
        onClick={toggleBubble}
        aria-label="Witch Cat Companion - Click for message"
        title="Click to hear from your study companion"
        className="pointer-events-auto group relative w-16 h-16 sm:w-20 sm:h-20 transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-berry rounded-full p-1"
      >
        <div className="relative w-full h-full animate-gentle-float">
          <WitchCat
            pose={activePose}
            size={80}
            sticker={sticker}
            alt="Margam Witch Cat"
            className="transition-transform group-hover:scale-105"
          />
        </div>
      </button>
    </aside>
  );
}


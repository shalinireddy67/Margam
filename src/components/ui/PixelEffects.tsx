"use client";

import React, { useEffect, useState } from "react";
import { Zap, Trophy, Award, Flame } from "lucide-react";
import { getLevelProgress, XpRank } from "@/lib/xp-config";
import { playLevelUpSound } from "@/lib/sound";

/**
 * Pixel Confetti Burst Component
 * Radiates 10 colorful pixel squares outward with smooth physics.
 * Replaces with simple fade when prefers-reduced-motion is active.
 */
export function PixelConfetti({ active }: { active: boolean }) {
  if (!active) return null;

  const particles = [
    { x: -36, y: -42, color: "#6DB33F", size: 8, delay: 0 },
    { x: 38, y: -40, color: "#F2C230", size: 6, delay: 40 },
    { x: -50, y: -10, color: "#4EDBD3", size: 8, delay: 20 },
    { x: 52, y: -14, color: "#E8CF9C", size: 6, delay: 60 },
    { x: -28, y: -60, color: "#F2C230", size: 10, delay: 10 },
    { x: 26, y: -58, color: "#6DB33F", size: 8, delay: 50 },
    { x: 0, y: -65, color: "#78BDE8", size: 8, delay: 30 },
    { x: -44, y: -30, color: "#D9B87A", size: 6, delay: 70 },
  ];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible z-30"
    >
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute block animate-pixel-burst motion-reduce:opacity-0"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            boxShadow: `1px 1px 0px #1E1610`,
            transform: `translate(${p.x}px, ${p.y}px)`,
            animationDelay: `${p.delay}ms`,
          }}
        />
      ))}
    </div>
  );
}

/**
 * Floating XP Gain Indicator (+10 XP)
 */
export function FloatingXp({
  xp,
  active,
}: {
  xp: number;
  active: boolean;
}) {
  if (!active || xp <= 0) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed top-16 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-auto sm:right-8 sm:top-20 z-50 animate-xp-float motion-reduce:animate-none flex items-center gap-1.5 px-3 py-1.5 bg-[#6DB33F] text-[#1E1610] border-2 border-[#1E1610] shadow-[3px_3px_0px_#1E1610] font-heading font-extrabold text-xs"
    >
      <Zap className="w-4 h-4 text-[#1E1610]" />
      <span>+{xp} XP</span>
    </div>
  );
}

/**
 * Kind Mistake Creature Helper Card
 * Replaces harsh red errors with a helpful companion message.
 */
export function MistakeCreatureCard({
  tag,
  hint,
  onDismiss,
}: {
  tag?: string;
  hint?: string;
  onDismiss?: () => void;
}) {
  const categoryInfo = (() => {
    const t = (tag || "").toLowerCase();
    if (t.includes("sign") || t.includes("negative") || t.includes("minus")) {
      return {
        name: "Sign Slip",
        creature: "❄️",
        line: "Sign Slip spotted! Remember: when multiplying two negatives, the result turns positive.",
        color: "#78BDE8",
      };
    }
    if (t.includes("added_instead") || t.includes("multipli") || t.includes("square")) {
      return {
        name: "Operation Ooze",
        creature: "🧪",
        line: "Operation Ooze spotted! Check whether the problem asks to add, multiply, or square.",
        color: "#F2C230",
      };
    }
    if (t.includes("bracket") || t.includes("distribut") || t.includes("term")) {
      return {
        name: "Bracket Bug",
        creature: "🐛",
        line: "Bracket Bug spotted! Remember to multiply the outside factor with every term inside.",
        color: "#E8CF9C",
      };
    }
    return {
      name: "Curious Critter",
      creature: "🦉",
      line: hint || "A small misstep spotted! Take a deep breath and review the steps calmly.",
      color: "#E8CF9C",
    };
  })();

  return (
    <div
      role="alert"
      aria-live="polite"
      data-panel="mistake-card"
      className="animate-gentle-shake motion-reduce:animate-none mt-4 p-3.5 bg-[#232634]/95 border-[3px] border-[#1E1610] shadow-[3px_3px_0px_#1E1610] text-[#F3E3BC] flex items-start gap-3 rounded-xs"
    >
      <div
        className="w-9 h-9 shrink-0 flex items-center justify-center border-2 border-[#1E1610] shadow-[1px_1px_0px_#1E1610] text-lg select-none"
        style={{ backgroundColor: categoryInfo.color }}
      >
        {categoryInfo.creature}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-[11px] font-heading font-extrabold text-[#F2C230]">
            {categoryInfo.name} spotted!
          </span>
        </div>
        <p className="text-xs text-[#F3E3BC] font-medium leading-relaxed m-0">
          {categoryInfo.line}
        </p>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="text-xs text-[#B9BCC0] hover:text-[#F3E3BC] p-1 font-bold"
          aria-label="Dismiss helper"
        >
          ✕
        </button>
      )}
    </div>
  );
}

/**
 * Satisfying Segmented XP Bar Component
 */
export function SegmentedXpBar({
  currentXp,
  className = "",
}: {
  currentXp: number;
  className?: string;
}) {
  const { level, rank, currentLevelXp, nextLevelXp, progressPercent, xpUntilNextLevel } =
    getLevelProgress(currentXp);

  // 10 segments representing 10% each
  const totalSegments = 10;
  const activeSegments = Math.min(totalSegments, Math.floor(progressPercent / 10));

  return (
    <div
      data-panel="xp-bar"
      className={`p-3 bg-[#232634]/92 border-[3px] border-[#1E1610] shadow-[3px_3px_0px_#1E1610] text-[#F3E3BC] select-none rounded-xs ${className}`}
      role="region"
      aria-label={`Level ${level} ${rank.name} rank progression`}
    >
      <div className="flex items-center justify-between text-xs font-heading font-bold mb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-base select-none">{rank.badge}</span>
          <span className="text-[#F2C230] uppercase tracking-wider">{rank.name}</span>
          <span className="text-[#B9BCC0]">• Lv {level}</span>
        </div>
        <div className="text-[11px] text-[#F3E3BC]" aria-live="polite">
          {progressPercent}% ({xpUntilNextLevel} XP to Lv {level + 1})
        </div>
      </div>

      {/* 10-Segmented Progress Track */}
      <div
        className="grid grid-cols-10 gap-1 bg-[#1E1610] p-1 border-2 border-[#1E1610] rounded-xs"
        role="progressbar"
        aria-valuenow={progressPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progress to Level ${level + 1}: ${progressPercent}%`}
      >
        {Array.from({ length: totalSegments }).map((_, idx) => {
          const isFilled = idx < activeSegments;
          return (
            <div
              key={idx}
              className={`h-2.5 transition-all duration-300 rounded-none ${
                isFilled
                  ? "bg-[#6DB33F] border border-[#8CCB55]"
                  : "bg-[#232634]"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}

/**
 * Level-Up Celebration Modal
 * Block-rising animation when level milestone is crossed.
 */
export function LevelUpModal({
  newLevel,
  rank,
  onClose,
}: {
  newLevel: number;
  rank: XpRank;
  onClose: () => void;
}) {
  useEffect(() => {
    playLevelUpSound();
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="levelup-title"
      className="fixed inset-0 bg-[#1E1610]/80 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      <div
        data-panel="modal"
        className="animate-block-rise max-w-sm w-full bg-[#232634] border-[3px] border-[#1E1610] rounded-xs shadow-[6px_6px_0px_#1E1610] p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] sm:pb-6 text-center text-[#F3E3BC] relative"
      >
        <div className="w-16 h-16 mx-auto mb-3 bg-[#E8CF9C] border-[3px] border-[#1E1610] shadow-[3px_3px_0px_#1E1610] flex items-center justify-center text-3xl select-none">
          {rank.badge}
        </div>

        <span className="text-[11px] font-heading font-extrabold text-[#1E1610] bg-[#6DB33F] px-2 py-0.5 border border-[#1E1610] uppercase tracking-widest">
          Level Up!
        </span>

        <h2 id="levelup-title" className="font-heading font-extrabold text-2xl text-[#F2C230] mt-2 mb-1">
          LEVEL {newLevel} REACHED
        </h2>

        <p className="text-xs text-[#F3E3BC] font-medium leading-relaxed mb-4">
          You reached <strong className="text-[#F2C230]">{rank.name} level</strong> in maths. Keep practicing to reach the next tool tier.
        </p>

        <button
          type="button"
          onClick={onClose}
          className="w-full min-h-[44px] px-4 py-2 bg-[#6DB33F] text-[#1E1610] border-[3px] border-[#1E1610] font-heading font-extrabold text-xs shadow-[3px_3px_0px_#1E1610] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#1E1610]"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

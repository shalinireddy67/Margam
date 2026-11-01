"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, Trophy, Award, Flame } from "lucide-react";
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
    { x: -36, y: -42, color: "#5DAA3A", size: 8, delay: 0 },
    { x: 38, y: -40, color: "#FFE9A8", size: 6, delay: 40 },
    { x: -50, y: -10, color: "#3FA7C9", size: 8, delay: 20 },
    { x: 52, y: -14, color: "#FF8FA3", size: 6, delay: 60 },
    { x: -28, y: -60, color: "#FFE9A8", size: 10, delay: 10 },
    { x: 26, y: -58, color: "#5DAA3A", size: 8, delay: 50 },
    { x: 0, y: -65, color: "#6EB5FF", size: 8, delay: 30 },
    { x: -44, y: -30, color: "#FFB36B", size: 6, delay: 70 },
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
            boxShadow: `1px 1px 0px #1B120C`,
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
      className="pointer-events-none absolute -top-8 right-4 z-40 animate-xp-float motion-reduce:animate-none flex items-center gap-1 px-2.5 py-1 bg-[#2F6B22] text-[#FFE9A8] border-2 border-[#102610] shadow-[2px_2px_0px_#102610] font-heading font-extrabold text-xs"
    >
      <Sparkles className="w-3.5 h-3.5 text-[#FFE9A8]" />
      <span>+{xp} XP</span>
    </div>
  );
}

/**
 * Kind Mistake Creature Helper Card
 * Replaces harsh red errors with a helpful voxel companion message.
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
        color: "#6EB5FF",
      };
    }
    if (t.includes("added_instead") || t.includes("multipli") || t.includes("square")) {
      return {
        name: "Operation Ooze",
        creature: "🧪",
        line: "Operation Ooze spotted! Check whether the problem asks to add, multiply, or square.",
        color: "#FFB36B",
      };
    }
    if (t.includes("bracket") || t.includes("distribut") || t.includes("term")) {
      return {
        name: "Bracket Bug",
        creature: "🐛",
        line: "Bracket Bug spotted! Remember to multiply the outside factor with every term inside.",
        color: "#FFE9A8",
      };
    }
    return {
      name: "Curious Critter",
      creature: "🦉",
      line: hint || "A small misstep spotted! Take a deep breath and review the steps calmly.",
      color: "#FFE9A8",
    };
  })();

  return (
    <div
      role="alert"
      aria-live="polite"
      className="animate-gentle-shake motion-reduce:animate-none mt-4 p-3.5 bg-[#422816] border-3 border-[#A06A3C] shadow-[3px_3px_0px_#1B120C] text-[#FFF7E6] flex items-start gap-3 rounded-[2px]"
    >
      <div
        className="w-9 h-9 shrink-0 flex items-center justify-center border-2 border-[#2B1B0F] shadow-[1px_1px_0px_#1B120C] text-lg select-none"
        style={{ backgroundColor: categoryInfo.color }}
      >
        {categoryInfo.creature}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-[11px] font-heading font-extrabold text-[#FFE9A8]">
            {categoryInfo.name} spotted!
          </span>
        </div>
        <p className="text-xs text-[#E5D7BE] font-medium leading-relaxed">
          {categoryInfo.line}
        </p>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="text-xs text-[#D9D9D9] hover:text-[#FFE9A8] p-1 font-bold"
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
      className={`p-3 bg-[#5A3720] border-3 border-[#422816] shadow-[3px_3px_0px_#1B120C] text-[#FFF7E6] select-none ${className}`}
      role="region"
      aria-label={`Level ${level} ${rank.name} rank progression`}
    >
      <div className="flex items-center justify-between text-xs font-heading font-bold mb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-base select-none">{rank.badge}</span>
          <span className="text-[#FFE9A8] uppercase tracking-wider">{rank.name}</span>
          <span className="text-[#D9D9D9]/80">• Lv {level}</span>
        </div>
        <div className="text-[11px] text-[#FFE9A8]" aria-live="polite">
          {progressPercent}% ({xpUntilNextLevel} XP to Lv {level + 1})
        </div>
      </div>

      {/* 10-Segmented Pixel Progress Track */}
      <div
        className="grid grid-cols-10 gap-1 bg-[#2B1B0F] p-1 border-2 border-[#422816] rounded-[2px]"
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
              className={`h-2.5 transition-all duration-300 rounded-[1px] ${
                isFilled
                  ? "bg-gradient-to-b from-[#79B82A] to-[#4E9330] shadow-[inset_1px_1px_0px_rgba(255,255,255,0.4)]"
                  : "bg-[#422816]/70"
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
      className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
    >
      <div className="animate-block-rise max-w-sm w-full bg-[#5A3720] border-4 border-[#A06A3C] shadow-[8px_8px_0px_#1B120C] p-6 text-center text-[#FFF7E6] relative">
        <div className="w-16 h-16 mx-auto mb-3 bg-[#FFE9A8] border-3 border-[#422816] shadow-[3px_3px_0px_#1B120C] flex items-center justify-center text-3xl select-none">
          {rank.badge}
        </div>

        <span className="text-[11px] font-heading font-extrabold text-[#5DAA3A] bg-[#2F6B22]/60 px-2 py-0.5 border border-[#5DAA3A]/40 uppercase tracking-widest">
          Level Up!
        </span>

        <h2 id="levelup-title" className="font-heading font-extrabold text-2xl text-[#FFE9A8] mt-2 mb-1">
          LEVEL {newLevel} REACHED
        </h2>

        <p className="text-xs text-[#E5D7BE] font-medium leading-relaxed mb-4">
          You have achieved the <strong className="text-[#FFE9A8]">{rank.name} Rank</strong> in the Margam realm! Keep exploring to unlock diamond tier achievements.
        </p>

        <button
          type="button"
          onClick={onClose}
          className="w-full min-h-[44px] px-4 py-2 bg-gradient-to-b from-[#5DAA3A] to-[#2F6B22] text-[#FFF7E6] border-2 border-[#204514] font-heading font-extrabold text-xs shadow-[inset_1px_1px_0px_rgba(255,255,255,0.4),3px_3px_0px_#1B120C] active:translate-y-0.5"
        >
          Claim Glory & Continue →
        </button>
      </div>
    </div>
  );
}


"use client";

import React from "react";
import { notFound } from "next/navigation";
import { WitchCat, type WitchCatPose } from "@/components/ui/WitchCat";

const POSES: {
  id: WitchCatPose;
  title: string;
  description: string;
  destination: string;
}[] = [
  {
    id: "greet",
    title: "Greet (Waving Hello)",
    description: "Welcoming smile with a waving right arm and twitching tail.",
    destination: "Home screen greeting and returning student welcome card",
  },
  {
    id: "read",
    title: "Read (Studying Book)",
    description: "Glasses perched on nose, reading an open yellow maths notebook.",
    destination: "Lesson screen explanation and worked example cards",
  },
  {
    id: "think",
    title: "Think (Pondering)",
    description: "Paw on chin, looking up with a thought bubble questioning mark.",
    destination: "Practice question screens before answer submission",
  },
  {
    id: "cheer",
    title: "Cheer (Celebrating)",
    description: "Both paws raised with floating sparkle stars and happy expression.",
    destination: "Result screens and mastery / chapter completion cards",
  },
  {
    id: "oops",
    title: "Oops (Sympathetic Hint)",
    description: "Tilted hat and sympathetic comforting paw offering a hint.",
    destination: "Practice screens when a mistake is made, paired with misconception hint",
  },
];

interface TileVariant {
  title: string;
  badge: string;
  hex: string;
  isDark?: boolean;
  sticker: boolean;
  ruleExplanation: string;
}

const TILE_VARIANTS: TileVariant[] = [
  {
    title: "Bare on White",
    badge: "WHITE #FFFFFF",
    hex: "#FFFFFF",
    sticker: false,
    ruleExplanation: "High contrast against dark lines and color blocks",
  },
  {
    title: "Bare on Yellow",
    badge: "YELLOW #FFE14D",
    hex: "#FFE14D",
    sticker: false,
    ruleExplanation: "Warm brand background with crisp blue/pink contrast",
  },
  {
    title: "Bare on Ink",
    badge: "INK #111111",
    hex: "#111111",
    isDark: true,
    sticker: false,
    ruleExplanation: "Dark card mode with bright colored fills",
  },
  {
    title: "Sticker on Cyan",
    badge: "CYAN #4DD9E8",
    hex: "#4DD9E8",
    sticker: true,
    ruleExplanation: "White circle + 3px ink outline prevents sky-blue body vanishing",
  },
  {
    title: "Sticker on Pink",
    badge: "PINK #FF4F9A",
    hex: "#FF4F9A",
    sticker: true,
    ruleExplanation: "White circle + 3px ink outline prevents pink hat vanishing",
  },
  {
    title: "Sticker on Ink",
    badge: "INK #111111",
    hex: "#111111",
    isDark: true,
    sticker: true,
    ruleExplanation: "High-pop physical sticker badge on deep dark surfaces",
  },
];

export default function CatPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#102610] minecraft-grid-bg p-4 md:p-8 font-sans text-[#F2F0DF]">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Banner */}
        <header className="border-[3px] border-[#111111] bg-[#FFE14D] p-6 rounded-2xl shadow-[6px_6px_0_#111111]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-block px-3 py-1 bg-[#111111] text-white text-xs font-black uppercase tracking-wider rounded-md mb-2">
                Dev Only · Not in Production
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#111111]">
                Witch Cat Pose Matrix (Updated Rules)
              </h1>
              <p className="mt-1 text-sm md:text-base font-semibold text-[#111111]">
                Option 1 Palette with Rule 1 Background Contrast (Sticker on Cyan/Pink) & Rule 2 64px Simplification
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-bold">
              <span className="px-2.5 py-1.5 bg-[#FF4F9A] border-2 border-[#111111] rounded-md shadow-[2px_2px_0_#111111]">
                Hat #FF4F9A
              </span>
              <span className="px-2.5 py-1.5 bg-[#FFE14D] border-2 border-[#111111] rounded-md shadow-[2px_2px_0_#111111]">
                Band/Book #FFE14D
              </span>
              <span className="px-2.5 py-1.5 bg-[#A9D8F0] border-2 border-[#111111] rounded-md shadow-[2px_2px_0_#111111]">
                Body #A9D8F0
              </span>
              <span className="px-2.5 py-1.5 bg-white border-2 border-[#111111] rounded-md shadow-[2px_2px_0_#111111]">
                Sticker Badge #FFFFFF
              </span>
            </div>
          </div>
        </header>

        {/* Rule 1 & Rule 2 Summary Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-[3px] border-[#111111] bg-white p-4 rounded-xl shadow-[4px_4px_0_#111111] space-y-1">
            <span className="px-2 py-0.5 bg-[#FFE14D] text-[#111111] font-black text-xs rounded border border-[#111111] uppercase">
              Rule 1: Background & Sticker Backing
            </span>
            <p className="text-xs md:text-sm font-semibold text-[#222222]">
              Cat sits bare only on <strong>White</strong>, <strong>Yellow</strong>, or <strong>Ink</strong>. On <strong>Cyan</strong> and <strong>Pink</strong> tiles, a white circular sticker backing with 3px ink outline ensures the pink hat and sky-blue body never vanish.
            </p>
          </div>
          <div className="border-[3px] border-[#111111] bg-white p-4 rounded-xl shadow-[4px_4px_0_#111111] space-y-1">
            <span className="px-2 py-0.5 bg-[#4DD9E8] text-[#111111] font-black text-xs rounded border border-[#111111] uppercase">
              Rule 2: 64px Simplification
            </span>
            <p className="text-xs md:text-sm font-semibold text-[#222222]">
              At 64px, vectors automatically declutter: 2 bold whiskers per side, punchy 3.8px strokes, bold book formulas (√x and ±), and an enlarged 26px thought bubble (?) for instant legibility.
            </p>
          </div>
        </div>

        {/* Contrast Rule 1 Verification: Vanishing Failure vs Sticker Solution */}
        <section
          id="section-contrast-rule"
          className="border-[3px] border-[#111111] bg-white p-6 rounded-2xl shadow-[6px_6px_0_#111111] space-y-4"
        >
          <div className="border-b-2 border-[#111111] pb-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-[#FF4F9A] text-white text-xs font-black uppercase rounded">
                Rule 1 Contrast Enforcement
              </span>
              <span className="text-xs font-bold text-[#666666]">
                Why Bare is prohibited on Pink & Cyan · Sticker Backing Solution
              </span>
            </div>
            <h2 className="text-xl font-black text-[#111111]">
              Vanishing Analysis: Bare Failure vs. Sticker Backing Solution
            </h2>
            <p className="text-xs md:text-sm font-medium text-[#444444]">
              Bare cat is strictly limited to White, Yellow, or Ink. On Cyan (#4DD9E8) and Pink (#FF4F9A), a circular white sticker backing (3px ink outline) guarantees the sky-blue body and pink hat never blend or disappear into the background.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Cyan Problem: Bare */}
            <div className="border-[3px] border-[#111111] bg-[#4DD9E8] p-4 rounded-xl shadow-[3px_3px_0_#111111] flex flex-col items-center justify-between text-center">
              <div className="w-full flex justify-between items-center mb-2">
                <span className="px-2 py-0.5 bg-[#FF4F9A] text-white text-[10px] font-black rounded uppercase">
                  Prohibited
                </span>
                <span className="text-[10px] font-mono font-bold text-[#111111]">CYAN #4DD9E8</span>
              </div>
              <div className="py-2">
                <WitchCat pose="greet" size={100} sticker={false} />
              </div>
              <div className="mt-2 p-2 bg-white/90 border border-[#111111] rounded text-[11px] font-bold text-red-600">
                ❌ Sky-blue body (#A9D8F0) vanishes against Cyan tile
              </div>
            </div>

            {/* Cyan Solution: Sticker */}
            <div className="border-[3px] border-[#111111] bg-[#4DD9E8] p-4 rounded-xl shadow-[3px_3px_0_#111111] flex flex-col items-center justify-between text-center">
              <div className="w-full flex justify-between items-center mb-2">
                <span className="px-2 py-0.5 bg-[#111111] text-[#FFE14D] text-[10px] font-black rounded uppercase">
                  Approved Rule 1
                </span>
                <span className="text-[10px] font-mono font-bold text-[#111111]">CYAN + STICKER</span>
              </div>
              <div className="py-2">
                <WitchCat pose="greet" size={100} sticker={true} />
              </div>
              <div className="mt-2 p-2 bg-white border border-[#111111] rounded text-[11px] font-bold text-[#111111]">
                ✓ White circle + 3px outline pops body & hat crisply
              </div>
            </div>

            {/* Pink Problem: Bare */}
            <div className="border-[3px] border-[#111111] bg-[#FF4F9A] p-4 rounded-xl shadow-[3px_3px_0_#111111] flex flex-col items-center justify-between text-center">
              <div className="w-full flex justify-between items-center mb-2">
                <span className="px-2 py-0.5 bg-[#111111] text-white text-[10px] font-black rounded uppercase">
                  Prohibited
                </span>
                <span className="text-[10px] font-mono font-bold text-white">PINK #FF4F9A</span>
              </div>
              <div className="py-2">
                <WitchCat pose="think" size={100} sticker={false} />
              </div>
              <div className="mt-2 p-2 bg-white/90 border border-[#111111] rounded text-[11px] font-bold text-red-600">
                ❌ Pink hat (#FF4F9A) camouflages against Pink tile
              </div>
            </div>

            {/* Pink Solution: Sticker */}
            <div className="border-[3px] border-[#111111] bg-[#FF4F9A] p-4 rounded-xl shadow-[3px_3px_0_#111111] flex flex-col items-center justify-between text-center">
              <div className="w-full flex justify-between items-center mb-2">
                <span className="px-2 py-0.5 bg-[#111111] text-[#FFE14D] text-[10px] font-black rounded uppercase">
                  Approved Rule 1
                </span>
                <span className="text-[10px] font-mono font-bold text-white">PINK + STICKER</span>
              </div>
              <div className="py-2">
                <WitchCat pose="think" size={100} sticker={true} />
              </div>
              <div className="mt-2 p-2 bg-white border border-[#111111] rounded text-[11px] font-bold text-[#111111]">
                ✓ White circle + 3px outline cleanly isolates hat & ears
              </div>
            </div>
          </div>

          {/* Approved Bare Backgrounds Bar */}
          <div className="p-3 bg-[#FFF8DC] border-2 border-[#111111] rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold">
            <span className="text-[#111111] uppercase tracking-wide">
              Approved Bare Backgrounds (No Sticker Required):
            </span>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-white border border-[#111111] rounded shadow-[1px_1px_0_#111111]">
                ✓ White (#FFFFFF)
              </span>
              <span className="px-3 py-1 bg-[#FFE14D] border border-[#111111] rounded shadow-[1px_1px_0_#111111]">
                ✓ Yellow (#FFE14D)
              </span>
              <span className="px-3 py-1 bg-[#111111] text-white border border-[#111111] rounded shadow-[1px_1px_0_#111111]">
                ✓ Ink (#111111)
              </span>
            </div>
          </div>
        </section>

        {/* 64px Side-by-Side Comparison Section */}
        <section
          id="section-64px-comparison"
          className="border-[3px] border-[#111111] bg-white p-6 rounded-2xl shadow-[6px_6px_0_#111111] space-y-4"
        >
          <div className="border-b-2 border-[#111111] pb-3">
            <h2 className="text-xl font-black text-[#111111]">
              64px Legibility Comparison: Standard vs Simplified
            </h2>
            <p className="text-xs font-semibold text-[#555555]">
              Direct side-by-side inspection of all 5 poses at 64px. Simplified mode removes cramped micro-strokes and amplifies key math and facial cues.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {POSES.map((pose) => (
              <div
                key={pose.id}
                className="border-2 border-[#111111] bg-[#FFF8DC] p-3 rounded-xl flex flex-col items-center gap-3 shadow-[2px_2px_0_#111111]"
              >
                <span className="text-xs font-black uppercase text-[#111111] tracking-wide">
                  {pose.id}
                </span>
                <div className="flex items-center justify-around w-full gap-2">
                  <div className="flex flex-col items-center gap-1">
                    <WitchCat pose={pose.id} size={64} simplified={false} />
                    <span className="text-[10px] font-mono font-bold text-[#666666]">Standard</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 bg-white p-1 rounded-lg border border-[#111111]">
                    <WitchCat pose={pose.id} size={64} simplified={true} />
                    <span className="text-[10px] font-mono font-black text-[#111111]">Simplified</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pose Matrix Sections */}
        <div className="space-y-12">
          {POSES.map((pose) => (
            <section
              key={pose.id}
              id={`pose-${pose.id}`}
              className="border-[3px] border-[#111111] bg-white p-6 rounded-2xl shadow-[6px_6px_0_#111111] space-y-6"
            >
              {/* Pose Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b-2 border-[#111111] gap-2">
                <div>
                  <h2 className="text-2xl font-black text-[#111111] capitalize">
                    {pose.title}
                  </h2>
                  <p className="text-sm font-medium text-[#444444]">
                    {pose.description}
                  </p>
                </div>
                <div className="text-xs font-bold px-3 py-1.5 bg-[#A9D8F0] border-2 border-[#111111] rounded-lg shadow-[2px_2px_0_#111111] self-start md:self-auto">
                  Appears on: {pose.destination}
                </div>
              </div>

              {/* 6 Background Variants Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {TILE_VARIANTS.map((variant) => (
                  <div
                    key={variant.title}
                    style={{ backgroundColor: variant.hex }}
                    className={`border-[3px] border-[#111111] p-4 rounded-xl shadow-[4px_4px_0_#111111] flex flex-col justify-between ${
                      variant.isDark ? "text-white" : "text-[#111111]"
                    }`}
                  >
                    {/* Variant Header Label */}
                    <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-current/20">
                      <span
                        className={`text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded border border-[#111111] shadow-[1px_1px_0_#111111] ${
                          variant.sticker ? "bg-white text-[#111111]" : "bg-[#FFE14D] text-[#111111]"
                        }`}
                      >
                        {variant.badge}
                      </span>
                      <span className="text-[11px] font-mono font-bold opacity-80">
                        {variant.sticker ? "Sticker Backing" : "Bare Cat"}
                      </span>
                    </div>

                    {/* Sizes row (64px Simplified, 96px Compact, 132px Display) */}
                    <div className="flex items-end justify-around gap-1 sm:gap-2 py-3">
                      {/* 64px Simplified */}
                      <div className="flex flex-col items-center gap-1.5">
                        <WitchCat
                          pose={pose.id}
                          size={64}
                          sticker={variant.sticker}
                          simplified={true}
                        />
                        <span className="text-[10px] font-mono font-extrabold px-1.5 py-0.5 bg-[#111111] text-white rounded">
                          64px (simp)
                        </span>
                      </div>

                      {/* 96px Compact */}
                      <div className="flex flex-col items-center gap-1.5">
                        <WitchCat
                          pose={pose.id}
                          size={96}
                          sticker={variant.sticker}
                        />
                        <span className="text-[10px] font-mono font-extrabold px-1.5 py-0.5 bg-[#111111] text-white rounded">
                          96px
                        </span>
                      </div>

                      {/* 132px Display */}
                      <div className="flex flex-col items-center gap-1.5">
                        <WitchCat
                          pose={pose.id}
                          size={132}
                          sticker={variant.sticker}
                        />
                        <span className="text-[10px] font-mono font-extrabold px-1.5 py-0.5 bg-[#111111] text-white rounded">
                          132px
                        </span>
                      </div>
                    </div>

                    {/* Footer Rule Note */}
                    <div className="mt-3 pt-2 border-t border-current/20 text-[11px] font-medium opacity-90">
                      {variant.ruleExplanation}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* High-Resolution Hero Showcase */}
        <section
          id="section-hero-showcase"
          className="border-[3px] border-[#111111] bg-white p-6 rounded-2xl shadow-[6px_6px_0_#111111] space-y-6"
        >
          <div className="border-b-2 border-[#111111] pb-3">
            <h2 className="text-xl font-black text-[#111111]">
              High-Resolution Hero Showcase (200px Clean Unclipped Views)
            </h2>
            <p className="text-xs md:text-sm font-semibold text-[#555555]">
              Full unclipped rendering across all 5 poses rotating through approved backgrounds (Bare White, Bare Yellow, Bare Ink, Sticker Cyan, Sticker Pink).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {POSES.map((pose, idx) => {
              const bgConfigs = [
                { hex: "#FFFFFF", sticker: false, label: "Bare on White", dark: false },
                { hex: "#FFE14D", sticker: false, label: "Bare on Yellow", dark: false },
                { hex: "#111111", sticker: false, label: "Bare on Ink", dark: true },
                { hex: "#4DD9E8", sticker: true, label: "Sticker on Cyan", dark: false },
                { hex: "#FF4F9A", sticker: true, label: "Sticker on Pink", dark: false },
              ];
              const config = bgConfigs[idx % bgConfigs.length];
              return (
                <div
                  key={pose.id}
                  style={{ backgroundColor: config.hex }}
                  className={`border-[3px] border-[#111111] p-4 rounded-xl shadow-[4px_4px_0_#111111] flex flex-col items-center justify-between text-center gap-3 ${
                    config.dark ? "text-white" : "text-[#111111]"
                  }`}
                >
                  <div className="w-full flex justify-between items-center text-xs font-black uppercase pb-2 border-b-2 border-current/20">
                    <span>{pose.id}</span>
                    <span className="font-mono text-[10px] opacity-80">{config.label}</span>
                  </div>
                  <div className="py-2 flex items-center justify-center">
                    <WitchCat
                      pose={pose.id}
                      size={180}
                      sticker={config.sticker}
                    />
                  </div>
                  <div className="text-[11px] font-bold px-2.5 py-0.5 bg-[#111111] text-white rounded">
                    Hero Scale (180px)
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}

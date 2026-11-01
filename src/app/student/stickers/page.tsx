"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowLeft,
  Award,
  Star,
  Lock,
  RotateCcw,
  CheckCircle2,
  TrendingUp,
  Zap,
} from "lucide-react";
import { LearnerProfile } from "@/lib/types";
import { getActiveProfile } from "@/lib/storage";
import { BottomTabBar } from "@/components/ui/BottomTabBar";
import { WitchCat } from "@/components/ui/WitchCat";
import {
  SkeletonCard,
  EmptyState,
  OfflineBanner,
  Button,
} from "@/components/ui";

interface DerivedSticker {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  unlockedAtLabel?: string;
  color: "yellow" | "cyan" | "pink" | "green" | "orange";
  icon: "star" | "sparkles" | "award" | "trending" | "zap";
}

export default function StickersPage() {
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const initStickers = useCallback(() => {
    try {
      setLoading(true);
      setHasError(false);
      setErrorMessage(null);

      const active = getActiveProfile();
      setProfile(active);
      setLoading(false);
    } catch (err: unknown) {
      setHasError(true);
      setErrorMessage(err instanceof Error ? err.message : "Failed to load sticker showcase.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initStickers();
  }, [initStickers]);

  // 1. Loading Skeleton State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#102610] minecraft-grid-bg text-[#F2F0DF] p-4 sm:p-6 pb-28">
        <OfflineBanner />
        <div className="max-w-xl mx-auto space-y-4 pt-4" role="status" aria-label="Loading stickers">
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <BottomTabBar currentTab="stickers" />
      </div>
    );
  }

  // 2. Error State with Retry
  if (hasError) {
    return (
      <div className="min-h-screen bg-[#102610] minecraft-grid-bg text-[#F2F0DF] pb-28 flex flex-col justify-between">
        <OfflineBanner />
        <main className="max-w-xl mx-auto px-4 py-12 flex-1 flex flex-col justify-center text-center">
          <div className="bg-[#FFFFFF] border-4 border-[#111111] rounded-none p-8 shadow-[4px_4px_0px_#111111] space-y-4">
            <div className="w-12 h-12 rounded-none bg-[#FF4F9A] border-[2px] border-[#111111] flex items-center justify-center mx-auto text-[#FFFFFF] font-extrabold text-lg">
              !
            </div>
            <h1 className="font-heading font-extrabold text-xl text-[#F2F0DF]">
              Sticker Showcase Error
            </h1>
            <p className="text-xs sm:text-sm font-bold text-[#F2F0DF]/70 leading-relaxed">
              {errorMessage || "Unable to display learner trophy badges."}
            </p>
            <div className="pt-2">
              <Button
                variant="yellow"
                size="default"
                onClick={initStickers}
                className="w-full sm:w-auto min-h-[48px]"
              >
                <span>Try Again</span>
                <RotateCcw className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </div>
        </main>
        <BottomTabBar currentTab="stickers" />
      </div>
    );
  }

  // 3. Locked State: If user has not onboarded
  if (!profile || !profile.selectedClass) {
    return (
      <div className="min-h-screen bg-[#102610] minecraft-grid-bg text-[#F2F0DF] pb-28 flex flex-col justify-between">
        <OfflineBanner />
        <header className="border-b-3 border-[#315B2A] bg-[#173B19] shadow-[0px_4px_0px_#102610]">
          <div className="max-w-xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center min-h-[48px] gap-2 text-xs font-heading font-extrabold text-[#F2F0DF] no-underline focus-visible:ring-3 focus-visible:ring-[#111111] focus-visible:outline-none"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <span className="font-heading font-extrabold text-base text-[#F2F0DF]">
              Sticker Showcase
            </span>
          </div>
        </header>

        <main className="max-w-xl mx-auto px-4 py-12 flex-1 flex flex-col justify-center text-center">
          <div className="bg-[#FFFFFF] border-4 border-[#111111] rounded-none p-8 shadow-[4px_4px_0px_#111111] space-y-4">
            <div className="w-12 h-12 rounded-none bg-[#FFE14D] border-[2px] border-[#111111] flex items-center justify-center mx-auto text-[#F2F0DF]">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="font-heading font-extrabold text-xl text-[#F2F0DF]">
              Stickers Locked
            </h1>
            <p className="text-xs sm:text-sm font-bold text-[#F2F0DF]/70 leading-relaxed">
              Start learning on Margam to earn achievement stickers and track your mastery milestones.
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center justify-center min-h-[48px] px-6 py-2.5 rounded-none bg-[#111111] text-[#FFE14D] border-[2px] border-[#111111] text-xs font-heading font-extrabold shadow-[2px_2px_0px_#111111] no-underline active:translate-x-[1px] active:translate-y-[1px] focus-visible:ring-3 focus-visible:ring-[#111111] focus-visible:outline-none"
              >
                <span>Get Started</span>
              </Link>
            </div>
          </div>
        </main>
        <BottomTabBar currentTab="stickers" />
      </div>
    );
  }

  // Derive all stickers strictly from existing profile fields (no new storage logic)
  const completedTopics = Object.values(profile.topicProgress).filter((t) => t.status === "completed");
  const completedCount = completedTopics.length;

  const stickers: DerivedSticker[] = [
    {
      id: "first_step",
      title: "First Step",
      description: `Began learning in Class ${profile.selectedClass}`,
      unlocked: true,
      unlockedAtLabel: "Unlocked on onboarding",
      color: "green",
      icon: "star",
    },
    {
      id: "concept_pioneer",
      title: "Concept Pioneer",
      description: "Mastered first mathematical concept",
      unlocked: completedCount >= 1,
      unlockedAtLabel: completedCount >= 1 ? "1 concept mastered" : "Master 1 concept to unlock",
      color: "yellow",
      icon: "award",
    },
    {
      id: "adaptive_climber",
      title: "Adaptive Climber",
      description: "Reached Difficulty Level 2 or higher",
      unlocked: profile.currentDifficulty >= 2,
      unlockedAtLabel: profile.currentDifficulty >= 2 ? `Level ${profile.currentDifficulty} reached` : "Advance difficulty to unlock",
      color: "cyan",
      icon: "trending",
    },
    {
      id: "focus_streak",
      title: "Focus Streak",
      description: "Answered 3 questions correctly in a row",
      unlocked: profile.consecutiveCorrect >= 3,
      unlockedAtLabel: profile.consecutiveCorrect >= 3 ? "3 correct streak achieved" : "Achieve 3 correct in a row to unlock",
      color: "pink",
      icon: "zap",
    },
    {
      id: "mastery_builder",
      title: "Mastery Builder",
      description: "Completed 3 sequential concepts",
      unlocked: completedCount >= 3,
      unlockedAtLabel: completedCount >= 3 ? `${completedCount} concepts mastered` : `Master 3 concepts to unlock (${completedCount}/3)`,
      color: "orange",
      icon: "sparkles",
    },
    {
      id: "top_performer",
      title: "Top Performer",
      description: "Reached Difficulty Level 3 in adaptive practice",
      unlocked: profile.currentDifficulty === 3,
      unlockedAtLabel: profile.currentDifficulty === 3 ? "Level 3 achieved" : "Reach Difficulty Level 3 to unlock",
      color: "yellow",
      icon: "star",
    },
  ];

  const unlockedCount = stickers.filter((s) => s.unlocked).length;

  return (
    <div className="min-h-screen bg-[#102610] minecraft-grid-bg text-[#F2F0DF] pb-28 flex flex-col justify-between">
      <OfflineBanner />

      <header className="border-b-[3px] border-[#111111] bg-[#FFFFFF]">
        <div className="max-w-xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center min-h-[48px] gap-2 text-xs font-heading font-extrabold text-[#F2F0DF] no-underline focus-visible:ring-3 focus-visible:ring-[#111111] focus-visible:outline-none"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Home</span>
          </Link>
          <span className="font-heading font-extrabold text-base text-[#F2F0DF]">
            Sticker Showcase
          </span>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-6 sm:py-8 w-full flex-1 space-y-6">
        {/* Showcase Banner */}
        <div className="p-6 bg-[#173B19] border-3 border-[#4F8A24] border-t-[6px] border-t-[#79B82A] shadow-[6px_6px_0px_#102610] text-center space-y-4">
          <div className="w-16 h-16 rounded-none bg-[#FFE14D] border-4 border-[#111111] shadow-[2px_2px_0px_#111111] flex items-center justify-center mx-auto text-[#F2F0DF]">
            <Award className="w-8 h-8" />
          </div>

          <h1 className="font-heading font-extrabold text-2xl text-[#F2F0DF]">
            Learner Trophy Badges
          </h1>
          <p className="text-xs sm:text-sm font-bold text-[#F2F0DF]/70 leading-relaxed">
            Earn stickers and companion badges as you master sequential concepts and complete diagnostics.
          </p>
          <div className="pt-1">
            <span className="inline-block px-3.5 py-1 bg-[#102610] text-[#79B82A] border-2 border-[#315B2A] text-xs font-heading font-extrabold shadow-[2px_2px_0px_#102610]">
              {unlockedCount} of {stickers.length} Badges Unlocked
            </span>
          </div>
        </div>

        {/* 4. Empty State: If no badges unlocked beyond onboarding */}
        {unlockedCount <= 1 && completedCount === 0 && (
          <div className="p-4 bg-[#FFFFFF] border-[2px] border-[#111111] rounded-none text-center space-y-2">
            <p className="text-xs font-bold text-[#F2F0DF]/80">
              Complete your first lesson practice to unlock additional mastery badges!
            </p>
          </div>
        )}

        {/* Stickers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {stickers.map((st) => {
            const colorClass = {
              green: "bg-[#8DE86A]",
              yellow: "bg-[#FFE14D]",
              cyan: "bg-[#4DD9E8]",
              pink: "bg-[#FF4F9A]",
              orange: "bg-[#FF8A3D]",
            }[st.color];

            return (
              <div
                key={st.id}
                className={`p-4 rounded-none border-4 border-[#111111] text-center space-y-2 select-none ${
                  st.unlocked
                    ? "bg-[#173B19] border-3 border-[#79B82A] shadow-[4px_4px_0px_#102610]"
                    : "bg-[#20251F]/60 border-2 border-[#315B2A] opacity-70 border-dashed"
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-none border-[2px] border-[#111111] flex items-center justify-center mx-auto shadow-[2px_2px_0px_#111111] ${
                    st.unlocked ? colorClass : "bg-[#E8E0BD] text-[#F2F0DF]/50"
                  }`}
                >
                  {st.unlocked ? (
                    st.icon === "star" ? <Star className="w-7 h-7 text-[#F2F0DF]" /> :
                    st.icon === "award" ? <Award className="w-7 h-7 text-[#F2F0DF]" /> :
                    st.icon === "trending" ? <TrendingUp className="w-7 h-7 text-[#F2F0DF]" /> :
                    st.icon === "zap" ? <Zap className="w-7 h-7 text-[#F2F0DF]" /> :
                    <Sparkles className="w-7 h-7 text-[#F2F0DF]" />
                  ) : (
                    <Lock className="w-6 h-6 text-[#F2F0DF]/60" />
                  )}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center justify-center gap-1.5">
                    <h2 className="font-heading font-extrabold text-sm text-[#F2F0DF]">
                      {st.title}
                    </h2>
                    {st.unlocked && <CheckCircle2 className="w-3.5 h-3.5 text-[#F2F0DF]" />}
                  </div>
                  <p className="text-[11px] font-bold text-[#F2F0DF]/70 leading-snug">
                    {st.description}
                  </p>
                </div>

                <div className="pt-1 border-t border-[#315B2A]">
                  <span className={`text-[10px] font-heading font-extrabold px-2 py-0.5 rounded-none ${
                    st.unlocked ? "bg-[#8DE86A]/40 text-[#F2F0DF]" : "text-[#F2F0DF]/60"
                  }`}>
                    {st.unlockedAtLabel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <BottomTabBar currentTab="stickers" />
    </div>
  );
}

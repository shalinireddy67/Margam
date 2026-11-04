"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
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
import { Navigation } from "@/components/Navigation";
import {
  SkeletonCard,
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
  icon: "star" | "zap" | "award" | "trending";
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
      <div className="min-h-[100dvh] bg-transparent text-[#1E1610] p-4 sm:p-6 pb-10 flex flex-col justify-between">
        <OfflineBanner />
        <Navigation currentTab="stickers" profile={profile} />
        <div className="max-w-2xl mx-auto w-full space-y-4 pt-4 flex-1" role="status" aria-label="Loading stickers">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  // 2. Error State with Retry
  if (hasError) {
    return (
      <div className="min-h-[100dvh] bg-transparent text-[#1E1610] pb-10 flex flex-col justify-between">
        <OfflineBanner />
        <Navigation currentTab="stickers" profile={profile} />
        <main className="max-w-xl mx-auto px-4 py-12 flex-1 flex flex-col justify-center items-center text-center my-auto">
          <div
            data-panel="error-card"
            className="bg-[#D9B87A]/90 border-[3px] border-[#1E1610] rounded-xs p-8 shadow-[4px_4px_0px_#1E1610] space-y-4"
          >
            <div className="w-12 h-12 bg-[#D1362B] border-2 border-[#1E1610] flex items-center justify-center mx-auto text-[#F3E3BC] font-heading font-extrabold text-lg">
              !
            </div>
            <h1 className="font-heading font-extrabold text-lg text-[#1E1610]">
              Could not load stickers
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-[#5A3720] leading-relaxed">
              {errorMessage || "Could not show stickers. Please tap Try again."}
            </p>
            <div className="pt-2">
              <Button
                variant="primary"
                size="default"
                onClick={initStickers}
                className="w-full sm:w-auto min-h-[48px]"
              >
                <span>Try again</span>
                <RotateCcw className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // 3. Locked State: If user has not onboarded
  if (!profile || !profile.selectedClass) {
    return (
      <div className="min-h-[100dvh] bg-transparent text-[#1E1610] pb-10 flex flex-col justify-between">
        <OfflineBanner />
        <Navigation currentTab="stickers" />
        <main className="max-w-xl mx-auto px-4 py-12 flex-1 flex flex-col justify-center items-center text-center my-auto">
          <div
            data-panel="locked-card"
            className="bg-[#D9B87A]/90 border-[3px] border-[#1E1610] rounded-xs p-8 shadow-[4px_4px_0px_#1E1610] space-y-4"
          >
            <div className="w-12 h-12 bg-[#E8CF9C] border-2 border-[#1E1610] flex items-center justify-center mx-auto text-[#1E1610]">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="font-heading font-extrabold text-lg text-[#1E1610]">
              Stickers locked
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-[#5A3720] leading-relaxed">
              Finish lessons and quick checks to earn stickers.
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center justify-center min-h-[48px] px-6 py-2.5 bg-[#6DB33F] text-[#1E1610] border-[3px] border-[#1E1610] font-heading font-extrabold text-xs shadow-[3px_3px_0px_#1E1610] no-underline hover:bg-[#8CCB55] rounded-xs"
              >
                <span>Start now</span>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Derive all stickers strictly from existing profile fields
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
      icon: "zap",
    },
    {
      id: "top_performer",
      title: "Top Performer",
      description: "Reached Difficulty Level 3 in practice",
      unlocked: profile.currentDifficulty === 3,
      unlockedAtLabel: profile.currentDifficulty === 3 ? "Level 3 achieved" : "Reach Difficulty Level 3 to unlock",
      color: "yellow",
      icon: "star",
    },
  ];

  const unlockedCount = stickers.filter((s) => s.unlocked).length;

  return (
    <div className="min-h-[100dvh] bg-transparent text-[#1E1610] flex flex-col justify-between">
      <OfflineBanner />

      <Navigation
        currentTab="stickers"
        profile={profile}
      />

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full flex-1 space-y-6 md:pl-28 lg:pl-8 pb-10 lg:pb-12">
        {/* Showcase Banner */}
        <div
          data-panel="showcase-banner"
          className="bg-[#D9B87A]/90 p-6 sm:p-8 border-[3px] border-[#1E1610] shadow-[3px_3px_0px_#1E1610] text-center space-y-4 max-w-2xl mx-auto rounded-xs"
        >
          <div className="w-16 h-16 rounded-xs bg-[#F2C230] border-[2px] border-[#1E1610] shadow-[2px_2px_0px_#1E1610] flex items-center justify-center mx-auto text-[#1E1610]">
            <Award className="w-8 h-8" />
          </div>

          <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-[#1E1610] m-0">
            Learner Trophy Badges
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-[#5A3720] leading-relaxed font-sans m-0">
            Earn stickers and companion badges as you master sequential concepts and complete quick checks.
          </p>
          <div className="pt-1">
            <span className="inline-block px-3.5 py-1.5 rounded-xs bg-[#6DB33F] text-[#1E1610] border-2 border-[#1E1610] font-heading font-extrabold text-xs shadow-[1px_1px_0px_#1E1610]">
              {unlockedCount} of {stickers.length} Badges Unlocked
            </span>
          </div>
        </div>

        {/* Empty State */}
        {unlockedCount <= 1 && completedCount === 0 && (
          <div
            data-panel="empty-hint"
            className="bg-[#E8CF9C] p-4 border-[2px] border-[#1E1610] text-center space-y-2 max-w-md mx-auto rounded-xs"
          >
            <p className="text-xs font-semibold text-[#1E1610] m-0">
              Complete your first lesson practice to unlock additional mastery badges!
            </p>
          </div>
        )}

        {/* Stickers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {stickers.map((st) => {
            const colorClass = {
              green: "bg-[#6DB33F] text-[#1E1610]",
              yellow: "bg-[#F2C230] text-[#1E1610]",
              cyan: "bg-[#4EDBD3] text-[#1E1610]",
              pink: "bg-[#E8CF9C] text-[#1E1610]",
              orange: "bg-[#F2C230] text-[#1E1610]",
            }[st.color];

            return (
              <div
                key={st.id}
                data-panel="sticker-item"
                className={`p-4 border-[3px] text-center space-y-2 select-none rounded-xs ${
                  st.unlocked
                    ? "bg-[#D9B87A]/90 border-[#1E1610] shadow-[3px_3px_0px_#1E1610]"
                    : "bg-[#B9BCC0]/80 border-[#1E1610] opacity-75 border-dashed"
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-xs border-2 border-[#1E1610] flex items-center justify-center mx-auto shadow-[1px_1px_0px_#1E1610] ${
                    st.unlocked ? colorClass : "bg-[#6B6F76] text-[#F3E3BC]"
                  }`}
                >
                  {st.unlocked ? (
                    st.icon === "star" ? <Star className="w-7 h-7" /> :
                    st.icon === "award" ? <Award className="w-7 h-7" /> :
                    st.icon === "trending" ? <TrendingUp className="w-7 h-7" /> :
                    <Zap className="w-7 h-7" />
                  ) : (
                    <Lock className="w-6 h-6 text-[#1E1610]" />
                  )}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center justify-center gap-1.5">
                    <h2 className="font-heading font-extrabold text-xs text-[#1E1610] m-0">
                      {st.title}
                    </h2>
                    {st.unlocked && <CheckCircle2 className="w-3.5 h-3.5 text-[#17B862]" />}
                  </div>
                  <p className="text-[11px] font-semibold text-[#5A3720] leading-snug font-sans m-0">
                    {st.description}
                  </p>
                </div>

                <div className="pt-1.5 border-t border-[#1E1610]/20">
                  <span className={`text-[10px] font-heading font-extrabold px-2 py-0.5 rounded-none ${
                    st.unlocked ? "bg-[#6DB33F] text-[#1E1610] border border-[#1E1610]" : "text-[#5A3720]"
                  }`}>
                    {st.unlockedAtLabel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

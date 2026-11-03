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
import { Navigation } from "@/components/Navigation";
import Footer from "@/components/Footer";
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
      <div className="min-h-[100dvh]  text-[#2B1B0F] p-4 sm:p-6 pb-10 flex flex-col justify-between">
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
      <div className="min-h-[100dvh]  text-[#2B1B0F] pb-10 flex flex-col justify-between">
        <OfflineBanner />
        <Navigation currentTab="stickers" profile={profile} />
        <main className="max-w-xl mx-auto px-4 py-12 flex-1 flex flex-col justify-center items-center text-center my-auto">
          <div className="bg-[#FFF7E6] border-[3px] border-[#422816] rounded-none p-8 shadow-[4px_4px_0px_#1B120C] space-y-4">
            <div className="w-12 h-12 bg-[#D9453D] border-[2px] border-[#422816] flex items-center justify-center mx-auto text-[#FFF7E6] font-pixel text-lg">
              !
            </div>
            <h1 className="font-pixel text-lg text-[#2B1B0F]">
              Sticker Showcase Error
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-[#5A3720] leading-relaxed">
              {errorMessage || "Unable to display learner trophy badges."}
            </p>
            <div className="pt-2">
              <Button
                variant="primary"
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
      </div>
    );
  }

  // 3. Locked State: If user has not onboarded
  if (!profile || !profile.selectedClass) {
    return (
      <div className="min-h-[100dvh]  text-[#2B1B0F] pb-10 flex flex-col justify-between">
        <OfflineBanner />
        <Navigation currentTab="stickers" />
        <main className="max-w-xl mx-auto px-4 py-12 flex-1 flex flex-col justify-center items-center text-center my-auto">
          <div className="bg-[#FFF7E6] border-[3px] border-[#422816] rounded-none p-8 shadow-[4px_4px_0px_#1B120C] space-y-4">
            <div className="w-12 h-12 bg-[#FFE9A8] border-[2px] border-[#422816] flex items-center justify-center mx-auto text-[#2B1B0F]">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="font-pixel text-lg text-[#2B1B0F]">
              Stickers Locked
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-[#5A3720] leading-relaxed">
              Start learning on Margam to earn achievement stickers and track your mastery milestones.
            </p>
            <div className="pt-2">
              <Link
                href="/student"
                className="inline-flex items-center justify-center min-h-[48px] px-6 py-2.5 bg-[#5DAA3A] text-[#FFF7E6] border-[2px] border-[#422816] font-pixel text-xs shadow-[3px_3px_0px_#1B120C] no-underline hover:bg-[#4E9330]"
              >
                <span>Get Started</span>
              </Link>
            </div>
          </div>
        </main>
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
    <div className="min-h-[100dvh]  text-[#2B1B0F] flex flex-col justify-between">
      <OfflineBanner />

      <Navigation
        currentTab="stickers"
        profile={profile}
      />

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full flex-1 space-y-6 md:pl-28 lg:pl-8 pb-10 lg:pb-12">
        {/* Showcase Banner */}
        <div className="glass-panel p-6 sm:p-8 border border-white/70 shadow-sm text-center space-y-4 max-w-2xl mx-auto rounded-2xl">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 shadow-sm border border-white/80 flex items-center justify-center mx-auto text-white">
            <Award className="w-8 h-8" />
          </div>

          <h1 className="font-pixel text-xl sm:text-2xl text-[#2B1B0F]">
            Learner Trophy Badges
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-[#5A3720] leading-relaxed font-sans">
            Earn stickers and companion badges as you master sequential concepts and complete diagnostics.
          </p>
          <div className="pt-1">
            <span className="inline-block px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 font-heading font-bold text-xs shadow-xs">
              {unlockedCount} of {stickers.length} Badges Unlocked
            </span>
          </div>
        </div>

        {/* 4. Empty State: If no badges unlocked beyond onboarding */}
        {unlockedCount <= 1 && completedCount === 0 && (
          <div className="glass-panel p-4 border border-white/70 text-center space-y-2 max-w-md mx-auto rounded-xl">
            <p className="text-xs font-semibold text-[#5A3720]">
              Complete your first lesson practice to unlock additional mastery badges!
            </p>
          </div>
        )}

        {/* Stickers Grid: 1 col on mobile, 2 on tablet, 3 to 4 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {stickers.map((st) => {
            const colorClass = {
              green: "bg-[#5DAA3A] text-[#FFF7E6]",
              yellow: "bg-[#FFE9A8] text-[#2B1B0F]",
              cyan: "bg-[#3FA7C9] text-[#FFF7E6]",
              pink: "bg-[#FF8FA3] text-[#2B1B0F]",
              orange: "bg-[#FFB36B] text-[#2B1B0F]",
            }[st.color];

            return (
              <div
                key={st.id}
                className={`p-4 border-[3px] text-center space-y-2 select-none ${
                  st.unlocked
                    ? "bg-[#FFF7E6] border-[#422816] shadow-[4px_4px_0px_#1B120C]"
                    : "bg-[#D9D9D9]/80 border-[#8B8B8B] opacity-75 border-dashed"
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl border border-white/80 flex items-center justify-center mx-auto shadow-xs ${
                    st.unlocked ? colorClass : "bg-[#8B8B8B] text-[#FFF7E6]"
                  }`}
                >
                  {st.unlocked ? (
                    st.icon === "star" ? <Star className="w-7 h-7" /> :
                    st.icon === "award" ? <Award className="w-7 h-7" /> :
                    st.icon === "trending" ? <TrendingUp className="w-7 h-7" /> :
                    st.icon === "zap" ? <Zap className="w-7 h-7" /> :
                    <Sparkles className="w-7 h-7" />
                  ) : (
                    <Lock className="w-6 h-6 text-[#422816]" />
                  )}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center justify-center gap-1.5">
                    <h2 className="font-pixel text-xs text-[#2B1B0F]">
                      {st.title}
                    </h2>
                    {st.unlocked && <CheckCircle2 className="w-3.5 h-3.5 text-[#5DAA3A]" />}
                  </div>
                  <p className="text-[11px] font-semibold text-[#5A3720] leading-snug font-sans">
                    {st.description}
                  </p>
                </div>

                <div className="pt-1.5 border-t border-[#422816]/20">
                  <span className={`text-[10px] font-pixel px-2 py-0.5 ${
                    st.unlocked ? "bg-[#5DAA3A] text-[#FFF7E6]" : "text-[#7A4B2A]"
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

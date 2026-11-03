"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Sparkles,
  Award,
  Star,
  Lock,
  CheckCircle2,
  TrendingUp,
  Zap,
} from "lucide-react";
import { LearnerProfile } from "@/lib/types";
import { getActiveProfile } from "@/lib/storage";
import { Navigation } from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  SkeletonCard,
  OfflineBanner,
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
      if (!active) {
        setProfile(null);
        setLoading(false);
        return;
      }

      setProfile(active);
      setLoading(false);
    } catch (err) {
      console.error("Error loading learner stickers:", err);
      setHasError(true);
      setErrorMessage("Could not load stickers. Your learning data is safe.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initStickers();
  }, [initStickers]);

  // Loading skeleton state
  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-[#FFF7E6] text-[#2B1B0F] flex flex-col justify-between">
        <OfflineBanner />
        <Navigation currentTab="stickers" profile={null} />
        <main className="max-w-[1200px] mx-auto px-4 py-8 w-full flex-1 space-y-6 md:pl-28 lg:pl-8">
          <SkeletonCard />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (hasError) {
    return (
      <div className="min-h-[100dvh] bg-[#FFF7E6] text-[#2B1B0F] flex flex-col justify-between">
        <OfflineBanner />
        <Navigation currentTab="stickers" profile={profile} />
        <main className="max-w-md mx-auto px-4 py-12 flex-1 flex flex-col justify-center text-center">
          <div className="bg-white border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] p-6 space-y-4">
            <h1 className="font-heading font-extrabold text-xl text-[#2B1B0F]">
              Sticker Collection Paused
            </h1>
            <p className="text-xs sm:text-sm text-[#2B1B0F]/80">
              {errorMessage || "Unable to display stickers right now."}
            </p>
            <button
              type="button"
              onClick={initStickers}
              className="inline-flex items-center justify-center min-h-[48px] px-6 py-2.5 bg-[#5DAA3A] text-[#2B1B0F] border-[3px] border-[#2B1B0F] font-heading font-bold text-sm shadow-[3px_3px_0px_#2B1B0F]"
            >
              Try Again
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Locked state if no profile
  if (!profile) {
    return (
      <div className="min-h-[100dvh] bg-[#FFF7E6] text-[#2B1B0F] flex flex-col justify-between">
        <OfflineBanner />
        <Navigation currentTab="stickers" profile={null} />
        <main className="max-w-md mx-auto px-4 py-12 flex-1 flex flex-col justify-center text-center">
          <div className="bg-white border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] p-6 sm:p-8 space-y-4">
            <div className="w-12 h-12 bg-[#FFE9A8] border-2 border-[#2B1B0F] flex items-center justify-center mx-auto text-[#2B1B0F]">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="font-heading font-extrabold text-2xl text-[#2B1B0F]">
              Badges Locked
            </h1>
            <p className="text-xs sm:text-sm font-sans font-medium text-[#2B1B0F]/80 leading-relaxed">
              Start learning on Margam to earn achievement stickers and track your mastery milestones.
            </p>
            <div className="pt-2">
              <Link
                href="/student"
                className="inline-flex items-center justify-center min-h-[48px] px-6 py-2.5 bg-[#5DAA3A] text-[#2B1B0F] border-[3px] border-[#2B1B0F] font-heading font-bold text-sm shadow-[3px_3px_0px_#2B1B0F] no-underline hover:brightness-105"
              >
                <span>Get Started</span>
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
    <div className="min-h-[100dvh] bg-[#FFF7E6] text-[#2B1B0F] flex flex-col justify-between">
      <OfflineBanner />

      <Navigation
        currentTab="stickers"
        profile={profile}
      />

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full flex-1 space-y-6 md:pl-28 lg:pl-8 pb-10 lg:pb-12">
        {/* Showcase Banner */}
        <div className="bg-white p-6 sm:p-8 border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] text-center space-y-4 max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-[#F4C542] border-[3px] border-[#2B1B0F] shadow-[3px_3px_0px_#2B1B0F] flex items-center justify-center mx-auto text-[#2B1B0F]">
            <Award className="w-8 h-8" />
          </div>

          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#2B1B0F]">
            Learner Trophy Badges
          </h1>
          <p className="text-xs sm:text-sm font-sans font-medium text-[#2B1B0F]/80 leading-relaxed max-w-lg mx-auto">
            Earn stickers and companion badges as you master sequential concepts and complete diagnostics.
          </p>
          <div className="pt-1">
            <span className="inline-block px-3.5 py-1.5 bg-[#5DAA3A] text-[#2B1B0F] border-2 border-[#2B1B0F] font-heading font-extrabold text-xs shadow-[2px_2px_0px_#2B1B0F]">
              {unlockedCount} of {stickers.length} Badges Unlocked
            </span>
          </div>
        </div>

        {/* Empty State: If no badges unlocked beyond onboarding */}
        {unlockedCount <= 1 && completedCount === 0 && (
          <div className="bg-white p-4 border-[2px] border-[#2B1B0F] shadow-[2px_2px_0px_#2B1B0F] text-center space-y-2 max-w-md mx-auto">
            <p className="text-xs font-sans font-bold text-[#2B1B0F]/80">
              Complete your first lesson practice to unlock additional mastery badges!
            </p>
          </div>
        )}

        {/* Stickers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {stickers.map((st) => {
            const colorClass = {
              green: "bg-[#5DAA3A] text-[#2B1B0F]",
              yellow: "bg-[#FFE9A8] text-[#2B1B0F]",
              cyan: "bg-[#6EB5FF] text-[#2B1B0F]",
              pink: "bg-[#FF8FA3] text-[#2B1B0F]",
              orange: "bg-[#FFB36B] text-[#2B1B0F]",
            }[st.color];

            return (
              <div
                key={st.id}
                className={`p-4 border-[3px] border-[#2B1B0F] text-center space-y-3 select-none ${
                  st.unlocked
                    ? "bg-white shadow-[4px_4px_0px_#2B1B0F]"
                    : "bg-[#E5D7BE]/40 shadow-[2px_2px_0px_#2B1B0F] opacity-75 border-dashed"
                }`}
              >
                <div
                  className={`w-14 h-14 border-2 border-[#2B1B0F] flex items-center justify-center mx-auto shadow-[2px_2px_0px_#2B1B0F] ${
                    st.unlocked ? colorClass : "bg-[#D8D8D8] text-[#2B1B0F]/50"
                  }`}
                >
                  {st.unlocked ? (
                    st.icon === "star" ? <Star className="w-7 h-7" /> :
                    st.icon === "award" ? <Award className="w-7 h-7" /> :
                    st.icon === "trending" ? <TrendingUp className="w-7 h-7" /> :
                    st.icon === "zap" ? <Zap className="w-7 h-7" /> :
                    <Sparkles className="w-7 h-7" />
                  ) : (
                    <Lock className="w-6 h-6 text-[#2B1B0F]/50" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-1.5">
                    <h2 className="font-heading font-extrabold text-base text-[#2B1B0F]">
                      {st.title}
                    </h2>
                    {st.unlocked && <CheckCircle2 className="w-4 h-4 text-[#5DAA3A]" />}
                  </div>
                  <p className="text-xs font-sans font-medium text-[#2B1B0F]/75 leading-snug">
                    {st.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#2B1B0F]/20">
                  <span className={`text-[10px] font-heading font-bold px-2 py-0.5 border border-[#2B1B0F] ${
                    st.unlocked ? "bg-[#5DAA3A] text-[#2B1B0F]" : "bg-transparent text-[#2B1B0F]/60"
                  }`}>
                    {st.unlockedAtLabel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}

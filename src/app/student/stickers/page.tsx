"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import {
  Award,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { LearnerProfile, SupportedLanguage } from "@/lib/types";
import { getActiveProfile } from "@/lib/storage";
import { Navigation } from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  SkeletonCard,
  OfflineBanner,
} from "@/components/ui";
import { evaluateStudentBadges, EvaluatedBadge } from "@/lib/badges";
import { PixelBadgeIcon } from "@/components/ui/PixelBadgeIcon";
import { playBadgeUnlockedSound } from "@/lib/sound";

export default function StickersPage() {
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>("en");
  const hasPlayedChimeRef = useRef(false);

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
      const savedLang = (localStorage.getItem("margam_language") as SupportedLanguage) || "en";
      setCurrentLang(savedLang);
      setLoading(false);
    } catch (err) {
      console.error("Error loading learner stickers:", err);
      setHasError(true);
      setErrorMessage("Could not load badges. Reload the page.");
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
        <main id="main-content" className="max-w-[1200px] mx-auto px-4 py-8 w-full flex-1 space-y-6 md:pl-28 lg:pl-8">
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
              Badges could not load
            </h1>
            <p className="text-xs sm:text-sm text-[#2B1B0F]/80">
              {errorMessage || "Unable to display stickers right now."}
            </p>
            <button
              type="button"
              onClick={initStickers}
              className="inline-flex items-center justify-center min-h-[48px] px-6 py-2.5 bg-[#5DAA3A] text-[#2B1B0F] border-[3px] border-[#2B1B0F] font-heading font-bold text-sm shadow-[3px_3px_0px_#2B1B0F] cursor-pointer"
            >
              Try again
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
          <div className="bg-[#FFFDF7] border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] p-6 sm:p-8 space-y-4">
            <div className="w-12 h-12 bg-[#FFE9A8] border-2 border-[#2B1B0F] flex items-center justify-center mx-auto text-[#2B1B0F]">
              <Award className="w-6 h-6" />
            </div>
            <h1 className="font-heading font-extrabold text-2xl text-[#2B1B0F]">
              No badges earned yet.
            </h1>
            <p className="text-xs sm:text-sm font-sans font-medium text-[#2B1B0F]/80 leading-relaxed">
              Complete lessons and practice worksheets to earn badges.
            </p>
            <div className="pt-2">
              <Link
                href="/student/learn"
                className="inline-flex items-center justify-center min-h-[48px] px-6 py-2.5 bg-[#5DAA3A] text-[#2B1B0F] border-[3px] border-[#2B1B0F] font-heading font-bold text-sm shadow-[3px_3px_0px_#2B1B0F] no-underline hover:brightness-105"
              >
                <span>Go to lessons</span>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Derive badges from real history
  const evaluatedBadges: EvaluatedBadge[] = evaluateStudentBadges(profile, [currentLang]);
  const unlockedCount = evaluatedBadges.filter((b) => b.unlocked).length;

  return (
    <div className="min-h-[100dvh] bg-[#FFF7E6] text-[#2B1B0F] flex flex-col justify-between">
      <OfflineBanner />

      <Navigation
        currentTab="stickers"
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        profile={profile}
      />

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full flex-1 space-y-6 md:pl-28 lg:pl-8 pb-10 lg:pb-12">
        {/* Showcase Banner */}
        <div className="bg-[#FFFDF7] p-6 sm:p-8 border-3 border-[#2B1B0F] shadow-block text-center space-y-4 max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-[#F4C542] border-3 border-[#2B1B0F] shadow-[3px_3px_0px_#2B1B0F] flex items-center justify-center mx-auto text-[#2B1B0F]">
            <Award className="w-8 h-8" />
          </div>

          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#2B1B0F]">
            Badge Inventory
          </h1>
          <p className="text-xs sm:text-sm font-sans font-medium text-[#2B1B0F]/80 leading-relaxed max-w-lg mx-auto">
            Badges earned from your real study history, completed lessons, streaks, and fixed gaps.
          </p>
          <div className="pt-1">
            <span className="inline-block px-3.5 py-1.5 bg-[#5DAA3A] text-[#2B1B0F] border-2 border-[#2B1B0F] font-heading font-extrabold text-xs shadow-xs">
              {unlockedCount} of {evaluatedBadges.length} badges earned
            </span>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {evaluatedBadges.map((badge) => {
            const title = badge.title[currentLang] || badge.title.en;
            const description = badge.description[currentLang] || badge.description.en;

            if (!badge.unlocked) {
              // LOCKED BADGE (GREY STONE BLOCK WITH LOCK ICON)
              return (
                <div
                  key={badge.id}
                  className="p-4 bg-[#3E3A36] border-3 border-[#2B1B0F] shadow-[3px_3px_0px_#1B120C] text-center space-y-3 select-none flex flex-col justify-between min-h-[200px]"
                >
                  <div className="space-y-3">
                    <div className="w-14 h-14 bg-[#2B1B0F] border-2 border-[#1B120C] flex items-center justify-center mx-auto shadow-inner">
                      <PixelBadgeIcon type="lock" unlocked={false} size={28} />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-1.5">
                        <h2 className="font-heading font-bold text-sm text-[#D9D9D9]">
                          {title}
                        </h2>
                      </div>
                      <p className="text-xs font-sans text-[#A69E96] leading-snug">
                        {description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#2B1B0F]">
                    <span className="text-[10px] font-heading font-bold px-2 py-0.5 bg-[#2B1B0F] text-[#8C827A] border border-[#1B120C] block">
                      {badge.unlockedAtLabel}
                    </span>
                  </div>
                </div>
              );
            }

            // UNLOCKED BADGE (PIXEL ARTWORK AND TITLE)
            return (
              <div
                key={badge.id}
                className="p-4 bg-white border-3 border-[#2B1B0F] shadow-block text-center space-y-3 select-none flex flex-col justify-between min-h-[200px] transition-transform hover:-translate-y-0.5"
              >
                <div className="space-y-3">
                  <div className="w-14 h-14 bg-[#FFF7E6] border-2 border-[#2B1B0F] flex items-center justify-center mx-auto shadow-[2px_2px_0px_#2B1B0F]">
                    <PixelBadgeIcon type={badge.icon} unlocked={true} size={32} />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-1.5">
                      <h2 className="font-heading font-extrabold text-base text-[#2B1B0F]">
                        {title}
                      </h2>
                      <CheckCircle2 className="w-4 h-4 text-[#5DAA3A] shrink-0" />
                    </div>
                    <p className="text-xs font-sans font-medium text-[#2B1B0F]/75 leading-snug">
                      {description}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#2B1B0F]/20">
                  <span className="text-[10px] font-heading font-bold px-2 py-0.5 bg-[#5DAA3A] text-[#2B1B0F] border border-[#2B1B0F] shadow-xs block">
                    {badge.unlockedAtLabel}
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

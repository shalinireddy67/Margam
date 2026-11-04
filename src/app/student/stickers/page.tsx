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
  Flame,
  Shield,
  Crown,
  Sparkles,
} from "lucide-react";
import { LearnerProfile } from "@/lib/types";
import { getActiveProfile } from "@/lib/storage";
import { Navigation } from "@/components/Navigation";
import { SkeletonCard, OfflineBanner, Button } from "@/components/ui";
import { getLevelProgress } from "@/lib/xp-config";
import { useLanguage } from "@/contexts/LanguageContext";

export type StickerRarity = "common" | "rare" | "epic";

export interface InventorySticker {
  id: string;
  title: string;
  description: string;
  rarity: StickerRarity;
  icon: string;
  unlocked: boolean;
  hint: string;
  earnedDateLabel?: string;
}

export default function StickersInventoryPage() {
  const { t } = useLanguage();
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  // Toast auto-clear
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

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

  if (hasError) {
    return (
      <div className="min-h-[100dvh] bg-transparent text-[#1E1610] pb-10 flex flex-col justify-between">
        <OfflineBanner />
        <Navigation currentTab="stickers" profile={profile} />
        <main className="max-w-xl mx-auto px-4 py-12 flex-1 flex flex-col justify-center items-center text-center my-auto">
          <div
            data-panel="error-card"
            className="panel-plank p-8 border-3 border-[#1E1610] shadow-[4px_4px_0px_#1E1610] space-y-4 text-[#1E1610]"
          >
            <div className="w-12 h-12 bg-[#D1362B] border-2 border-[#1E1610] flex items-center justify-center mx-auto text-[#F3E3BC] font-heading font-extrabold text-lg">
              !
            </div>
            <h1 className="font-heading font-extrabold text-lg text-[#1E1610]">
              {t("errors.generic") || "Could not load stickers"}
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-[#5A3720] leading-relaxed">
              {errorMessage || t("stickers.tryAgain") || "Could not show stickers. Please tap Try again."}
            </p>
            <div className="pt-2">
              <Button
                variant="primary"
                size="default"
                onClick={initStickers}
                className="w-full sm:w-auto min-h-[48px]"
              >
                <span>{t("stickers.tryAgain") || "Try again"}</span>
                <RotateCcw className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!profile || !profile.selectedClass) {
    return (
      <div className="min-h-[100dvh] bg-transparent text-[#1E1610] pb-10 flex flex-col justify-between">
        <OfflineBanner />
        <Navigation currentTab="stickers" />
        <main className="max-w-xl mx-auto px-4 py-12 flex-1 flex flex-col justify-center items-center text-center my-auto">
          <div
            data-panel="locked-card"
            className="panel-plank p-8 border-3 border-[#1E1610] shadow-[4px_4px_0px_#1E1610] space-y-4 text-[#1E1610]"
          >
            <div className="w-12 h-12 bg-[#E8CF9C] border-2 border-[#1E1610] flex items-center justify-center mx-auto text-[#1E1610]">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="font-heading font-extrabold text-lg text-[#1E1610]">
              {t("stickers.locked") || "Stickers locked"}
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-[#5A3720] leading-relaxed">
              {t("stickers.howToUnlock") || "Select a class and complete lessons to unlock your inventory."}
            </p>
            <div className="pt-2">
              <Link
                href="/student/select-class"
                className="inline-flex items-center justify-center min-h-[48px] px-6 py-2.5 bg-[#6DB33F] text-[#1E1610] border-3 border-[#1E1610] font-heading font-extrabold text-xs shadow-[3px_3px_0px_#1E1610] no-underline hover:bg-[#8CCB55]"
              >
                <span>{t("stickers.selectClass") || "Select Class"}</span>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Derive real statistics strictly from profile state
  const completedTopics = Object.values(profile.topicProgress || {}).filter(
    (t) => t.status === "completed"
  );
  const completedCount = completedTopics.length;
  const resolvedGapsCount = (profile.resolvedGaps || []).length;
  const currentStreak = profile.streak?.current || 0;
  const longestStreak = profile.streak?.longest || currentStreak;
  const consecutiveCorrect = profile.consecutiveCorrect || 0;
  const levelInfo = getLevelProgress(profile.xp || 0);

  // Exact Real Event Trigger Inventory Stickers
  const inventory: InventorySticker[] = [
    {
      id: "first_step",
      title: "First Step",
      description: `Began learning mathematics in Class ${profile.selectedClass}`,
      rarity: "common",
      icon: "⭐",
      unlocked: Boolean(profile.selectedClass),
      hint: "Select your school class to earn this sticker.",
      earnedDateLabel: "Class selected",
    },
    {
      id: "concept_builder",
      title: "Concept Builder",
      description: "Mastered your first curriculum mathematics topic",
      rarity: "common",
      icon: "🧱",
      unlocked: completedCount >= 1,
      hint: "Complete 1 full lesson and worksheet to earn this sticker.",
      earnedDateLabel: `${completedCount} concept(s) mastered`,
    },
    {
      id: "first_gap_fixed",
      title: "Foundation Repair",
      description: "Identified and repaired a prerequisite learning gap",
      rarity: "rare",
      icon: "🛡️",
      unlocked: resolvedGapsCount >= 1,
      hint: "Fix 1 foundational prerequisite gap to earn this sticker.",
      earnedDateLabel: `${resolvedGapsCount} gap(s) repaired`,
    },
    {
      id: "streak_warrior",
      title: "Streak Keeper",
      description: "Maintained a 3-day continuous daily study streak",
      rarity: "rare",
      icon: "🔥",
      unlocked: longestStreak >= 3,
      hint: "Study 3 days in a row to earn the Streak Keeper sticker.",
      earnedDateLabel: `${currentStreak} day streak`,
    },
    {
      id: "streak_master",
      title: "Fire Champion",
      description: "Achieved a 7-day continuous daily study streak",
      rarity: "epic",
      icon: "⚡",
      unlocked: longestStreak >= 7,
      hint: "Maintain a full 7-day study streak to earn this sticker.",
      earnedDateLabel: `${currentStreak} day streak`,
    },
    {
      id: "accuracy_ace",
      title: "Sharp Mind",
      description: "Answered 10 practice questions consecutively correct",
      rarity: "rare",
      icon: "🎯",
      unlocked: consecutiveCorrect >= 10,
      hint: "Answer 10 practice questions in a row without making a mistake.",
      earnedDateLabel: `${consecutiveCorrect}/10 consecutive correct`,
    },
    {
      id: "iron_tier",
      title: "Iron Tier",
      description: "Reached Level 10 and unlocked the Iron tool tier",
      rarity: "rare",
      icon: "⚔️",
      unlocked: levelInfo.level >= 10,
      hint: "Earn 600 XP and reach Level 10 to unlock Iron tier.",
      earnedDateLabel: `Current: Level ${levelInfo.level}`,
    },
    {
      id: "diamond_tier",
      title: "Diamond Tier",
      description: "Reached Level 20 and achieved the Diamond tool tier",
      rarity: "epic",
      icon: "👑",
      unlocked: levelInfo.level >= 20,
      hint: "Reach Level 20 in mathematics to earn the Diamond sticker.",
      earnedDateLabel: `Current: Level ${levelInfo.level}`,
    },
  ];

  const unlockedCount = inventory.filter((s) => s.unlocked).length;

  const rarityBadge = (rarity: StickerRarity) => {
    if (rarity === "common") {
      return (
        <span className="px-1.5 py-0.5 bg-[#B9BCC0] text-[#1E1610] border border-[#1E1610] text-[9px] font-heading font-extrabold uppercase tracking-wider">
          common
        </span>
      );
    }
    if (rarity === "rare") {
      return (
        <span className="px-1.5 py-0.5 bg-[#F2C230] text-[#1E1610] border border-[#1E1610] text-[9px] font-heading font-extrabold uppercase tracking-wider">
          rare
        </span>
      );
    }
    return (
      <span className="px-1.5 py-0.5 bg-[#4EDBD3] text-[#1E1610] border border-[#1E1610] text-[9px] font-heading font-extrabold uppercase tracking-wider">
        epic
      </span>
    );
  };

  return (
    <div className="min-h-[100dvh] bg-transparent text-[#1E1610] flex flex-col justify-between">
      <OfflineBanner />

      <Navigation
        currentTab="stickers"
        profile={profile}
      />

      {/* Earn Toast Notification (<=600ms anim) */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-20 right-4 z-50 p-3 bg-[#6DB33F] text-[#1E1610] border-3 border-[#1E1610] shadow-[3px_3px_0px_#1E1610] font-heading font-extrabold text-xs flex items-center gap-2 animate-bounce motion-reduce:animate-none"
          style={{ animationDuration: "500ms" }}
        >
          <Sparkles className="w-4 h-4 text-[#1E1610]" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full flex-1 space-y-6 has-mobile-nav">
        {/* Banner */}
        <div
          data-panel="inventory-header"
          className="panel-plank p-6 sm:p-8 border-3 border-[#1E1610] shadow-[3px_3px_0px_#1E1610] flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#F2C230] text-[#1E1610] border-2 border-[#1E1610] font-heading font-extrabold text-xs">
              <Award className="w-3.5 h-3.5" />
              <span>{t("stickers.blockInventory") || "Block Inventory"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#1E1610]">
              {t("stickers.title") || "Stickers & Trophy Inventory"}
            </h1>
            <p className="text-xs sm:text-sm text-[#5A3720] font-sans max-w-xl">
              {t("stickers.subtitle") || "Earn permanent inventory stickers by completing lessons, keeping daily streaks, and repairing foundational gaps."}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3.5 py-1.5 bg-[#6DB33F] text-[#1E1610] border-3 border-[#1E1610] font-heading font-extrabold text-xs shadow-[2px_2px_0px_#1E1610]">
              {unlockedCount} / {inventory.length} {t("stickers.totalEarned", { count: unlockedCount, total: inventory.length }) || "Stickers Collected"}
            </span>
          </div>
        </div>

        {/* Inventory Grid: 4 columns on large screens */}
        <div
          data-panel="inventory-grid"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {inventory.map((item) => {
            if (item.unlocked) {
              return (
                <div
                  key={item.id}
                  data-slot="filled"
                  className="p-4 bg-[#E8CF9C]/90 border-3 border-[#1E1610] shadow-[3px_3px_0px_#1E1610] flex flex-col justify-between gap-3 text-center transition-all select-none"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-heading font-bold text-[#5A3720]">
                      [✓ {t("stickers.earned") || "Earned"}]
                    </span>
                    {rarityBadge(item.rarity)}
                  </div>

                  <div className="w-16 h-16 mx-auto bg-[#18120C] border-3 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] flex items-center justify-center text-3xl">
                    {item.icon}
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-heading font-extrabold text-sm text-[#1E1610]">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-[#5A3720] font-sans leading-snug">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t-2 border-[#1E1610]/15">
                    <span className="text-[10px] font-heading font-bold text-[#6DB33F]">
                      {item.earnedDateLabel}
                    </span>
                  </div>
                </div>
              );
            }

            // Locked slot: recessed style with plain hint on how to earn
            return (
              <div
                key={item.id}
                data-slot="empty"
                className="p-4 bg-[#B9BCC0]/40 border-3 border-[#1E1610] border-dashed flex flex-col justify-between gap-3 text-center opacity-85 select-none"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-heading font-bold text-[#5A3720]">
                    [-- {t("stickers.locked") || "Locked"}]
                  </span>
                  {rarityBadge(item.rarity)}
                </div>

                <div className="w-16 h-16 mx-auto bg-[#232634]/50 border-2 border-[#1E1610] border-dashed flex items-center justify-center text-xl text-[#5A3720]">
                  <Lock className="w-6 h-6 text-[#5A3720]" />
                </div>

                <div className="space-y-1">
                  <h3 className="font-heading font-bold text-xs text-[#5A3720]">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-[#5A3720] font-sans leading-snug italic">
                    {item.hint}
                  </p>
                </div>

                <div className="pt-2 border-t-2 border-[#1E1610]/15">
                  <span className="text-[10px] font-heading font-bold text-[#5A3720]">
                    {t("stickers.locked") || "Incomplete"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-[1200px] mx-auto px-4 my-6 text-center text-xs font-sans font-medium text-[#5A3720]">
        Margam • {t("stickers.title") || "Block Inventory & Trophy Showcase"}
      </footer>
    </div>
  );
}

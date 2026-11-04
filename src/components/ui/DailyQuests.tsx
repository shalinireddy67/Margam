"use client";

import React, { useState } from "react";
import { Check, Sparkles, Target, Zap } from "lucide-react";
import { LearnerProfile } from "@/lib/types";
import { getIstDateString, XP_CONFIG } from "@/lib/xp-config";
import { applyAwardedXpToProfile } from "@/lib/gamification";
import { saveProfile } from "@/lib/storage";
import { useLanguage } from "@/contexts/LanguageContext";

interface DailyQuestsProps {
  profile: LearnerProfile;
  onProfileUpdate?: (updated: LearnerProfile) => void;
}

interface QuestState {
  id: string;
  title: string;
  current: number;
  target: number;
  xpReward: number;
  completed: boolean;
  claimed: boolean;
}

export function DailyQuests({ profile, onProfileUpdate }: DailyQuestsProps) {
  const { t } = useLanguage();
  const todayIst = getIstDateString();
  const [animatingQuestId, setAnimatingQuestId] = useState<string | null>(null);

  // Derive real state from profile
  const resolvedGapsCount = (profile.resolvedGaps || []).length;
  // If user has an active gap currently unresolved, gap quest is 0/1; otherwise if they resolved any gap, 1/1
  const gapCompleted = resolvedGapsCount > 0 && !profile.activeGap;

  // Questions answered today in IST
  const questionHistory = profile.answeredQuestionsHistory || {};
  let todayAnsweredCount = 0;
  for (const dateStr of Object.values(questionHistory)) {
    try {
      if (getIstDateString(new Date(dateStr)) === todayIst) {
        todayAnsweredCount++;
      }
    } catch {
      // ignore parse error
    }
  }
  // Also count total answered if timestamp wasn't recorded per item
  if (todayAnsweredCount === 0 && Object.keys(questionHistory).length > 0) {
    todayAnsweredCount = Math.min(5, Object.keys(questionHistory).length);
  }

  // Lesson completed
  const lessonCompleted = Object.values(profile.topicProgress || {}).some(
    (t) => t.lessonCompleted || t.status === "completed"
  );

  // Check stored claimed quests for today
  const storageKey = `margam_claimed_quests_${profile.id}_${todayIst}`;
  let claimedIds: string[] = [];
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;
    if (raw) claimedIds = JSON.parse(raw);
  } catch {
    claimedIds = [];
  }

  const quests: QuestState[] = [
    {
      id: "quest_gap",
      title: "Fix one gap",
      current: gapCompleted ? 1 : 0,
      target: 1,
      xpReward: XP_CONFIG.QUEST_COMPLETION || 15,
      completed: gapCompleted,
      claimed: claimedIds.includes("quest_gap"),
    },
    {
      id: "quest_questions",
      title: "Answer 5 questions",
      current: Math.min(5, todayAnsweredCount),
      target: 5,
      xpReward: XP_CONFIG.QUEST_COMPLETION || 15,
      completed: todayAnsweredCount >= 5,
      claimed: claimedIds.includes("quest_questions"),
    },
    {
      id: "quest_lesson",
      title: "Read one lesson",
      current: lessonCompleted ? 1 : 0,
      target: 1,
      xpReward: XP_CONFIG.QUEST_COMPLETION || 15,
      completed: lessonCompleted,
      claimed: claimedIds.includes("quest_lesson"),
    },
  ];

  const handleClaim = (quest: QuestState) => {
    if (!quest.completed || quest.claimed) return;

    // Trigger <=600ms block-place animation
    setAnimatingQuestId(quest.id);

    // Save claim in localStorage
    const updatedClaimed = [...claimedIds, quest.id];
    try {
      localStorage.setItem(storageKey, JSON.stringify(updatedClaimed));
    } catch {
      // ignore
    }

    // Award XP with sound
    const currentDaily = profile.dailyXp?.xp || 0;
    const { updatedProfile } = applyAwardedXpToProfile(profile, quest.xpReward, currentDaily + quest.xpReward);
    saveProfile(updatedProfile);
    if (onProfileUpdate) {
      onProfileUpdate(updatedProfile);
    }

    setTimeout(() => {
      setAnimatingQuestId(null);
    }, 500);
  };

  return (
    <div
      data-panel="daily-quests"
      className="panel-plank p-4 sm:p-5 border-3 border-[#1E1610] shadow-[3px_3px_0px_#1E1610] space-y-4"
    >
      <div className="flex items-center justify-between border-b-2 border-[#1E1610]/20 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#F2C230] border-2 border-[#1E1610] flex items-center justify-center text-[#1E1610] shadow-[1px_1px_0px_#1E1610]">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-sm text-[#1E1610] m-0">
              {t("gamification.dailyGoalCompleted") || "Daily Quests"}
            </h3>
            <p className="text-[11px] text-[#5A3720] font-sans m-0">
              Finish 3 daily quests to earn bonus XP. Resets daily.
            </p>
          </div>
        </div>
        <span className="text-[11px] font-heading font-extrabold px-2 py-0.5 bg-[#E8CF9C] border-2 border-[#1E1610] text-[#1E1610]">
          {quests.filter((q) => q.completed).length} / 3 {t("common.completed") || "Done"}
        </span>
      </div>

      <div className="space-y-2.5">
        {quests.map((quest) => {
          const isAnimating = animatingQuestId === quest.id;

          return (
            <div
              key={quest.id}
              className={`p-3 bg-[#E8CF9C]/70 border-2 border-[#1E1610] flex items-center justify-between gap-3 transition-transform duration-300 ${
                isAnimating
                  ? "scale-[1.03] -translate-y-1 bg-[#6DB33F]/30 motion-reduce:scale-100 motion-reduce:translate-y-0"
                  : ""
              }`}
              style={{ transitionDuration: "400ms" }}
            >
              {/* Left: Tick-box + Title */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 border-2 border-[#1E1610] flex items-center justify-center text-xs font-heading font-extrabold select-none shadow-[1px_1px_0px_#1E1610] ${
                    quest.completed
                      ? "bg-[#6DB33F] text-[#1E1610]"
                      : "bg-[#E8CF9C] text-[#5A3720]"
                  }`}
                  aria-label={quest.completed ? "Completed quest" : "Incomplete quest"}
                >
                  {quest.completed ? "✓" : "–"}
                </div>
                <div>
                  <span className="font-heading font-bold text-xs text-[#1E1610] block">
                    {quest.title}
                  </span>
                  <span className="text-[10px] text-[#5A3720] font-sans">
                    {quest.current}/{quest.target} • +{quest.xpReward} XP
                  </span>
                </div>
              </div>

              {/* Right: Claim Button or Status Tag */}
              <div>
                {quest.claimed ? (
                  <span className="text-[10px] font-heading font-extrabold px-2 py-0.5 bg-[#6DB33F] text-[#1E1610] border border-[#1E1610]">
                    Claimed ✓
                  </span>
                ) : quest.completed ? (
                  <button
                    type="button"
                    onClick={() => handleClaim(quest)}
                    className="min-h-[32px] px-3 py-1 bg-[#F2C230] hover:bg-[#6DB33F] text-[#1E1610] font-heading font-extrabold text-[11px] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer flex items-center gap-1 transition-colors"
                  >
                    <Zap className="w-3 h-3 text-[#1E1610]" />
                    <span>{t("gamification.claimReward") || "Claim XP"}</span>
                  </button>
                ) : (
                  <span className="text-[10px] font-heading font-bold px-2 py-0.5 bg-[#D9B87A] text-[#5A3720] border border-[#1E1610]">
                    {t("common.inProgress") || "In Progress"}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DailyQuests;

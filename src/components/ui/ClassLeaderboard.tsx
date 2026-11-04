"use client";

import React, { useState, useEffect } from "react";
import { Trophy, TrendingUp, Flame, EyeOff, Eye, Zap } from "lucide-react";
import { LearnerProfile } from "@/lib/types";
import { getActiveProfile } from "@/lib/storage";
import { useLanguage } from "@/contexts/LanguageContext";

interface LeaderboardEntry {
  studentId: string;
  displayName: string;
  avatarPixel: string;
  level: number;
  rankBadge: string;
  rankName: string;
  weeklyXp: number;
  streakDays: number;
  improvedDelta: number;
  rankPosition: number;
  isCurrentUser?: boolean;
}

interface LeaderboardData {
  classId: string;
  tab: "weekly" | "most_improved" | "streak_kings";
  resetWindowLabel: string;
  totalMembers: number;
  leaderboard: LeaderboardEntry[];
  userRelativePosition: {
    rank: number;
    weeklyXp: number;
    diffToAhead: number;
    aheadRank: number;
    aheadName: string;
  } | null;
}

export function ClassLeaderboard({
  classId = "demo-sec-10a",
  className = "",
}: {
  classId?: string;
  className?: string;
}) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"weekly" | "most_improved" | "streak_kings">("weekly");
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [optOut, setOptOut] = useState(false);
  const [profile, setProfile] = useState<LearnerProfile | null>(null);

  useEffect(() => {
    const prof = getActiveProfile();
    setProfile(prof);
    setOptOut(Boolean(prof?.optOutOfLeaderboard));
  }, []);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const studentParam = profile?.id ? `&studentId=${encodeURIComponent(profile.id)}` : "";
    fetch(`/api/leaderboard/${classId}?tab=${activeTab}${studentParam}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (isMounted && json) {
          setData(json);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [classId, activeTab, profile?.id]);

  const toggleOptOut = () => {
    const next = !optOut;
    setOptOut(next);
  };

  const medalStyle = (pos: number) => {
    if (pos === 1) return { bg: "bg-[#F2C230]", text: "text-[#1E1610]", border: "border-[#1E1610]", badge: "🥇" };
    if (pos === 2) return { bg: "bg-[#B9BCC0]", text: "text-[#1E1610]", border: "border-[#1E1610]", badge: "🥈" };
    if (pos === 3) return { bg: "bg-[#D9B87A]", text: "text-[#1E1610]", border: "border-[#1E1610]", badge: "🥉" };
    return { bg: "bg-[#1E1610]", text: "text-[#F3E3BC]", border: "border-[#6B6F76]", badge: `#${pos}` };
  };

  return (
    <div
      data-panel="leaderboard"
      className={`bg-[#232634]/95 border-[3px] border-[#1E1610] shadow-[4px_4px_0px_#1E1610] text-[#F3E3BC] p-4 sm:p-6 rounded-xs ${className}`}
    >
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#1E1610] pb-4 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-[#F2C230] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] flex items-center justify-center text-xl shrink-0">
            🏆
          </div>
          <div>
            <h2 className="font-heading font-extrabold text-base sm:text-lg text-[#F2C230] leading-tight m-0">
              {t("leaderboard.title") || "Class Quest Board"}
            </h2>
            <p className="text-[11px] text-[#B9BCC0] font-medium m-0">
              Class Section • Privacy-First • {data?.resetWindowLabel || "Resets Mondays 00:00 IST"}
            </p>
          </div>
        </div>

        {/* Student Opt-out Toggle */}
        <button
          type="button"
          onClick={toggleOptOut}
          className={`self-start sm:self-auto min-h-[38px] px-3 py-1.5 flex items-center gap-1.5 text-xs font-heading font-extrabold border-2 border-[#1E1610] rounded-xs shadow-[2px_2px_0px_#1E1610] transition-all cursor-pointer ${
            optOut
              ? "bg-[#6B6F76] text-[#F3E3BC]"
              : "bg-[#6DB33F] text-[#1E1610]"
          }`}
          title={t("leaderboard.hideFromLeaderboard") || "Toggle visibility on the class leaderboard"}
        >
          {optOut ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>{optOut ? (t("leaderboard.hiddenOnLeaderboard") || "Hidden from Board") : (t("leaderboard.showOnLeaderboard") || "Visible on Board")}</span>
        </button>
      </div>

      {/* 3 Tabs */}
      <div className="grid grid-cols-3 gap-1.5 bg-[#1E1610] p-1.5 border-2 border-[#1E1610] mb-4 rounded-xs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "weekly"}
          onClick={() => setActiveTab("weekly")}
          className={`min-h-[40px] px-2 py-1.5 text-xs font-heading font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer rounded-xs ${
            activeTab === "weekly"
              ? "bg-[#6DB33F] text-[#1E1610] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610]"
              : "bg-[#D9B87A] text-[#1E1610] hover:bg-[#E8CF9C]"
          }`}
        >
          <Trophy className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{t("leaderboard.weeklyXp") || "Weekly XP"}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "most_improved"}
          onClick={() => setActiveTab("most_improved")}
          className={`min-h-[40px] px-2 py-1.5 text-xs font-heading font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer rounded-xs ${
            activeTab === "most_improved"
              ? "bg-[#6DB33F] text-[#1E1610] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610]"
              : "bg-[#D9B87A] text-[#1E1610] hover:bg-[#E8CF9C]"
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{t("leaderboard.mostImproved") || "Most Improved"}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "streak_kings"}
          onClick={() => setActiveTab("streak_kings")}
          className={`min-h-[40px] px-2 py-1.5 text-xs font-heading font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer rounded-xs ${
            activeTab === "streak_kings"
              ? "bg-[#6DB33F] text-[#1E1610] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610]"
              : "bg-[#D9B87A] text-[#1E1610] hover:bg-[#E8CF9C]"
          }`}
        >
          <Flame className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{t("leaderboard.streakKings") || "Streak Kings"}</span>
        </button>
      </div>

      {/* Leaderboard Table / Rows */}
      {loading ? (
        <div className="py-8 text-center text-xs text-[#B9BCC0] font-medium space-y-2">
          <div className="w-6 h-6 border-[3px] border-[#F2C230] border-t-transparent animate-spin mx-auto" />
          <span>{t("leaderboard.assemblingScores") || "Assembling class quest scores..."}</span>
        </div>
      ) : (
        <div className="space-y-1.5">
          {data?.leaderboard.map((item) => {
            const medal = medalStyle(item.rankPosition);
            return (
              <div
                key={item.studentId}
                className={`p-2.5 sm:p-3 border-2 border-[#1E1610] flex items-center justify-between gap-2 transition-all rounded-xs ${
                  item.isCurrentUser
                    ? "bg-[#6DB33F]/30 border-[#6DB33F] shadow-[inset_0px_0px_6px_rgba(109,179,63,0.4)]"
                    : "bg-[#1E1610]/60 hover:bg-[#1E1610]"
                }`}
              >
                {/* Rank & User Info */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`w-7 h-7 shrink-0 flex items-center justify-center text-xs font-heading font-extrabold border-2 shadow-[1px_1px_0px_#1E1610] ${medal.bg} ${medal.text} ${medal.border}`}
                  >
                    {medal.badge}
                  </span>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-heading font-bold text-xs sm:text-sm text-[#F3E3BC] truncate">
                        {item.displayName}
                      </span>
                      {item.isCurrentUser && (
                        <span className="text-[9px] bg-[#6DB33F] text-[#1E1610] px-1 py-0.2 font-heading font-extrabold uppercase rounded-none">
                          {t("leaderboard.youBadge") || "You"}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-[#B9BCC0]">
                      <span>{item.rankBadge}</span>
                      <span>Lv {item.level}</span>
                      <span>•</span>
                      <span>{item.rankName}</span>
                    </div>
                  </div>
                </div>

                {/* Score Column */}
                <div className="text-right shrink-0">
                  {activeTab === "weekly" && (
                    <div className="font-heading font-extrabold text-xs sm:text-sm text-[#F2C230]">
                      {item.weeklyXp} XP
                    </div>
                  )}
                  {activeTab === "most_improved" && (
                    <div className="font-heading font-extrabold text-xs sm:text-sm text-[#6DB33F] flex items-center justify-end gap-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>+{item.improvedDelta}%</span>
                    </div>
                  )}
                  {activeTab === "streak_kings" && (
                    <div className="font-heading font-extrabold text-xs sm:text-sm text-[#F2C230] flex items-center justify-end gap-1">
                      <Flame className="w-3.5 h-3.5 fill-[#F2C230]" />
                      <span>{item.streakDays}d</span>
                    </div>
                  )}
                  <span className="text-[10px] text-[#B9BCC0] block">
                    {activeTab === "weekly" ? "XP" : activeTab === "most_improved" ? "%" : "days"}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Relative Ranking for Student Outside Top 10 */}
          {data?.userRelativePosition && (
            <div className="mt-3 p-3 bg-[#1E1610] border-2 border-[#F2C230] text-[#F3E3BC] flex items-center justify-between gap-3 text-xs rounded-xs">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#F2C230] shrink-0" />
                <span>
                  Rank: <strong className="text-[#F2C230]">#{data.userRelativePosition.rank}</strong> •{" "}
                  <strong>{data.userRelativePosition.weeklyXp} XP</strong>
                </span>
              </div>
              <span className="text-[11px] font-heading font-bold text-[#6DB33F] shrink-0">
                +{data.userRelativePosition.diffToAhead} XP to #{data.userRelativePosition.aheadRank}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

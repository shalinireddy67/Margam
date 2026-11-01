"use client";

import React, { useState, useEffect } from "react";
import { Trophy, TrendingUp, Flame, Shield, EyeOff, Eye, Sparkles } from "lucide-react";
import { LearnerProfile } from "@/lib/types";
import { getActiveProfile, saveProfile } from "@/lib/storage";

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
    const prof = getActiveProfile();
    if (prof) {
      prof.optOutOfLeaderboard = next;
      saveProfile(prof);
      setProfile(prof);
    }
  };

  const medalStyle = (pos: number) => {
    if (pos === 1) return { bg: "bg-[#FFE9A8]", text: "text-[#2B1B0F]", border: "border-[#422816]", badge: "🥇" };
    if (pos === 2) return { bg: "bg-[#D9D9D9]", text: "text-[#2B1B0F]", border: "border-[#422816]", badge: "🥈" };
    if (pos === 3) return { bg: "bg-[#FFB36B]", text: "text-[#2B1B0F]", border: "border-[#422816]", badge: "🥉" };
    return { bg: "bg-[#422816]", text: "text-[#FFE9A8]", border: "border-[#7A4B2A]", badge: `#${pos}` };
  };

  return (
    <div className={`bg-[#5A3720] border-4 border-[#422816] shadow-[6px_6px_0px_#1B120C] text-[#FFF7E6] p-4 sm:p-6 ${className}`}>
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#7A4B2A] pb-4 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-[#FFE9A8] border-2 border-[#422816] shadow-[2px_2px_0px_#1B120C] flex items-center justify-center text-xl shrink-0">
            🏆
          </div>
          <div>
            <h2 className="font-heading font-extrabold text-base sm:text-lg text-[#FFE9A8] leading-tight">
              Class Quest Board
            </h2>
            <p className="text-[11px] text-[#E5D7BE] font-medium">
              Class Section • Privacy-First • {data?.resetWindowLabel || "Resets Mondays 00:00 IST"}
            </p>
          </div>
        </div>

        {/* Student Opt-out Toggle */}
        <button
          type="button"
          onClick={toggleOptOut}
          className={`self-start sm:self-auto min-h-[38px] px-3 py-1.5 flex items-center gap-1.5 text-xs font-heading font-bold border-2 transition-all cursor-pointer ${
            optOut
              ? "bg-[#422816] text-[#A68A72] border-[#7A4B2A]"
              : "bg-[#2F6B22] text-[#FFE9A8] border-[#102610] shadow-[inset_1px_1px_0px_rgba(255,255,255,0.4)]"
          }`}
          title="Toggle visibility on the class leaderboard"
        >
          {optOut ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>{optOut ? "Hidden from Board" : "Visible on Board"}</span>
        </button>
      </div>

      {/* 3 Tabs */}
      <div className="grid grid-cols-3 gap-1.5 bg-[#422816] p-1.5 border-2 border-[#7A4B2A] mb-4" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "weekly"}
          onClick={() => setActiveTab("weekly")}
          className={`min-h-[40px] px-2 py-1.5 text-xs font-heading font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === "weekly"
              ? "bg-[#5DAA3A] text-[#FFF7E6] border border-[#204514] shadow-[inset_1px_1px_0px_rgba(255,255,255,0.4),2px_2px_0px_#1B120C]"
              : "text-[#D9D9D9] hover:text-[#FFE9A8]"
          }`}
        >
          <Trophy className="w-3.5 h-3.5 text-[#FFE9A8] shrink-0" />
          <span className="truncate">Weekly XP</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "most_improved"}
          onClick={() => setActiveTab("most_improved")}
          className={`min-h-[40px] px-2 py-1.5 text-xs font-heading font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === "most_improved"
              ? "bg-[#5DAA3A] text-[#FFF7E6] border border-[#204514] shadow-[inset_1px_1px_0px_rgba(255,255,255,0.4),2px_2px_0px_#1B120C]"
              : "text-[#D9D9D9] hover:text-[#FFE9A8]"
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-[#FFE9A8] shrink-0" />
          <span className="truncate">Most Improved</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "streak_kings"}
          onClick={() => setActiveTab("streak_kings")}
          className={`min-h-[40px] px-2 py-1.5 text-xs font-heading font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === "streak_kings"
              ? "bg-[#5DAA3A] text-[#FFF7E6] border border-[#204514] shadow-[inset_1px_1px_0px_rgba(255,255,255,0.4),2px_2px_0px_#1B120C]"
              : "text-[#D9D9D9] hover:text-[#FFE9A8]"
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-[#FFB36B] shrink-0" />
          <span className="truncate">Streak Kings</span>
        </button>
      </div>

      {/* Leaderboard Table / Rows */}
      {loading ? (
        <div className="py-8 text-center text-xs text-[#E5D7BE] font-medium space-y-2">
          <div className="w-6 h-6 border-3 border-[#FFE9A8] border-t-transparent animate-spin mx-auto" />
          <span>Assembling class quest scores...</span>
        </div>
      ) : (
        <div className="space-y-1.5">
          {data?.leaderboard.map((item) => {
            const medal = medalStyle(item.rankPosition);
            return (
              <div
                key={item.studentId}
                className={`p-2.5 sm:p-3 border-2 flex items-center justify-between gap-2 transition-all ${
                  item.isCurrentUser
                    ? "bg-[#2F6B22]/50 border-[#5DAA3A] shadow-[inset_0px_0px_6px_rgba(93,170,58,0.4)]"
                    : "bg-[#422816] border-[#7A4B2A] hover:border-[#FFE9A8]/60"
                }`}
              >
                {/* Rank & User Info */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`w-7 h-7 shrink-0 flex items-center justify-center text-xs font-heading font-extrabold border shadow-[1px_1px_0px_#1B120C] ${medal.bg} ${medal.text} ${medal.border}`}
                  >
                    {medal.badge}
                  </span>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-heading font-bold text-xs sm:text-sm text-[#FFF7E6] truncate">
                        {item.displayName}
                      </span>
                      {item.isCurrentUser && (
                        <span className="text-[9px] bg-[#5DAA3A] text-[#FFF7E6] px-1 py-0.2 font-heading font-extrabold uppercase">
                          You
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-[#E5D7BE]">
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
                    <div className="font-heading font-extrabold text-xs sm:text-sm text-[#FFE9A8]">
                      {item.weeklyXp} XP
                    </div>
                  )}
                  {activeTab === "most_improved" && (
                    <div className="font-heading font-extrabold text-xs sm:text-sm text-[#5DAA3A] flex items-center justify-end gap-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>+{item.improvedDelta}%</span>
                    </div>
                  )}
                  {activeTab === "streak_kings" && (
                    <div className="font-heading font-extrabold text-xs sm:text-sm text-[#FFB36B] flex items-center justify-end gap-1">
                      <Flame className="w-3.5 h-3.5 fill-[#FF8A3D]" />
                      <span>{item.streakDays}d</span>
                    </div>
                  )}
                  <span className="text-[10px] text-[#A68A72] block">
                    {activeTab === "weekly" ? "this week" : activeTab === "most_improved" ? "growth" : "streak"}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Relative Ranking for Student Outside Top 10 */}
          {data?.userRelativePosition && (
            <div className="mt-3 p-3 bg-[#2B1B0F] border-2 border-[#FFE9A8] text-[#FFF7E6] flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FFE9A8] shrink-0" />
                <span>
                  You&apos;re ranked <strong className="text-[#FFE9A8]">#{data.userRelativePosition.rank}</strong> with{" "}
                  <strong>{data.userRelativePosition.weeklyXp} XP</strong>!
                </span>
              </div>
              <span className="text-[11px] font-heading font-bold text-[#5DAA3A] shrink-0">
                +{data.userRelativePosition.diffToAhead} XP to #{data.userRelativePosition.aheadRank}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { LearnerProfile } from "@/lib/types";
import { getIstDateString } from "@/lib/xp-config";
import { playQuestCompleteSound } from "@/lib/sound";

interface DailyQuestsProps {
  profile: LearnerProfile;
}

export function DailyQuests({ profile }: DailyQuestsProps) {
  const todayIst = getIstDateString();
  const hasPlayedSoundRef = useRef(false);

  // Quest 1: Fix one gap
  // Checked from profile.resolvedGaps resolved today in IST, or activeGap resolved
  const gapFixedCount = (profile.resolvedGaps || []).filter((rg) => {
    if (!rg.resolvedAt) return false;
    try {
      return getIstDateString(new Date(rg.resolvedAt)) === todayIst;
    } catch {
      return false;
    }
  }).length + (profile.activeGap && profile.activeGap.status === "resolved" ? 1 : 0);
  const quest1Done = gapFixedCount >= 1;

  // Quest 2: Answer 5 questions
  // Checked from answeredQuestionsHistory answered today in IST
  let questionsToday = 0;
  if (profile.answeredQuestionsHistory) {
    for (const ts of Object.values(profile.answeredQuestionsHistory)) {
      try {
        if (getIstDateString(new Date(ts)) === todayIst) {
          questionsToday++;
        }
      } catch {
        // ignore date parse error
      }
    }
  }
  // Fallback: if student made topic progress today
  if (questionsToday === 0 && profile.topicProgress) {
    for (const prog of Object.values(profile.topicProgress)) {
      if (prog.lastAttemptAt && getIstDateString(new Date(prog.lastAttemptAt)) === todayIst) {
        questionsToday += Math.min(5, (prog.consecutiveCorrect || 0) + (prog.consecutiveIncorrect || 0) || 2);
      }
    }
  }
  const quest2Progress = Math.min(5, questionsToday);
  const quest2Done = quest2Progress >= 5;

  // Quest 3: Read one lesson
  // Checked from topicProgress where lesson was read/completed today in IST
  let lessonsToday = 0;
  if (profile.topicProgress) {
    for (const prog of Object.values(profile.topicProgress)) {
      if (
        prog.lessonCompleted &&
        prog.lastAttemptAt &&
        getIstDateString(new Date(prog.lastAttemptAt)) === todayIst
      ) {
        lessonsToday++;
      }
    }
  }
  const quest3Done = lessonsToday >= 1;

  const allQuestsDone = quest1Done && quest2Done && quest3Done;
  const completedCount = (quest1Done ? 1 : 0) + (quest2Done ? 1 : 0) + (quest3Done ? 1 : 0);

  useEffect(() => {
    if (allQuestsDone && !hasPlayedSoundRef.current) {
      hasPlayedSoundRef.current = true;
      playQuestCompleteSound();
    }
  }, [allQuestsDone]);

  return (
    <div className="bg-[#FFFDF7] p-5 sm:p-6 border-3 border-[#2B1B0F] shadow-block space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-[#2B1B0F]/15 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#F4C542] text-[#2B1B0F] border border-[#2B1B0F] text-[10px] font-pixel uppercase tracking-wide">
              DAILY QUESTS
            </span>
            <span className="text-[11px] font-heading font-extrabold text-[#2B1B0F]/70">
              {todayIst}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-heading font-extrabold text-[#2B1B0F]">
            {allQuestsDone ? "All quests done today." : "Today's Quests"}
          </h2>
        </div>

        {/* Quest Completion Counter */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <span
            className={`px-3 py-1 text-xs font-heading font-extrabold border-2 border-[#2B1B0F] shadow-xs ${
              allQuestsDone
                ? "bg-[#5DAA3A] text-[#2B1B0F]"
                : "bg-[#FFF7E6] text-[#2B1B0F]"
            }`}
          >
            {completedCount} of 3 done
          </span>
        </div>
      </div>

      {/* 3 Quest Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Quest 1: Fix one gap */}
        <div
          className={`p-3.5 border-2 border-[#2B1B0F] flex flex-col justify-between gap-3 transition-colors ${
            quest1Done ? "bg-[#5DAA3A]/15 border-[#2B1B0F]" : "bg-white"
          }`}
        >
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-pixel text-[#2B1B0F]/70 uppercase">
                Quest 1
              </span>
              {quest1Done ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-heading font-extrabold text-[#2F6B22]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2F6B22]" />
                  Done
                </span>
              ) : (
                <span className="text-[11px] font-heading font-bold text-[#2B1B0F]/60">
                  {gapFixedCount}/1
                </span>
              )}
            </div>
            <h3 className="font-heading font-extrabold text-sm text-[#2B1B0F]">
              Fix one gap
            </h3>
            <p className="text-xs text-[#2B1B0F]/70 font-sans">
              Complete a targeted practice worksheet to resolve an earlier topic you missed.
            </p>
          </div>

          {/* Block-fill progress bar (<600ms transition) */}
          <div className="space-y-1 pt-1">
            <div className="w-full h-3 bg-[#E2DDD5] border border-[#2B1B0F] overflow-hidden">
              <div
                className="h-full bg-[#5DAA3A] transition-all duration-500 ease-out"
                style={{ width: quest1Done ? "100%" : "0%" }}
              />
            </div>
            {!quest1Done && (
              <Link
                href="/student/practice"
                className="inline-flex items-center gap-1 text-[11px] font-heading font-bold text-[#5DAA3A] hover:underline pt-0.5"
              >
                <span>Find practice</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>

        {/* Quest 2: Answer 5 questions */}
        <div
          className={`p-3.5 border-2 border-[#2B1B0F] flex flex-col justify-between gap-3 transition-colors ${
            quest2Done ? "bg-[#5DAA3A]/15 border-[#2B1B0F]" : "bg-white"
          }`}
        >
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-pixel text-[#2B1B0F]/70 uppercase">
                Quest 2
              </span>
              {quest2Done ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-heading font-extrabold text-[#2F6B22]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2F6B22]" />
                  Done
                </span>
              ) : (
                <span className="text-[11px] font-heading font-bold text-[#2B1B0F]/60">
                  {quest2Progress}/5
                </span>
              )}
            </div>
            <h3 className="font-heading font-extrabold text-sm text-[#2B1B0F]">
              Answer 5 questions
            </h3>
            <p className="text-xs text-[#2B1B0F]/70 font-sans">
              Solve 5 questions across check-ins, practice worksheets, or lessons today.
            </p>
          </div>

          {/* Block-fill progress bar (<600ms transition) */}
          <div className="space-y-1 pt-1">
            <div className="w-full h-3 bg-[#E2DDD5] border border-[#2B1B0F] overflow-hidden">
              <div
                className="h-full bg-[#5DAA3A] transition-all duration-500 ease-out"
                style={{ width: `${(quest2Progress / 5) * 100}%` }}
              />
            </div>
            {!quest2Done && (
              <Link
                href="/student/learn"
                className="inline-flex items-center gap-1 text-[11px] font-heading font-bold text-[#5DAA3A] hover:underline pt-0.5"
              >
                <span>Start questions</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>

        {/* Quest 3: Read one lesson */}
        <div
          className={`p-3.5 border-2 border-[#2B1B0F] flex flex-col justify-between gap-3 transition-colors ${
            quest3Done ? "bg-[#5DAA3A]/15 border-[#2B1B0F]" : "bg-white"
          }`}
        >
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-pixel text-[#2B1B0F]/70 uppercase">
                Quest 3
              </span>
              {quest3Done ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-heading font-extrabold text-[#2F6B22]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2F6B22]" />
                  Done
                </span>
              ) : (
                <span className="text-[11px] font-heading font-bold text-[#2B1B0F]/60">
                  {lessonsToday}/1
                </span>
              )}
            </div>
            <h3 className="font-heading font-extrabold text-sm text-[#2B1B0F]">
              Read one lesson
            </h3>
            <p className="text-xs text-[#2B1B0F]/70 font-sans">
              Open a lesson, read the simple explanation, and inspect the worked example.
            </p>
          </div>

          {/* Block-fill progress bar (<600ms transition) */}
          <div className="space-y-1 pt-1">
            <div className="w-full h-3 bg-[#E2DDD5] border border-[#2B1B0F] overflow-hidden">
              <div
                className="h-full bg-[#5DAA3A] transition-all duration-500 ease-out"
                style={{ width: quest3Done ? "100%" : "0%" }}
              />
            </div>
            {!quest3Done && (
              <Link
                href="/student/learn"
                className="inline-flex items-center gap-1 text-[11px] font-heading font-bold text-[#5DAA3A] hover:underline pt-0.5"
              >
                <span>Open lessons</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

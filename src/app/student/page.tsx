"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Compass,
  Sparkles,
  BookOpen,
  Award,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  Target,
  User,
  Flame,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { LearnerProfile, SupportedLanguage } from "@/lib/types";
import {
  getActiveProfile,
  handleLogout,
} from "@/lib/storage";
import { syncClassProgression } from "@/lib/progression";
import {
  getChaptersByClass,
  getConceptsByClass,
  getConceptsByChapter,
  canTakeChapterDiagnostic,
  getConceptById,
} from "@/lib/curriculum";
import { Companion } from "@/components/ui/Companion";
import { isIstNightTime, getLevelProgress } from "@/lib/xp-config";
import { SegmentedXpBar } from "@/components/ui/PixelEffects";
import { ClassLeaderboard } from "@/components/ui/ClassLeaderboard";
import { getLearnerGreeting } from "@/lib/greetings";
import { getRevisionQueue, getCompanionRevisionGreeting } from "@/lib/revision";

export default function StudentDashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>("en");

  useEffect(() => {
    const active = getActiveProfile();
    if (!active || !active.selectedClass) {
      // Do not silently assign Class 10. Direct user to select class & enter nickname.
      router.replace("/student/select-class");
      return;
    }
    const updated = syncClassProgression(active);
    setProfile(updated);
    setIsLoaded(true);
  }, [router]);

  useEffect(() => {
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  if (!isLoaded || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-800">
        <div className="glass-panel p-6 rounded-2xl text-center shadow-lg border border-white/70">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="font-heading text-xs text-emerald-950">Opening student home...</p>
        </div>
      </div>
    );
  }

  const studyClass = (profile.studyClass || profile.selectedClass || 10) as 6 | 7 | 8 | 9 | 10;
  const enrolledClass = (profile.enrolledClass || profile.selectedClass || 10) as 6 | 7 | 8 | 9 | 10;
  const chapters = getChaptersByClass(studyClass);
  const allClassConcepts = getConceptsByClass(studyClass);
  const revisionQueue = getRevisionQueue(profile);
  const levelInfo = getLevelProgress(profile.xp || 0);

  // Concept statuses for current study class
  const completedInClass = allClassConcepts.filter(
    (c) => profile.topicProgress?.[c.id]?.status === "completed"
  );
  const inProgressInClass = allClassConcepts.filter(
    (c) => profile.topicProgress?.[c.id]?.status === "in_progress"
  );
  const availableInClass = allClassConcepts.filter(
    (c) => profile.topicProgress?.[c.id]?.status === "available"
  );
  const lockedInClass = allClassConcepts.filter(
    (c) => !profile.topicProgress?.[c.id] || profile.topicProgress?.[c.id]?.status === "locked"
  );

  // Active learning gap
  const activeGap =
    profile.activeGap && profile.activeGap.status === "confirmed"
      ? profile.activeGap
      : null;
  const rootConcept = activeGap?.rootConceptId
    ? getConceptById(activeGap.rootConceptId)
    : null;

  // Derive high-priority next recommendation
  let nextRecommendation: {
    badge: string;
    title: string;
    description: string;
    href: string;
    cta: string;
    isUrgent?: boolean;
  };

  if (activeGap && rootConcept) {
    nextRecommendation = {
      badge: "Foundational Gap Review",
      title: `Fix earlier topic: ${rootConcept.name[currentLang] || rootConcept.name.en}`,
      description:
        activeGap.plainLanguageReason ||
        `Our diagnostic detected a prerequisite gap from Class ${rootConcept.class}. Reviewing this concept will make current grade quests effortless.`,
      href: `/lesson/${rootConcept.id}?fromGap=true&reason=${encodeURIComponent(
        activeGap.plainLanguageReason || ""
      )}`,
      cta: "Review Foundational Lesson",
      isUrgent: true,
    };
  } else if (revisionQueue.length > 0) {
    const rev = revisionQueue[0];
    nextRecommendation = {
      badge: "Spaced Repetition Due",
      title: `Revise: ${rev.conceptName}`,
      description: rev.reason || "Strengthen long-term retention through timed spaced practice.",
      href: rev.href,
      cta: "Start Revision Practice",
    };
  } else if (availableInClass.length > 0) {
    const nextC = availableInClass[0];
    nextRecommendation = {
      badge: "Recommended Next Quest",
      title: `Study: ${nextC.name[currentLang] || nextC.name.en}`,
      description: nextC.learningObjective[currentLang] || nextC.learningObjective.en,
      href: `/lesson/${nextC.id}`,
      cta: "Start Lesson",
    };
  } else if (inProgressInClass.length > 0) {
    const nextC = inProgressInClass[0];
    nextRecommendation = {
      badge: "In Progress",
      title: `Practice Worksheet: ${nextC.name[currentLang] || nextC.name.en}`,
      description: "Complete the practice worksheet to achieve topic mastery.",
      href: `/student/worksheet/${nextC.id}`,
      cta: "Open Worksheet",
    };
  } else {
    const firstEligibleChapter = chapters.find((ch) => canTakeChapterDiagnostic(ch.id)) || chapters[0];
    nextRecommendation = {
      badge: "Chapter Milestone",
      title: `Diagnose Mastery: ${firstEligibleChapter?.name[currentLang] || firstEligibleChapter?.name.en || "Chapter"}`,
      description: "Take the chapter diagnostic or test to evaluate your understanding.",
      href: `/student/diagnostic/${firstEligibleChapter?.id || "c10-ch04"}`,
      cta: "Take quick check",
    };
  }

  const greetingObj = getLearnerGreeting(profile.name, currentLang);
  const companionRevisionObj = getCompanionRevisionGreeting(revisionQueue, profile);
  const displayGreeting = companionRevisionObj?.message || greetingObj.text;

  return (
    <div className="min-h-screen text-slate-800 flex flex-col justify-between">
      {/* Top Floating Glass Navigation */}
      <Navigation
        currentTab="home"
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        profile={profile}
        showTopBar={true}
      />

      {/* Main Student Realm Content */}
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7 w-full flex-1 space-y-6 has-mobile-nav">
        {/* 1. Welcome Companion & Hero Bar */}
        <div className="glass-panel p-5 sm:p-7 rounded-3xl border border-white/80 shadow-[0_12px_40px_rgba(16,42,18,0.1)] flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6">
          <div className="flex items-start gap-4">
            <div className="shrink-0">
              <Companion
                pose={isIstNightTime() ? "sleepy" : "greet"}
                size={64}
                sticker={false}
                alt="Margam companion"
              />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100/90 border border-emerald-300 text-[10px] font-heading font-extrabold text-emerald-900 uppercase tracking-wide">
                  Studying Class {studyClass}
                </span>
                <Link
                  href="/student/select-class"
                  className="text-[10px] font-heading font-bold text-emerald-700 hover:text-emerald-900 underline"
                  title="Switch study class"
                >
                  Switch Class
                </Link>
                {enrolledClass !== studyClass && (
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100/90 border border-slate-300 text-[10px] font-heading font-bold text-slate-700">
                    Enrolled Grade {enrolledClass}
                  </span>
                )}
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100/90 border border-amber-300 text-[10px] font-heading font-extrabold text-amber-900">
                  {levelInfo.rank.badge} {levelInfo.rank.name} • Lv {levelInfo.level}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-heading font-extrabold text-emerald-950 leading-tight">
                Welcome back, {profile.name}!
              </h1>
              <p className="text-xs sm:text-sm text-slate-700 font-sans max-w-xl">
                {displayGreeting}
              </p>
            </div>
          </div>

          {/* Quick Profile Level & XP widget */}
          <div className="w-full md:w-64 space-y-2 p-3 rounded-2xl bg-white/60 border border-white/80 shrink-0">
            <div className="flex items-center justify-between text-xs font-heading font-bold text-emerald-950">
              <span>Level {levelInfo.level} Progress</span>
              <span>{profile.xp || 0} XP</span>
            </div>
            <SegmentedXpBar currentXp={profile.xp || 0} />
            <div className="flex items-center justify-between text-[10px] text-slate-600 font-sans font-medium">
              <span>
                {levelInfo.currentLevelXp} / {levelInfo.nextLevelXp} XP (Needs {levelInfo.xpUntilNextLevel} XP)
              </span>
              {profile.streak && profile.streak.current > 0 && (
                <span className="flex items-center gap-0.5 font-heading font-bold text-amber-700">
                  <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                  {profile.streak.current}d Streak
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 2. RECOMMENDED NEXT ACTIVITY (High Priority Single Action) */}
        <div
          className={`p-5 sm:p-6 rounded-2xl border-2 transition-all shadow-[0_8px_30px_rgba(0,0,0,0.06)] ${
            nextRecommendation.isUrgent
              ? "bg-[#FFF4E5] border-[#E07A2A] text-[#4A2608]"
              : "bg-[#e0dcd1] border-[#5A3720] text-[#2B1B0F]"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-heading font-bold uppercase tracking-wider ${
                    nextRecommendation.isUrgent
                      ? "bg-[#E07A2A] text-white"
                      : "bg-[#3D6926] text-white"
                  }`}
                >
                  {nextRecommendation.badge}
                </span>
                <span className="text-[11px] font-heading font-bold text-[#6B4423]">
                  What to do next
                </span>
              </div>
              <h2 className="font-heading font-extrabold text-base sm:text-lg leading-snug">
                {nextRecommendation.title}
              </h2>
              <p className="font-sans text-xs sm:text-sm leading-relaxed opacity-90">
                {nextRecommendation.description}
              </p>
            </div>

            <Link
              href={nextRecommendation.href}
              className={`shrink-0 inline-flex items-center justify-center min-h-[46px] px-5 py-2.5 rounded-xl font-heading font-bold text-xs border-2 shadow-[2px_2px_0px_#2B1B0F] transition-all no-underline ${
                nextRecommendation.isUrgent
                  ? "bg-[#E07A2A] hover:bg-[#C9691E] text-white border-[#4A2608]"
                  : "bg-[#3D6926] hover:bg-[#32561F] text-white border-[#2B1B0F]"
              }`}
            >
              <span>{nextRecommendation.cta}</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </div>
        </div>

        {/* 3. ACTIVE FOUNDATIONAL GAP REMEDIATION CARD (if gap is confirmed) */}
        {activeGap && rootConcept && (
          <div className="p-5 sm:p-6 rounded-2xl bg-[#FFF8EE] border-2 border-[#D97706] shadow-[0_8px_30px_rgba(217,119,6,0.12)] space-y-4 text-slate-800">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 text-amber-800">
                <AlertCircle className="w-5 h-5 shrink-0 text-amber-600" />
                <h3 className="font-heading font-extrabold text-sm sm:text-base text-amber-950">
                  Foundational Learning Gap Identified
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-[10px] font-heading font-bold text-amber-900">
                Earlier topic from Class {rootConcept.class}
              </span>
            </div>

            <div className="space-y-1">
              <div className="font-heading font-bold text-sm text-slate-900">
                {rootConcept.name[currentLang] || rootConcept.name.en}
              </div>
              <p className="font-sans text-xs sm:text-sm text-slate-700 leading-relaxed">
                {activeGap.plainLanguageReason ||
                  "Our adaptive diagnostic detected that prerequisite concepts from earlier grades need strengthening. Reviewing this lesson will resolve your gap."}
              </p>
            </div>

            {/* Prerequisite Chain Trail */}
            {activeGap.prerequisitePath && activeGap.prerequisitePath.length > 0 && (
              <div className="p-3 rounded-xl bg-white/80 border border-amber-200 text-xs">
                <span className="font-heading font-bold text-[10px] uppercase text-amber-900 block mb-1">
                  Dependency Pathway:
                </span>
                <div className="font-mono text-[11px] text-slate-700 flex flex-wrap items-center gap-1.5">
                  {activeGap.prerequisitePath.map((step, idx) => (
                    <React.Fragment key={step}>
                      <span className="px-1.5 py-0.5 bg-amber-50 rounded border border-amber-200">
                        {step}
                      </span>
                      {idx < activeGap.prerequisitePath.length - 1 && (
                        <span className="text-amber-500">➔</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-1 flex items-center gap-3">
              <Link
                href={`/lesson/${rootConcept.id}?fromGap=true&reason=${encodeURIComponent(
                  activeGap.plainLanguageReason || ""
                )}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-heading font-bold text-xs shadow-xs"
              >
                <svg className="w-4 h-4 mr-1.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                      <span>Learn this topic</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* 4. CLASS PROGRESSION SNAPSHOT (Completed, Available, Locked) */}
        <div className="p-5 rounded-2xl bg-[#e0dcd1] border-2 border-[#5A3720] shadow-[0_4px_16px_rgba(0,0,0,0.05)] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="font-pixel text-[10px] uppercase tracking-wider text-[#3D6926]">
                Topic Status Overview
              </span>
              <h3 className="font-pixel text-xs sm:text-sm text-[#2B1B0F] mt-0.5">
                Class {studyClass} Curriculum Progress
              </h3>
            </div>
            <Link
              href="/student/learn"
              className="text-xs font-heading font-bold text-[#3D6926] hover:underline self-start sm:self-auto"
            >
              View Full Topic Cascade ➔
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            <div className="p-3 rounded-xl bg-white border border-[#8C6D53]/40 text-center">
              <span className="text-[10px] font-heading font-extrabold uppercase text-[#3D6926] block tracking-wide">Completed</span>
              <span className="font-pixel text-base text-[#2B1B0F]">
                {completedInClass.length}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-white border border-[#8C6D53]/40 text-center">
              <span className="text-[10px] font-heading font-extrabold uppercase text-[#D97706] block tracking-wide">In Progress</span>
              <span className="font-pixel text-base text-[#2B1B0F]">
                {inProgressInClass.length}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-white border border-[#8C6D53]/40 text-center">
              <span className="text-[10px] font-heading font-extrabold uppercase text-[#2563EB] block tracking-wide">Available</span>
              <span className="font-pixel text-base text-[#2B1B0F]">
                {availableInClass.length}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-white border border-[#8C6D53]/40 text-center">
              <span className="text-[10px] font-heading font-extrabold uppercase text-[#6B7280] block tracking-wide">Locked</span>
              <span className="font-pixel text-base text-[#2B1B0F]">
                {lockedInClass.length}
              </span>
            </div>
          </div>
        </div>

        {/* 5. PRIMARY NAVIGATION TILES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* 1. LEARN */}
          <Link
            href="/student/learn"
            className="glass-panel p-5 rounded-2xl border border-white/80 shadow-[0_8px_24px_rgba(16,42,18,0.08)] hover:border-emerald-400/70 hover:scale-[1.01] transition-all flex flex-col justify-between group min-h-[190px]"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs group-hover:bg-emerald-700 transition-colors font-pixel text-xs">
                  📖
                </div>
                <span className="text-[10px] font-heading font-bold px-2 py-0.5 rounded-full bg-emerald-100/80 text-emerald-900 border border-emerald-200">
                  Curriculum
                </span>
              </div>
              <div>
                <h2 className="font-heading font-extrabold text-base text-emerald-950 group-hover:text-emerald-700 transition-colors">
                  Learn Concepts
                </h2>
                <p className="text-xs text-slate-600 font-sans mt-1">
                  Explore Class {studyClass} lessons arranged sequentially, view explanations, and step-by-step examples.
                </p>
              </div>
            </div>
            <div className="pt-3 mt-auto border-t border-emerald-950/10 flex items-center justify-between text-xs font-heading font-bold text-emerald-800">
              <span>Open Lessons</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* 2. PRACTICE */}
          <Link
            href="/student/practice"
            className="glass-panel p-5 rounded-2xl border border-white/80 shadow-[0_8px_24px_rgba(16,42,18,0.08)] hover:border-emerald-400/70 hover:scale-[1.01] transition-all flex flex-col justify-between group min-h-[190px]"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs group-hover:bg-amber-700 transition-colors font-pixel text-xs">
                  ✏️
                </div>
                <span className="text-[10px] font-heading font-bold px-2 py-0.5 rounded-full bg-amber-100/80 text-amber-900 border border-amber-200">
                  Worksheets
                </span>
              </div>
              <div>
                <h2 className="font-heading font-extrabold text-base text-emerald-950 group-hover:text-amber-700 transition-colors">
                  Practice Worksheets
                </h2>
                <p className="text-xs text-slate-600 font-sans mt-1">
                  Solve adaptive problem sets, receive instant hints, and overcome common NCERT misconceptions.
                </p>
              </div>
            </div>
            <div className="pt-3 mt-auto border-t border-emerald-950/10 flex items-center justify-between text-xs font-heading font-bold text-amber-800">
              <span>Start Practice</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* 3. DIAGNOSE */}
          <Link
            href="/student/diagnostic"
            className="glass-panel p-5 rounded-2xl border border-white/80 shadow-[0_8px_24px_rgba(16,42,18,0.08)] hover:border-emerald-400/70 hover:scale-[1.01] transition-all flex flex-col justify-between group min-h-[190px]"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-cyan-600 text-white flex items-center justify-center shadow-xs group-hover:bg-cyan-700 transition-colors font-pixel text-xs">
                  🎯
                </div>
                <span className="text-[10px] font-heading font-bold px-2 py-0.5 rounded-full bg-cyan-100/80 text-cyan-900 border border-cyan-200">
                  Placement
                </span>
              </div>
              <div>
                <h2 className="font-heading font-extrabold text-base text-emerald-950 group-hover:text-cyan-700 transition-colors">
                  Diagnose Mastery
                </h2>
                <p className="text-xs text-slate-600 font-sans mt-1">
                  Take quick checks to find topics you missed and open new lessons.
                </p>
              </div>
            </div>
            <div className="pt-3 mt-auto border-t border-emerald-950/10 flex items-center justify-between text-xs font-heading font-bold text-cyan-800">
              <span>Take quick check</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* 4. PROFILE */}
          <Link
            href="/student/profile"
            className="glass-panel p-5 rounded-2xl border border-white/80 shadow-[0_8px_24px_rgba(16,42,18,0.08)] hover:border-emerald-400/70 hover:scale-[1.01] transition-all flex flex-col justify-between group min-h-[190px]"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs group-hover:bg-purple-700 transition-colors font-pixel text-xs">
                  ⚙️
                </div>
                <span className="text-[10px] font-heading font-bold px-2 py-0.5 rounded-full bg-purple-100/80 text-purple-900 border border-purple-200">
                  Preferences
                </span>
              </div>
              <div>
                <h2 className="font-heading font-extrabold text-base text-emerald-950 group-hover:text-purple-700 transition-colors">
                  My Profile
                </h2>
                <p className="text-xs text-slate-600 font-sans mt-1">
                  Change daily study class (Classes 6–10), update your nickname, and inspect learning progress.
                </p>
              </div>
            </div>
            <div className="pt-3 mt-auto border-t border-emerald-950/10 flex items-center justify-between text-xs font-heading font-bold text-purple-800">
              <span>Edit Profile</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* 6. Spaced Repetition Revision Zone (if any topics are due) */}
        {revisionQueue.length > 0 && (
          <div className="glass-panel p-6 rounded-3xl border border-amber-300/80 shadow-[0_8px_32px_rgba(245,158,11,0.1)] bg-amber-50/60 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-amber-600 animate-spin-slow" />
                <h2 className="font-heading font-extrabold text-base text-amber-950">
                  Spaced Repetition: Revision Due ({revisionQueue.length} topics)
                </h2>
              </div>
              <span className="text-xs font-heading font-bold text-amber-800">
                Retention Booster
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {revisionQueue.slice(0, 3).map((item) => (
                <div
                  key={item.conceptId}
                  className="p-3.5 rounded-2xl bg-white/80 border border-amber-200 shadow-xs flex flex-col justify-between gap-3"
                >
                  <div>
                    <span className="text-[10px] font-heading font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                      Class {item.class} • Mastery {item.mastery}%
                    </span>
                    <h3 className="font-heading font-bold text-xs text-slate-900 mt-1">
                      {item.conceptName}
                    </h3>
                    <p className="text-[11px] text-slate-600 font-sans mt-0.5">
                      {item.reason}
                    </p>
                  </div>
                  <Link
                    href={item.href}
                    className="w-full py-1.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-heading font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                  >
                    <span>Revise Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. Chapters Overview for Active Study Class */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/80 shadow-[0_12px_40px_rgba(16,42,18,0.1)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-heading font-bold uppercase tracking-wider mb-1">
                NCERT Syllabus
              </div>
              <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-emerald-950">
                Class {studyClass} Mathematics Chapters
              </h2>
              <p className="text-xs text-slate-600 font-sans mt-0.5">
                Explore chapters, take chapter diagnostics, or study individual concept lessons.
              </p>
            </div>
            <Link
              href="/student/learn"
              className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-emerald-800 hover:text-emerald-950 py-2 px-3.5 rounded-xl bg-white/70 hover:bg-white border border-white transition-all shadow-xs self-start sm:self-auto"
            >
              <span>View All Cascade Topics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {chapters.map((chapter) => {
              const chapterConcepts = getConceptsByChapter(chapter.id);
              const completedInChapter = chapterConcepts.filter(
                (c) => profile.topicProgress?.[c.id]?.status === "completed"
              ).length;
              const hasDiagnostic = canTakeChapterDiagnostic(chapter.id);

              return (
                <div
                  key={chapter.id}
                  className="p-4 rounded-2xl bg-white/70 border border-white/80 shadow-xs flex flex-col justify-between gap-3 hover:bg-white/90 transition-all"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-heading font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        Chapter {chapter.chapterNumber}
                      </span>
                      {chapter.status === "full" ? (
                        <span className="text-[10px] font-heading font-extrabold text-emerald-700">
                          {completedInChapter}/{chapterConcepts.length} Completed
                        </span>
                      ) : (
                        <span className="text-[10px] font-heading font-bold text-slate-500">
                          Curriculum Preview
                        </span>
                      )}
                    </div>
                    <h3 className="font-heading font-extrabold text-sm text-emerald-950">
                      {chapter.name[currentLang] || chapter.name.en}
                    </h3>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-2">
                    {hasDiagnostic ? (
                      <Link
                        href={`/student/diagnostic/${chapter.id}`}
                        className="text-xs font-heading font-bold text-cyan-700 hover:text-cyan-900 hover:underline flex items-center gap-1"
                      >
                        <Target className="w-3.5 h-3.5" />
                        <span>Take Diagnostic</span>
                      </Link>
                    ) : (
                      <span className="text-[11px] text-slate-500 font-sans">
                        {chapterConcepts.length} Concepts
                      </span>
                    )}

                    <Link
                      href="/student/learn"
                      className="text-xs font-heading font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 hover:underline"
                    >
                      <span>Study</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 8. Gamification & Leaderboard Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ClassLeaderboard classId={`class-${studyClass}`} />
          </div>

          {/* Badges Preview Card */}
          <div className="glass-panel p-6 rounded-3xl border border-white/80 shadow-[0_12px_40px_rgba(16,42,18,0.1)] flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <h3 className="font-heading font-extrabold text-base text-emerald-950">
                    Badge Showcase
                  </h3>
                </div>
                <Link
                  href="/student/stickers"
                  className="text-xs font-heading font-bold text-emerald-700 hover:underline"
                >
                  View All
                </Link>
              </div>
              <p className="text-xs text-slate-600 font-sans mt-1">
                Earn stickers by finishing lessons, keeping streaks, and fixing gaps.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/70 border border-white/80 text-center space-y-2">
              <div className="text-3xl">🏆</div>
              <div className="font-heading font-bold text-xs text-emerald-950">
                {profile.unlockedBadgeIds?.length || 0} Badges Unlocked
              </div>
              <p className="text-[11px] text-slate-500 font-sans">
                Keep learning daily to level up your Margam rank!
              </p>
            </div>

            <Link
              href="/student/stickers"
              className="w-full py-2.5 px-3 rounded-xl bg-white/80 hover:bg-white text-emerald-950 font-heading font-bold text-xs flex items-center justify-center gap-1.5 border border-white shadow-xs transition-colors"
            >
              <span>Explore Achievement Badges</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-[1200px] mx-auto px-4 my-6 text-center text-xs font-sans font-medium text-emerald-950/70">
        Margam • Adaptive Mathematics for NCERT Classes 6–10
      </footer>
    </div>
  );
}

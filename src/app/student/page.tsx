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
import { DailyQuests } from "@/components/ui/DailyQuests";
import { getLearnerGreeting } from "@/lib/greetings";
import { getRevisionQueue, getCompanionRevisionGreeting } from "@/lib/revision";
import { useLanguage } from "@/contexts/LanguageContext";

export default function StudentDashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { lang: currentLang, setLang: setCurrentLang, t, resolve } = useLanguage();

  useEffect(() => {
    const active = getActiveProfile();
    if (!active || !active.selectedClass) {
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
      <div className="min-h-screen flex items-center justify-center text-[#1E1610]">
        <div className="panel-plank p-6 text-center border-3 border-[#1E1610] shadow-[3px_3px_0px_#1E1610]">
          <div className="w-8 h-8 border-3 border-[#6DB33F] border-t-transparent animate-spin mx-auto mb-2" />
          <p className="font-heading font-extrabold text-xs text-[#1E1610]">Opening student home...</p>
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
      title: `Fix earlier topic: ${resolve(rootConcept.name).text}`,
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
    <div className="min-h-screen text-[#1E1610] flex flex-col justify-between">
      {/* Top Floating Navigation */}
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
        <div className="panel-plank p-5 sm:p-7 border-3 border-[#1E1610] shadow-[3px_3px_0px_#1E1610] flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6">
          <div className="flex items-start gap-4">
            <div className="shrink-0">
              <Companion
                pose={isIstNightTime() ? "sleepy" : "greet"}
                size={100}
                withShadow={true}
                sticker={false}
                alt="Margam companion"
              />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 bg-[#8CCB55] border-2 border-[#1E1610] text-[11px] font-heading font-extrabold text-[#1E1610] uppercase tracking-wide">
                  Studying Class {studyClass}
                </span>
                <Link
                  href="/student/select-class"
                  className="text-[11px] font-heading font-bold text-[#2F4FB5] hover:underline"
                  title="Switch study class"
                >
                  Switch Class
                </Link>
                {enrolledClass !== studyClass && (
                  <span className="px-2.5 py-0.5 bg-[#E8CF9C] border-2 border-[#1E1610] text-[11px] font-heading font-bold text-[#1E1610]">
                    Enrolled Grade {enrolledClass}
                  </span>
                )}
                <span className="px-2.5 py-0.5 bg-[#F2C230] border-2 border-[#1E1610] text-[11px] font-heading font-extrabold text-[#1E1610]">
                  {levelInfo.rank.badge} {levelInfo.rank.name} • Lv {levelInfo.level}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-heading font-extrabold text-[#1E1610] leading-tight">
                {t("home.welcomeBack")}, {profile.name}!
              </h1>
              <p className="text-xs sm:text-sm text-[#5A3720] font-sans max-w-xl">
                {displayGreeting}
              </p>
            </div>
          </div>

          {/* Quick Profile Level & XP widget */}
          <div className="w-full md:w-64 space-y-2 p-3 bg-[#E8CF9C]/70 border-2 border-[#1E1610] shrink-0">
            <div className="flex items-center justify-between text-xs font-heading font-bold text-[#1E1610]">
              <span>{t("profile.level", { lvl: levelInfo.level })}</span>
              <span>{profile.xp || 0} XP</span>
            </div>
            <SegmentedXpBar currentXp={profile.xp || 0} />
            <div className="flex items-center justify-between text-[11px] text-[#5A3720] font-sans font-medium">
              <span>
                {levelInfo.currentLevelXp} / {levelInfo.nextLevelXp} XP (Needs {levelInfo.xpUntilNextLevel} XP)
              </span>
              {profile.streak && profile.streak.current > 0 && (
                <span className="flex items-center gap-1 font-heading font-bold text-[#D1362B]">
                  <Flame className="w-3.5 h-3.5 text-[#D1362B] fill-[#D1362B]" />
                  {profile.streak.current} {profile.streak.current === 1 ? "day in a row" : "days in a row"}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 2. RECOMMENDED NEXT ACTIVITY (High Priority Single Action) */}
        <div
          className={`p-5 sm:p-6 border-3 border-[#1E1610] shadow-[3px_3px_0px_#1E1610] transition-all ${
            nextRecommendation.isUrgent
              ? "panel-plank border-[#D1362B]"
              : "panel-grass"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 border-2 border-[#1E1610] text-[11px] font-heading font-bold uppercase tracking-wider ${
                    nextRecommendation.isUrgent
                      ? "bg-[#D1362B] text-[#F3E3BC]"
                      : "bg-[#6DB33F] text-[#1E1610]"
                  }`}
                >
                  {nextRecommendation.badge}
                </span>
                <span className="text-[11px] font-heading font-bold text-[#5A3720]">
                  What to do next
                </span>
              </div>
              <h2 className="font-heading font-extrabold text-base sm:text-lg leading-snug text-[#1E1610]">
                {nextRecommendation.title}
              </h2>
              <p className="font-sans text-xs sm:text-sm leading-relaxed text-[#5A3720]">
                {nextRecommendation.description}
              </p>
            </div>

            <Link
              href={nextRecommendation.href}
              className={`shrink-0 inline-flex items-center justify-center min-h-[46px] px-5 py-2.5 font-heading font-bold text-xs border-3 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] active:translate-x-[1px] active:translate-y-[1px] transition-all no-underline ${
                nextRecommendation.isUrgent
                  ? "bg-[#D1362B] hover:bg-[#8B5A2B] text-[#F3E3BC]"
                  : "bg-[#6DB33F] hover:bg-[#8CCB55] text-[#1E1610]"
              }`}
            >
              <span>{nextRecommendation.cta}</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </div>
        </div>

        {/* 3. ACTIVE FOUNDATIONAL GAP REMEDIATION CARD (if gap is confirmed) */}
        {activeGap && rootConcept && (
          <div className="p-5 sm:p-6 panel-plank border-3 border-[#D1362B] shadow-[3px_3px_0px_#1E1610] space-y-4 text-[#1E1610]">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 text-[#D1362B]">
                <AlertCircle className="w-5 h-5 shrink-0 text-[#D1362B]" />
                <h3 className="font-heading font-extrabold text-sm sm:text-base text-[#1E1610]">
                  {t("dashboard.activeGapTitle")}
                </h3>
              </div>
              <span className="px-2.5 py-0.5 bg-[#E8CF9C] border-2 border-[#1E1610] text-[11px] font-heading font-bold text-[#1E1610]">
                {t("dashboard.activeGapBadge")}
              </span>
            </div>

            <div className="space-y-1">
              <div className="font-heading font-bold text-sm text-[#1E1610]">
                {resolve(rootConcept.name).text}
              </div>
              <p className="font-sans text-xs sm:text-sm text-[#5A3720] leading-relaxed">
                {activeGap.plainLanguageReason ||
                  "Our adaptive diagnostic detected that prerequisite concepts from earlier grades need strengthening. Reviewing this lesson will resolve your gap."}
              </p>
            </div>

            {/* Prerequisite Chain Trail */}
            {activeGap.prerequisitePath && activeGap.prerequisitePath.length > 0 && (
              <div className="p-3 bg-[#E8CF9C]/70 border-2 border-[#1E1610] text-xs">
                <span className="font-heading font-bold text-[11px] uppercase text-[#1E1610] block mb-1">
                  Dependency Pathway:
                </span>
                <div className="font-mono text-[11px] text-[#1E1610] flex flex-wrap items-center gap-1.5">
                  {activeGap.prerequisitePath.map((step, idx) => (
                    <React.Fragment key={step}>
                      <span className="px-1.5 py-0.5 bg-[#D9B87A] border border-[#1E1610]">
                        {step}
                      </span>
                      {idx < activeGap.prerequisitePath.length - 1 && (
                        <span className="text-[#D1362B] font-bold">➔</span>
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
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#6DB33F] hover:bg-[#8CCB55] text-[#1E1610] border-3 border-[#1E1610] font-heading font-bold text-xs shadow-[2px_2px_0px_#1E1610] active:translate-x-[1px] active:translate-y-[1px]"
              >
                <BookOpen className="w-4 h-4 mr-1 shrink-0" />
                <span>{t("dashboard.fixThisTopic")}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* 4. CLASS PROGRESSION SNAPSHOT (Completed, Available, Locked) */}
        <div className="p-5 panel-stone border-3 border-[#1E1610] shadow-[3px_3px_0px_#1E1610] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="font-heading font-extrabold text-[11px] uppercase tracking-wider text-[#6DB33F]">
                Topic Status Overview
              </span>
              <h3 className="font-heading font-extrabold text-sm sm:text-base text-[#1E1610] mt-0.5">
                Class {studyClass} Curriculum Progress
              </h3>
            </div>
            <Link
              href="/student/learn"
              className="text-xs font-heading font-bold text-[#2F4FB5] hover:underline self-start sm:self-auto"
            >
              View Full Topic Cascade ➔
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            <div className="p-3 bg-[#E8CF9C]/70 border-2 border-[#1E1610] text-center">
              <span className="text-[11px] font-heading font-extrabold uppercase text-[#1E1610] block tracking-wide">Completed</span>
              <span className="font-heading font-extrabold text-lg text-[#1E1610]">
                {completedInClass.length}
              </span>
            </div>
            <div className="p-3 bg-[#E8CF9C]/70 border-2 border-[#1E1610] text-center">
              <span className="text-[11px] font-heading font-extrabold uppercase text-[#5A3720] block tracking-wide">In Progress</span>
              <span className="font-heading font-extrabold text-lg text-[#1E1610]">
                {inProgressInClass.length}
              </span>
            </div>
            <div className="p-3 bg-[#E8CF9C]/70 border-2 border-[#1E1610] text-center">
              <span className="text-[11px] font-heading font-extrabold uppercase text-[#2F4FB5] block tracking-wide">Available</span>
              <span className="font-heading font-extrabold text-lg text-[#1E1610]">
                {availableInClass.length}
              </span>
            </div>
            <div className="p-3 bg-[#E8CF9C]/70 border-2 border-[#1E1610] text-center">
              <span className="text-[11px] font-heading font-extrabold uppercase text-[#6B6F76] block tracking-wide">Locked</span>
              <span className="font-heading font-extrabold text-lg text-[#1E1610]">
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
            className="panel-plank p-5 border-3 border-[#1E1610] shadow-[3px_3px_0px_#1E1610] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex flex-col justify-between group min-h-[190px]"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-[#6DB33F] text-[#1E1610] border-2 border-[#1E1610] flex items-center justify-center font-heading font-bold text-base">
                  📖
                </div>
                <span className="text-[11px] font-heading font-bold px-2 py-0.5 bg-[#E8CF9C] text-[#1E1610] border border-[#1E1610]">
                  Curriculum
                </span>
              </div>
              <div>
                <h2 className="font-heading font-extrabold text-base text-[#1E1610]">
                  Learn Concepts
                </h2>
                <p className="text-xs text-[#5A3720] font-sans mt-1">
                  Explore Class {studyClass} lessons arranged sequentially, view explanations, and step-by-step examples.
                </p>
              </div>
            </div>
            <div className="pt-3 mt-auto border-t-2 border-[#1E1610]/20 flex items-center justify-between text-xs font-heading font-bold text-[#1E1610]">
              <span>{t("dashboard.openLessons")}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* 2. PRACTICE */}
          <Link
            href="/student/practice"
            className="panel-plank p-5 border-3 border-[#1E1610] shadow-[3px_3px_0px_#1E1610] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex flex-col justify-between group min-h-[190px]"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-[#F2C230] text-[#1E1610] border-2 border-[#1E1610] flex items-center justify-center font-heading font-bold text-base">
                  ✏️
                </div>
                <span className="text-[11px] font-heading font-bold px-2 py-0.5 bg-[#E8CF9C] text-[#1E1610] border border-[#1E1610]">
                  Worksheets
                </span>
              </div>
              <div>
                <h2 className="font-heading font-extrabold text-base text-[#1E1610]">
                  Practice Worksheets
                </h2>
                <p className="text-xs text-[#5A3720] font-sans mt-1">
                  Solve adaptive problem sets, receive instant hints, and overcome common NCERT misconceptions.
                </p>
              </div>
            </div>
            <div className="pt-3 mt-auto border-t-2 border-[#1E1610]/20 flex items-center justify-between text-xs font-heading font-bold text-[#1E1610]">
              <span>{t("dashboard.startPractice")}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* 3. DIAGNOSE */}
          <Link
            href="/student/diagnostic"
            className="panel-plank p-5 border-3 border-[#1E1610] shadow-[3px_3px_0px_#1E1610] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex flex-col justify-between group min-h-[190px]"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-[#78BDE8] text-[#1E1610] border-2 border-[#1E1610] flex items-center justify-center font-heading font-bold text-base">
                  🎯
                </div>
                <span className="text-[11px] font-heading font-bold px-2 py-0.5 bg-[#E8CF9C] text-[#1E1610] border border-[#1E1610]">
                  Placement
                </span>
              </div>
              <div>
                <h2 className="font-heading font-extrabold text-base text-[#1E1610]">
                  Diagnose Mastery
                </h2>
                <p className="text-xs text-[#5A3720] font-sans mt-1">
                  Take quick checks to find topics you missed and open new lessons.
                </p>
              </div>
            </div>
            <div className="pt-3 mt-auto border-t-2 border-[#1E1610]/20 flex items-center justify-between text-xs font-heading font-bold text-[#1E1610]">
              <span>{t("dashboard.takeQuickCheck")}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* 4. PROFILE */}
          <Link
            href="/student/profile"
            className="panel-plank p-5 border-3 border-[#1E1610] shadow-[3px_3px_0px_#1E1610] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex flex-col justify-between group min-h-[190px]"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-[#8B5A2B] text-[#F3E3BC] border-2 border-[#1E1610] flex items-center justify-center font-heading font-bold text-base">
                  ⚙️
                </div>
                <span className="text-[11px] font-heading font-bold px-2 py-0.5 bg-[#E8CF9C] text-[#1E1610] border border-[#1E1610]">
                  Preferences
                </span>
              </div>
              <div>
                <h2 className="font-heading font-extrabold text-base text-[#1E1610]">
                  My Profile
                </h2>
                <p className="text-xs text-[#5A3720] font-sans mt-1">
                  Change daily study class (Classes 6–10), update your nickname, and inspect learning progress.
                </p>
              </div>
            </div>
            <div className="pt-3 mt-auto border-t-2 border-[#1E1610]/20 flex items-center justify-between text-xs font-heading font-bold text-[#1E1610]">
              <span>{t("dashboard.editProfile")}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* 6. Spaced Repetition Revision Zone (if any topics are due) */}
        {revisionQueue.length > 0 && (
          <div className="panel-plank p-6 border-3 border-[#1E1610] shadow-[3px_3px_0px_#1E1610] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-[#D1362B]" />
                <h2 className="font-heading font-extrabold text-base text-[#1E1610]">
                  Spaced Repetition: Revision Due ({revisionQueue.length} topics)
                </h2>
              </div>
              <span className="text-xs font-heading font-bold text-[#5A3720]">
                Retention Booster
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {revisionQueue.slice(0, 3).map((item) => (
                <div
                  key={item.conceptId}
                  className="p-3.5 bg-[#E8CF9C]/70 border-2 border-[#1E1610] flex flex-col justify-between gap-3"
                >
                  <div>
                    <span className="text-[11px] font-heading font-bold px-2 py-0.5 bg-[#D9B87A] border border-[#1E1610] text-[#1E1610]">
                      Class {item.class} • Mastery {item.mastery}%
                    </span>
                    <h3 className="font-heading font-bold text-xs text-[#1E1610] mt-1">
                      {item.conceptName}
                    </h3>
                    <p className="text-[11px] text-[#5A3720] font-sans mt-0.5">
                      {item.reason}
                    </p>
                  </div>
                  <Link
                    href={item.href}
                    className="w-full py-1.5 px-3 bg-[#6DB33F] hover:bg-[#8CCB55] text-[#1E1610] font-heading font-bold text-xs flex items-center justify-center gap-1.5 border-3 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] active:translate-x-[1px] active:translate-y-[1px]"
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
        <div className="panel-plank p-6 sm:p-8 border-3 border-[#1E1610] shadow-[3px_3px_0px_#1E1610] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#8CCB55] border-2 border-[#1E1610] text-[11px] font-heading font-bold uppercase tracking-wider mb-1 text-[#1E1610]">
                NCERT Syllabus
              </div>
              <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-[#1E1610]">
                Class {studyClass} Mathematics Chapters
              </h2>
              <p className="text-xs text-[#5A3720] font-sans mt-0.5">
                Explore chapters, take chapter diagnostics, or study individual concept lessons.
              </p>
            </div>
            <Link
              href="/student/learn"
              className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-[#1E1610] hover:text-[#2F4FB5] py-2 px-3.5 bg-[#E8CF9C] hover:bg-[#D9B87A] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] transition-all self-start sm:self-auto"
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
                  className="p-4 bg-[#E8CF9C]/70 border-2 border-[#1E1610] flex flex-col justify-between gap-3 hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-heading font-bold px-2 py-0.5 bg-[#D9B87A] border border-[#1E1610] text-[#1E1610]">
                        Chapter {chapter.chapterNumber}
                      </span>
                      {chapter.status === "full" ? (
                        <span className="text-[11px] font-heading font-extrabold text-[#1E1610]">
                          {completedInChapter}/{chapterConcepts.length} Completed
                        </span>
                      ) : (
                        <span className="text-[11px] font-heading font-bold text-[#5A3720]">
                          Curriculum Preview
                        </span>
                      )}
                    </div>
                    <h3 className="font-heading font-extrabold text-sm text-[#1E1610]">
                      {resolve(chapter.name).text}
                    </h3>
                  </div>

                  <div className="pt-2 border-t-2 border-[#1E1610]/20 flex items-center justify-between gap-2">
                    {hasDiagnostic ? (
                      <Link
                        href={`/student/diagnostic/${chapter.id}`}
                        className="text-xs font-heading font-bold text-[#2F4FB5] hover:underline flex items-center gap-1"
                      >
                        <Target className="w-3.5 h-3.5" />
                        <span>Take Diagnostic</span>
                      </Link>
                    ) : (
                      <span className="text-[11px] text-[#5A3720] font-sans">
                        {chapterConcepts.length} Concepts
                      </span>
                    )}

                    <Link
                      href="/student/learn"
                      className="text-xs font-heading font-bold text-[#1E1610] hover:text-[#2F4FB5] flex items-center gap-1 hover:underline"
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

        {/* 8. Daily Quests & Personal Effort (No competitive leaderboard) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <DailyQuests profile={profile} onProfileUpdate={setProfile} />

            {/* Personal Learning Effort Card */}
            <div className="panel-plank p-5 sm:p-6 border-3 border-[#1E1610] shadow-[3px_3px_0px_#1E1610] text-[#1E1610] space-y-3">
              <div className="flex items-center justify-between border-b-2 border-[#1E1610]/20 pb-2">
                <span className="font-heading font-extrabold text-xs text-[#1E1610] uppercase tracking-wider">
                  Personal Learning Effort
                </span>
                <span className="text-[11px] font-heading font-bold text-[#5A3720]">
                  Your Journey
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-[#E8CF9C]/70 border-2 border-[#1E1610]">
                  <span className="text-[10px] font-heading font-extrabold uppercase text-[#5A3720] block">
                    Questions Solved
                  </span>
                  <span className="font-heading font-extrabold text-lg text-[#1E1610]">
                    {Object.keys(profile.answeredQuestionsHistory || {}).length}
                  </span>
                </div>
                <div className="p-3 bg-[#E8CF9C]/70 border-2 border-[#1E1610]">
                  <span className="text-[10px] font-heading font-extrabold uppercase text-[#5A3720] block">
                    Days Active
                  </span>
                  <span className="font-heading font-extrabold text-lg text-[#D1362B]">
                    {profile.streak?.current || 0}
                  </span>
                </div>
                <div className="p-3 bg-[#E8CF9C]/70 border-2 border-[#1E1610]">
                  <span className="text-[10px] font-heading font-extrabold uppercase text-[#5A3720] block">
                    Gaps Repaired
                  </span>
                  <span className="font-heading font-extrabold text-lg text-[#6DB33F]">
                    {(profile.resolvedGaps || []).length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Badges Preview Card */}
          <div className="panel-plank p-6 border-3 border-[#1E1610] shadow-[3px_3px_0px_#1E1610] flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#F2C230]" />
                  <h3 className="font-heading font-extrabold text-base text-[#1E1610]">
                    Badge Showcase
                  </h3>
                </div>
                <Link
                  href="/student/stickers"
                  className="text-xs font-heading font-bold text-[#2F4FB5] hover:underline"
                >
                  View All
                </Link>
              </div>
              <p className="text-xs text-[#5A3720] font-sans mt-1">
                Earn stickers by finishing lessons, keeping streaks, and fixing gaps.
              </p>
            </div>

            <div className="p-4 bg-[#E8CF9C]/70 border-2 border-[#1E1610] text-center space-y-2">
              <div className="text-3xl">🏆</div>
              <div className="font-heading font-bold text-xs text-[#1E1610]">
                {profile.unlockedBadgeIds?.length || 0} Badges Unlocked
              </div>
              <p className="text-[11px] text-[#5A3720] font-sans">
                Keep learning daily to level up your Margam rank!
              </p>
            </div>

            <Link
              href="/student/stickers"
              className="w-full py-2.5 px-3 bg-[#6DB33F] hover:bg-[#8CCB55] text-[#1E1610] font-heading font-bold text-xs flex items-center justify-center gap-1.5 border-3 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] active:translate-x-[1px] active:translate-y-[1px] transition-all"
            >
              <span>Explore Achievement Badges</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-[1200px] mx-auto px-4 my-6 text-center text-xs font-sans font-medium text-[#5A3720]">
        Margam • Adaptive Mathematics for NCERT Classes 6–10
      </footer>
    </div>
  );
}

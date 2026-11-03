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
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  Calendar,
  CheckCircle2,
  TrendingUp,
  School,
  GraduationCap,
  Target,
  User,
  Zap,
  Flame,
  Star,
} from "lucide-react";
import {
  Button,
  Card,
  Tile,
  LanguageToggle,
  OfflineBanner,
  Logo,
  ProgressBar,
  type Language,
} from "@/components/ui";
import { Navigation } from "@/components/Navigation";
import Footer from "@/components/Footer";
import { LearnerProfile, SupportedLanguage, Concept } from "@/lib/types";
import {
  getActiveProfile,
  createLearnerProfile,
  clearActiveProfile,
  handleLogout,
} from "@/lib/storage";
import { syncClassProgression } from "@/lib/progression";
import {
  getChaptersByClass,
  getSupportedChapters,
  getConceptsByChapter,
  canTakeChapterDiagnostic,
  getConceptById,
  resolveLocalizedString,
} from "@/lib/curriculum";
import { WitchCat } from "@/components/ui/WitchCat";
import { isIstNightTime, getLevelProgress } from "@/lib/xp-config";
import { SegmentedXpBar } from "@/components/ui/PixelEffects";
import { ClassLeaderboard } from "@/components/ui/ClassLeaderboard";
import { evaluateStudentBadges } from "@/lib/badges";
import { getCatGreeting } from "@/lib/greetings";
import { getRevisionQueue, getCompanionRevisionGreeting } from "@/lib/revision";
import { PathMap } from "@/components/student/PathMap";

export default function StudentDashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>("en");

  useEffect(() => {
    let active = getActiveProfile();
    if (!active) {
      // Create guest profile if none exists
      active = createLearnerProfile("Student", 10);
    }
    const updated = syncClassProgression(active);
    setProfile(updated);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  if (!isLoaded || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-800">
        <div className="bg-[#FFFDF7] p-6 border-3 border-[#2B1B0F] shadow-block text-center">
          <div className="w-8 h-8 border-3 border-[#5DAA3A] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="font-heading font-bold text-xs text-[#2B1B0F]">Opening Margam Learning Realm...</p>
        </div>
      </div>
    );
  }

  const studyClass = (profile.studyClass || profile.selectedClass || 10) as 6 | 7 | 8 | 9 | 10;
  const enrolledClass = (profile.enrolledClass || profile.selectedClass || 10) as 6 | 7 | 8 | 9 | 10;
  const chapters = getChaptersByClass(studyClass);
  const revisionQueue = getRevisionQueue(profile);
  const levelInfo = getLevelProgress(profile.xp || 0);

  // Calculate mastery statistics
  const completedConcepts = Object.values(profile.topicProgress || {}).filter(
    (tp) => tp.status === "completed"
  ).length;

  const totalAttempted = Object.values(profile.topicProgress || {}).filter(
    (tp) => tp.worksheetCompleted || (tp.worksheetScore !== undefined) || tp.lastAttemptAt
  ).length;

  const greetingObj = getCatGreeting(profile.name, currentLang);
  const companionRevisionObj = getCompanionRevisionGreeting(revisionQueue, profile);
  const displayGreeting = companionRevisionObj?.message || greetingObj.text;

  // 1. Calculate "Fix this first" from real adaptive engine state
  const hasActiveGap = Boolean(profile.activeGap && profile.activeGap.status !== "resolved");
  let fixThisFirst: {
    concept: Concept;
    title: string;
    description: string;
    actionHref: string;
    actionText: string;
    isRootGap: boolean;
  } | null = null;

  if (hasActiveGap && profile.activeGap) {
    const rootConcept = getConceptById(profile.activeGap.rootConceptId);
    const currConcept = getConceptById(profile.activeGap.currentConceptId);
    if (rootConcept) {
      const rootName = resolveLocalizedString(rootConcept.name, currentLang).text;
      const currName = currConcept ? resolveLocalizedString(currConcept.name, currentLang).text : "";
      fixThisFirst = {
        concept: rootConcept,
        title: `Repair Foundational Skill: ${rootName}`,
        description: currConcept
          ? `While working on Class ${currConcept.class} (${currName}), a prerequisite gap in Class ${rootConcept.class} was detected. Fixing this unlocks smooth progress!`
          : `A prerequisite gap was identified in Class ${rootConcept.class}. Repair this foundational step to unlock smooth progress!`,
        actionHref: `/student/worksheet/${rootConcept.id}`,
        actionText: "Repair Gap Now",
        isRootGap: true,
      };
    }
  } else {
    // Check topicProgress for any concept with low mastery (< 60%) or consecutive errors (>= 2)
    const weakProgressEntries = Object.entries(profile.topicProgress || {})
      .filter(([id, prog]) => (prog.mastery !== undefined && prog.mastery < 60) || (prog.consecutiveIncorrect && prog.consecutiveIncorrect >= 2))
      .sort((a, b) => (a[1].mastery ?? 50) - (b[1].mastery ?? 50));

    if (weakProgressEntries.length > 0) {
      const [weakId, weakProg] = weakProgressEntries[0];
      const weakConcept = getConceptById(weakId);
      if (weakConcept) {
        const weakName = resolveLocalizedString(weakConcept.name, currentLang).text;
        fixThisFirst = {
          concept: weakConcept,
          title: `Reinforce Concept: ${weakName}`,
          description: `Your assessed mastery is currently ${Math.round(weakProg.mastery ?? 50)}%. Complete a targeted adaptive practice set to solidify your method.`,
          actionHref: `/student/worksheet/${weakConcept.id}`,
          actionText: "Practice Skill",
          isRootGap: false,
        };
      }
    }
  }

  // 2. Calculate "Continue where you left off"
  let continueItem: {
    conceptId: string;
    conceptName: string;
    class: number;
    mastery: number;
    href: string;
  } | null = null;

  const attemptedEntries = Object.entries(profile.topicProgress || {})
    .filter(([_, prog]) => prog.lastAttemptAt || prog.completedAt || prog.worksheetCompleted)
    .sort((a, b) => {
      const timeA = new Date(a[1].lastAttemptAt || a[1].completedAt || 0).getTime();
      const timeB = new Date(b[1].lastAttemptAt || b[1].completedAt || 0).getTime();
      return timeB - timeA;
    });

  if (attemptedEntries.length > 0) {
    const [recentId, recentProg] = attemptedEntries[0];
    const recentConcept = getConceptById(recentId);
    if (recentConcept && (!fixThisFirst || fixThisFirst.concept.id !== recentId)) {
      continueItem = {
        conceptId: recentId,
        conceptName: resolveLocalizedString(recentConcept.name, currentLang).text,
        class: recentConcept.class,
        mastery: Math.round(recentProg.mastery ?? 60),
        href: recentProg.status === "completed"
          ? `/student/worksheet/${recentId}`
          : `/student/lesson/${recentId}`,
      };
    }
  }

  // 3. Badges evaluation
  const evaluatedBadges = evaluateStudentBadges(profile);
  const earnedBadges = evaluatedBadges.filter((b) => b.unlocked);

  // 4. First diagnostic href
  const firstChapter = chapters[0];
  const firstDiagnosticHref = firstChapter && canTakeChapterDiagnostic(firstChapter.id)
    ? `/student/diagnostic/${firstChapter.id}`
    : `/student/diagnostic`;

  return (
    <div className="min-h-screen text-[#2B1B0F] flex flex-col justify-between">
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
        
        {/* Welcome Companion & Hero Bar */}
        <div className="bg-[#FFFDF7] p-5 sm:p-7 border-3 border-[#2B1B0F] shadow-block flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6">
          <div className="flex items-start gap-4">
            <div className="shrink-0 p-2.5 bg-[#FFF7E6] border-2 border-[#2B1B0F]">
              <WitchCat
                pose={isIstNightTime() ? "sleepy" : "greet"}
                size={64}
                sticker={false}
                alt="Maru companion"
              />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 bg-[#5DAA3A] text-[#2B1B0F] border border-[#2B1B0F] text-[10px] font-pixel uppercase tracking-wide">
                  Studying Class {studyClass}
                </span>
                {enrolledClass !== studyClass && (
                  <span className="px-2.5 py-0.5 bg-[#E2DDD5] border border-[#2B1B0F] text-[10px] font-heading font-bold text-[#2B1B0F]">
                    Enrolled Grade {enrolledClass}
                  </span>
                )}
                <span className="px-2.5 py-0.5 bg-[#F4C542] text-[#2B1B0F] border border-[#2B1B0F] text-[10px] font-pixel">
                  {levelInfo.rank.badge} {levelInfo.rank.name} • Lv {levelInfo.level}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-heading font-extrabold text-[#2B1B0F] leading-tight">
                Welcome back, {profile.name}!
              </h1>
              <p className="text-xs sm:text-sm text-[#2B1B0F]/80 font-sans max-w-xl">
                {displayGreeting}
              </p>
            </div>
          </div>

          {/* Quick Profile Level & XP widget */}
          <div className="w-full md:w-64 space-y-2 p-3 bg-[#FFF7E6] border-2 border-[#2B1B0F] shrink-0">
            <div className="flex items-center justify-between text-xs font-heading font-bold text-[#2B1B0F]">
              <span>Level {levelInfo.level} Progress</span>
              <span className="font-pixel text-[10px]">{profile.xp || 0} XP</span>
            </div>
            <SegmentedXpBar currentXp={profile.xp || 0} />
            <div className="flex items-center justify-between text-[10px] text-[#2B1B0F]/70 font-sans font-medium">
              <span>{levelInfo.currentLevelXp} / {levelInfo.nextLevelXp} XP (Needs {levelInfo.xpUntilNextLevel} XP)</span>
              {profile.streak && profile.streak.current > 0 && (
                <span className="flex items-center gap-0.5 font-heading font-bold text-[#B8322B]">
                  <Flame className="w-3 h-3 text-[#B8322B] fill-[#B8322B]" />
                  {profile.streak.current}d Streak
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 1. NEW STUDENT EMPTY STATE BANNER (When no attempts or gaps recorded) */}
        {totalAttempted === 0 && !hasActiveGap && (
          <div className="bg-[#FFFDF7] p-6 sm:p-7 border-3 border-[#2B1B0F] shadow-block flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#F4C542] border-2 border-[#2B1B0F] shrink-0">
                <Target className="w-8 h-8 text-[#2B1B0F]" />
              </div>
              <div className="space-y-1.5">
                <span className="px-2.5 py-0.5 bg-[#5DAA3A] text-[#2B1B0F] border border-[#2B1B0F] text-[10px] font-pixel uppercase tracking-wide">
                  START YOUR JOURNEY
                </span>
                <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-[#2B1B0F]">
                  Discover Your Math Baseline
                </h2>
                <p className="text-xs sm:text-sm text-[#2B1B0F]/80 font-sans max-w-xl leading-relaxed">
                  Welcome to Margam! Take a quick 6-question diagnostic placement for Class {studyClass}. We’ll automatically identify your strengths and pinpoint any hidden prerequisite gaps from earlier classes.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0">
              <Link
                href={firstDiagnosticHref}
                className="px-5 py-3 bg-[#5DAA3A] hover:bg-[#4E9330] text-[#2B1B0F] font-heading font-bold text-xs uppercase tracking-wider border-3 border-[#2B1B0F] shadow-block hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center justify-center gap-2 no-underline cursor-pointer"
              >
                <span>Take Diagnostic</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/student/learn"
                className="px-4 py-3 bg-white hover:bg-slate-50 text-[#2B1B0F] font-heading font-bold text-xs uppercase tracking-wider border-3 border-[#2B1B0F] shadow-block hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center justify-center gap-1.5 no-underline cursor-pointer"
              >
                <span>Explore Lessons</span>
              </Link>
            </div>
          </div>
        )}

        {/* 2. "FIX THIS FIRST" CARD (Driven by real adaptive engine) */}
        {fixThisFirst && (
          <div className="bg-[#FFF0F0] p-5 sm:p-6 border-3 border-[#D9453D] shadow-[4px_4px_0px_#D9453D] flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#D9453D] text-white border-2 border-[#2B1B0F] shrink-0 text-xl font-pixel flex items-center justify-center">
                ⚡
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 bg-[#D9453D] text-white text-[10px] font-pixel uppercase tracking-wide">
                    FIX THIS FIRST
                  </span>
                  <span className="text-[11px] font-heading font-bold text-[#D9453D]">
                    Class {fixThisFirst.concept.class} Foundational Skill
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-heading font-extrabold text-[#2B1B0F]">
                  {fixThisFirst.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#2B1B0F]/80 font-sans max-w-xl leading-relaxed">
                  {fixThisFirst.description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
              <Link
                href={fixThisFirst.actionHref}
                className="w-full md:w-auto px-5 py-2.5 bg-[#D9453D] hover:bg-[#B8322B] text-white font-heading font-bold text-xs uppercase tracking-wider border-3 border-[#2B1B0F] shadow-block hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center justify-center gap-2 no-underline cursor-pointer"
              >
                <span>{fixThisFirst.actionText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* 3. "CONTINUE WHERE YOU LEFT OFF" CARD (If student has previous attempt and no blocker) */}
        {continueItem && !fixThisFirst && (
          <div className="bg-[#FFFDF7] p-5 sm:p-6 border-3 border-[#2B1B0F] shadow-block flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-[#F4C542] border-2 border-[#2B1B0F] text-[#2B1B0F] shrink-0">
                <Compass className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-pixel text-[#5DAA3A] uppercase tracking-wider">
                  CONTINUE WHERE YOU LEFT OFF
                </span>
                <h3 className="font-heading font-extrabold text-base text-[#2B1B0F]">
                  {continueItem.conceptName}
                </h3>
                <p className="text-xs text-[#2B1B0F]/70 font-sans">
                  Class {continueItem.class} • Current Mastery {continueItem.mastery}%
                </p>
              </div>
            </div>
            <Link
              href={continueItem.href}
              className="w-full md:w-auto px-5 py-2.5 bg-[#5DAA3A] hover:bg-[#4E9330] text-[#2B1B0F] font-heading font-bold text-xs uppercase tracking-wider border-3 border-[#2B1B0F] shadow-block hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center justify-center gap-2 no-underline cursor-pointer"
            >
              <span>Resume Learning</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* 4. THE PATH MAP COMPONENT (The Margam Progression Path with Cracked & Solid Voxel Blocks) */}
        <PathMap profile={profile} currentLang={currentLang} />

        {/* 4 Primary Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* 1. LEARN */}
          <Link
            href="/student/learn"
            className="bg-[#FFFDF7] p-5 border-3 border-[#2B1B0F] shadow-block hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex flex-col justify-between group min-h-[190px] no-underline"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-[#5DAA3A] border-2 border-[#2B1B0F] text-[#2B1B0F] flex items-center justify-center shadow-xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-pixel px-2 py-0.5 bg-[#FFF7E6] text-[#2B1B0F] border border-[#2B1B0F]">
                  CURRICULUM
                </span>
              </div>
              <div>
                <h2 className="font-heading font-extrabold text-base text-[#2B1B0F] group-hover:text-[#5DAA3A] transition-colors">
                  Learn Concepts
                </h2>
                <p className="text-xs text-[#2B1B0F]/70 font-sans mt-1">
                  Explore Class {studyClass} lessons arranged sequentially, view explanations, and worked examples.
                </p>
              </div>
            </div>
            <div className="pt-3 mt-auto border-t-2 border-[#2B1B0F]/10 flex items-center justify-between text-xs font-heading font-bold text-[#2B1B0F]">
              <span>Open Lessons</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* 2. PRACTICE */}
          <Link
            href="/student/practice"
            className="bg-[#FFFDF7] p-5 border-3 border-[#2B1B0F] shadow-block hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex flex-col justify-between group min-h-[190px] no-underline"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-[#F4C542] border-2 border-[#2B1B0F] text-[#2B1B0F] flex items-center justify-center shadow-xs">
                  <Compass className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-pixel px-2 py-0.5 bg-[#FFF7E6] text-[#2B1B0F] border border-[#2B1B0F]">
                  ADAPTIVE
                </span>
              </div>
              <div>
                <h2 className="font-heading font-extrabold text-base text-[#2B1B0F] group-hover:text-[#B8322B] transition-colors">
                  Practice Worksheets
                </h2>
                <p className="text-xs text-[#2B1B0F]/70 font-sans mt-1">
                  Solve adaptive problem sets, receive instant hints, and overcome common NCERT misconceptions.
                </p>
              </div>
            </div>
            <div className="pt-3 mt-auto border-t-2 border-[#2B1B0F]/10 flex items-center justify-between text-xs font-heading font-bold text-[#2B1B0F]">
              <span>Start Practice</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* 3. DIAGNOSE */}
          <Link
            href="/student/diagnostic"
            className="bg-[#FFFDF7] p-5 border-3 border-[#2B1B0F] shadow-block hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex flex-col justify-between group min-h-[190px] no-underline"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-[#6EB5FF] border-2 border-[#2B1B0F] text-[#2B1B0F] flex items-center justify-center shadow-xs">
                  <Target className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-pixel px-2 py-0.5 bg-[#FFF7E6] text-[#2B1B0F] border border-[#2B1B0F]">
                  PLACEMENT
                </span>
              </div>
              <div>
                <h2 className="font-heading font-extrabold text-base text-[#2B1B0F] group-hover:text-[#3880FF] transition-colors">
                  Diagnose Mastery
                </h2>
                <p className="text-xs text-[#2B1B0F]/70 font-sans mt-1">
                  Take chapter diagnostics to pinpoint hidden learning gaps and auto-unlock chapter concepts.
                </p>
              </div>
            </div>
            <div className="pt-3 mt-auto border-t-2 border-[#2B1B0F]/10 flex items-center justify-between text-xs font-heading font-bold text-[#2B1B0F]">
              <span>Take Diagnostic</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* 4. PROFILE */}
          <Link
            href="/student/profile"
            className="bg-[#FFFDF7] p-5 border-3 border-[#2B1B0F] shadow-block hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex flex-col justify-between group min-h-[190px] no-underline"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-[#D4A5FF] border-2 border-[#2B1B0F] text-[#2B1B0F] flex items-center justify-center shadow-xs">
                  <User className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-pixel px-2 py-0.5 bg-[#FFF7E6] text-[#2B1B0F] border border-[#2B1B0F]">
                  ACCOUNT
                </span>
              </div>
              <div>
                <h2 className="font-heading font-extrabold text-base text-[#2B1B0F] group-hover:text-[#9050FF] transition-colors">
                  My Profile
                </h2>
                <p className="text-xs text-[#2B1B0F]/70 font-sans mt-1">
                  Change daily study class (Classes 6–10), update your nickname, and inspect learning progress.
                </p>
              </div>
            </div>
            <div className="pt-3 mt-auto border-t-2 border-[#2B1B0F]/10 flex items-center justify-between text-xs font-heading font-bold text-[#2B1B0F]">
              <span>Edit Profile</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Spaced Repetition Revision Zone (if any topics are due) */}
        {revisionQueue.length > 0 && (
          <div className="bg-[#FFF9E6] p-6 border-3 border-[#2B1B0F] shadow-block space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-[#B8322B]" />
                <h2 className="font-heading font-extrabold text-base text-[#2B1B0F]">
                  Spaced Repetition: Revision Due ({revisionQueue.length} topics)
                </h2>
              </div>
              <span className="text-xs font-pixel text-[#B8322B]">
                RETENTION BOOSTER
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {revisionQueue.slice(0, 3).map((item) => (
                <div
                  key={item.conceptId}
                  className="p-3.5 bg-white border-2 border-[#2B1B0F] shadow-xs flex flex-col justify-between gap-3"
                >
                  <div>
                    <span className="text-[10px] font-pixel px-2 py-0.5 bg-[#F4C542] text-[#2B1B0F] border border-[#2B1B0F]">
                      Class {item.class} • Mastery {item.mastery}%
                    </span>
                    <h3 className="font-heading font-bold text-xs text-[#2B1B0F] mt-1.5">
                      {item.conceptName}
                    </h3>
                    <p className="text-[11px] text-[#2B1B0F]/70 font-sans mt-0.5">
                      {item.reason}
                    </p>
                  </div>
                  <Link
                    href={item.href}
                    className="w-full py-1.5 px-3 bg-[#5DAA3A] hover:bg-[#4E9330] text-[#2B1B0F] font-heading font-bold text-xs border-2 border-[#2B1B0F] flex items-center justify-center gap-1.5 shadow-xs transition-colors no-underline"
                  >
                    <span>Revise Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chapters Overview for Active Study Class */}
        <div className="bg-[#FFFDF7] p-6 sm:p-8 border-3 border-[#2B1B0F] shadow-block space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#FFF7E6] text-[#2B1B0F] border border-[#2B1B0F] text-[10px] font-pixel uppercase tracking-wider mb-1">
                NCERT SYLLABUS
              </div>
              <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-[#2B1B0F]">
                Class {studyClass} Mathematics Chapters
              </h2>
              <p className="text-xs text-[#2B1B0F]/70 font-sans mt-0.5">
                Explore chapters, take chapter diagnostics, or study individual concept lessons.
              </p>
            </div>
            <Link
              href="/student/learn"
              className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-[#2B1B0F] py-2 px-3.5 bg-white hover:bg-slate-50 border-2 border-[#2B1B0F] shadow-xs transition-all self-start sm:self-auto no-underline"
            >
              <span>View All Chapters</span>
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
              const chName = chapter.name[currentLang] || chapter.name.en;

              return (
                <div
                  key={chapter.id}
                  className="p-4 bg-white border-2 border-[#2B1B0F] shadow-xs flex flex-col justify-between gap-3 hover:bg-[#FFFDF7] transition-all"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-pixel px-2 py-0.5 bg-[#FFF7E6] text-[#2B1B0F] border border-[#2B1B0F]">
                        CH {chapter.chapterNumber}
                      </span>
                      {chapter.status === "full" ? (
                        <span className="text-[10px] font-heading font-extrabold text-[#5DAA3A]">
                          {completedInChapter}/{chapterConcepts.length} Completed
                        </span>
                      ) : (
                        <span className="text-[10px] font-heading font-bold text-slate-500">
                          Curriculum Preview
                        </span>
                      )}
                    </div>
                    <h3 className="font-heading font-extrabold text-sm text-[#2B1B0F]">
                      {chName}
                    </h3>
                  </div>

                  <div className="pt-2 border-t border-[#2B1B0F]/10 flex items-center justify-between gap-2">
                    {hasDiagnostic ? (
                      <Link
                        href={`/student/diagnostic/${chapter.id}`}
                        className="text-xs font-heading font-bold text-[#3880FF] hover:underline flex items-center gap-1"
                      >
                        <Target className="w-3.5 h-3.5" />
                        <span>Diagnostic</span>
                      </Link>
                    ) : (
                      <span className="text-[11px] text-slate-500 font-sans">
                        {chapterConcepts.length} Concepts
                      </span>
                    )}

                    <Link
                      href="/student/learn"
                      className="text-xs font-heading font-bold text-[#5DAA3A] hover:underline flex items-center gap-1"
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

        {/* Gamification & Leaderboard + Earned Stickers Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ClassLeaderboard classId={`class-${studyClass}`} />
          </div>

          {/* Earned Stickers & Badges Preview Card */}
          <div className="bg-[#FFFDF7] p-6 border-3 border-[#2B1B0F] shadow-block flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#F4C542]" />
                  <h3 className="font-heading font-extrabold text-base text-[#2B1B0F]">
                    Earned Stickers
                  </h3>
                </div>
                <Link
                  href="/student/stickers"
                  className="text-xs font-heading font-bold text-[#5DAA3A] hover:underline"
                >
                  View All ({evaluatedBadges.length})
                </Link>
              </div>
              <p className="text-xs text-[#2B1B0F]/70 font-sans mt-1">
                Collect achievement stickers by mastering skills, fixing gaps, and learning daily.
              </p>
            </div>

            {/* Unlocked Badges Showcase */}
            {earnedBadges.length > 0 ? (
              <div className="grid grid-cols-2 gap-2.5">
                {earnedBadges.slice(0, 4).map((b) => (
                  <div
                    key={b.id}
                    className="p-2.5 bg-[#FFF7E6] border-2 border-[#2B1B0F] text-center space-y-1 shadow-2xs"
                  >
                    <div className="text-2xl">
                      {b.icon === "star" ? "⭐" : b.icon === "flame" ? "🔥" : b.icon === "crown" ? "👑" : "🏆"}
                    </div>
                    <div className="font-heading font-bold text-[11px] text-[#2B1B0F] truncate">
                      {b.title[currentLang] || b.title.en}
                    </div>
                    <span className="text-[9px] font-pixel text-[#5DAA3A] block">
                      UNLOCKED
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-[#FFF7E6] border-2 border-[#2B1B0F] text-center space-y-1.5">
                <div className="text-3xl">🎯</div>
                <div className="font-heading font-bold text-xs text-[#2B1B0F]">
                  No Stickers Unlocked Yet
                </div>
                <p className="text-[11px] text-[#2B1B0F]/70 font-sans">
                  Complete your first lesson or practice session to earn the &quot;First Step&quot; sticker!
                </p>
              </div>
            )}

            <Link
              href="/student/stickers"
              className="w-full py-2.5 px-3 bg-white hover:bg-slate-50 text-[#2B1B0F] font-heading font-bold text-xs flex items-center justify-center gap-1.5 border-2 border-[#2B1B0F] shadow-xs transition-colors no-underline"
            >
              <span>Explore All Badges & Stickers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-[1200px] mx-auto px-4 my-6 text-center text-xs font-sans font-medium text-[#2B1B0F]/70">
        Margam • Adaptive Mathematics for NCERT Classes 6–10
      </footer>
    </div>
  );
}

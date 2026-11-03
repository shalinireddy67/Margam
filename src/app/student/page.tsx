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
  Calendar,
  CheckCircle2,
  TrendingUp,
  School,
  GraduationCap,
  Target,
  User,
  Zap,
  Flame,
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
import { LearnerProfile, SupportedLanguage } from "@/lib/types";
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
} from "@/lib/curriculum";
import { WitchCat } from "@/components/ui/WitchCat";
import { isIstNightTime, getLevelProgress } from "@/lib/xp-config";
import { SegmentedXpBar } from "@/components/ui/PixelEffects";
import { ClassLeaderboard } from "@/components/ui/ClassLeaderboard";
import { evaluateStudentBadges } from "@/lib/badges";
import { getCatGreeting } from "@/lib/greetings";
import { getRevisionQueue, getCompanionRevisionGreeting } from "@/lib/revision";

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
        <div className="glass-panel p-6 rounded-2xl text-center shadow-lg border border-white/70">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="font-heading text-xs text-emerald-950">Opening Student Realm...</p>
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
    (tp) => tp.worksheetCompleted || (tp.worksheetScore !== undefined)
  ).length;

  const greetingObj = getCatGreeting(profile.name, currentLang);
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
        
        {/* Welcome Companion & Hero Bar */}
        <div className="glass-panel p-5 sm:p-7 rounded-3xl border border-white/80 shadow-[0_12px_40px_rgba(16,42,18,0.1)] flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6">
          <div className="flex items-start gap-4">
            <div className="shrink-0 p-2.5 rounded-2xl bg-white/70 border border-white/80 shadow-xs">
              <WitchCat
                pose={isIstNightTime() ? "sleepy" : "greet"}
                size={64}
                sticker={false}
                alt="Maru companion"
              />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100/90 border border-emerald-300 text-[10px] font-heading font-extrabold text-emerald-900 uppercase tracking-wide">
                  Studying Class {studyClass}
                </span>
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
              <span>{levelInfo.currentLevelXp} / {levelInfo.nextLevelXp} XP (Needs {levelInfo.xpUntilNextLevel} XP)</span>
              {profile.streak && profile.streak.current > 0 && (
                <span className="flex items-center gap-0.5 font-heading font-bold text-amber-700">
                  <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                  {profile.streak.current}d Streak
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 4 Primary Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* 1. LEARN */}
          <Link
            href="/student/learn"
            className="glass-panel p-5 rounded-2xl border border-white/80 shadow-[0_8px_24px_rgba(16,42,18,0.08)] hover:border-emerald-400/70 hover:scale-[1.01] transition-all flex flex-col justify-between group min-h-[200px]"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs group-hover:bg-emerald-700 transition-colors">
                  <Sparkles className="w-5 h-5" />
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
            className="glass-panel p-5 rounded-2xl border border-white/80 shadow-[0_8px_24px_rgba(16,42,18,0.08)] hover:border-emerald-400/70 hover:scale-[1.01] transition-all flex flex-col justify-between group min-h-[200px]"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs group-hover:bg-amber-700 transition-colors">
                  <Compass className="w-5 h-5" />
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
            className="glass-panel p-5 rounded-2xl border border-white/80 shadow-[0_8px_24px_rgba(16,42,18,0.08)] hover:border-emerald-400/70 hover:scale-[1.01] transition-all flex flex-col justify-between group min-h-[200px]"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-cyan-600 text-white flex items-center justify-center shadow-xs group-hover:bg-cyan-700 transition-colors">
                  <Target className="w-5 h-5" />
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
                  Take chapter diagnostics to pinpoint hidden learning gaps and auto-unlock chapter concepts.
                </p>
              </div>
            </div>
            <div className="pt-3 mt-auto border-t border-emerald-950/10 flex items-center justify-between text-xs font-heading font-bold text-cyan-800">
              <span>Take Diagnostic</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* 4. PROFILE */}
          <Link
            href="/student/profile"
            className="glass-panel p-5 rounded-2xl border border-white/80 shadow-[0_8px_24px_rgba(16,42,18,0.08)] hover:border-emerald-400/70 hover:scale-[1.01] transition-all flex flex-col justify-between group min-h-[200px]"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs group-hover:bg-purple-700 transition-colors">
                  <User className="w-5 h-5" />
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

        {/* Spaced Repetition Revision Zone (if any topics are due) */}
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

        {/* Chapters Overview for Active Study Class */}
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

        {/* Gamification & Leaderboard Section */}
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
                Earn badges by completing lessons, scoring streaks, and resolving diagnostic gaps.
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

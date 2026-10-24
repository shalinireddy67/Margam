"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Compass,
  ArrowRight,
  CheckCircle2,
  Lock,
  Clock,
  PlayCircle,
  RotateCcw,
  Sparkles,
  FileText,
  Award,
  BarChart2,
} from "lucide-react";
import { SupportedLanguage, LearnerProfile, TopicStatus } from "@/lib/types";
import {
  getActiveProfile,
  createLearnerProfile,
  clearActiveProfile,
} from "@/lib/storage";
import { syncClassProgression } from "@/lib/progression";
import {
  getChaptersByClass,
  getConceptsByChapter,
  getSupportedChapters,
  canTakeChapterDiagnostic,
} from "@/lib/curriculum";
import WitchCatCompanion from "@/components/WitchCatCompanion";

export default function MargamApp() {
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>("en");

  // Welcome Form State
  const [nameInput, setNameInput] = useState("");
  const [selectedClassInput, setSelectedClassInput] = useState<6 | 7 | 8 | 9 | 10>(8);

  useEffect(() => {
    const active = getActiveProfile();
    if (active && active.selectedClass) {
      const updated = syncClassProgression(active);
      setProfile(updated);
    }
    setIsLoaded(true);
  }, []);

  // 1. Handle Start Learning
  const handleStartLearning = (e: React.FormEvent) => {
    e.preventDefault();
    const newProfile = createLearnerProfile(
      nameInput.trim() || "Student",
      selectedClassInput
    );
    const updated = syncClassProgression(newProfile);
    setProfile(updated);
  };

  // 2. Handle Reset Profile
  const handleResetProfile = () => {
    if (
      window.confirm(
        "Are you sure you want to reset your learner profile? This will allow you to enter a new name or class."
      )
    ) {
      clearActiveProfile();
      setProfile(null);
      setNameInput("");
      setSelectedClassInput(8);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F6]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-berry border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-grey">Loading Margam...</p>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SCREEN 1: Simple Welcome Screen (If no profile saved)
  // Ask only two things: Name and Class. One button: Start Learning.
  // =========================================================================
  if (!profile) {
    return (
      <div className="min-h-screen bg-[#FAF8F6] flex flex-col justify-between text-plum font-sans">
        {/* Simple Header */}
        <header className="border-b border-border bg-white/90 backdrop-blur-md">
          <div className="max-w-xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-berry flex items-center justify-center text-white shadow-soft">
                <Compass className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-plum">
                Margam
              </span>
            </div>
            <span className="text-xs font-semibold text-grey">
              Math for Classes 6–10
            </span>
          </div>
        </header>

        {/* Main Onboarding Card with Witch Cat */}
        <main className="max-w-md mx-auto px-4 py-8 w-full flex-1 flex flex-col justify-center">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border shadow-card space-y-6">
            {/* Mascot Centerpiece */}
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-24 h-24 sm:w-28 sm:h-28 relative animate-gentle-float">
                <Image
                  src="/images/witch-cat-transparent.png"
                  alt="Margam Witch Cat Study Companion"
                  width={112}
                  height={112}
                  className="object-contain drop-shadow-sm select-none"
                  priority
                />
              </div>

              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-peach-light text-plum text-xs font-bold border border-peach-border">
                  <Sparkles className="w-3.5 h-3.5 text-berry" />
                  <span>Meet Your Study Companion</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-plum tracking-tight pt-1">
                  Welcome to Margam
                </h1>
                <p className="text-xs sm:text-sm text-grey">
                  Enter your name and select your class to begin.
                </p>
              </div>
            </div>

            <form onSubmit={handleStartLearning} className="space-y-5">
              {/* Question 1: Name */}
              <div className="space-y-1.5">
                <label
                  htmlFor="learner-name"
                  className="block text-xs font-bold text-plum uppercase tracking-wider"
                >
                  Your Name
                </label>
                <input
                  id="learner-name"
                  type="text"
                  required
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-4 py-3 rounded-2xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-berry focus:border-transparent text-plum bg-white"
                />
              </div>

              {/* Question 2: Class Selection */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-plum uppercase tracking-wider">
                  Your Class
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {([6, 7, 8, 9, 10] as const).map((grade) => {
                    const isSelected = selectedClassInput === grade;
                    return (
                      <button
                        type="button"
                        key={grade}
                        onClick={() => setSelectedClassInput(grade)}
                        className={`min-h-[48px] py-2.5 rounded-2xl font-bold text-sm transition-all ${
                          isSelected
                            ? "bg-berry text-white shadow-soft ring-2 ring-berry/20"
                            : "bg-[#FDF5F3] hover:bg-peach-light text-plum border border-peach-border/60"
                        }`}
                      >
                        {grade}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-grey pt-1 text-center">
                  Selected: <strong className="text-plum">Class {selectedClassInput}</strong>
                </p>
              </div>

              {/* Primary Action Button */}
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 min-h-[50px] px-6 rounded-2xl bg-berry hover:bg-berry-hover text-white font-bold text-sm shadow-soft transition-all cursor-pointer active:scale-98"
              >
                <span>Start Learning</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border py-4 text-center text-xs text-grey bg-white">
          Margam Adaptive Mathematics • Classes 6 to 10
        </footer>
      </div>
    );
  }

  // =========================================================================
  // SCREEN 2: Class-Specific Learning Page
  // Shows ONLY that class's lessons in a simple vertical list with Witch Cat.
  // =========================================================================
  const allChapters = getChaptersByClass(profile.selectedClass);

  return (
    <div className="min-h-screen bg-[#FAF8F6] flex flex-col justify-between text-plum font-sans">
      {/* Simple Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Logo & Grade */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-berry flex items-center justify-center text-white shadow-soft">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-plum">
                Margam
              </span>
              <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-peach-light text-plum border border-peach-border">
                Class {profile.selectedClass}
              </span>
            </div>
          </div>

          {/* Right Controls: Language Switcher, Learner Badge, Reset */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-[#FDF5F3] p-1 rounded-xl border border-peach-border/70">
              <button
                type="button"
                onClick={() => setCurrentLang("en")}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                  currentLang === "en" ? "bg-white text-plum shadow-xs" : "text-grey"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setCurrentLang("hi")}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                  currentLang === "hi" ? "bg-white text-plum shadow-xs" : "text-grey"
                }`}
              >
                हिन्दी
              </button>
              <button
                type="button"
                onClick={() => setCurrentLang("te")}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                  currentLang === "te" ? "bg-white text-plum shadow-xs" : "text-grey"
                }`}
              >
                తెలుగు
              </button>
            </div>

            {/* Learner Name Badge */}
            <span className="text-xs font-semibold text-plum hidden sm:inline">
              {profile.name}
            </span>

            {/* Simple Reset Profile Action */}
            <button
              type="button"
              onClick={handleResetProfile}
              title="Reset profile to switch class or name"
              className="inline-flex items-center gap-1 text-xs font-semibold text-grey hover:text-plum p-2 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Learning Space: Vertical List of Lessons */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 w-full flex-1 space-y-6">
        {/* Friendly Witch Cat Greeting Banner */}
        <WitchCatCompanion
          studentName={profile.name}
          context="greeting"
          mode="inline"
        />

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-plum tracking-tight">
            Class {profile.selectedClass} Mathematics
          </h1>
          <p className="text-xs sm:text-sm text-grey mt-1">
            Complete each lesson in order to unlock the next.
          </p>
        </div>

        {/* Chapters & Lessons */}
        <div className="space-y-4">
          {allChapters.map((chapter) => {
            const isFull = chapter.status === "full";
            const chapterConcepts = getConceptsByChapter(chapter.id);
            const hasDiagnostic = canTakeChapterDiagnostic(chapter.id);
            const hasCompletedAny = chapterConcepts.some(
              (c) => profile.topicProgress[c.id]?.status === "completed"
            );

            return (
              <div
                key={chapter.id}
                className={`rounded-3xl border transition-all ${
                  isFull
                    ? "bg-white border-border shadow-card p-5 sm:p-6"
                    : "bg-[#FBF9F7] border-border/70 p-4 sm:p-5"
                }`}
              >
                {/* Chapter Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
                  <div>
                    <h2 className="font-bold text-base text-plum">
                      Ch {chapter.chapterNumber}: {chapter.name[currentLang] || chapter.name.en}
                    </h2>
                    <p className="text-xs text-grey">{chapter.bookName}</p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Take Diagnostic (Only on chapters whose questions total >= 6) */}
                    {isFull && hasDiagnostic && (
                      <Link
                        href={`/student/diagnostic/${chapter.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-berry text-white text-xs font-bold hover:bg-berry-hover transition-colors shadow-soft"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>Take Diagnostic</span>
                      </Link>
                    )}

                    {/* Chapter Test (if chapter has questions and at least one concept completed) */}
                    {isFull && hasDiagnostic && hasCompletedAny && (
                      <Link
                        href={`/student/test/${chapter.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-plum text-xs font-bold transition-colors"
                      >
                        <BarChart2 className="w-3.5 h-3.5" />
                        <span>Chapter Test</span>
                      </Link>
                    )}

                    {!isFull && (
                      <span className="text-xs font-semibold text-grey bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                        Coming soon
                      </span>
                    )}
                  </div>
                </div>

                {/* If full chapter, show lessons vertically */}
                {isFull && (
                  <div className="pt-4 space-y-3">
                    {chapterConcepts.map((concept, idx) => {
                      const prog = profile.topicProgress[concept.id];
                      const status: TopicStatus =
                        prog?.status || (idx === 0 ? "available" : "locked");
                      const isLocked = status === "locked";
                      const isCompleted = status === "completed";
                      const isInProgress = status === "in_progress";
                      const isAvailable = status === "available";

                      return (
                        <div
                          key={concept.id}
                          className={`rounded-2xl border p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                            isCompleted
                              ? "bg-[#F3FAF5] border-emerald-200"
                              : isAvailable || isInProgress
                              ? "bg-white border-berry/40 ring-1 ring-berry/20 shadow-xs"
                              : "bg-slate-50/70 border-slate-200 opacity-60"
                          }`}
                        >
                          {/* Lesson Info */}
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-grey uppercase tracking-wider">
                                Lesson {idx + 1}
                              </span>

                              {isCompleted && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>Completed</span>
                                </span>
                              )}
                              {isInProgress && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-berry bg-berry-light px-2 py-0.5 rounded-full border border-berry-border">
                                  <Clock className="w-3 h-3" />
                                  <span>In Progress</span>
                                </span>
                              )}
                              {isAvailable && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-plum bg-peach-light px-2 py-0.5 rounded-full border border-peach-border">
                                  <span>Available</span>
                                </span>
                              )}
                              {isLocked && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-grey bg-slate-200 px-2 py-0.5 rounded-full">
                                  <Lock className="w-3 h-3" />
                                  <span>Locked</span>
                                </span>
                              )}
                            </div>

                            <h3 className="font-bold text-sm sm:text-base text-plum">
                              {concept.name[currentLang] || concept.name.en}
                            </h3>

                            <p className="text-xs text-grey line-clamp-2">
                              {concept.learningObjective[currentLang] ||
                                concept.learningObjective.en}
                            </p>
                          </div>

                          {/* Action Buttons: Practice & Lesson */}
                          <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
                            {isLocked ? (
                              <button
                                disabled
                                className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold bg-slate-200 text-grey cursor-not-allowed"
                              >
                                Locked
                              </button>
                            ) : (
                              <>
                                <Link
                                  href={`/student/worksheet/${concept.id}`}
                                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#FDF5F3] hover:bg-peach-light text-plum border border-peach-border/70 transition-all min-h-[38px]"
                                >
                                  <FileText className="w-3.5 h-3.5 text-berry" />
                                  <span>Practice</span>
                                </Link>

                                <Link
                                  href={`/lesson/${concept.id}`}
                                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all min-h-[38px] ${
                                    isCompleted
                                      ? "bg-slate-100 hover:bg-slate-200 text-plum"
                                      : "bg-berry hover:bg-berry-hover text-white shadow-soft"
                                  }`}
                                >
                                  <PlayCircle className="w-4 h-4" />
                                  <span>
                                    {isCompleted
                                      ? "Revisit"
                                      : isInProgress
                                      ? "Continue"
                                      : "Start Lesson"}
                                  </span>
                                </Link>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* Floating Witch Cat Companion */}
      <WitchCatCompanion
        studentName={profile.name}
        context="greeting"
        mode="floating"
      />

      {/* Simple Clean Footer */}
      <footer className="border-t border-border py-4 text-center text-xs text-grey bg-white">
        Margam • Sequentially Adaptive Mathematics
      </footer>
    </div>
  );
}

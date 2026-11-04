"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  BookOpen,
  CheckCircle2,
  Lock,
  ArrowRight,
  Clock,
  Compass,
  AlertCircle,
  Search,
  Filter,
  GraduationCap,
  Layers,
  ChevronRight,
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { LearnerProfile, Concept, Chapter, SupportedLanguage } from "@/lib/types";
import {
  getActiveProfile,
  createLearnerProfile,
  updateLearnerStudyClass,
} from "@/lib/storage";
import { syncClassProgression, canAccessTopic } from "@/lib/progression";
import {
  getChaptersByClass,
  getConceptsByClass,
  getConceptById,
} from "@/lib/curriculum";

export default function StudentLearnPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>("en");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "unlocked" | "completed" | "locked">("all");

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
      <div className="min-h-screen flex items-center justify-center text-slate-800">
        <div className="glass-panel p-6 rounded-2xl text-center shadow-lg border border-white/70">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="font-heading text-xs text-emerald-950">Loading Curriculum...</p>
        </div>
      </div>
    );
  }

  const studyClass = (profile.studyClass || profile.selectedClass || 10) as 6 | 7 | 8 | 9 | 10;
  const enrolledClass = (profile.enrolledClass || profile.selectedClass || 10) as 6 | 7 | 8 | 9 | 10;

  // Handle study class change directly from the learn page
  const handleSelectClass = (newGrade: 6 | 7 | 8 | 9 | 10) => {
    if (newGrade === studyClass) return;
    const updated = updateLearnerStudyClass(profile, newGrade);
    const synced = syncClassProgression(updated);
    setProfile({ ...synced });
  };

  const chapters = getChaptersByClass(studyClass);
  const allConcepts = getConceptsByClass(studyClass);

  // Filter concepts
  const filteredConcepts = allConcepts.filter((concept) => {
    const topicProgress = profile.topicProgress?.[concept.id];
    const isCompleted = topicProgress?.status === "completed";
    const isUnlocked = isCompleted || topicProgress?.status === "available" || topicProgress?.status === "in_progress";
    const isLocked = !isUnlocked;

    if (statusFilter === "unlocked" && !isUnlocked) return false;
    if (statusFilter === "completed" && !isCompleted) return false;
    if (statusFilter === "locked" && !isLocked) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const nameMatch =
        concept.name.en.toLowerCase().includes(q) ||
        (concept.name.hi && concept.name.hi.toLowerCase().includes(q)) ||
        (concept.name.te && concept.name.te.toLowerCase().includes(q));
      const objMatch =
        concept.learningObjective.en.toLowerCase().includes(q) ||
        (concept.learningObjective.hi && concept.learningObjective.hi.toLowerCase().includes(q)) ||
        (concept.learningObjective.te && concept.learningObjective.te.toLowerCase().includes(q));
      const chapterMatch = (concept.chapter || "").toLowerCase().includes(q);
      return nameMatch || objMatch || chapterMatch;
    }

    return true;
  });

  const completedCount = allConcepts.filter(
    (c) => profile.topicProgress?.[c.id]?.status === "completed"
  ).length;

  return (
    <div className="min-h-screen text-slate-800 flex flex-col justify-between">
      {/* Top Floating Glass Navigation */}
      <Navigation
        currentTab="learn"
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        profile={profile}
        showTopBar={true}
      />

      {/* Main Content */}
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full flex-1 space-y-6 has-mobile-nav">
        
        {/* Header Banner */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/80 shadow-[0_12px_40px_rgba(16,42,18,0.1)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100/90 border border-emerald-300 text-[10px] font-heading font-extrabold text-emerald-900 uppercase tracking-wide">
                NCERT Curriculum
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/80 border border-white text-[10px] font-heading font-bold text-slate-700">
                {completedCount} of {allConcepts.length} Topics Mastered
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-emerald-950">
              Class {studyClass} Mathematics Topics
            </h1>
            <p className="text-xs sm:text-sm text-slate-700 font-sans max-w-xl">
              Topics are arranged sequentially below according to the NCERT syllabus. Complete lessons
              and practice worksheets to unlock downstream concepts.
            </p>
          </div>

          {/* Quick Study Class Switcher Pills */}
          <div className="flex flex-col gap-1.5 shrink-0 w-full sm:w-auto">
            <span className="text-[10px] font-heading font-bold text-emerald-950/70 uppercase">
              Switch Study Class:
            </span>
            <div className="flex items-center gap-1.5 bg-white/70 p-1.5 rounded-2xl border border-white/80 shadow-xs flex-wrap sm:flex-nowrap">
              {([6, 7, 8, 9, 10] as const).map((grade) => (
                <button
                  key={grade}
                  type="button"
                  onClick={() => handleSelectClass(grade)}
                  className={`min-h-[36px] min-w-[36px] sm:min-w-[42px] px-2 text-xs font-heading font-extrabold rounded-xl transition-all cursor-pointer ${
                    studyClass === grade
                      ? "bg-emerald-600 text-white shadow-xs scale-105"
                      : "text-emerald-950/70 hover:text-emerald-950 hover:bg-white/60"
                  }`}
                >
                  Class {grade}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="glass-panel p-4 rounded-2xl border border-white/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics or concepts..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/80 border border-white text-xs font-sans text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 bg-white/70 p-1 rounded-xl border border-white/80 text-xs font-heading font-bold w-full sm:w-auto overflow-x-auto">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                statusFilter === "all"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-700 hover:text-slate-900"
              }`}
            >
              All ({allConcepts.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("unlocked")}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                statusFilter === "unlocked"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-700 hover:text-slate-900"
              }`}
            >
              Available
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("completed")}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                statusFilter === "completed"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-700 hover:text-slate-900"
              }`}
            >
              Completed ({completedCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("locked")}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                statusFilter === "locked"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-700 hover:text-slate-900"
              }`}
            >
              Locked
            </button>
          </div>
        </div>

        {/* Vertical Cascade of Topics */}
        <div className="space-y-3">
          {filteredConcepts.length === 0 ? (
            <div className="glass-panel p-8 rounded-3xl text-center space-y-2 border border-white/80">
              <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="font-heading font-bold text-sm text-slate-700">No topics match your filter</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                }}
                className="text-xs font-heading font-bold text-emerald-700 underline cursor-pointer"
              >
                Reset filters
              </button>
            </div>
          ) : (
            filteredConcepts.map((concept, index) => {
              const topicProgress = profile.topicProgress?.[concept.id];
              const isCompleted = topicProgress?.status === "completed";
              const isInProgress = topicProgress?.status === "in_progress";
              const isAvailable = topicProgress?.status === "available";
              const isUnlocked = isCompleted || isInProgress || isAvailable;
              const isLocked = !isUnlocked;

              // Find prerequisite concept names if locked
              const missingPrereqs = (concept.prerequisites || []).filter(
                (prereqId) => profile.topicProgress?.[prereqId]?.status !== "completed"
              );
              const missingPrereqNames = missingPrereqs.map((prereqId) => {
                const c = getConceptById(prereqId);
                return c?.name[currentLang] || c?.name.en || prereqId;
              });

              return (
                <div
                  key={concept.id}
                  className={`glass-panel p-5 rounded-2xl border transition-all ${
                    isCompleted
                      ? "border-emerald-300/80 bg-white/80 shadow-[0_4px_16px_rgba(16,185,129,0.06)]"
                      : isInProgress || isAvailable
                      ? "border-emerald-500/60 bg-white/90 shadow-[0_8px_24px_rgba(16,42,18,0.08)] hover:border-emerald-500"
                      : "border-slate-200/80 bg-white/50 opacity-80"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    {/* Left: Status Icon & Details */}
                    <div className="flex items-start gap-3.5 flex-1">
                      {/* Status Indicator Icon */}
                      <div className="shrink-0 mt-0.5">
                        {isCompleted ? (
                          <div
                            className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs"
                            title="Concept Mastered"
                          >
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                        ) : isInProgress ? (
                          <div
                            className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs animate-pulse"
                            title="In Progress"
                          >
                            <Clock className="w-5 h-5" />
                          </div>
                        ) : isAvailable ? (
                          <div
                            className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-xs"
                            title="Ready to Learn"
                          >
                            <Sparkles className="w-5 h-5" />
                          </div>
                        ) : (
                          <div
                            className="w-9 h-9 rounded-xl bg-slate-300 text-slate-600 flex items-center justify-center shadow-xs"
                            title="Locked Topic"
                          >
                            <Lock className="w-4 h-4" />
                          </div>
                        )}
                      </div>

                      {/* Content details */}
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-heading font-extrabold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            {concept.chapter || `Class ${studyClass}`}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">
                            {concept.id}
                          </span>
                          {isCompleted && (
                            <span className="text-[10px] font-heading font-extrabold px-2 py-0.5 rounded bg-emerald-600 text-white">
                              Mastered
                            </span>
                          )}
                          {isInProgress && (
                            <span className="text-[10px] font-heading font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                              In Progress
                            </span>
                          )}
                          {isAvailable && (
                            <span className="text-[10px] font-heading font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                              Unlocked
                            </span>
                          )}
                          {isLocked && (
                            <span className="text-[10px] font-heading font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                              Locked
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h2 className="font-heading font-extrabold text-base text-emerald-950">
                          {concept.name[currentLang] || concept.name.en}
                        </h2>

                        {/* Objective */}
                        <p className="text-xs text-slate-600 font-sans leading-relaxed">
                          {concept.learningObjective[currentLang] || concept.learningObjective.en}
                        </p>

                        {/* Prerequisite Requirement Message if Locked */}
                        {isLocked && missingPrereqNames.length > 0 && (
                          <div className="pt-1 flex items-center gap-1.5 text-xs font-sans text-rose-700">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>
                              <strong>Earlier topic needed:</strong> Finish {missingPrereqNames.join(", ")} first.
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                      {isUnlocked ? (
                        <>
                          <Link
                            href={`/lesson/${concept.id}`}
                            className="flex-1 sm:flex-initial py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all hover:scale-[1.02]"
                          >
                            <span>Open lesson</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                          {isCompleted && (
                            <Link
                              href={`/student/worksheet/${concept.id}`}
                              className="py-2 px-3 rounded-xl bg-white/80 hover:bg-white text-emerald-900 border border-white font-heading font-bold text-xs flex items-center justify-center gap-1 shadow-xs transition-colors"
                              title="Practice Worksheet"
                            >
                              <Compass className="w-3.5 h-3.5" />
                              <span className="hidden md:inline">Worksheet</span>
                            </Link>
                          )}
                        </>
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="flex-1 sm:flex-initial py-2 px-4 rounded-xl bg-slate-200 text-slate-500 font-heading font-bold text-xs flex items-center justify-center gap-1.5 cursor-not-allowed"
                          title="Complete prerequisites first"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>Locked</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-[1200px] mx-auto px-4 my-6 text-center text-xs font-sans font-medium text-emerald-950/70">
        Margam • Adaptive Mathematics for NCERT Classes 6–10
      </footer>
    </div>
  );
}

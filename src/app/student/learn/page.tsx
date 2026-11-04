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
import { useLanguage } from "@/contexts/LanguageContext";
import ConceptPathway from "@/components/ConceptPathway";
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
  const { lang: currentLang, setLang: setCurrentLang, t, resolve } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "unlocked" | "completed" | "locked">("all");
  const [viewMode, setViewMode] = useState<"cascade" | "pathway">("cascade");

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
          <p className="font-heading font-extrabold text-xs text-[#1E1610]">{t("common.loading")}</p>
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
    <div className="min-h-screen text-[#1E1610] flex flex-col justify-between">
      {/* Top Floating Navigation */}
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
        <div className="panel-plank p-6 sm:p-8 border-3 border-[#1E1610] shadow-[3px_3px_0px_#1E1610] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 bg-[#8CCB55] border-2 border-[#1E1610] text-[11px] font-heading font-extrabold text-[#1E1610] uppercase tracking-wide">
                NCERT Curriculum
              </span>
              <span className="px-2.5 py-0.5 bg-[#E8CF9C] border-2 border-[#1E1610] text-[11px] font-heading font-bold text-[#1E1610]">
                {completedCount} of {allConcepts.length} Topics Mastered
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#1E1610]">
              Class {studyClass} Mathematics Topics
            </h1>
            <p className="text-xs sm:text-sm text-[#5A3720] font-sans max-w-xl">
              Topics are arranged sequentially below according to the NCERT syllabus. Complete lessons
              and practice worksheets to unlock downstream concepts.
            </p>
          </div>

          {/* Quick Study Class Switcher Pills */}
          <div className="flex flex-col gap-1.5 shrink-0 w-full sm:w-auto">
            <span className="text-[11px] font-heading font-extrabold text-[#1E1610] uppercase">
              Switch Study Class:
            </span>
            <div className="flex items-center gap-1.5 bg-[#E8CF9C]/70 p-1.5 border-2 border-[#1E1610] flex-wrap sm:flex-nowrap">
              {([6, 7, 8, 9, 10] as const).map((grade) => (
                <button
                  key={grade}
                  type="button"
                  onClick={() => handleSelectClass(grade)}
                  className={`min-h-[36px] min-w-[36px] sm:min-w-[42px] px-2 text-xs font-heading font-extrabold transition-all cursor-pointer ${
                    studyClass === grade
                      ? "bg-[#6DB33F] text-[#1E1610] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610]"
                      : "bg-[#E8CF9C] text-[#1E1610] hover:bg-[#D9B87A] border-2 border-[#1E1610]"
                  }`}
                >
                  Class {grade}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* View Mode Switcher: Cascade List vs Prerequisite Path Map */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode("cascade")}
            className={`min-h-[40px] px-4 py-1.5 text-xs font-heading font-extrabold border-2 transition-all cursor-pointer ${
              viewMode === "cascade"
                ? "bg-[#6DB33F] text-[#1E1610] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610]"
                : "bg-[#E8CF9C] text-[#1E1610] border-2 border-[#1E1610]"
            }`}
          >
            Topic Cascade List
          </button>
          <button
            type="button"
            onClick={() => setViewMode("pathway")}
            className={`min-h-[40px] px-4 py-1.5 text-xs font-heading font-extrabold border-2 transition-all cursor-pointer ${
              viewMode === "pathway"
                ? "bg-[#6DB33F] text-[#1E1610] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610]"
                : "bg-[#E8CF9C] text-[#1E1610] border-2 border-[#1E1610]"
            }`}
          >
            🗺️ Prerequisite Path Map
          </button>
        </div>

        {viewMode === "pathway" && (
          <ConceptPathway currentLang={currentLang} profile={profile} />
        )}

        {viewMode === "cascade" && (
          <>
        {/* Filter & Search Bar */}
        <div className="panel-plank p-4 border-3 border-[#1E1610] shadow-[3px_3px_0px_#1E1610] flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5A3720]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("practice.searchPlaceholder") || "Search topics or concepts..."}
              className="w-full pl-9 pr-3 py-2 bg-[#E8CF9C] border-3 border-[#1E1610] text-xs font-sans text-[#1E1610] placeholder:text-[#5A3720]/60 focus:outline-none focus:ring-2 focus:ring-[#2F4FB5]"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 bg-[#E8CF9C]/70 p-1 border-2 border-[#1E1610] text-xs font-heading font-bold w-full sm:w-auto overflow-x-auto">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 transition-colors cursor-pointer ${
                statusFilter === "all"
                  ? "bg-[#6DB33F] text-[#1E1610] border-2 border-[#1E1610]"
                  : "text-[#1E1610] hover:bg-[#D9B87A]/50"
              }`}
            >
              {t("practice.allFilter") || "All"} ({allConcepts.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("unlocked")}
              className={`px-3 py-1.5 transition-colors cursor-pointer ${
                statusFilter === "unlocked"
                  ? "bg-[#6DB33F] text-[#1E1610] border-2 border-[#1E1610]"
                  : "text-[#1E1610] hover:bg-[#D9B87A]/50"
              }`}
            >
              {t("tile.available") || "Available"}
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("completed")}
              className={`px-3 py-1.5 transition-colors cursor-pointer ${
                statusFilter === "completed"
                  ? "bg-[#6DB33F] text-[#1E1610] border-2 border-[#1E1610]"
                  : "text-[#1E1610] hover:bg-[#D9B87A]/50"
              }`}
            >
              {t("practice.completedFilter") || "Completed"} ({completedCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("locked")}
              className={`px-3 py-1.5 transition-colors cursor-pointer ${
                statusFilter === "locked"
                  ? "bg-[#6DB33F] text-[#1E1610] border-2 border-[#1E1610]"
                  : "text-[#1E1610] hover:bg-[#D9B87A]/50"
              }`}
            >
              {t("tile.locked") || "Locked"}
            </button>
          </div>
        </div>

        {/* Vertical Cascade of Topics */}
        <div className="space-y-3">
          {filteredConcepts.length === 0 ? (
            <div className="panel-plank p-8 text-center space-y-2 border-3 border-[#1E1610] shadow-[3px_3px_0px_#1E1610]">
              <BookOpen className="w-8 h-8 text-[#5A3720] mx-auto" />
              <p className="font-heading font-bold text-sm text-[#1E1610]">{t("practice.emptySearch") || "No topics match your filter"}</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                }}
                className="text-xs font-heading font-bold text-[#2F4FB5] underline cursor-pointer"
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
                  className={`p-5 border-3 border-[#1E1610] shadow-[3px_3px_0px_#1E1610] transition-all ${
                    isCompleted
                      ? "panel-plank"
                      : isInProgress || isAvailable
                      ? "panel-plank hover:translate-x-[2px]"
                      : "panel-stone opacity-80"
                    }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    {/* Left: Status Icon & Details */}
                    <div className="flex items-start gap-3.5 flex-1">
                      {/* Status Indicator Icon */}
                      <div className="shrink-0 mt-0.5">
                        {isCompleted ? (
                          <div
                            className="w-9 h-9 bg-[#6DB33F] text-[#1E1610] border-2 border-[#1E1610] flex items-center justify-center shadow-[1px_1px_0px_#1E1610]"
                            title="Concept Mastered"
                          >
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                        ) : isInProgress ? (
                          <div
                            className="w-9 h-9 bg-[#F2C230] text-[#1E1610] border-2 border-[#1E1610] flex items-center justify-center shadow-[1px_1px_0px_#1E1610] animate-pulse"
                            title="In Progress"
                          >
                            <Clock className="w-5 h-5" />
                          </div>
                        ) : isAvailable ? (
                          <div
                            className="w-9 h-9 bg-[#8CCB55] text-[#1E1610] border-2 border-[#1E1610] flex items-center justify-center shadow-[1px_1px_0px_#1E1610]"
                            title="Ready to Learn"
                          >
                            <Sparkles className="w-5 h-5" />
                          </div>
                        ) : (
                          <div
                            className="w-9 h-9 bg-[#6B6F76] text-[#F3E3BC] border-2 border-[#1E1610] flex items-center justify-center shadow-[1px_1px_0px_#1E1610]"
                            title="Locked Topic"
                          >
                            <Lock className="w-4 h-4" />
                          </div>
                        )}
                      </div>

                      {/* Content details */}
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[11px] font-heading font-extrabold px-2 py-0.5 bg-[#E8CF9C] border border-[#1E1610] text-[#1E1610]">
                            {concept.chapter || `Class ${studyClass}`}
                          </span>
                          <span className="text-[11px] font-mono text-[#5A3720]">
                            {concept.id}
                          </span>
                          {isCompleted && (
                            <span className="text-[11px] font-heading font-extrabold px-2 py-0.5 bg-[#6DB33F] border border-[#1E1610] text-[#1E1610]">
                              {t("pathway.masteredBadge") || "Mastered"}
                            </span>
                          )}
                          {isInProgress && (
                            <span className="text-[11px] font-heading font-bold px-2 py-0.5 bg-[#F2C230] border border-[#1E1610] text-[#1E1610]">
                              {t("tile.inProgress") || "In Progress"}
                            </span>
                          )}
                          {isAvailable && (
                            <span className="text-[11px] font-heading font-bold px-2 py-0.5 bg-[#8CCB55] border border-[#1E1610] text-[#1E1610]">
                              {t("tile.available") || "Unlocked"}
                            </span>
                          )}
                          {isLocked && (
                            <span className="text-[11px] font-heading font-bold px-2 py-0.5 bg-[#B9BCC0] border border-[#1E1610] text-[#1E1610]">
                              {t("tile.locked") || "Locked"}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h2 className="font-heading font-extrabold text-base text-[#1E1610]">
                          {resolve(concept.name).text}
                        </h2>

                        {/* Objective */}
                        <p className="text-xs text-[#5A3720] font-sans leading-relaxed">
                          {resolve(concept.learningObjective).text}
                        </p>

                        {/* Prerequisite Requirement Message if Locked */}
                        {isLocked && missingPrereqNames.length > 0 && (
                          <div className="pt-1 flex items-center gap-1.5 text-xs font-sans text-[#D1362B]">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>
                              <strong>Prerequisite required:</strong> Complete {missingPrereqNames.join(", ")} to unlock.
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto pt-2 sm:pt-0 border-t-2 sm:border-t-0 border-[#1E1610]/20">
                      {isUnlocked ? (
                        <>
                          <Link
                            href={`/lesson/${concept.id}`}
                            className="flex-1 sm:flex-initial py-2 px-4 bg-[#6DB33F] hover:bg-[#8CCB55] text-[#1E1610] font-heading font-bold text-xs flex items-center justify-center gap-1.5 border-3 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] active:translate-x-[1px] active:translate-y-[1px]"
                          >
                            <span>{t("tile.openLesson") || "Open Lesson"}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                          {isCompleted && (
                            <Link
                              href={`/student/worksheet/${concept.id}`}
                              className="py-2 px-3 bg-[#D9B87A] hover:bg-[#E8CF9C] text-[#1E1610] border-3 border-[#1E1610] font-heading font-bold text-xs flex items-center justify-center gap-1 shadow-[2px_2px_0px_#1E1610] active:translate-x-[1px] active:translate-y-[1px]"
                              title="Practice Worksheet"
                            >
                              <Compass className="w-3.5 h-3.5" />
                              <span className="hidden md:inline">{t("tile.practiceWorksheet") || "Worksheet"}</span>
                            </Link>
                          )}
                        </>
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="flex-1 sm:flex-initial py-2 px-4 bg-[#B9BCC0] text-[#5A3720] font-heading font-bold text-xs flex items-center justify-center gap-1.5 border-2 border-[#1E1610] cursor-not-allowed"
                          title="Complete prerequisites first"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>{t("tile.locked") || "Locked"}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-[1200px] mx-auto px-4 my-6 text-center text-xs font-sans font-medium text-[#5A3720]">
        Margam • Adaptive Mathematics for NCERT Classes 6–10
      </footer>
    </div>
  );
}

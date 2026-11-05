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
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { LearnerProfile, SupportedLanguage } from "@/lib/types";
import {
  getActiveProfile,
  createLearnerProfile,
  updateLearnerStudyClass,
} from "@/lib/storage";
import { syncClassProgression } from "@/lib/progression";
import {
  getChaptersByClass,
  getConceptsByClass,
  getConceptById,
} from "@/lib/curriculum";
import { SkeletonList, SkeletonLine } from "@/components/ui/LoadingSkeleton";

export default function StudentLearnPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>("en");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "unlocked" | "completed" | "locked">("all");

  useEffect(() => {
    let active = getActiveProfile();
    if (!active) {
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
      <div className="min-h-screen py-8 px-4 text-[#2B1B0F] max-w-[1200px] mx-auto space-y-6">
        <div className="bg-[#FFFDF7] p-6 border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] space-y-3">
          <SkeletonLine width="200px" height="24px" className="bg-[#FFE9A8] border-[#2B1B0F]" />
          <SkeletonLine width="320px" height="14px" className="bg-[#2B1B0F]/10 border-[#2B1B0F]/20" />
        </div>
        <SkeletonList count={5} />
      </div>
    );
  }

  const studyClass = (profile.studyClass || profile.selectedClass || 10) as 6 | 7 | 8 | 9 | 10;

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
    <div className="min-h-screen text-[#2B1B0F] flex flex-col justify-between">
      {/* Top Navigation */}
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
        <div className="bg-[#FFFDF7] p-5 sm:p-6 rounded-[2px] border-3 border-[#2B1B0F] shadow-block flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 bg-[#F4C542] border-2 border-[#2B1B0F] shadow-[1px_1px_0px_#2B1B0F] rounded-[2px] text-[10px] font-heading font-extrabold text-[#2B1B0F] uppercase tracking-wide">
                NCERT Curriculum
              </span>
              <span className="px-2.5 py-1 bg-[#FFF7E6] border-2 border-[#2B1B0F] rounded-[2px] text-[10px] font-heading font-bold text-[#2B1B0F]">
                {completedCount} of {allConcepts.length} topics completed
              </span>
            </div>
            <h1 className="text-base sm:text-lg md:text-xl font-pixel text-[#2B1B0F] tracking-tight leading-snug">
              Class {studyClass} maths topics
            </h1>
            <p className="text-xs sm:text-sm text-[#2B1B0F]/90 font-sans max-w-xl">
              Topics follow the NCERT syllabus. Complete lessons and practice worksheets to make next topics available.
            </p>
          </div>

          {/* Quick Study Class Switcher Pills */}
          <div className="flex flex-col gap-1.5 shrink-0 w-full sm:w-auto">
            <span className="text-[10px] font-heading font-bold text-[#2B1B0F]/80 uppercase">
              Switch class:
            </span>
            <div className="flex items-center gap-1.5 bg-[#FFF7E6] p-1.5 rounded-[2px] border-2 border-[#2B1B0F] flex-wrap sm:flex-nowrap">
              {([6, 7, 8, 9, 10] as const).map((grade) => (
                <button
                  key={grade}
                  type="button"
                  onClick={() => handleSelectClass(grade)}
                  className={`min-h-[36px] min-w-[36px] sm:min-w-[42px] px-2 text-xs font-heading font-extrabold rounded-[2px] transition-all cursor-pointer ${
                    studyClass === grade
                      ? "bg-[#5DAA3A] text-white border-2 border-[#2B1B0F] shadow-[1px_1px_0px_#2B1B0F]"
                      : "text-[#2B1B0F] border border-[#2B1B0F]/20 hover:bg-[#F4C542]/30"
                  }`}
                >
                  Class {grade}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-[#FFFDF7] p-3 sm:p-4 rounded-[2px] border-3 border-[#2B1B0F] shadow-block flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#2B1B0F]/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics or concepts..."
              className="w-full pl-9 pr-3 py-2 rounded-[2px] bg-[#FFF7E6] border-2 border-[#2B1B0F] text-xs font-sans text-[#2B1B0F] placeholder:text-[#2B1B0F]/50 focus:outline-none focus:border-[#5DAA3A]"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 bg-[#FFF7E6] p-1 rounded-[2px] border-2 border-[#2B1B0F] text-xs font-heading font-bold w-full sm:w-auto overflow-x-auto">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-[2px] transition-colors cursor-pointer ${
                statusFilter === "all"
                  ? "bg-[#5DAA3A] text-white border border-[#2B1B0F] shadow-[1px_1px_0px_#2B1B0F]"
                  : "text-[#2B1B0F] hover:bg-[#F4C542]/30"
              }`}
            >
              All ({allConcepts.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("unlocked")}
              className={`px-3 py-1.5 rounded-[2px] transition-colors cursor-pointer ${
                statusFilter === "unlocked"
                  ? "bg-[#5DAA3A] text-white border border-[#2B1B0F] shadow-[1px_1px_0px_#2B1B0F]"
                  : "text-[#2B1B0F] hover:bg-[#F4C542]/30"
              }`}
            >
              Available
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("completed")}
              className={`px-3 py-1.5 rounded-[2px] transition-colors cursor-pointer ${
                statusFilter === "completed"
                  ? "bg-[#5DAA3A] text-white border border-[#2B1B0F] shadow-[1px_1px_0px_#2B1B0F]"
                  : "text-[#2B1B0F] hover:bg-[#F4C542]/30"
              }`}
            >
              Completed ({completedCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("locked")}
              className={`px-3 py-1.5 rounded-[2px] transition-colors cursor-pointer ${
                statusFilter === "locked"
                  ? "bg-[#5DAA3A] text-white border border-[#2B1B0F] shadow-[1px_1px_0px_#2B1B0F]"
                  : "text-[#2B1B0F] hover:bg-[#F4C542]/30"
              }`}
            >
              Locked
            </button>
          </div>
        </div>

        {/* Vertical Cascade of Topics */}
        <div className="space-y-3">
          {filteredConcepts.length === 0 ? (
            <div className="bg-[#FFFDF7] p-8 text-center space-y-3 border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F]">
              <div className="w-12 h-12 bg-[#FFE9A8] border-[2px] border-[#2B1B0F] shadow-[2px_2px_0px_#2B1B0F] mx-auto flex items-center justify-center">
                <Search className="w-6 h-6 text-[#2B1B0F]" />
              </div>
              <h2 className="font-heading font-extrabold text-lg text-[#2B1B0F]">
                {searchQuery.trim() ? `Nothing found for ${searchQuery.trim()}.` : "Nothing found."}
              </h2>
              <p className="text-xs sm:text-sm font-sans font-medium text-[#2B1B0F]/80">
                Try checking for another NCERT topic.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                  }}
                  className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 bg-[#5DAA3A] hover:brightness-105 text-[#2B1B0F] border-[2px] border-[#2B1B0F] font-heading font-bold text-xs shadow-[2px_2px_0px_#2B1B0F] cursor-pointer"
                >
                  Clear search
                </button>
              </div>
            </div>
          ) : (
            filteredConcepts.map((concept) => {
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
                  className={`bg-[#FFFDF7] p-4 sm:p-5 rounded-[2px] border-3 border-[#2B1B0F] shadow-block transition-all ${
                    isLocked ? "opacity-75" : ""
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    {/* Left: Status Icon & Details */}
                    <div className="flex items-start gap-3.5 flex-1">
                      {/* Status Indicator Icon */}
                      <div className="shrink-0 mt-0.5">
                        {isCompleted ? (
                          <div
                            className="w-8 h-8 rounded-[2px] bg-[#5DAA3A] text-white border-2 border-[#2B1B0F] shadow-[1px_1px_0px_#2B1B0F] flex items-center justify-center"
                            title="Concept Mastered"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        ) : isInProgress ? (
                          <div
                            className="w-8 h-8 rounded-[2px] bg-[#F4C542] text-[#2B1B0F] border-2 border-[#2B1B0F] shadow-[1px_1px_0px_#2B1B0F] flex items-center justify-center"
                            title="In Progress"
                          >
                            <Clock className="w-4 h-4" />
                          </div>
                        ) : isAvailable ? (
                          <div
                            className="w-8 h-8 rounded-[2px] bg-[#FFF7E6] text-[#2B1B0F] border-2 border-[#2B1B0F] shadow-[1px_1px_0px_#2B1B0F] flex items-center justify-center"
                            title="Ready to Learn"
                          >
                            <Sparkles className="w-4 h-4 text-[#5DAA3A]" />
                          </div>
                        ) : (
                          <div
                            className="w-8 h-8 rounded-[2px] bg-[#E5E0D8] text-[#8B8B8B] border-2 border-[#8B8B8B] flex items-center justify-center"
                            title="Locked Topic"
                          >
                            <Lock className="w-4 h-4" />
                          </div>
                        )}
                      </div>

                      {/* Content details */}
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-heading font-extrabold px-2 py-0.5 rounded-[2px] bg-[#FFF7E6] border border-[#2B1B0F] text-[#2B1B0F]">
                            {concept.chapter || `Class ${studyClass}`}
                          </span>
                          <span className="text-[10px] font-mono text-[#2B1B0F]/60">
                            {concept.id}
                          </span>
                          {isCompleted && (
                            <span className="text-[10px] font-heading font-extrabold px-2 py-0.5 rounded-[2px] bg-[#5DAA3A] text-white border border-[#2B1B0F]">
                              Mastered
                            </span>
                          )}
                          {isInProgress && (
                            <span className="text-[10px] font-heading font-bold px-2 py-0.5 rounded-[2px] bg-[#F4C542] text-[#2B1B0F] border border-[#2B1B0F]">
                              In progress
                            </span>
                          )}
                          {isAvailable && (
                            <span className="text-[10px] font-heading font-bold px-2 py-0.5 rounded-[2px] bg-[#FFF7E6] text-[#2B1B0F] border border-[#2B1B0F]">
                              Available
                            </span>
                          )}
                          {isLocked && (
                            <span className="text-[10px] font-heading font-bold px-2 py-0.5 rounded-[2px] bg-[#E5E0D8] text-[#8B8B8B] border border-[#8B8B8B]">
                              Locked
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h2 className="font-pixel text-xs sm:text-sm text-[#2B1B0F] leading-snug">
                          {concept.name[currentLang] || concept.name.en}
                        </h2>

                        {/* Objective */}
                        <p className="text-xs text-[#2B1B0F]/80 font-sans leading-relaxed">
                          {concept.learningObjective[currentLang] || concept.learningObjective.en}
                        </p>

                        {/* Prerequisite Requirement Message if Locked */}
                        {isLocked && missingPrereqNames.length > 0 && (
                          <div className="pt-1 flex items-center gap-1.5 text-xs font-sans text-[#E04A3F]">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>
                              <strong>Prerequisite needed:</strong> Complete {missingPrereqNames.join(", ")} first.
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#2B1B0F]/20">
                      {isUnlocked ? (
                        <>
                          <Link
                            href={`/lesson/${concept.id}`}
                            className="flex-1 sm:flex-initial py-2 px-4 rounded-[2px] bg-[#5DAA3A] hover:bg-[#4C8D2F] text-white border-2 border-[#2B1B0F] shadow-[2px_2px_0px_#2B1B0F] font-heading font-bold text-xs flex items-center justify-center gap-1.5 active:translate-x-[1px] active:translate-y-[1px] transition-colors cursor-pointer"
                          >
                            <span>Open lesson</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                          {isCompleted && (
                            <Link
                              href={`/student/worksheet/${concept.id}`}
                              className="py-2 px-3 rounded-[2px] bg-[#FFF7E6] hover:bg-[#F4C542] text-[#2B1B0F] border-2 border-[#2B1B0F] shadow-[2px_2px_0px_#2B1B0F] font-heading font-bold text-xs flex items-center justify-center gap-1 active:translate-x-[1px] active:translate-y-[1px] transition-colors cursor-pointer"
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
                          className="flex-1 sm:flex-initial py-2 px-4 rounded-[2px] bg-[#E5E0D8] text-[#8B8B8B] border-2 border-[#8B8B8B] font-heading font-bold text-xs flex items-center justify-center gap-1.5 cursor-not-allowed"
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
      <footer className="max-w-[1200px] mx-auto px-4 my-6 text-center text-xs font-sans font-medium text-[#2B1B0F]/70">
        Margam · Maths for Classes 6-10
      </footer>
    </div>
  );
}

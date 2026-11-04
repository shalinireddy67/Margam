"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Compass,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  RotateCcw,
  BookOpen,
  Search,
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { LearnerProfile, SupportedLanguage } from "@/lib/types";
import {
  getActiveProfile,
  createLearnerProfile,
} from "@/lib/storage";
import { syncClassProgression } from "@/lib/progression";
import {
  getChaptersByClass,
  getConceptsByClass,
} from "@/lib/curriculum";

export default function PracticeHubPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>("en");
  const [filter, setFilter] = useState<"all" | "completed" | "due">("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const active = getActiveProfile();
    if (!active || !active.selectedClass) {
      router.replace("/student/select-class");
      return;
    }
    const synced = syncClassProgression(active);
    setProfile(synced);
    setIsLoaded(true);
  }, [router]);

  useEffect(() => {
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  if (!isLoaded || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-800">
        <div className="glass-panel p-6 rounded-2xl text-center shadow-lg border border-white/70">
          <div className="w-8 h-8 border-3 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="font-heading text-xs text-amber-950">Opening Practice Hub...</p>
        </div>
      </div>
    );
  }

  const studyClass = (profile.studyClass || profile.selectedClass || 10) as 6 | 7 | 8 | 9 | 10;
  const concepts = getConceptsByClass(studyClass);

  const filteredConcepts = concepts.filter((concept) => {
    const tp = profile.topicProgress?.[concept.id];
    const isCompleted = tp?.worksheetCompleted || tp?.status === "completed";
    const isAvailable = tp?.status === "available" || tp?.status === "in_progress" || isCompleted;

    if (filter === "completed" && !isCompleted) return false;
    if (filter === "due" && !(tp?.revisionLevel && tp?.nextRevisionAt && new Date(tp.nextRevisionAt) <= new Date())) {
      if (filter === "due" && !tp) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const name = (concept.name[currentLang] || concept.name.en).toLowerCase();
      return name.includes(q) || concept.id.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="min-h-screen text-slate-800 flex flex-col justify-between">
      {/* Top Floating Glass Navigation */}
      <Navigation
        currentTab="practice"
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        profile={profile}
        showTopBar={true}
      />

      {/* Main Practice Content */}
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full flex-1 space-y-6 has-mobile-nav">
        
        {/* Practice Hub Header */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/80 shadow-[0_12px_40px_rgba(16,42,18,0.1)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100/90 border border-amber-300 text-[10px] font-heading font-extrabold text-amber-900 uppercase tracking-wide">
                Practice questions
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/80 border border-white text-[10px] font-heading font-bold text-slate-700">
                Class {studyClass} Mathematics
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-emerald-950">
              Practice topics
            </h1>
            <p className="text-xs sm:text-sm text-slate-700 font-sans max-w-xl">
              Practice questions picked for you. Earn XP and get helpful hints as you solve.
            </p>
          </div>

          <Link
            href="/student/learn"
            className="py-2.5 px-4 rounded-xl bg-white/80 hover:bg-white text-emerald-900 font-heading font-bold text-xs flex items-center gap-1.5 border border-white shadow-xs transition-colors shrink-0"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>View lessons</span>
          </Link>
        </div>

        {/* Search & Filter */}
        <div className="glass-panel p-4 rounded-2xl border border-white/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search worksheets..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/80 border border-white text-xs font-sans text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-white/70 p-1 rounded-xl border border-white/80 text-xs font-heading font-bold">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filter === "all" ? "bg-amber-600 text-white shadow-xs" : "text-slate-700"
              }`}
            >
              All Topics ({concepts.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("completed")}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filter === "completed" ? "bg-amber-600 text-white shadow-xs" : "text-slate-700"
              }`}
            >
              Practiced
            </button>
          </div>
        </div>

        {/* Worksheet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredConcepts.map((concept) => {
            const tp = profile.topicProgress?.[concept.id];
            const isCompleted = tp?.worksheetCompleted || tp?.status === "completed";
            const scorePercentage =
              tp?.worksheetScore !== undefined && tp?.worksheetTotal
                ? Math.round((tp.worksheetScore / tp.worksheetTotal) * 100)
                : null;
            const isUnlocked = tp?.status === "available" || tp?.status === "in_progress" || isCompleted;

            return (
              <div
                key={concept.id}
                className={`glass-panel p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 ${
                  isUnlocked
                    ? "border-white/80 hover:border-amber-400/80 hover:scale-[1.01]"
                    : "border-slate-200/80 bg-white/50 opacity-75"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-heading font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                      {concept.chapter || `Class ${studyClass}`}
                    </span>
                    {scorePercentage !== null ? (
                      <span className="text-[10px] font-heading font-extrabold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        Best: {scorePercentage}%
                      </span>
                    ) : isUnlocked ? (
                      <span className="text-[10px] font-heading font-bold text-slate-500">
                        Ready to Start
                      </span>
                    ) : (
                      <span className="text-[10px] font-heading font-bold text-slate-400 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    )}
                  </div>

                  <h3 className="font-heading font-extrabold text-sm text-emerald-950">
                    {concept.name[currentLang] || concept.name.en}
                  </h3>
                  <p className="text-xs text-slate-600 font-sans line-clamp-2">
                    {concept.learningObjective[currentLang] || concept.learningObjective.en}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                  {isUnlocked ? (
                    <Link
                      href={`/student/worksheet/${concept.id}`}
                      className="w-full py-2 px-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-heading font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>{scorePercentage !== null ? "Practice Again" : "Start Worksheet"}</span>
                    </Link>
                  ) : (
                    <Link
                      href="/student/learn"
                      className="w-full py-2 px-3.5 rounded-xl bg-slate-200 text-slate-600 font-heading font-bold text-xs flex items-center justify-center gap-1.5"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Unlock in Learn</span>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </main>

      {/* Footer */}
      <footer className="max-w-[1200px] mx-auto px-4 my-6 text-center text-xs font-sans font-medium text-emerald-950/70">
        Margam • Adaptive Mathematics for NCERT Classes 6–10
      </footer>
    </div>
  );
}


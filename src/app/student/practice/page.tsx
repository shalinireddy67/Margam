"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, Compass, Lock, Search } from "lucide-react";
import { LearnerProfile, SupportedLanguage } from "@/lib/types";
import { useLanguage } from "@/contexts/LanguageContext";
import { getActiveProfile } from "@/lib/storage";
import { syncClassProgression } from "@/lib/progression";
import { getConceptsByClass } from "@/lib/curriculum";
import Navigation from "@/components/Navigation";

export default function PracticeDirectoryPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { lang: currentLang, setLang: setCurrentLang, t, resolve } = useLanguage();
  const [filter, setFilter] = useState<"all" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const active = getActiveProfile();
    if (!active) {
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
      <div className="min-h-screen flex items-center justify-center text-[#1E1610] bg-transparent">
        <div
          data-panel="loading"
          className="bg-[#D9B87A]/90 p-6 rounded-xs text-center border-[3px] border-[#1E1610] shadow-[3px_3px_0px_#1E1610]"
        >
          <div className="w-8 h-8 border-[3px] border-[#6DB33F] border-t-transparent rounded-none animate-spin mx-auto mb-2" />
          <p className="font-heading font-extrabold text-xs text-[#1E1610] m-0">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  const studyClass = (profile.studyClass || profile.selectedClass || 10) as 6 | 7 | 8 | 9 | 10;
  const concepts = getConceptsByClass(studyClass);

  const filteredConcepts = concepts.filter((c) => {
    const tp = profile.topicProgress?.[c.id];
    const isCompleted = tp?.worksheetCompleted || tp?.status === "completed";
    if (filter === "completed" && !isCompleted) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const name = resolve(c.name).text.toLowerCase();
      const obj = resolve(c.learningObjective).text.toLowerCase();
      return name.includes(q) || obj.includes(q);
    }
    return true;
  });

  return (
    <div className="min-h-screen text-[#1E1610] bg-transparent flex flex-col justify-between">
      {/* Top Navigation */}
      <Navigation
        currentTab="learn"
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        profile={profile}
        showTopBar={true}
      />

      {/* Main Practice Content */}
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full flex-1 space-y-6 has-mobile-nav">
        
        {/* Practice Hub Header */}
        <div
          data-panel="practice-header"
          className="bg-[#D9B87A]/90 p-6 sm:p-8 rounded-xs border-[3px] border-[#1E1610] shadow-[4px_4px_0px_#1E1610] flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-none bg-[#F2C230] border-2 border-[#1E1610] text-[10px] font-heading font-extrabold text-[#1E1610] uppercase tracking-wide">
                Practice questions
              </span>
              <span className="px-2.5 py-0.5 rounded-none bg-[#E8CF9C] border-2 border-[#1E1610] text-[10px] font-heading font-extrabold text-[#1E1610]">
                Class {studyClass} Mathematics
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#1E1610] m-0">
              Practice topics
            </h1>
            <p className="text-xs sm:text-sm text-[#5A3720] font-sans font-semibold max-w-xl m-0 leading-relaxed">
              {t("practice.subtitle")}
            </p>
          </div>

          <Link
            href="/student/learn"
            className="py-2.5 px-4 rounded-xs bg-[#E8CF9C] hover:bg-[#F3E3BC] text-[#1E1610] font-heading font-extrabold text-xs flex items-center gap-1.5 border-[3px] border-[#1E1610] shadow-[2px_2px_0px_#1E1610] transition-colors shrink-0 no-underline"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#1E1610]" />
            <span>View lessons</span>
          </Link>
        </div>

        {/* Search & Filter */}
        <div
          data-panel="search-bar"
          className="bg-[#D9B87A]/90 p-4 rounded-xs border-[3px] border-[#1E1610] shadow-[3px_3px_0px_#1E1610] flex flex-col sm:flex-row items-center justify-between gap-3"
        >
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6F76]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search worksheets..."
              className="w-full pl-9 pr-3 py-2 rounded-xs bg-[#E8CF9C] border-2 border-[#1E1610] text-xs font-sans font-bold text-[#1E1610] placeholder:text-[#6B6F76] focus:outline-none focus:ring-2 focus:ring-[#2F4FB5]"
            />
          </div>

          <div className="flex items-center gap-1 bg-[#E8CF9C] p-1 rounded-xs border-2 border-[#1E1610] text-xs font-heading font-extrabold">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-none transition-colors cursor-pointer border ${
                filter === "all" ? "bg-[#F2C230] text-[#1E1610] border-[#1E1610] shadow-[1px_1px_0px_#1E1610]" : "text-[#1E1610] border-transparent"
              }`}
            >
              All Topics ({concepts.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("completed")}
              className={`px-3 py-1.5 rounded-none transition-colors cursor-pointer border ${
                filter === "completed" ? "bg-[#F2C230] text-[#1E1610] border-[#1E1610] shadow-[1px_1px_0px_#1E1610]" : "text-[#1E1610] border-transparent"
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
                data-panel="practice-card"
                className={`p-5 rounded-xs border-[3px] border-[#1E1610] transition-all flex flex-col justify-between gap-4 ${
                  isUnlocked
                    ? "bg-[#D9B87A]/90 shadow-[3px_3px_0px_#1E1610]"
                    : "bg-[#B9BCC0]/85 opacity-80 shadow-[2px_2px_0px_#1E1610]"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-heading font-extrabold px-2 py-0.5 rounded-none bg-[#E8CF9C] text-[#1E1610] border border-[#1E1610]">
                      {concept.chapter || `Class ${studyClass}`}
                    </span>
                    {scorePercentage !== null ? (
                      <span className="text-[10px] font-heading font-extrabold px-2 py-0.5 rounded-none bg-[#6DB33F] text-[#1E1610] border border-[#1E1610]">
                        Best: {scorePercentage}%
                      </span>
                    ) : isUnlocked ? (
                      <span className="text-[10px] font-heading font-bold text-[#5A3720]">
                        Ready to Start
                      </span>
                    ) : (
                      <span className="text-[10px] font-heading font-bold text-[#6B6F76] flex items-center gap-1">
                        <Lock className="w-3 h-3 text-[#1E1610]" /> Locked
                      </span>
                    )}
                  </div>

                  <h3 className="font-heading font-extrabold text-sm text-[#1E1610] m-0">
                    {resolve(concept.name).text}
                  </h3>
                  <p className="text-xs text-[#5A3720] font-sans font-medium line-clamp-2 m-0 leading-relaxed">
                    {resolve(concept.learningObjective).text}
                  </p>
                </div>

                <div className="pt-3 border-t-2 border-[#1E1610]/20 flex items-center justify-between">
                  {isUnlocked ? (
                    <Link
                      href={`/student/worksheet/${concept.id}`}
                      className="w-full py-2 px-3.5 rounded-xs bg-[#6DB33F] hover:bg-[#8CCB55] text-[#1E1610] font-heading font-extrabold text-xs flex items-center justify-center gap-1.5 border-[3px] border-[#1E1610] shadow-[2px_2px_0px_#1E1610] transition-colors no-underline"
                    >
                      <Compass className="w-3.5 h-3.5 text-[#1E1610]" />
                      <span>{scorePercentage !== null ? "Practice Again" : "Start Worksheet"}</span>
                    </Link>
                  ) : (
                    <Link
                      href="/student/learn"
                      className="w-full py-2 px-3.5 rounded-xs bg-[#E8CF9C] hover:bg-[#F3E3BC] text-[#1E1610] font-heading font-extrabold text-xs flex items-center justify-center gap-1.5 border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] no-underline"
                    >
                      <Lock className="w-3.5 h-3.5 text-[#1E1610]" />
                      <span>Unlock in Learn</span>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

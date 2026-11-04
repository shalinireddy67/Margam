"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, BookOpen, Target } from "lucide-react";
import { LearnerProfile, SupportedLanguage } from "@/lib/types";
import { useLanguage } from "@/contexts/LanguageContext";
import { getActiveProfile } from "@/lib/storage";
import { syncClassProgression } from "@/lib/progression";
import {
  getChaptersByClass,
  getConceptsByChapter,
  canTakeChapterDiagnostic,
} from "@/lib/curriculum";
import Navigation from "@/components/Navigation";

export default function DiagnosticDirectoryPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { lang: currentLang, setLang: setCurrentLang, t, resolve } = useLanguage();

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
  const chapters = getChaptersByClass(studyClass);

  return (
    <div className="min-h-screen text-[#1E1610] bg-transparent flex flex-col justify-between">
      {/* Top Navigation */}
      <Navigation
        currentTab="diagnostic"
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        profile={profile}
        showTopBar={true}
      />

      {/* Main Diagnostic Content */}
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full flex-1 space-y-6 has-mobile-nav">
        
        {/* Diagnostic Header */}
        <div
          data-panel="diagnostic-header"
          className="bg-[#D9B87A]/90 p-6 sm:p-8 rounded-xs border-[3px] border-[#1E1610] shadow-[4px_4px_0px_#1E1610] flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-none bg-[#78BDE8] border-2 border-[#1E1610] text-[10px] font-heading font-extrabold text-[#1E1610] uppercase tracking-wide">
                Chapter Placement
              </span>
              <span className="px-2.5 py-0.5 rounded-none bg-[#E8CF9C] border-2 border-[#1E1610] text-[10px] font-heading font-extrabold text-[#1E1610]">
                Class {studyClass} Mathematics
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#1E1610] m-0">
              {t("diagnostic.chapterQuickCheck") || "Chapter quick checks"}
            </h1>
            <p className="text-xs sm:text-sm text-[#5A3720] font-sans font-semibold max-w-xl m-0 leading-relaxed">
              Quick checks show how well you know earlier topics. Scoring 70% or higher opens all chapter lessons.
            </p>
          </div>

          <Link
            href="/student/learn"
            className="py-2.5 px-4 rounded-xs bg-[#E8CF9C] hover:bg-[#F3E3BC] text-[#1E1610] font-heading font-extrabold text-xs flex items-center gap-1.5 border-[3px] border-[#1E1610] shadow-[2px_2px_0px_#1E1610] transition-colors shrink-0 no-underline"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#1E1610]" />
            <span>{t("diagnostic.viewAllLessons") || "View all lessons"}</span>
          </Link>
        </div>

        {/* Chapter Diagnostic Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {chapters.map((chapter) => {
            const hasDiagnostic = canTakeChapterDiagnostic(chapter.id);
            const chapterConcepts = getConceptsByChapter(chapter.id);

            return (
              <div
                key={chapter.id}
                data-panel="chapter-diagnostic-card"
                className={`p-5 rounded-xs border-[3px] border-[#1E1610] transition-all flex flex-col justify-between gap-4 ${
                  hasDiagnostic
                    ? "bg-[#D9B87A]/90 shadow-[3px_3px_0px_#1E1610]"
                    : "bg-[#B9BCC0]/85 opacity-90 shadow-[2px_2px_0px_#1E1610]"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-heading font-extrabold px-2 py-0.5 rounded-none bg-[#E8CF9C] text-[#1E1610] border border-[#1E1610]">
                      Chapter {chapter.chapterNumber}
                    </span>
                    {hasDiagnostic ? (
                      <span className="text-[10px] font-heading font-extrabold px-2 py-0.5 rounded-none bg-[#6DB33F] text-[#1E1610] border border-[#1E1610]">
                        Quick check ready
                      </span>
                    ) : (
                      <span className="text-[10px] font-heading font-bold text-[#5A3720]">
                        Learn Direct
                      </span>
                    )}
                  </div>

                  <h3 className="font-heading font-extrabold text-base text-[#1E1610] m-0">
                    {resolve(chapter.name).text}
                  </h3>
                  <p className="text-xs text-[#5A3720] font-sans font-medium m-0">
                    {chapterConcepts.length} Concepts in this chapter syllabus.
                  </p>
                </div>

                <div className="pt-3 border-t-2 border-[#1E1610]/20">
                  {hasDiagnostic ? (
                    <Link
                      href={`/student/diagnostic/${chapter.id}`}
                      className="w-full py-2.5 px-4 rounded-xs bg-[#6DB33F] hover:bg-[#8CCB55] text-[#1E1610] font-heading font-extrabold text-xs flex items-center justify-center gap-2 border-[3px] border-[#1E1610] shadow-[2px_2px_0px_#1E1610] transition-colors no-underline"
                    >
                      <Target className="w-3.5 h-3.5 text-[#1E1610]" />
                      <span>{t("diagnostic.startCheck") || "Start check"}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#1E1610]" />
                    </Link>
                  ) : (
                    <Link
                      href="/student/learn"
                      className="w-full py-2 px-3.5 rounded-xs bg-[#E8CF9C] hover:bg-[#F3E3BC] text-[#1E1610] font-heading font-extrabold text-xs flex items-center justify-center gap-1.5 border-[2px] border-[#1E1610] shadow-[2px_2px_0px_#1E1610] transition-colors no-underline"
                    >
                      <span>{t("tile.openLesson") || "Go to lessons"}</span>
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

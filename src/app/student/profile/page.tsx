"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Edit3,
  Check,
  Save,
  GraduationCap,
  School,
  Lock,
  Sparkles,
  Award,
  Flame,
  ShieldCheck,
  LogOut,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { LearnerProfile, SupportedLanguage } from "@/lib/types";
import {
  getActiveProfile,
  createLearnerProfile,
  updateLearnerNickname,
  updateLearnerStudyClass,
  handleLogout,
} from "@/lib/storage";
import { syncClassProgression } from "@/lib/progression";
import { Companion } from "@/components/ui/Companion";
import { isIstNightTime, getLevelProgress } from "@/lib/xp-config";

export default function StudentProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { lang: currentLang, setLang: setCurrentLang, t, resolve } = useLanguage();

  // Nickname editing state
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [nameSuccess, setNameSuccess] = useState(false);

  // Study Class selector state
  const [chosenStudyClass, setChosenStudyClass] = useState<6 | 7 | 8 | 9 | 10>(10);
  const [savingClass, setSavingClass] = useState(false);
  const [classSuccess, setClassSuccess] = useState(false);

  // General error state
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const active = getActiveProfile();
    if (!active || !active.selectedClass) {
      router.replace("/student/select-class");
      return;
    }
    const synced = syncClassProgression(active);
    setProfile(synced);
    setNameInput(synced.name || "Student");
    setChosenStudyClass((synced.studyClass || synced.selectedClass || 10) as 6 | 7 | 8 | 9 | 10);
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
  const levelInfo = getLevelProgress(profile.xp || 0);

  // Mastery summary stats
  const masteredCount = Object.values(profile.topicProgress || {}).filter(
    (tp) => tp.status === "completed"
  ).length;

  const resolvedGapsCount = profile.resolvedGaps?.length || 0;

  // -----------------------------------------------------------------
  // 1. SAVE NICKNAME
  // -----------------------------------------------------------------
  const handleSaveNickname = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const clean = nameInput.trim();
    if (!clean) {
      setErrorMsg("Nickname cannot be empty.");
      return;
    }

    setSavingName(true);
    try {
      // 1. Update local storage profile immediately
      const updated = updateLearnerNickname(profile, clean);
      setProfile({ ...updated });

      // 2. Sync to cloud profile endpoint if authenticated
      await fetch("/api/student/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: clean }),
      }).catch(() => {
        // Non-blocking in guest/offline mode
      });

      setIsEditingName(false);
      setNameSuccess(true);
      setTimeout(() => setNameSuccess(false), 3000);
    } catch {
      setErrorMsg("Failed to save nickname.");
    } finally {
      setSavingName(false);
    }
  };

  // -----------------------------------------------------------------
  // 2. SAVE STUDY CLASS
  // -----------------------------------------------------------------
  const handleSaveStudyClass = async () => {
    setErrorMsg(null);
    setSavingClass(true);
    try {
      // 1. Update studyClass in local storage, preserving all topicProgress
      const updated = updateLearnerStudyClass(profile, chosenStudyClass);
      const synced = syncClassProgression(updated);
      setProfile({ ...synced });

      // 2. Sync to cloud profile endpoint
      await fetch("/api/student/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studyClass: chosenStudyClass }),
      }).catch(() => {
        // Non-blocking in guest/offline mode
      });

      setClassSuccess(true);
      setTimeout(() => setClassSuccess(false), 3000);
    } catch {
      setErrorMsg("Failed to update daily study class.");
    } finally {
      setSavingClass(false);
    }
  };

  // -----------------------------------------------------------------
  // 3. SECURE LOGOUT
  // -----------------------------------------------------------------
  const handleUserLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    handleLogout();
    router.push("/");
  };

  return (
    <div className="min-h-screen text-[#1E1610] flex flex-col justify-between">
      {/* Top Floating Navigation */}
      <Navigation
        currentTab="profile"
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        profile={profile}
        showTopBar={true}
      />

      {/* Main Profile Content */}
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full flex-1 space-y-6 has-mobile-nav">
        
        {/* Profile Hero Header */}
        <div className="panel-plank p-6 sm:p-8 border-3 border-[#1E1610] shadow-[3px_3px_0px_#1E1610] flex flex-col sm:flex-row items-center gap-6">
          <div className="shrink-0">
            <Companion
              pose={isIstNightTime() ? "sleepy" : "greet"}
              size={72}
              sticker={false}
              alt="Maru companion"
            />
          </div>

          <div className="space-y-1 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="px-2.5 py-0.5 bg-[#8CCB55] border-2 border-[#1E1610] text-[11px] font-heading font-extrabold text-[#1E1610] uppercase tracking-wide">
                {t("profile.title")}
              </span>
              <span className="px-2.5 py-0.5 bg-[#F2C230] border-2 border-[#1E1610] text-[11px] font-heading font-extrabold text-[#1E1610]">
                {levelInfo.rank.badge} {levelInfo.rank.name} Scholar
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#1E1610]">
              {profile.name}
            </h1>
            <p className="text-xs sm:text-sm text-[#5A3720] font-sans">
              Manage your personal nickname, choose your daily NCERT study class, and view your academic achievements.
            </p>
          </div>

          {/* Quick Logout Button */}
          <button
            type="button"
            onClick={handleUserLogout}
            className="py-2 px-4 bg-[#D9B87A] hover:bg-[#E8CF9C] text-[#D1362B] font-heading font-bold text-xs flex items-center gap-1.5 border-3 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none shrink-0 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t("profile.logOut") || "Log Out"}</span>
          </button>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="panel-plank p-3.5 border-3 border-[#D1362B] bg-[#E8CF9C] text-[#D1362B] text-xs font-sans flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#D1362B]" />
            <span>{errorMsg}</span>
          </div>
        )}
        {nameSuccess && (
          <div className="panel-grass p-3.5 border-3 border-[#1E1610] text-[#1E1610] text-xs font-sans flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#1E1610]" />
            <span>Nickname saved.</span>
          </div>
        )}
        {classSuccess && (
          <div className="panel-grass p-3.5 border-3 border-[#1E1610] text-[#1E1610] text-xs font-sans flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#1E1610]" />
            <span>Daily study class switched to Class {chosenStudyClass}! Your previous progress is fully preserved.</span>
          </div>
        )}

        {/* Section A: Nickname Card & Section B: Study Class */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* A. NICKNAME CARD */}
          <div className="panel-plank p-6 sm:p-7 border-3 border-[#1E1610] shadow-[3px_3px_0px_#1E1610] flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 bg-[#6DB33F] text-[#1E1610] border-2 border-[#1E1610] flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-heading font-extrabold text-base text-[#1E1610]">
                      Display Nickname
                    </h2>
                    <p className="text-[11px] text-[#5A3720] font-sans">
                      Used on greetings, companion dialogue, and leaderboard.
                    </p>
                  </div>
                </div>

                {!isEditingName && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingName(true);
                      setNameInput(profile.name);
                    }}
                    className="py-1 px-2.5 bg-[#E8CF9C] hover:bg-[#D9B87A] text-[#1E1610] border-2 border-[#1E1610] font-heading font-bold text-xs flex items-center gap-1 shadow-[2px_2px_0px_#1E1610] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#1E1610]" />
                    <span>{t("profile.edit") || "Edit"}</span>
                  </button>
                )}
              </div>

              {/* Display or Edit Input */}
              {isEditingName ? (
                <form onSubmit={handleSaveNickname} className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-heading font-bold text-[#1E1610] mb-1">
                      Enter New Nickname
                    </label>
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      placeholder="e.g. Arya, ScholarSteve, MathWizard"
                      className="w-full px-3.5 py-2.5 bg-[#E8CF9C] border-3 border-[#1E1610] text-xs font-sans text-[#1E1610] placeholder:text-[#5A3720]/60 focus:outline-none focus:ring-2 focus:ring-[#2F4FB5]"
                      maxLength={60}
                      autoFocus
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      disabled={savingName}
                      className="py-2 px-4 bg-[#6DB33F] hover:bg-[#8CCB55] text-[#1E1610] border-3 border-[#1E1610] font-heading font-bold text-xs flex items-center gap-1.5 shadow-[2px_2px_0px_#1E1610] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{savingName ? t("common.loading") : (t("profile.saveChanges") || "Save Nickname")}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingName(false)}
                      className="py-2 px-3 bg-[#D9B87A] hover:bg-[#E8CF9C] text-[#1E1610] font-heading font-bold text-xs border-3 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
                    >
                      {t("common.cancel") || "Cancel"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-3.5 bg-[#E8CF9C]/70 border-2 border-[#1E1610] flex items-center justify-between">
                  <span className="font-heading font-extrabold text-sm text-[#1E1610]">
                    {profile.name}
                  </span>
                  <span className="text-[10px] font-sans text-[#5A3720]">
                    Active Nickname
                  </span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t-2 border-[#1E1610]/20 text-[11px] text-[#5A3720] font-sans">
              Tip: Your nickname updates everywhere right away.
            </div>
          </div>

          {/* B. STUDY CLASS VS ENROLLED ACADEMIC GRADE */}
          <div className="panel-plank p-6 sm:p-7 border-3 border-[#1E1610] shadow-[3px_3px_0px_#1E1610] flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-[#78BDE8] text-[#1E1610] border-2 border-[#1E1610] flex items-center justify-center">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-heading font-extrabold text-base text-[#1E1610]">
                    Daily Study Class
                  </h2>
                  <p className="text-[11px] text-[#5A3720] font-sans">
                    Choose which NCERT class syllabus you want to learn today.
                  </p>
                </div>
              </div>

              {/* Enrolled Grade Indicator */}
              <div className="p-3 bg-[#E8CF9C]/70 border-2 border-[#1E1610] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-[#5A3720]" />
                  <span className="font-heading font-bold text-[#1E1610]">
                    Registered Academic Grade:
                  </span>
                </div>
                <span className="px-2 py-0.5 bg-[#D9B87A] border-2 border-[#1E1610] font-heading font-extrabold text-[#1E1610]">
                  Class {enrolledClass}
                </span>
              </div>

              {/* Study Class Pill Selector */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-xs font-heading font-bold text-[#1E1610]">
                  Select Study Class (Classes 6–10):
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {([6, 7, 8, 9, 10] as const).map((grade) => (
                    <button
                      key={grade}
                      type="button"
                      onClick={() => setChosenStudyClass(grade)}
                      className={`min-h-[40px] py-2 px-1 text-center font-heading font-extrabold text-xs transition-all cursor-pointer ${
                        chosenStudyClass === grade
                          ? "bg-[#6DB33F] text-[#1E1610] border-3 border-[#1E1610] shadow-[2px_2px_0px_#1E1610]"
                          : "bg-[#E8CF9C] hover:bg-[#D9B87A] text-[#1E1610] border-2 border-[#1E1610]"
                      }`}
                    >
                      Class {grade}
                    </button>
                  ))}
                </div>
              </div>

              {chosenStudyClass !== studyClass && (
                <button
                  type="button"
                  onClick={handleSaveStudyClass}
                  disabled={savingClass}
                  className="w-full py-2.5 px-4 bg-[#6DB33F] hover:bg-[#8CCB55] text-[#1E1610] font-heading font-bold text-xs flex items-center justify-center gap-1.5 border-3 border-[#1E1610] shadow-[3px_3px_0px_#1E1610] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer mt-2"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>
                    {savingClass ? "Switching..." : `Apply Study Class ${chosenStudyClass}`}
                  </span>
                </button>
              )}
            </div>

            <div className="pt-3 border-t-2 border-[#1E1610]/20 text-[11px] text-[#5A3720] font-sans">
              Switching your study class never resets or deletes your completed lessons, mastery records, or streak.
            </div>
          </div>
        </div>

        {/* Section C: Learning Progress Summary */}
        <div className="panel-plank p-6 sm:p-8 border-3 border-[#1E1610] shadow-[3px_3px_0px_#1E1610] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-heading font-extrabold text-[#1E1610]">
              Academic Learning Summary
            </h2>
            <Link
              href="/student/learn"
              className="text-xs font-heading font-bold text-[#1E1610] hover:text-[#2F4FB5] flex items-center gap-1"
            >
              <span>{t("profile.exploreCurriculum") || "Explore Curriculum"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-[#E8CF9C]/70 border-2 border-[#1E1610] text-center space-y-1">
              <span className="text-2xl font-heading font-extrabold text-[#1E1610]">
                {masteredCount}
              </span>
              <p className="text-xs font-heading font-bold text-[#1E1610]">
                Topics Mastered
              </p>
              <p className="text-[10px] text-[#5A3720] font-sans">NCERT Curriculum</p>
            </div>

            <div className="p-4 bg-[#E8CF9C]/70 border-2 border-[#1E1610] text-center space-y-1">
              <span className="text-2xl font-heading font-extrabold text-[#2F4FB5]">
                {resolvedGapsCount}
              </span>
              <p className="text-xs font-heading font-bold text-[#1E1610]">
                Gaps Resolved
              </p>
              <p className="text-[10px] text-[#5A3720] font-sans">Diagnostic Backtracks</p>
            </div>

            <div className="p-4 bg-[#E8CF9C]/70 border-2 border-[#1E1610] text-center space-y-1">
              <span className="text-2xl font-heading font-extrabold text-[#5A3720]">
                {profile.xp || 0}
              </span>
              <p className="text-xs font-heading font-bold text-[#1E1610]">
                Total XP Earned
              </p>
              <p className="text-[10px] text-[#5A3720] font-sans">Level {levelInfo.level}</p>
            </div>

            <div className="p-4 bg-[#E8CF9C]/70 border-2 border-[#1E1610] text-center space-y-1">
              <span className="text-2xl font-heading font-extrabold text-[#1E1610]">
                {profile.streak?.current || 0}d
              </span>
              <p className="text-xs font-heading font-bold text-[#1E1610]">
                Daily Streak
              </p>
              <p className="text-[10px] text-[#5A3720] font-sans">Longest: {profile.streak?.longest || 0}d</p>
            </div>
          </div>
        </div>

        {/* Section D: Privacy and Account Safety */}
        <div className="panel-plank p-6 border-3 border-[#1E1610] shadow-[3px_3px_0px_#1E1610] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#6DB33F] text-[#1E1610] border-2 border-[#1E1610] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-xs text-[#1E1610]">
                Privacy-Protected Student Session
              </h3>
              <p className="text-[11px] text-[#5A3720] font-sans">
                Margam does not collect email or phone numbers for student accounts. All progress is tied safely to your account.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleUserLogout}
            className="w-full sm:w-auto py-2 px-4 bg-[#D9B87A] hover:bg-[#E8CF9C] text-[#D1362B] font-heading font-bold text-xs flex items-center justify-center gap-1.5 border-3 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t("profile.logOut") || "Sign Out of Margam"}</span>
          </button>
        </div>

      </main>

      {/* Footer */}
      <footer className="max-w-[1200px] mx-auto px-4 my-6 text-center text-xs font-sans font-medium text-[#5A3720]">
        Margam • Adaptive Mathematics for NCERT Classes 6–10
      </footer>
    </div>
  );
}

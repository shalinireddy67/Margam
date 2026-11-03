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
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>("en");

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
    let active = getActiveProfile();
    if (!active) {
      active = createLearnerProfile("Student", 10);
    }
    const synced = syncClassProgression(active);
    setProfile(synced);
    setNameInput(synced.name || "Student");
    setChosenStudyClass((synced.studyClass || synced.selectedClass || 10) as 6 | 7 | 8 | 9 | 10);
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
          <p className="font-heading text-xs text-emerald-950">Loading Profile...</p>
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
    } catch (err: any) {
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
    <div className="min-h-screen text-slate-800 flex flex-col justify-between">
      {/* Top Floating Glass Navigation */}
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
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/80 shadow-[0_12px_40px_rgba(16,42,18,0.1)] flex flex-col sm:flex-row items-center gap-6">
          <div className="p-3 rounded-2xl bg-white/80 border border-white/90 shadow-xs shrink-0">
            <Companion
              pose={isIstNightTime() ? "sleepy" : "greet"}
              size={72}
              sticker={false}
              alt="Maru companion"
            />
          </div>

          <div className="space-y-1 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100/90 border border-emerald-300 text-[10px] font-heading font-extrabold text-emerald-900 uppercase tracking-wide">
                Student Profile
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100/90 border border-amber-300 text-[10px] font-heading font-extrabold text-amber-900">
                {levelInfo.rank.badge} {levelInfo.rank.name} Scholar
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-emerald-950">
              {profile.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-sans">
              Manage your personal nickname, choose your daily NCERT study class, and view your academic achievements.
            </p>
          </div>

          {/* Quick Logout Button */}
          <button
            type="button"
            onClick={handleUserLogout}
            className="py-2 px-4 rounded-xl bg-white/70 hover:bg-white text-rose-700 hover:text-rose-900 font-heading font-bold text-xs flex items-center gap-1.5 border border-white/80 transition-all shadow-xs shrink-0 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="glass-panel p-3.5 rounded-2xl border border-rose-300 bg-rose-50/90 text-rose-800 text-xs font-sans flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}
        {nameSuccess && (
          <div className="glass-panel p-3.5 rounded-2xl border border-emerald-300 bg-emerald-50/90 text-emerald-800 text-xs font-sans flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>Nickname successfully updated across the realm!</span>
          </div>
        )}
        {classSuccess && (
          <div className="glass-panel p-3.5 rounded-2xl border border-emerald-300 bg-emerald-50/90 text-emerald-800 text-xs font-sans flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>Daily study class switched to Class {chosenStudyClass}! Your previous progress is fully preserved.</span>
          </div>
        )}

        {/* Section A: Nickname Card & Section B: Study Class */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* A. NICKNAME CARD */}
          <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-white/80 shadow-[0_8px_32px_rgba(16,42,18,0.08)] flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-heading font-extrabold text-base text-emerald-950">
                      Display Nickname
                    </h2>
                    <p className="text-[11px] text-slate-500 font-sans">
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
                    className="py-1 px-2.5 rounded-lg bg-white/70 hover:bg-white text-emerald-900 border border-white font-heading font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Edit</span>
                  </button>
                )}
              </div>

              {/* Display or Edit Input */}
              {isEditingName ? (
                <form onSubmit={handleSaveNickname} className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-heading font-bold text-emerald-950 mb-1">
                      Enter New Nickname
                    </label>
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      placeholder="e.g. Arya, ScholarSteve, MathWizard"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-emerald-400 text-xs font-sans text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
                      maxLength={60}
                      autoFocus
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      disabled={savingName}
                      className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{savingName ? "Saving..." : "Save Nickname"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingName(false)}
                      className="py-2 px-3 rounded-xl bg-white/70 hover:bg-white text-slate-700 font-heading font-bold text-xs border border-white shadow-xs cursor-pointer transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-3.5 rounded-2xl bg-white/70 border border-white/80 flex items-center justify-between">
                  <span className="font-heading font-extrabold text-sm text-emerald-950">
                    {profile.name}
                  </span>
                  <span className="text-[10px] font-sans text-slate-500">
                    Active Nickname
                  </span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-200/60 text-[11px] text-slate-500 font-sans">
              Tip: Your nickname updates everywhere across the realm immediately.
            </div>
          </div>

          {/* B. STUDY CLASS VS ENROLLED ACADEMIC GRADE */}
          <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-white/80 shadow-[0_8px_32px_rgba(16,42,18,0.08)] flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-cyan-600 text-white flex items-center justify-center shadow-xs">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-heading font-extrabold text-base text-emerald-950">
                    Daily Study Class
                  </h2>
                  <p className="text-[11px] text-slate-500 font-sans">
                    Choose which NCERT class syllabus you want to learn today.
                  </p>
                </div>
              </div>

              {/* Enrolled Grade Indicator */}
              <div className="p-3 rounded-2xl bg-slate-100/80 border border-slate-200/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  <span className="font-heading font-bold text-slate-800">
                    Registered Academic Grade:
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-slate-200 font-heading font-extrabold text-slate-900">
                  Class {enrolledClass}
                </span>
              </div>

              {/* Study Class Pill Selector */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-xs font-heading font-bold text-emerald-950">
                  Select Study Class (Classes 6–10):
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {([6, 7, 8, 9, 10] as const).map((grade) => (
                    <button
                      key={grade}
                      type="button"
                      onClick={() => setChosenStudyClass(grade)}
                      className={`min-h-[40px] py-2 px-1 text-center font-heading font-extrabold text-xs rounded-xl transition-all cursor-pointer border ${
                        chosenStudyClass === grade
                          ? "bg-emerald-600 text-white border-emerald-700 shadow-sm scale-105"
                          : "bg-white/80 hover:bg-white text-slate-700 border-white/80 hover:border-emerald-300"
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
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer mt-2"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>
                    {savingClass ? "Switching..." : `Apply Study Class ${chosenStudyClass}`}
                  </span>
                </button>
              )}
            </div>

            <div className="pt-3 border-t border-slate-200/60 text-[11px] text-slate-500 font-sans">
              Switching your study class never resets or deletes your completed lessons, mastery records, or streak.
            </div>
          </div>
        </div>

        {/* Section C: Learning Progress Summary */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/80 shadow-[0_12px_40px_rgba(16,42,18,0.1)] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-heading font-extrabold text-emerald-950">
              Academic Learning Summary
            </h2>
            <Link
              href="/student/learn"
              className="text-xs font-heading font-bold text-emerald-700 hover:underline flex items-center gap-1"
            >
              <span>Explore Curriculum</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white/70 border border-white/80 text-center space-y-1">
              <span className="text-2xl font-heading font-extrabold text-emerald-700">
                {masteredCount}
              </span>
              <p className="text-xs font-heading font-bold text-emerald-950">
                Topics Mastered
              </p>
              <p className="text-[10px] text-slate-500 font-sans">NCERT Curriculum</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/70 border border-white/80 text-center space-y-1">
              <span className="text-2xl font-heading font-extrabold text-cyan-700">
                {resolvedGapsCount}
              </span>
              <p className="text-xs font-heading font-bold text-emerald-950">
                Gaps Resolved
              </p>
              <p className="text-[10px] text-slate-500 font-sans">Diagnostic Backtracks</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/70 border border-white/80 text-center space-y-1">
              <span className="text-2xl font-heading font-extrabold text-amber-600">
                {profile.xp || 0}
              </span>
              <p className="text-xs font-heading font-bold text-emerald-950">
                Total XP Earned
              </p>
              <p className="text-[10px] text-slate-500 font-sans">Level {levelInfo.level}</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/70 border border-white/80 text-center space-y-1">
              <span className="text-2xl font-heading font-extrabold text-purple-700">
                {profile.streak?.current || 0}d
              </span>
              <p className="text-xs font-heading font-bold text-emerald-950">
                Daily Streak
              </p>
              <p className="text-[10px] text-slate-500 font-sans">Longest: {profile.streak?.longest || 0}d</p>
            </div>
          </div>
        </div>

        {/* Section D: Privacy and Account Safety */}
        <div className="glass-panel p-6 rounded-3xl border border-white/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-xs text-emerald-950">
                Privacy-Protected Student Session
              </h3>
              <p className="text-[11px] text-slate-600 font-sans">
                Margam does not collect email or phone numbers for student accounts. All progress is tied safely to your account.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleUserLogout}
            className="w-full sm:w-auto py-2 px-4 rounded-xl bg-white/80 hover:bg-white text-rose-700 font-heading font-bold text-xs flex items-center justify-center gap-1.5 border border-white shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out of Margam</span>
          </button>
        </div>

      </main>

      {/* Footer */}
      <footer className="max-w-[1200px] mx-auto px-4 my-6 text-center text-xs font-sans font-medium text-emerald-950/70">
        Margam • Adaptive Mathematics for NCERT Classes 6–10
      </footer>
    </div>
  );
}


"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  GraduationCap,
  Save,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  LogOut,
  Edit3,
  Lock,
} from "lucide-react";
import { SupportedLanguage, LearnerProfile } from "@/lib/types";
import { getActiveProfile, saveProfile } from "@/lib/storage";
import { Navigation } from "@/components/Navigation";
import { getLevelProgress } from "@/lib/xp-config";

export default function StudentProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>("en");
  const [isLoaded, setIsLoaded] = useState(false);

  // Edit states
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [nameSuccess, setNameSuccess] = useState(false);

  // Study Class switcher state
  const [chosenStudyClass, setChosenStudyClass] = useState<6 | 7 | 8 | 9 | 10>(10);
  const [savingClass, setSavingClass] = useState(false);
  const [classSuccess, setClassSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const p = getActiveProfile();
    if (p) {
      setProfile(p);
      setNameInput(p.name);
      setChosenStudyClass(p.selectedClass as 6 | 7 | 8 | 9 | 10);
    }
    const savedLang = (localStorage.getItem("margam_language") as SupportedLanguage) || "en";
    setCurrentLang(savedLang);
    setIsLoaded(true);
  }, []);

  const handleLanguageChange = (lang: SupportedLanguage) => {
    setCurrentLang(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("margam_language", lang);
    }
  };

  const handleSaveNickname = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    const trimmed = nameInput.trim();
    if (!trimmed) {
      setErrorMsg("Nickname cannot be empty.");
      return;
    }

    setSavingName(true);
    setErrorMsg(null);
    setNameSuccess(false);

    try {
      // 1. Try server PATCH update if authenticated
      await fetch("/api/student/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: trimmed }),
      });

      // 2. Update local state
      const updated: LearnerProfile = { ...profile, name: trimmed };
      saveProfile(updated);
      setProfile(updated);
      setIsEditingName(false);
      setNameSuccess(true);
      setTimeout(() => setNameSuccess(false), 3000);
    } catch (err: any) {
      console.warn("Server nickname update failed; updated locally:", err.message);
      const updated: LearnerProfile = { ...profile, name: trimmed };
      saveProfile(updated);
      setProfile(updated);
      setIsEditingName(false);
      setNameSuccess(true);
      setTimeout(() => setNameSuccess(false), 3000);
    } finally {
      setSavingName(false);
    }
  };

  const handleSaveStudyClass = async () => {
    if (!profile) return;
    setSavingClass(true);
    setErrorMsg(null);
    setClassSuccess(false);

    try {
      // 1. Server PATCH update if authenticated
      await fetch("/api/student/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studyClass: chosenStudyClass }),
      });

      // 2. Local update
      const updated: LearnerProfile = { ...profile, selectedClass: chosenStudyClass };
      saveProfile(updated);
      setProfile(updated);
      setClassSuccess(true);
      setTimeout(() => setClassSuccess(false), 3500);
    } catch (err: any) {
      console.warn("Server study class update failed; updated locally:", err.message);
      const updated: LearnerProfile = { ...profile, selectedClass: chosenStudyClass };
      saveProfile(updated);
      setProfile(updated);
      setClassSuccess(true);
      setTimeout(() => setClassSuccess(false), 3500);
    } finally {
      setSavingClass(false);
    }
  };

  const handleUserLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      // Ignore network errors on logout
    }
    router.push("/login?role=student");
  };

  if (!isLoaded || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-[#FFFDF7] p-6 border-3 border-[#2B1B0F] shadow-block rounded-[2px] text-center max-w-sm w-full space-y-3">
          <p className="font-pixel text-xs text-[#2B1B0F] animate-pulse">Loading profile...</p>
        </div>
      </div>
    );
  }

  const studyClass = profile.selectedClass as 6 | 7 | 8 | 9 | 10;
  const enrolledClass = (profile as any).enrolledClass?.grade || studyClass;
  const levelInfo = getLevelProgress(profile.xp || 0);

  // Compute stats
  const masteredCount = Object.values(profile.topicProgress || {}).filter(
    (p) => p.status === "completed"
  ).length;
  const resolvedGapsCount = profile.resolvedGaps?.length || 0;

  return (
    <div className="min-h-screen text-[#2B1B0F] flex flex-col justify-between">
      {/* Navigation */}
      <Navigation
        currentTab="profile"
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        profile={profile}
        showTopBar={true}
      />

      {/* Main Profile Content */}
      <main id="main-content" className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full flex-1 space-y-6 has-mobile-nav">
        
        {/* Profile Hero Header */}
        <div className="bg-[#FFFDF7] p-6 sm:p-8 border-3 border-[#2B1B0F] border-t-4 border-t-[#5DAA3A] shadow-block rounded-[2px] flex flex-col sm:flex-row items-center gap-6">
          <div className="space-y-1 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="px-2.5 py-0.5 bg-[#5DAA3A] text-white border border-[#2B1B0F] text-[10px] font-pixel uppercase tracking-wide rounded-[2px]">
                Student Profile
              </span>
              <span className="px-2.5 py-0.5 bg-[#F4C542] text-[#2B1B0F] border border-[#2B1B0F] text-[10px] font-pixel rounded-[2px]">
                {levelInfo.rank.badge} {levelInfo.rank.name}, level {levelInfo.level}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-pixel text-[#2B1B0F] mt-2">
              {profile.name}
            </h1>
            <p className="text-xs sm:text-sm text-[#2B1B0F]/80 font-sans">
              Manage your personal nickname, choose your daily NCERT study class, and view your academic achievements.
            </p>
          </div>

          {/* Quick Logout Button */}
          <button
            type="button"
            onClick={handleUserLogout}
            className="py-2 px-4 rounded-[2px] bg-[#FFF7E6] hover:bg-[#F4C542] text-[#E04A3F] hover:text-[#B8322B] font-heading font-bold text-xs flex items-center gap-1.5 border-2 border-[#2B1B0F] shadow-[2px_2px_0px_#2B1B0F] active:translate-x-[1px] active:translate-y-[1px] transition-all shrink-0 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign out</span>
          </button>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="p-3.5 rounded-[2px] border-2 border-[#E04A3F] bg-[#FFF7E6] text-[#E04A3F] text-xs font-sans flex items-center gap-2 shadow-[2px_2px_0px_#2B1B0F]">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#E04A3F]" />
            <span>{errorMsg}</span>
          </div>
        )}
        {nameSuccess && (
          <div className="p-3.5 rounded-[2px] border-2 border-[#5DAA3A] bg-[#FFF7E6] text-[#2F6B22] text-xs font-sans flex items-center gap-2 shadow-[2px_2px_0px_#2B1B0F]">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#5DAA3A]" />
            <span>Nickname updated.</span>
          </div>
        )}
        {classSuccess && (
          <div className="p-3.5 rounded-[2px] border-2 border-[#5DAA3A] bg-[#FFF7E6] text-[#2F6B22] text-xs font-sans flex items-center gap-2 shadow-[2px_2px_0px_#2B1B0F]">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#5DAA3A]" />
            <span>Daily study class switched to Class {chosenStudyClass}! Your previous progress is fully preserved.</span>
          </div>
        )}

        {/* Section A: Nickname Card & Section B: Study Class */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* A. NICKNAME CARD */}
          <div className="bg-[#FFFDF7] p-6 sm:p-7 border-3 border-[#2B1B0F] shadow-block rounded-[2px] flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-[2px] bg-[#5DAA3A] text-white flex items-center justify-center border border-[#2B1B0F] shadow-[1px_1px_0px_#2B1B0F]">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-pixel text-xs sm:text-sm text-[#2B1B0F]">
                      Display Nickname
                    </h2>
                    <p className="text-[11px] text-[#2B1B0F]/70 font-sans">
                      Used on greetings and class leaderboard.
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
                    className="py-1 px-2.5 rounded-[2px] bg-[#FFF7E6] hover:bg-[#F4C542] text-[#2B1B0F] border-2 border-[#2B1B0F] font-heading font-bold text-xs flex items-center gap-1 shadow-[2px_2px_0px_#2B1B0F] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#5DAA3A]" />
                    <span>Edit</span>
                  </button>
                )}
              </div>

              {/* Display or Edit Input */}
              {isEditingName ? (
                <form onSubmit={handleSaveNickname} className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-pixel text-[#2B1B0F] mb-1">
                      Enter New Nickname
                    </label>
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      placeholder="e.g. Arya, Steve, Student1"
                      className="w-full px-3.5 py-2.5 rounded-[2px] bg-white border-2 border-[#2B1B0F] text-xs font-sans text-[#2B1B0F] focus:outline-none focus:ring-2 focus:ring-[#5DAA3A] shadow-[2px_2px_0px_#2B1B0F]"
                      maxLength={60}
                      autoFocus
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      disabled={savingName}
                      className="py-2 px-4 rounded-[2px] bg-[#5DAA3A] hover:brightness-105 text-white font-heading font-bold text-xs flex items-center gap-1.5 border-2 border-[#2B1B0F] shadow-[2px_2px_0px_#2B1B0F] active:translate-x-[1px] active:translate-y-[1px] transition-colors cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{savingName ? "Saving..." : "Save Nickname"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingName(false)}
                      className="py-2 px-3 rounded-[2px] bg-[#FFF7E6] hover:bg-[#F4C542] text-[#2B1B0F] font-heading font-bold text-xs border-2 border-[#2B1B0F] shadow-[2px_2px_0px_#2B1B0F] cursor-pointer transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-3.5 rounded-[2px] bg-[#FFF7E6] border-2 border-[#2B1B0F] flex items-center justify-between">
                  <span className="font-pixel text-xs text-[#2B1B0F]">
                    {profile.name}
                  </span>
                  <span className="text-[10px] font-pixel text-[#5DAA3A]">
                    Active
                  </span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#2B1B0F]/20 text-[11px] text-[#2B1B0F]/70 font-sans">
              Tip: Your nickname updates across your dashboard immediately.
            </div>
          </div>

          {/* B. STUDY CLASS VS ENROLLED ACADEMIC GRADE */}
          <div className="bg-[#FFFDF7] p-6 sm:p-7 border-3 border-[#2B1B0F] shadow-block rounded-[2px] flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-[2px] bg-[#3FA7C9] text-white flex items-center justify-center border border-[#2B1B0F] shadow-[1px_1px_0px_#2B1B0F]">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-pixel text-xs sm:text-sm text-[#2B1B0F]">
                    Daily Study Class
                  </h2>
                  <p className="text-[11px] text-[#2B1B0F]/70 font-sans">
                    Choose which NCERT class syllabus you want to learn today.
                  </p>
                </div>
              </div>

              {/* Enrolled Grade Indicator */}
              <div className="p-3 rounded-[2px] bg-[#FFF7E6] border-2 border-[#2B1B0F] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-[#2B1B0F]/60" />
                  <span className="font-heading font-bold text-[#2B1B0F]">
                    Registered Academic Grade:
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-[2px] bg-[#F4C542] border border-[#2B1B0F] font-pixel text-[10px] text-[#2B1B0F]">
                  Class {enrolledClass}
                </span>
              </div>

              {/* Study Class Button Selector */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-xs font-pixel text-[#2B1B0F]">
                  Select Study Class:
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {([6, 7, 8, 9, 10] as const).map((grade) => (
                    <button
                      key={grade}
                      type="button"
                      onClick={() => setChosenStudyClass(grade)}
                      className={`min-h-[40px] py-2 px-1 text-center font-pixel text-[10px] rounded-[2px] transition-all cursor-pointer border-2 ${
                        chosenStudyClass === grade
                          ? "bg-[#5DAA3A] text-white border-[#2B1B0F] shadow-[2px_2px_0px_#2B1B0F] scale-105"
                          : "bg-[#FFF7E6] hover:bg-[#F4C542] text-[#2B1B0F] border-[#2B1B0F]"
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
                  className="w-full py-2.5 px-4 rounded-[2px] bg-[#5DAA3A] hover:brightness-105 text-white font-heading font-bold text-xs flex items-center justify-center gap-1.5 border-2 border-[#2B1B0F] shadow-[2px_2px_0px_#2B1B0F] active:translate-x-[1px] active:translate-y-[1px] transition-colors cursor-pointer mt-2"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>
                    {savingClass ? "Switching..." : `Apply Study Class ${chosenStudyClass}`}
                  </span>
                </button>
              )}
            </div>

            <div className="pt-3 border-t border-[#2B1B0F]/20 text-[11px] text-[#2B1B0F]/70 font-sans">
              Switching your study class never resets or deletes your completed lessons, mastery records, or streak.
            </div>
          </div>
        </div>

        {/* Section C: Learning Progress Summary */}
        <div className="bg-[#FFFDF7] p-6 sm:p-8 border-3 border-[#2B1B0F] shadow-block rounded-[2px] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-pixel text-[#2B1B0F]">
              Academic Learning Summary
            </h2>
            <Link
              href="/student/learn"
              className="text-xs font-heading font-bold text-[#5DAA3A] hover:underline flex items-center gap-1"
            >
              <span>View lessons</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-[2px] bg-[#FFF7E6] border-2 border-[#2B1B0F] shadow-[2px_2px_0px_#2B1B0F] text-center space-y-1">
              <span className="text-xl sm:text-2xl font-pixel text-[#5DAA3A] block">
                {masteredCount}
              </span>
              <p className="text-xs font-heading font-bold text-[#2B1B0F]">
                Topics Mastered
              </p>
              <p className="text-[10px] text-[#2B1B0F]/70 font-sans">NCERT Curriculum</p>
            </div>

            <div className="p-4 rounded-[2px] bg-[#FFF7E6] border-2 border-[#2B1B0F] shadow-[2px_2px_0px_#2B1B0F] text-center space-y-1">
              <span className="text-xl sm:text-2xl font-pixel text-[#3FA7C9] block">
                {resolvedGapsCount}
              </span>
              <p className="text-xs font-heading font-bold text-[#2B1B0F]">
                Gaps Resolved
              </p>
              <p className="text-[10px] text-[#2B1B0F]/70 font-sans">Diagnostic Backtracks</p>
            </div>

            <div className="p-4 rounded-[2px] bg-[#FFF7E6] border-2 border-[#2B1B0F] shadow-[2px_2px_0px_#2B1B0F] text-center space-y-1">
              <span className="text-xl sm:text-2xl font-pixel text-[#F4C542] block">
                {profile.xp || 0}
              </span>
              <p className="text-xs font-heading font-bold text-[#2B1B0F]">
                Total XP Earned
              </p>
              <p className="text-[10px] text-[#2B1B0F]/70 font-sans">Level {levelInfo.level}</p>
            </div>

            <div className="p-4 rounded-[2px] bg-[#FFF7E6] border-2 border-[#2B1B0F] shadow-[2px_2px_0px_#2B1B0F] text-center space-y-1">
              <span className="text-xl sm:text-2xl font-pixel text-[#E04A3F] block">
                {profile.streak?.current || 0}d
              </span>
              <p className="text-xs font-heading font-bold text-[#2B1B0F]">
                Daily Streak
              </p>
              <p className="text-[10px] text-[#2B1B0F]/70 font-sans">Longest: {profile.streak?.longest || 0}d</p>
            </div>
          </div>
        </div>

        {/* Section D: Privacy and Account Safety */}
        <div className="bg-[#FFFDF7] p-6 rounded-[2px] border-3 border-[#2B1B0F] shadow-block flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[2px] bg-[#5DAA3A] text-white border border-[#2B1B0F] flex items-center justify-center shrink-0 shadow-[1px_1px_0px_#2B1B0F]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-pixel text-xs text-[#2B1B0F]">
                Privacy-Protected Student Session
              </h3>
              <p className="text-[11px] text-[#2B1B0F]/80 font-sans">
                Margam does not collect email or phone numbers for student accounts. All progress is tied safely to your account.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleUserLogout}
            className="w-full sm:w-auto py-2 px-4 rounded-[2px] bg-[#FFF7E6] hover:bg-[#F4C542] text-[#E04A3F] font-heading font-bold text-xs flex items-center justify-center gap-1.5 border-2 border-[#2B1B0F] shadow-[2px_2px_0px_#2B1B0F] active:translate-x-[1px] active:translate-y-[1px] transition-colors cursor-pointer shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out of Margam</span>
          </button>
        </div>

      </main>

      {/* Footer */}
      <footer className="max-w-[1200px] mx-auto px-4 my-6 text-center text-xs font-sans font-medium text-[#2B1B0F]/70">
        Margam · Maths for Classes 6-10
      </footer>
    </div>
  );
}

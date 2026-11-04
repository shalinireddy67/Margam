"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LearnerProfile } from "@/lib/types";
import {
  getActiveProfile,
  createLearnerProfile,
  updateLearnerStudyClass,
  updateLearnerNickname,
} from "@/lib/storage";
import { syncClassProgression } from "@/lib/progression";

interface GradeOption {
  grade: 6 | 7 | 8 | 9 | 10;
  title: string;
  book: string;
  desc: string;
}

const GRADE_OPTIONS: GradeOption[] = [
  {
    grade: 6,
    title: "Class 6",
    book: "Ganita Prakash",
    desc: "Patterns, number line, negative numbers, fractions, perimeter & area.",
  },
  {
    grade: 7,
    title: "Class 7",
    book: "Ganita Prakash",
    desc: "Integer operations, algebraic expressions, linear equations, ratio & proportion.",
  },
  {
    grade: 8,
    title: "Class 8",
    book: "Ganita Prakash",
    desc: "Rational numbers, linear equations in one variable, quadrilaterals, algebraic identities.",
  },
  {
    grade: 9,
    title: "Class 9",
    book: "Ganita Manjari",
    desc: "Real numbers, polynomials, coordinate geometry, linear equations in two variables.",
  },
  {
    grade: 10,
    title: "Class 10",
    book: "Mathematics",
    desc: "Real numbers, quadratic equations, polynomials, arithmetic progressions, trigonometry.",
  },
];

export default function SelectClassPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [name, setName] = useState("");
  const [selectedGrade, setSelectedGrade] = useState<6 | 7 | 8 | 9 | 10>(10);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const active = getActiveProfile();
    if (active) {
      setProfile(active);
      setName(active.name || "");
      setSelectedGrade(
        (active.studyClass || active.selectedClass || 10) as 6 | 7 | 8 | 9 | 10
      );
    }
    setIsLoaded(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanName = name.trim();
    if (!cleanName && !profile) {
      setErrorMsg("Please enter your name or nickname to continue.");
      return;
    }

    if (profile) {
      // Update existing profile
      let updated = updateLearnerStudyClass(profile, selectedGrade);
      if (cleanName && cleanName !== profile.name) {
        updated = updateLearnerNickname(updated, cleanName);
      }
      syncClassProgression(updated);
      router.push("/student");
    } else {
      // Create new profile with user-chosen name and class
      const newProf = createLearnerProfile(cleanName || "Student", selectedGrade);
      syncClassProgression(newProf);
      router.push("/student");
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="p-6 rounded-2xl bg-[#e0dcd1] border-2 border-[#5A3720] text-center shadow-sm">
          <p className="font-heading text-sm text-[#2B1B0F]">Loading class options...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between py-6 px-4 sm:px-6">
      <header className="max-w-3xl mx-auto w-full mb-6">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="font-pixel text-base sm:text-lg text-[#2B1B0F] tracking-wider no-underline hover:opacity-85"
          >
            MARGAM
          </Link>
          <Link
            href={profile ? "/student" : "/"}
            className="text-xs font-heading font-bold text-[#5A3720] hover:text-[#2B1B0F] underline"
          >
            {profile ? "Back to Dashboard" : "Back to Home"}
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto w-full flex-1 flex flex-col justify-center">
        <div className="glass-panel-cream p-6 sm:p-8 space-y-6 border border-[#7A4B2A]/30">
          <div className="space-y-2 text-center">
            <span className="font-pixel text-[11px] uppercase tracking-wider text-[#3D6926] block">
              NCERT Mathematics Curriculum
            </span>
            <h1 className="font-pixel text-lg sm:text-2xl text-[#2B1B0F] leading-snug">
              {profile ? "Select Your Study Class" : "Welcome to Margam"}
            </h1>
            <p className="font-sans text-xs sm:text-sm text-[#5A3720] max-w-xl mx-auto leading-relaxed">
              {profile
                ? "Switch your daily study class anytime. Your completed lessons, mastery records, and XP are strictly preserved."
                : "Choose your name and class (Classes 6–10) to begin. We pick questions to help you fix topics you missed."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Student Name / Nickname */}
            <div className="space-y-2">
              <label
                htmlFor="student-name-input"
                className="font-heading font-bold text-xs sm:text-sm text-[#2B1B0F] block"
              >
                {profile ? "Your Nickname" : "What should we call you?"}{" "}
                <span className="text-[#A12A2A]">*</span>
              </label>
              <input
                id="student-name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aarav, Priya, Rohan"
                maxLength={30}
                required={!profile}
                className="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-[#5A3720] text-sm text-[#2B1B0F] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3D6926]"
              />
            </div>

            {/* Class Cards Grid */}
            <div className="space-y-2">
              <label className="font-heading font-bold text-xs sm:text-sm text-[#2B1B0F] block">
                Choose Your Class (Classes 6 to 10) <span className="text-[#A12A2A]">*</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {GRADE_OPTIONS.map((opt) => {
                  const isSelected = selectedGrade === opt.grade;
                  return (
                    <button
                      key={opt.grade}
                      type="button"
                      onClick={() => setSelectedGrade(opt.grade)}
                      className={`p-4 rounded-xl text-left border-2 transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "bg-[#FFFFFF] border-[#3D6926] shadow-[3px_3px_0px_#3D6926] ring-2 ring-[#3D6926]"
                          : "bg-[#F7F5EE] border-[#8C6D53] hover:bg-[#FFFFFF]"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-pixel text-xs text-[#2B1B0F]">
                            {opt.title}
                          </span>
                          {isSelected && (
                            <span className="font-heading text-[10px] font-bold px-2 py-0.5 rounded bg-[#3D6926] text-white">
                              Selected
                            </span>
                          )}
                        </div>
                        <div className="font-sans text-[11px] font-bold text-[#6B4423]">
                          {opt.book}
                        </div>
                        <p className="font-sans text-[11px] text-[#5A3720] leading-snug pt-1">
                          {opt.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-[#FDE8E8] border border-[#A12A2A] text-xs font-bold text-[#A12A2A]">
                {errorMsg}
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-6 rounded-xl bg-[#3D6926] hover:bg-[#32561F] text-white font-heading font-bold text-sm border-2 border-[#2B1B0F] shadow-[3px_3px_0px_#2B1B0F] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
              >
                {profile ? `Save and start Class ${selectedGrade}` : `Start Class ${selectedGrade}`}
              </button>
            </div>
          </form>

          <div className="pt-2 border-t border-[#8C6D53]/40 text-center">
            <Link
              href="/login?role=student"
              className="text-xs font-sans font-semibold text-[#5A3720] hover:text-[#2B1B0F] underline"
            >
              Already have an account? Log in
            </Link>
          </div>
        </div>
      </main>

      <footer className="max-w-3xl mx-auto w-full mt-6 text-center text-xs font-sans text-[#5A3720]">
        Margam • Adaptive Mathematics for NCERT Classes 6–10
      </footer>
    </div>
  );
}

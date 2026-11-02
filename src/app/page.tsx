"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Compass,
  GraduationCap,
  School,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  Award,
  Layers,
  LogOut,
  User,
} from "lucide-react";
import { Logo } from "@/components/ui";
import { WitchCat } from "@/components/ui/WitchCat";
import { isIstNightTime } from "@/lib/xp-config";
import { handleLogout } from "@/lib/storage";

interface AuthStatus {
  authenticated: boolean;
  user: {
    id: string;
    role: "student" | "teacher";
    fullName?: string;
    username?: string;
    selectedClass?: number;
  } | null;
}

export default function HomePage() {
  const router = useRouter();
  const [authStatus, setAuthStatus] = useState<AuthStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (mounted) {
            setAuthStatus(data);
          }
        }
      } catch {
        if (mounted) setAuthStatus({ authenticated: false, user: null });
      } finally {
        if (mounted) setLoading(false);
      }
    }
    checkAuth();
    return () => {
      mounted = false;
    };
  }, []);

  const onLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    handleLogout();
    setAuthStatus({ authenticated: false, user: null });
    router.refresh();
  };

  return (
    <div className="min-h-screen text-slate-800 flex flex-col justify-between">
      {/* Floating Top Frosted Glass Header */}
      <header className="sticky top-3 z-50 max-w-[1240px] mx-auto px-3 sm:px-6 w-full">
        <div className="glass-panel px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3 shadow-[0_8px_32px_rgba(16,42,18,0.1)] border border-white/70">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-sm border border-white/60 flex items-center justify-center shrink-0">
              <Logo className="w-5 h-5 text-white" ariaLabel="Margam Logo" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-base sm:text-lg text-emerald-950 tracking-wider leading-none">
                MARGAM
              </span>
              <span className="text-[9px] font-sans font-bold text-emerald-700 leading-tight hidden sm:block mt-0.5">
                NCERT Mathematics • Classes 6–10
              </span>
            </div>
          </Link>

          {/* Right Status */}
          <div className="flex items-center gap-2">
            {authStatus?.authenticated && authStatus.user ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-xl bg-white/70 border border-white/80 text-xs font-heading font-bold text-emerald-950">
                  <User className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                  {authStatus.user.fullName || authStatus.user.username || "User"} (
                  {authStatus.user.role === "teacher" ? "Educator" : "Student"})
                </span>
                <button
                  type="button"
                  onClick={onLogout}
                  className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-rose-700 hover:text-rose-900 py-1.5 px-3 rounded-xl bg-white/70 hover:bg-white border border-white/80 transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login?role=student"
                  className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-emerald-900 hover:text-emerald-950 py-1.5 px-3 rounded-xl bg-white/70 hover:bg-white border border-white/80 transition-all"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Student Sign In</span>
                </Link>
                <Link
                  href="/login?role=teacher"
                  className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-cyan-900 hover:text-cyan-950 py-1.5 px-3 rounded-xl bg-white/70 hover:bg-white border border-white/80 transition-all"
                >
                  <School className="w-3.5 h-3.5 text-cyan-600" />
                  <span className="hidden sm:inline">Teacher Sign In</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-[1240px] mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full flex-1 flex flex-col justify-center items-center">
        {/* Active Session Resume Card (If already logged in) */}
        {!loading && authStatus?.authenticated && authStatus.user && (
          <div className="w-full max-w-2xl mb-8">
            <div className="glass-panel p-6 rounded-2xl border border-emerald-400/60 shadow-[0_12px_40px_rgba(16,42,18,0.12)] bg-emerald-50/70 text-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  {authStatus.user.role === "teacher" ? (
                    <School className="w-6 h-6" />
                  ) : (
                    <GraduationCap className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-200/80 text-[10px] font-heading font-extrabold text-emerald-900 uppercase tracking-wide">
                    Active Session Detected
                  </div>
                  <h2 className="text-lg font-heading font-extrabold text-emerald-950 mt-0.5">
                    Welcome back, {authStatus.user.fullName || authStatus.user.username}!
                  </h2>
                  <p className="text-xs text-emerald-800 font-sans">
                    You are logged in as a{" "}
                    <strong>{authStatus.user.role === "teacher" ? "Teacher" : "Student"}</strong>.
                  </p>
                </div>
              </div>
              <Link
                href={authStatus.user.role === "teacher" ? "/teacher" : "/student"}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.02]"
              >
                <span>
                  {authStatus.user.role === "teacher" ? "Open Teacher Dashboard" : "Enter Student Realm"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-8 sm:mb-12">
          {/* Maru Companion Mascot Greeting */}
          <div className="flex justify-center mb-1">
            <div className="p-2.5 rounded-2xl bg-white/70 border border-white/80 shadow-xs flex items-center gap-2.5">
              <WitchCat
                pose={isIstNightTime() ? "sleepy" : "greet"}
                size={44}
                sticker={false}
                alt="Maru companion"
              />
              <span className="text-xs font-heading font-bold text-emerald-950">
                Welcome to Margam • Choose your learning path to begin
              </span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-emerald-950 tracking-tight leading-tight">
            Adaptive Mathematics for <span className="text-emerald-700">NCERT Classes 6–10</span>
          </h1>
          <p className="text-sm sm:text-base text-emerald-950/80 font-sans max-w-2xl mx-auto leading-relaxed">
            A serene, Minecraft-inspired educational environment that diagnoses conceptual gaps,
            personalizes lessons, and guides every learner with interactive NCERT mastery.
          </p>
        </div>

        {/* Role Selection Grid: Student vs Teacher */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl w-full">
          {/* 1. STUDENT CARD */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/80 shadow-[0_16px_48px_rgba(16,42,18,0.12)] flex flex-col justify-between hover:border-emerald-400/60 transition-all group">
            <div className="space-y-5">
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center shadow-sm border border-white/60 group-hover:scale-105 transition-transform">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100/90 border border-emerald-300 text-[10px] font-heading font-extrabold text-emerald-900 uppercase tracking-wider">
                  Classes 6–10
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h2 className="text-2xl font-heading font-extrabold text-emerald-950">
                  Student Realm
                </h2>
                <p className="text-xs sm:text-sm text-slate-700 font-sans mt-1 leading-relaxed">
                  Learn concepts through adaptive lessons, diagnostic mastery maps, interactive practice worksheets, and earn badges.
                </p>
              </div>

              {/* Feature Highlights */}
              <div className="space-y-2 pt-2 border-t border-emerald-950/10">
                <div className="flex items-center gap-2 text-xs font-sans text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Interactive NCERT lessons tailored to your understanding</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-sans text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Real-time diagnostic mastery map & prerequisite backtracking</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-sans text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Privacy-first: no email or phone number required</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 mt-6 border-t border-white/60 space-y-2.5">
              <Link
                href="/login?role=student"
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.01]"
              >
                <span>Student Log In</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login?role=student"
                className="w-full py-2.5 px-4 rounded-xl bg-white/80 hover:bg-white text-emerald-950 font-heading font-bold text-xs flex items-center justify-center gap-1.5 border border-white transition-all shadow-xs"
              >
                <span>New Student? Register Free</span>
              </Link>
            </div>
          </div>

          {/* 2. TEACHER CARD */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/80 shadow-[0_16px_48px_rgba(16,42,18,0.12)] flex flex-col justify-between hover:border-cyan-400/60 transition-all group">
            <div className="space-y-5">
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-600 to-sky-700 text-white flex items-center justify-center shadow-sm border border-white/60 group-hover:scale-105 transition-transform">
                  <School className="w-7 h-7" />
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-cyan-100/90 border border-cyan-300 text-[10px] font-heading font-extrabold text-cyan-900 uppercase tracking-wider">
                  Educator Portal
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h2 className="text-2xl font-heading font-extrabold text-cyan-950">
                  Teacher & Educator
                </h2>
                <p className="text-xs sm:text-sm text-slate-700 font-sans mt-1 leading-relaxed">
                  Create classrooms, invite students with unique class codes, monitor real-time diagnostic gaps, and track NCERT curriculum mastery.
                </p>
              </div>

              {/* Feature Highlights */}
              <div className="space-y-2 pt-2 border-t border-cyan-950/10">
                <div className="flex items-center gap-2 text-xs font-sans text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>Unique class codes for one-click student enrollment</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-sans text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>Pinpoint specific student misconception tags & root gaps</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-sans text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>School & guardian compliance-ready authorization</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 mt-6 border-t border-white/60 space-y-2.5">
              <Link
                href="/login?role=teacher"
                className="w-full py-3 px-4 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-heading font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.01]"
              >
                <span>Teacher Log In</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login?role=teacher"
                className="w-full py-2.5 px-4 rounded-xl bg-white/80 hover:bg-white text-cyan-950 font-heading font-bold text-xs flex items-center justify-center gap-1.5 border border-white transition-all shadow-xs"
              >
                <span>Register as Educator</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Curriculum Footnote / Trust Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs font-sans font-semibold text-emerald-950/70">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-emerald-700" />
            <span>Aligned with NCERT 2024–2026 Mathematics Curriculum</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-emerald-700" />
            <span>Concept Directed Acyclic Graph (DAG) Engine</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Zero Third-Party Trackers • Privacy Protected</span>
          </div>
        </div>
      </main>

      {/* Lightweight Frosted Glass Footer */}
      <footer className="max-w-[1240px] mx-auto px-4 my-6 text-center text-xs font-sans font-medium text-emerald-950/70">
        Margam • Adaptive Mathematics for NCERT Classes 6–10 •{" "}
        <Link href="/privacy" className="underline hover:text-emerald-950">
          Privacy Policy
        </Link>{" "}
        •{" "}
        <Link href="/terms" className="underline hover:text-emerald-950">
          Terms of Service
        </Link>
      </footer>
    </div>
  );
}

"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Compass,
  ArrowLeft,
  Lock,
  User,
  GraduationCap,
  KeyRound,
  AlertTriangle,
  CheckCircle,
  Copy,
  Sparkles,
  ArrowRight,
  School,
  Mail,
  Shield,
  Users,
  CheckCircle2,
} from "lucide-react";
import { handleLoginSync, setStorageMode, createLearnerProfile } from "@/lib/storage";
import { WitchCat } from "@/components/ui/WitchCat";
import { isIstNightTime } from "@/lib/xp-config";
import { DEMO_SCHOOL_CONFIG, DEMO_STUDENTS } from "@/lib/demo/demo-school-data";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");
  const modeParam = searchParams.get("mode");
  const isTeacherFlow = roleParam === "teacher";

  // Mode within the role portal: "signin" or "signup"
  const [subMode, setSubMode] = useState<"signin" | "signup">(
    modeParam === "signup" ? "signup" : "signin"
  );
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Demo state
  const [selectedDemoStudent, setSelectedDemoStudent] = useState<string>("student01");
  const [demoSubmitting, setDemoSubmitting] = useState<string | null>(null);

  // Student form fields
  const [studentUsername, setStudentUsername] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [studentFullName, setStudentFullName] = useState("");
  const [studentClass, setStudentClass] = useState<number>(10);
  const [studentClassCode, setStudentClassCode] = useState("");

  // Teacher form fields
  const [teacherEmail, setTeacherEmail] = useState("");
  const [teacherPassword, setTeacherPassword] = useState("");
  const [teacherFullName, setTeacherFullName] = useState("");
  const [teacherClassName, setTeacherClassName] = useState("");
  const [teacherGrade, setTeacherGrade] = useState<number>(10);
  const [teacherConsent, setTeacherConsent] = useState(false);

  // Success states
  const [recoveryCode, setRecoveryCode] = useState<string | null>(null);
  const [copiedRecovery, setCopiedRecovery] = useState(false);
  const [savedRecoveryCodeCheckbox, setSavedRecoveryCodeCheckbox] = useState(false);
  const [createdClassCode, setCreatedClassCode] = useState<string | null>(null);

  // Lockout state
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutMinutes, setLockoutMinutes] = useState<number>(15);

  // Auto-prefill demo credentials when ?demo=1 is provided
  useEffect(() => {
    const mode = searchParams.get("mode");
    if (mode === "signup") {
      setSubMode("signup");
    }
    const demo = searchParams.get("demo");
    if (demo === "1" || demo === "true") {
      setSubMode("signin");
      if (isTeacherFlow) {
        setTeacherEmail(DEMO_SCHOOL_CONFIG.teacher.email);
        setTeacherPassword(DEMO_SCHOOL_CONFIG.demoPassword);
      } else {
        setStudentUsername("student01");
        setStudentPassword(DEMO_SCHOOL_CONFIG.demoPassword);
      }
    }
  }, [searchParams, isTeacherFlow]);

  const resetMessages = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const copyRecoveryCode = () => {
    if (recoveryCode) {
      navigator.clipboard.writeText(recoveryCode);
      setCopiedRecovery(true);
      setTimeout(() => setCopiedRecovery(false), 2500);
    }
  };

  // -------------------------------------------------------------
  // DEMO AUTHENTICATION HANDLERS (FOR LIVE JUDGING)
  // -------------------------------------------------------------
  const handleDemoLogin = async (role: "teacher" | "student", studentUsername?: string) => {
    resetMessages();
    setDemoSubmitting(role === "teacher" ? "teacher" : (studentUsername || "student"));
    try {
      const res = await fetch("/api/auth/demo-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          username: studentUsername,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Demo login failed.");
        return;
      }

      if (data.user) {
        await handleLoginSync(data.user);
      }
      if (data.role === "teacher") {
        setStorageMode("supabase");
      }
      router.push(data.redirectUrl || (data.role === "teacher" ? "/teacher" : "/student"));
    } catch {
      setErrorMessage("Network error during demo login.");
    } finally {
      setDemoSubmitting(null);
    }
  };

  // -------------------------------------------------------------
  // STUDENT AUTHENTICATION HANDLERS
  // -------------------------------------------------------------
  const handleStudentSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: studentUsername.trim(),
          password: studentPassword,
          expectedRole: "student",
        }),
      });

      const data = await res.json();

      if (res.status === 429 || data.locked) {
        setIsLocked(true);
        setLockoutMinutes(data.remainingMinutes || 15);
        setErrorMessage(
          data.error ||
            "Account temporarily locked for 15 minutes due to 5 consecutive failed login attempts."
        );
        setLoading(false);
        return;
      }

      if (!res.ok) {
        const warning = data.attemptsRemaining
          ? ` (${data.attemptsRemaining} attempt(s) remaining before 15-min lockout)`
          : "";
        setErrorMessage((data.error || "Invalid username or password.") + warning);
        setLoading(false);
        return;
      }

      await handleLoginSync(data.user);
      router.push("/student");
    } catch {
      setErrorMessage("Network error during student sign-in.");
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/student-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: studentUsername.trim(),
          password: studentPassword,
          fullName: studentFullName.trim() || studentUsername.trim(),
          selectedClass: Number(studentClass),
          classCode: studentClassCode.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Failed to create student account.");
        setLoading(false);
        return;
      }

      setRecoveryCode(data.recoveryCode);
      await handleLoginSync(data.user);
      setSuccessMessage("Student account created successfully!");
    } catch {
      setErrorMessage("Network error during student registration.");
    } finally {
      setLoading(false);
    }
  };

  const handleGuestContinue = () => {
    createLearnerProfile("Student", Number(studentClass) as 6 | 7 | 8 | 9 | 10);
    router.push("/student");
  };

  // -------------------------------------------------------------
  // TEACHER AUTHENTICATION HANDLERS
  // -------------------------------------------------------------
  const handleTeacherSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: teacherEmail.trim(),
          password: teacherPassword,
          expectedRole: "teacher",
        }),
      });

      const data = await res.json();

      if (res.status === 429 || data.locked) {
        setIsLocked(true);
        setLockoutMinutes(data.remainingMinutes || 15);
        setErrorMessage(
          data.error ||
            "Account temporarily locked for 15 minutes due to 5 consecutive failed login attempts."
        );
        setLoading(false);
        return;
      }

      if (!res.ok) {
        const warning = data.attemptsRemaining
          ? ` (${data.attemptsRemaining} attempt(s) remaining before 15-min lockout)`
          : "";
        setErrorMessage((data.error || "Invalid email or password.") + warning);
        setLoading(false);
        return;
      }

      setStorageMode("supabase");
      router.push("/teacher");
    } catch {
      setErrorMessage("Network error during teacher sign-in.");
    } finally {
      setLoading(false);
    }
  };

  const handleTeacherSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!teacherConsent) {
      setErrorMessage("Please confirm school or guardian consent to register as an educator.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/teacher-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: teacherEmail.trim(),
          password: teacherPassword,
          fullName: teacherFullName.trim(),
          className: teacherClassName.trim(),
          grade: Number(teacherGrade),
          consentConfirmed: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Failed to create teacher account.");
        setLoading(false);
        return;
      }

      setCreatedClassCode(data.classInfo?.classCode || null);
      setStorageMode("supabase");
      setSuccessMessage(data.message || "Teacher account created!");
    } catch {
      setErrorMessage("Network error during teacher registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* ============================================================= */}
      {/* DEMO ACCESS FOR LIVE JUDGING                                  */}
      {/* ============================================================= */}
        <section className="glass-panel p-5 sm:p-6 rounded-2xl border-2 border-emerald-500/30 bg-emerald-950/15 shadow-[0_12px_40px_rgba(16,42,18,0.12)] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/30 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 text-[10px] font-heading font-black tracking-wider uppercase shadow-xs">
                DEMO ENVIRONMENT
              </span>
              <span className="text-xs font-heading font-extrabold text-emerald-950">
                Vignan School • Class 10-A4
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-800 bg-white/60 px-2 py-0.5 rounded-md border border-white/80 font-bold">
              25 Pre-Seeded Students
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-heading font-extrabold text-emerald-950 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Demo Access for Live Hackathon Judging</span>
            </h2>
            <p className="text-xs text-slate-700 font-sans leading-relaxed">
              Explore the realistic seeded classroom without manual sign-ups. Click any option below to instantly enter as the teacher or inspect contrasting student learning journeys.
            </p>
          </div>

          {/* Quick Demo Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* 1. Demo Teacher */}
            <button
              type="button"
              disabled={demoSubmitting !== null}
              onClick={() => handleDemoLogin("teacher")}
              className="p-3 bg-gradient-to-br from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 text-white rounded-xl border border-emerald-400/50 shadow-md text-left transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] uppercase tracking-wider font-extrabold text-emerald-200">
                    Class Teacher
                  </span>
                  <School className="w-3.5 h-3.5 text-emerald-200 group-hover:scale-110 transition-transform" />
                </div>
                <div className="font-heading font-extrabold text-xs text-white">
                  Demo Teacher
                </div>
                <p className="text-[10px] text-emerald-100/90 font-sans mt-0.5 leading-tight">
                  Class 10-A4 • Roster of 25, analytics & gap heatmaps
                </p>
              </div>
              <div className="mt-2.5 pt-2 border-t border-emerald-500/50 flex items-center justify-between text-[10px] font-heading font-bold text-amber-200">
                <span>{demoSubmitting === "teacher" ? "Logging in..." : "Open Dashboard"}</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>

            {/* 2. Top Student (Aarav Sharma) */}
            <button
              type="button"
              disabled={demoSubmitting !== null}
              onClick={() => handleDemoLogin("student", "student01")}
              className="p-3 bg-white/80 hover:bg-white text-slate-800 rounded-xl border border-emerald-300 shadow-sm text-left transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] uppercase tracking-wider font-extrabold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.2 rounded">
                    Top Performer
                  </span>
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-700 group-hover:scale-110 transition-transform" />
                </div>
                <div className="font-heading font-extrabold text-xs text-emerald-950">
                  Aarav Sharma (#01)
                </div>
                <p className="text-[10px] text-slate-600 font-sans mt-0.5 leading-tight">
                  90% Diagnostic • Mastered Real Numbers & Linear Eq
                </p>
              </div>
              <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] font-heading font-bold text-emerald-800">
                <span>{demoSubmitting === "student01" ? "Logging in..." : "Enter as Student"}</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>

            {/* 3. Remedial Breakthrough (Isha Reddy) */}
            <button
              type="button"
              disabled={demoSubmitting !== null}
              onClick={() => handleDemoLogin("student", "student08")}
              className="p-3 bg-white/80 hover:bg-white text-slate-800 rounded-xl border border-amber-300 shadow-sm text-left transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] uppercase tracking-wider font-extrabold text-amber-800 bg-amber-100/80 px-1.5 py-0.2 rounded">
                    Breakthrough
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 group-hover:scale-110 transition-transform" />
                </div>
                <div className="font-heading font-extrabold text-xs text-amber-950">
                  Isha Reddy (#08)
                </div>
                <p className="text-[10px] text-slate-600 font-sans mt-0.5 leading-tight">
                  40% ➔ 90% • Resolved Gap: Negative Integers (c7-int-02)
                </p>
              </div>
              <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] font-heading font-bold text-amber-800">
                <span>{demoSubmitting === "student08" ? "Logging in..." : "Enter as Student"}</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          </div>

          {/* Selector for all 25 seeded students */}
          <div className="pt-2 border-t border-white/40 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1">
              <select
                aria-label="Select Demo Student"
                value={selectedDemoStudent}
                onChange={(e) => setSelectedDemoStudent(e.target.value)}
                className="w-full bg-white/90 border border-emerald-300 rounded-xl px-3 py-2 text-xs font-heading font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                {DEMO_STUDENTS.map((st) => (
                  <option key={st.username} value={st.username}>
                    #{String(st.rollNumber).padStart(2, "0")} {st.name} — {st.persona} ({st.diagnosticScore}/{st.diagnosticTotal})
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              disabled={demoSubmitting !== null}
              onClick={() => handleDemoLogin("student", selectedDemoStudent)}
              className="glass-btn-primary px-3.5 py-2 text-xs font-heading font-bold rounded-xl whitespace-nowrap cursor-pointer disabled:opacity-60 flex items-center justify-center gap-1.5"
            >
              <span>{demoSubmitting === selectedDemoStudent ? "Entering..." : "Enter Selected Student"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Subtle Manual Credentials Note */}
          <div className="text-[11px] text-slate-600 font-sans flex flex-wrap items-center justify-between gap-1 pt-1">
            <span>
              <strong>Manual Credentials:</strong> Teacher: <code className="bg-white/60 px-1 py-0.5 rounded font-mono font-bold text-slate-800">{DEMO_SCHOOL_CONFIG.teacher.email}</code> / <code className="bg-white/60 px-1 py-0.5 rounded font-mono font-bold text-slate-800">{DEMO_SCHOOL_CONFIG.demoPassword}</code>
            </span>
            <span className="font-mono text-emerald-900 font-bold">
              Class Code: {DEMO_SCHOOL_CONFIG.classCode}
            </span>
          </div>
        </section>

        {/* ============================================================= */}
        {/* STANDARD REGISTRATION / SIGN IN CARD                          */}
        {/* ============================================================= */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/75 shadow-[0_12px_40px_rgba(16,42,18,0.1)] space-y-6 text-slate-800">
          
          {/* Companion Mascot on Student Portal */}
          {!isTeacherFlow && !recoveryCode && (
            <div className="flex justify-center -mb-2">
              <div className="p-2 rounded-2xl bg-white/70 border border-white/80 shadow-xs flex items-center gap-2">
                <WitchCat
                  pose={isIstNightTime() ? "sleepy" : "greet"}
                  size={50}
                  sticker={false}
                  alt="Maru companion"
                />
                <span className="text-[10px] font-heading font-bold text-emerald-900">
                  Maru is ready to guide you!
                </span>
              </div>
            </div>
          )}

          {/* Logo & Headline */}
          <div className="text-center space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-100/90 border border-emerald-300 text-[10px] font-heading font-extrabold text-emerald-950 rounded-full uppercase tracking-wider mb-1">
              {isTeacherFlow ? (
                <>
                  <School className="w-3.5 h-3.5 text-[#3FA7C9]" />
                  <span>Educator Access</span>
                </>
              ) : (
                <>
                  <GraduationCap className="w-3.5 h-3.5 text-[#5DAA3A]" />
                  <span>Student Access</span>
                </>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-emerald-950">
              {isTeacherFlow ? "Teacher Portal" : "Student Portal"}
            </h1>
            <p className="text-xs text-slate-600 font-sans font-medium">
              {isTeacherFlow
                ? "Manage classrooms, track learning gaps & monitor diagnostics"
                : "Privacy-first math realm. No email or phone required."}
            </p>
          </div>

          {/* Mode Switcher Tabs (Sign In vs Sign Up within this role) */}
          {!recoveryCode && !createdClassCode && (
            <div className="grid grid-cols-2 gap-1.5 bg-white/60 p-1.5 rounded-xl border border-white/80 text-xs font-heading text-center">
              <button
                type="button"
                onClick={() => {
                  setSubMode("signin");
                  resetMessages();
                }}
                className={`py-2 px-1.5 transition-all cursor-pointer min-h-[44px] flex items-center justify-center ${
                  subMode === "signin"
                    ? "bg-emerald-600 text-white shadow-xs rounded-lg font-bold"
                    : "text-emerald-950/70 hover:text-emerald-950 rounded-lg"
                }`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => {
                  setSubMode("signup");
                  resetMessages();
                }}
                className={`py-2 px-1.5 transition-all cursor-pointer min-h-[44px] flex items-center justify-center ${
                  subMode === "signup"
                    ? "bg-emerald-600 text-white shadow-xs rounded-lg font-bold"
                    : "text-emerald-950/70 hover:text-emerald-950 rounded-lg"
                }`}
              >
                Create Account
              </button>
            </div>
          )}

          {/* Alerts */}
          {errorMessage && (
            <div
              className={`p-3.5 border rounded-xl text-xs font-semibold flex items-start gap-2 ${
                isLocked ? "bg-amber-100 border-amber-300 text-amber-950 rounded-xl" : "bg-rose-50 border-rose-300 text-rose-950 rounded-xl"
              }`}
            >
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && !recoveryCode && !createdClassCode && (
            <div className="p-3.5 border border-emerald-300 bg-emerald-100 text-emerald-950 text-xs font-semibold rounded-xl flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0 text-white" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* RECOVERY CODE MODAL (STUDENT SIGN-UP ONLY) */}
          {recoveryCode && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 bg-[#FFFDF7] border-3 border-[#2B1B0F] shadow-block space-y-3 text-[#2B1B0F]">
                <div className="flex items-center gap-2 font-pixel text-xs text-[#2B1B0F]">
                  <KeyRound className="w-4 h-4 text-[#A06A3C]" />
                  <span>One-Time Account Recovery Code</span>
                </div>
                <p className="text-xs text-[#2B1B0F] leading-relaxed font-sans font-medium">
                  ⚠️ <strong>IMPORTANT:</strong> Passwords cannot be reset by email because we do not collect your email or phone number.
                  This code is shown <strong>ONLY ONCE</strong>.
                </p>

                <div className="bg-white p-3 border-2 border-[#2B1B0F] shadow-2xs flex items-center justify-between gap-2">
                  <code className="font-mono text-sm sm:text-base font-extrabold tracking-wider text-[#2B1B0F] select-all">
                    {recoveryCode}
                  </code>
                  <button
                    type="button"
                    onClick={copyRecoveryCode}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#5DAA3A] hover:bg-[#4E9330] text-[#2B1B0F] text-xs font-heading font-bold border-2 border-[#2B1B0F] shadow-xs transition-all cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedRecovery ? "Copied!" : "Copy Code"}</span>
                  </button>
                </div>
              </div>

              <label className="flex items-start gap-2.5 text-xs text-[#2B1B0F] cursor-pointer pt-1 font-semibold">
                <input
                  type="checkbox"
                  checked={savedRecoveryCodeCheckbox}
                  onChange={(e) => setSavedRecoveryCodeCheckbox(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded-none accent-[#5DAA3A] border-2 border-[#2B1B0F]"
                />
                <span>I&apos;ve saved it — I have written down or safely stored my recovery code.</span>
              </label>

              <button
                type="button"
                disabled={!savedRecoveryCodeCheckbox}
                onClick={() => router.push("/student")}
                className="w-full min-h-[46px] py-2.5 bg-[#5DAA3A] hover:bg-[#4E9330] disabled:opacity-40 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:cursor-not-allowed text-[#2B1B0F] text-xs font-heading font-extrabold uppercase tracking-wider border-3 border-[#2B1B0F] shadow-block hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Continue to Margam</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* TEACHER CLASS CODE MODAL */}
          {createdClassCode && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-300 space-y-2.5 text-emerald-950 shadow-xs">
                <div className="flex items-center gap-2 font-pixel text-xs">
                  <Sparkles className="w-4 h-4 text-[#5DAA3A]" />
                  <span>Class Code Generated!</span>
                </div>
                <p className="text-xs text-[#2B1B0F] leading-relaxed font-sans font-semibold">
                  Share this class code with your students so they can link their diagnostic quizzes to your teacher dashboard:
                </p>
                <div className="bg-white p-3 rounded-xl border border-slate-300 shadow-2xs flex items-center justify-between">
                  <code className="font-mono text-base font-extrabold tracking-widest text-[#2B1B0F]">
                    {createdClassCode}
                  </code>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(createdClassCode);
                      setCopiedRecovery(true);
                      setTimeout(() => setCopiedRecovery(false), 2000);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-heading font-bold rounded-lg shadow-xs transition-all"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedRecovery ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => router.push("/teacher")}
                className="w-full min-h-[46px] py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-heading font-extrabold rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Open Teacher Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ============================================================= */}
          {/* 1. STUDENT FLOW FORMS                                         */}
          {/* ============================================================= */}
          {!isTeacherFlow && !recoveryCode && (
            <>
              {subMode === "signin" ? (
                <form onSubmit={handleStudentSignIn} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#2B1B0F] block">
                      Student Username <span className="text-[#D9453D]">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#7A4B2A] absolute left-3 top-3.5" />
                      <input
                        type="text"
                        required
                        value={studentUsername}
                        onChange={(e) => setStudentUsername(e.target.value)}
                        placeholder="e.g. priya_maths"
                        className="w-full pl-9 pr-3 py-2.5 bg-white rounded-xl border border-slate-300 text-xs font-sans text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-2xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#2B1B0F] block">
                      Password <span className="text-[#D9453D]">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#7A4B2A] absolute left-3 top-3.5" />
                      <input
                        type="password"
                        required
                        value={studentPassword}
                        onChange={(e) => setStudentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-3 py-2.5 bg-white rounded-xl border border-slate-300 text-xs font-sans text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-2xs"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || isLocked}
                    className="w-full min-h-[46px] py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-heading font-extrabold rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>{loading ? "Entering Realm..." : "Log In to Student Realm"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleStudentSignUp} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#2B1B0F] block">
                      Full Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={studentFullName}
                      onChange={(e) => setStudentFullName(e.target.value)}
                      placeholder="e.g. Priya Sharma"
                      className="w-full px-3 py-2.5 bg-white rounded-xl border border-slate-300 text-xs font-sans text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-2xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#2B1B0F] block">
                      Username <span className="text-[#D9453D]">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#7A4B2A] absolute left-3 top-3.5" />
                      <input
                        type="text"
                        required
                        pattern="^[a-zA-Z0-9_]{3,20}$"
                        title="3-20 characters: letters, numbers, and underscores only"
                        value={studentUsername}
                        onChange={(e) => setStudentUsername(e.target.value)}
                        placeholder="e.g. priya_maths"
                        className="w-full pl-9 pr-3 py-2.5 bg-white rounded-xl border border-slate-300 text-xs font-sans text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-2xs"
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 font-sans">3–20 characters, letters/numbers/underscores only</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#2B1B0F] block">
                      Password <span className="text-[#D9453D]">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#7A4B2A] absolute left-3 top-3.5" />
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={studentPassword}
                        onChange={(e) => setStudentPassword(e.target.value)}
                        placeholder="Minimum 6 characters"
                        className="w-full pl-9 pr-3 py-2.5 bg-white rounded-xl border border-slate-300 text-xs font-sans text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-2xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#2B1B0F] block">
                      Select Class <span className="text-[#D9453D]">*</span>
                    </label>
                    <div className="grid grid-cols-5 gap-1.5">
                      {[6, 7, 8, 9, 10].map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setStudentClass(c)}
                          className={`py-2 text-xs font-heading font-extrabold rounded-xl border transition-all cursor-pointer ${
                            studentClass === c
                              ? "bg-[#5DAA3A] text-white shadow-[2px_2px_0px_#1B120C]"
                              : "bg-white/80 text-slate-700 hover:bg-emerald-50 border-slate-200"
                          }`}
                        >
                          C{c}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#2B1B0F] block">
                      Teacher Class Code (Optional)
                    </label>
                    <input
                      type="text"
                      value={studentClassCode}
                      onChange={(e) => setStudentClassCode(e.target.value.toUpperCase())}
                      placeholder="e.g. VIGNAN-10A4"
                      className="w-full px-3 py-2.5 bg-white rounded-xl border border-slate-300 text-xs font-mono font-bold tracking-wider uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-2xs"
                    />
                    <p className="text-[10px] text-slate-500 font-sans">Leave blank if studying independently</p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || isLocked}
                    className="w-full min-h-[46px] py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-heading font-extrabold rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>{loading ? "Creating Account..." : "Create Student Account"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* Guest / Teacher Switcher */}
              <div className="pt-4 border-t-2 border-[#E5D7BE] space-y-3 text-center">
                <button
                  type="button"
                  onClick={handleGuestContinue}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-900 underline cursor-pointer"
                >
                  Or continue as Guest (browser storage only)
                </button>
                <div>
                  <Link
                    href="/login?role=teacher"
                    className="text-xs font-heading font-bold text-[#3FA7C9] hover:underline inline-flex items-center gap-1"
                  >
                    <School className="w-3.5 h-3.5" />
                    <span>Are you an educator? Switch to Teacher Portal</span>
                  </Link>
                </div>
              </div>
            </>
          )}

          {/* ============================================================= */}
          {/* 2. TEACHER FLOW FORMS                                         */}
          {/* ============================================================= */}
          {isTeacherFlow && !createdClassCode && (
            <>
              {subMode === "signin" ? (
                <form onSubmit={handleTeacherSignIn} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#2B1B0F] block">
                      Educator Email <span className="text-[#D9453D]">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#7A4B2A] absolute left-3 top-3.5" />
                      <input
                        type="email"
                        required
                        value={teacherEmail}
                        onChange={(e) => setTeacherEmail(e.target.value)}
                        placeholder="teacher@school.edu.in"
                        className="w-full pl-9 pr-3 py-2.5 bg-white rounded-xl border border-slate-300 text-xs font-sans text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 shadow-2xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#2B1B0F] block">
                      Password <span className="text-[#D9453D]">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#7A4B2A] absolute left-3 top-3.5" />
                      <input
                        type="password"
                        required
                        value={teacherPassword}
                        onChange={(e) => setTeacherPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-3 py-2.5 bg-white rounded-xl border border-slate-300 text-xs font-sans text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 shadow-2xs"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || isLocked}
                    className="w-full min-h-[46px] py-2.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white text-xs font-heading font-extrabold rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>{loading ? "Signing In..." : "Log In to Teacher Hub"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleTeacherSignUp} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#2B1B0F] block">
                      Full Name <span className="text-[#D9453D]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={teacherFullName}
                      onChange={(e) => setTeacherFullName(e.target.value)}
                      placeholder="e.g. Shalini Reddy"
                      className="w-full px-3 py-2.5 bg-white rounded-xl border border-slate-300 text-xs font-sans text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 shadow-2xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#2B1B0F] block">
                      School / Educator Email <span className="text-[#D9453D]">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#7A4B2A] absolute left-3 top-3.5" />
                      <input
                        type="email"
                        required
                        value={teacherEmail}
                        onChange={(e) => setTeacherEmail(e.target.value)}
                        placeholder="teacher@school.edu.in"
                        className="w-full pl-9 pr-3 py-2.5 bg-white rounded-xl border border-slate-300 text-xs font-sans text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 shadow-2xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#2B1B0F] block">
                      Password <span className="text-[#D9453D]">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#7A4B2A] absolute left-3 top-3.5" />
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={teacherPassword}
                        onChange={(e) => setTeacherPassword(e.target.value)}
                        placeholder="Minimum 6 characters"
                        className="w-full pl-9 pr-3 py-2.5 bg-white rounded-xl border border-slate-300 text-xs font-sans text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 shadow-2xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#2B1B0F] block">
                      Initial Class Name <span className="text-[#D9453D]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={teacherClassName}
                      onChange={(e) => setTeacherClassName(e.target.value)}
                      placeholder="e.g. Class 10-A Math"
                      className="w-full px-3 py-2.5 bg-white rounded-xl border border-slate-300 text-xs font-sans text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 shadow-2xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#2B1B0F] block">
                      Class Grade <span className="text-[#D9453D]">*</span>
                    </label>
                    <div className="grid grid-cols-5 gap-1.5">
                      {[6, 7, 8, 9, 10].map((grade) => (
                        <button
                          key={grade}
                          type="button"
                          onClick={() => setTeacherGrade(grade)}
                          className={`py-2 text-xs font-heading font-extrabold rounded-xl border transition-all cursor-pointer ${
                            teacherGrade === grade
                              ? "bg-[#3FA7C9] text-white shadow-[2px_2px_0px_#1B120C]"
                              : "bg-white/80 text-slate-700 hover:bg-emerald-50 border-slate-200"
                          }`}
                        >
                          C{grade}
                        </button>
                      ))}
                    </div>
                  </div>

                  <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer pt-1 font-semibold">
                    <input
                      type="checkbox"
                      checked={teacherConsent}
                      onChange={(e) => setTeacherConsent(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded-none accent-[#3FA7C9]"
                    />
                    <span>
                      I confirm I am an educator and authorized to view classroom diagnostic analytics.
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={loading || isLocked}
                    className="w-full min-h-[46px] py-2.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white text-xs font-heading font-extrabold rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>{loading ? "Registering..." : "Create Teacher Account"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* Portal Switcher */}
              <div className="pt-4 border-t-2 border-[#E5D7BE] text-center">
                <Link
                  href="/login?role=student"
                  className="text-xs font-heading font-bold text-[#5DAA3A] hover:underline inline-flex items-center gap-1"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Are you a student? Switch to Student Login</span>
                </Link>
              </div>
            </>
          )}

        </div>
    </div>
  );
}

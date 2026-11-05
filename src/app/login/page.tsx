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
import { Companion } from "@/components/ui/Companion";
import { isIstNightTime } from "@/lib/xp-config";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");
  const isTeacherFlow = roleParam === "teacher";

  // Mode within the role portal: "signin" or "signup"
  const [subMode, setSubMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Demo state
  const [demoLoginEnabled, setDemoLoginEnabled] = useState<boolean>(
    process.env.NEXT_PUBLIC_DEMO_LOGIN_ENABLED === "true"
  );
  const [demoSubmitting, setDemoSubmitting] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/demo-login")
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.enabled === "boolean") {
          setDemoLoginEnabled(data.enabled);
        }
      })
      .catch(() => {});
  }, []);

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
  const handleDemoLogin = async (key: "teacher" | "riya" | "aarav" | "new") => {
    resetMessages();
    setDemoSubmitting(key);
    try {
      const res = await fetch("/api/auth/demo-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
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
    const chosenName = studentFullName.trim() || studentUsername.trim() || "Student";
    const chosenGrade = (Number(studentClass) || 10) as 6 | 7 | 8 | 9 | 10;
    createLearnerProfile(chosenName, chosenGrade);
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
    <div className="min-h-screen text-slate-800 flex flex-col justify-between">
      {/* Floating Top Glass Header */}
      <header className="max-w-[1200px] mx-auto mt-3 px-3 sm:px-6 w-full">
        <div className="panel-night px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3 border-3 border-[#1E1610] shadow-[3px_3px_0px_#1E1610] text-[#F3E3BC]">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-[#6DB33F] border-2 border-[#1E1610] flex items-center justify-center text-[#1E1610]">
              <Compass className="w-4 h-4" />
            </div>
            <span className="font-heading font-extrabold text-base sm:text-lg text-emerald-950">MARGAM</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-[#1E1610] py-1.5 px-3 bg-[#E8CF9C] hover:bg-[#D9B87A] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] transition-all active:translate-x-[1px] active:translate-y-[1px]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Go back</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-2xl mx-auto px-4 py-8 w-full flex-1 flex flex-col justify-center space-y-6">

        {/* ============================================================= */}
        {/* DEMO ACCESS FOR LIVE JUDGING                                  */}
        {/* ============================================================= */}
        {demoLoginEnabled && (
          <section className="panel-plank p-5 sm:p-6 border-3 border-[#1E1610] shadow-[3px_3px_0px_#1E1610] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#1E1610]/20 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 text-[10px] font-heading font-black tracking-wider uppercase shadow-xs">
                  DEMO ENVIRONMENT
                </span>
                <span className="text-xs font-heading font-extrabold text-emerald-950">
                  Class 10-A (Demo)
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#1E1610] bg-[#E8CF9C] px-2 py-0.5 border-2 border-[#1E1610] font-bold">
                Class 10-A • Code: DEMO10A
              </span>
            </div>

            <div className="space-y-1">
              <h2 className="text-base sm:text-lg font-heading font-extrabold text-emerald-950">
                Try Margam without signing up
              </h2>
              <p className="text-xs text-slate-700 font-sans leading-relaxed">
                The data is made up. One class of 25 students.
              </p>
            </div>

            {/* Quick Demo Action Buttons (Exactly 4 actions) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* 1. Open the teacher dashboard */}
              <button
                type="button"
                disabled={demoSubmitting !== null}
                onClick={() => handleDemoLogin("teacher")}
                className="p-3 bg-[#6DB33F] hover:bg-[#8CCB55] text-[#1E1610] border-3 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] text-left transition-all active:translate-x-[1px] active:translate-y-[1px] disabled:opacity-60 cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-[#1E1610]">
                      Teacher
                    </span>
                    <School className="w-3.5 h-3.5 text-[#1E1610] group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="font-heading font-extrabold text-xs text-[#1E1610]">
                    Open the teacher dashboard
                  </div>
                  <p className="text-[10px] text-[#1E1610]/90 font-sans mt-0.5 leading-tight">
                    Class 10-A • Roster of 25, analytics & gap heatmaps
                  </p>
                </div>
                <div className="mt-2.5 pt-2 border-t-2 border-[#1E1610]/20 flex items-center justify-between text-[10px] font-heading font-bold text-[#1E1610]">
                  <span>{demoSubmitting === "teacher" ? "Logging in..." : "Open Dashboard"}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>

              {/* 2. Open as Riya */}
              <button
                type="button"
                disabled={demoSubmitting !== null}
                onClick={() => handleDemoLogin("riya")}
                className="p-3 bg-[#D9B87A] hover:bg-[#E8CF9C] text-[#1E1610] border-3 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] text-left transition-all active:translate-x-[1px] active:translate-y-[1px] disabled:opacity-60 cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-[#1E1610]">
                      Student
                    </span>
                    <GraduationCap className="w-3.5 h-3.5 text-[#1E1610] group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="font-heading font-extrabold text-xs text-[#1E1610]">
                    Open as Riya
                  </div>
                  <p className="text-[10px] text-slate-700 font-sans mt-0.5 leading-tight">
                    Riya has not fixed her integer-sign gap. Start at Fix this first.
                  </p>
                </div>
                <div className="mt-2.5 pt-2 border-t-2 border-[#1E1610]/20 flex items-center justify-between text-[10px] font-heading font-bold text-[#1E1610]">
                  <span>{demoSubmitting === "riya" ? "Logging in..." : "Enter as Student"}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>

              {/* 3. Open as Aarav */}
              <button
                type="button"
                disabled={demoSubmitting !== null}
                onClick={() => handleDemoLogin("aarav")}
                className="p-3 bg-[#E8CF9C] hover:bg-[#D9B87A] text-[#1E1610] border-3 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] text-left transition-all active:translate-x-[1px] active:translate-y-[1px] disabled:opacity-60 cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-[#1E1610]">
                      Student
                    </span>
                    <GraduationCap className="w-3.5 h-3.5 text-[#1E1610] group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="font-heading font-extrabold text-xs text-[#1E1610]">
                    Open as Aarav
                  </div>
                  <p className="text-[10px] text-slate-700 font-sans mt-0.5 leading-tight">
                    Aarav knows most topics.
                  </p>
                </div>
                <div className="mt-2.5 pt-2 border-t-2 border-[#1E1610]/20 flex items-center justify-between text-[10px] font-heading font-bold text-[#1E1610]">
                  <span>{demoSubmitting === "aarav" ? "Logging in..." : "Enter as Student"}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>

              {/* 4. Open as a new student */}
              <button
                type="button"
                disabled={demoSubmitting !== null}
                onClick={() => handleDemoLogin("new")}
                className="p-3 bg-[#E8CF9C] hover:bg-[#D9B87A] text-[#1E1610] border-3 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] text-left transition-all active:translate-x-[1px] active:translate-y-[1px] disabled:opacity-60 cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-[#1E1610]">
                      New Student
                    </span>
                    <User className="w-3.5 h-3.5 text-[#1E1610] group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="font-heading font-extrabold text-xs text-[#1E1610]">
                    Open as a new student
                  </div>
                  <p className="text-[10px] text-slate-700 font-sans mt-0.5 leading-tight">
                    See the first-time screen.
                  </p>
                </div>
                <div className="mt-2.5 pt-2 border-t-2 border-[#1E1610]/20 flex items-center justify-between text-[10px] font-heading font-bold text-[#1E1610]">
                  <span>{demoSubmitting === "new" ? "Logging in..." : "Enter as Student"}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            </div>

            {/* Small collapsed section: Sign in by hand instead */}
            <details className="pt-2 border-t-2 border-[#1E1610]/20 text-[11px] text-slate-700 font-sans group">
              <summary className="font-heading font-bold text-[#1E1610] cursor-pointer hover:underline select-none">
                Sign in by hand instead
              </summary>
              <div className="mt-2 p-3 bg-[#E8CF9C]/60 border-2 border-[#1E1610] space-y-1.5 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <span>Teacher: <code className="font-mono font-bold text-[#1E1610]">demo.teacher@margam.example</code></span>
                  <span className="font-mono font-bold text-emerald-950">Code: DEMO10A</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span>Students:</span>
                  <code className="font-mono font-bold text-[#1E1610]">demo_riya@student.margam.local</code>
                  <span>•</span>
                  <code className="font-mono font-bold text-[#1E1610]">demo_aarav@student.margam.local</code>
                  <span>•</span>
                  <code className="font-mono font-bold text-[#1E1610]">demo_new@student.margam.local</code>
                </div>
                <div className="pt-1 text-[10px] text-slate-600 font-medium">
                  Password: ask the team
                </div>
              </div>
            </details>
          </section>
        )}

        {/* ============================================================= */}
        {/* STANDARD REGISTRATION / SIGN IN CARD                          */}
        {/* ============================================================= */}
        <div className="panel-plank p-6 sm:p-8 border-3 border-[#1E1610] shadow-[3px_3px_0px_#1E1610] space-y-6 text-[#1E1610]">
          
          {/* Companion Mascot on Student Portal */}
          {!isTeacherFlow && !recoveryCode && (
            <div className="flex justify-center -mb-2">
              <div className="flex items-center gap-2.5">
                <Companion
                  pose={isIstNightTime() ? "sleepy" : "greet"}
                  size={80}
                  withShadow={true}
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
                : "Safe maths space. No email or phone needed."}
            </p>
          </div>

          {/* Mode Switcher Tabs (Sign In vs Sign Up within this role) */}
          {!recoveryCode && !createdClassCode && (
            <div className="grid grid-cols-2 gap-1.5 bg-[#E8CF9C]/70 p-1.5 border-2 border-[#1E1610] text-xs font-heading text-center">
              <button
                type="button"
                onClick={() => {
                  setSubMode("signin");
                  resetMessages();
                }}
                className={`py-2 px-1.5 transition-all cursor-pointer min-h-[44px] flex items-center justify-center ${
                  subMode === "signin"
                    ? "bg-[#6DB33F] text-[#1E1610] border-2 border-[#1E1610] font-bold shadow-[2px_2px_0px_#1E1610]"
                    : "text-[#1E1610] hover:bg-[#D9B87A] border-2 border-transparent"
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
                    ? "bg-[#6DB33F] text-[#1E1610] border-2 border-[#1E1610] font-bold shadow-[2px_2px_0px_#1E1610]"
                    : "text-[#1E1610] hover:bg-[#D9B87A] border-2 border-transparent"
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
              <CheckCircle className="w-4 h-4 shrink-0 text-[#1E1610]" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* RECOVERY CODE MODAL (STUDENT SIGN-UP ONLY) */}
          {recoveryCode && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-300 space-y-2.5 text-amber-950 shadow-xs">
                <div className="flex items-center gap-2 font-pixel text-xs">
                  <KeyRound className="w-4 h-4 text-[#A06A3C]" />
                  <span>One-Time Account Recovery Code</span>
                </div>
                <p className="text-xs text-[#2B1B0F] leading-relaxed font-semibold font-sans">
                  ⚠️ <strong>IMPORTANT:</strong> Passwords cannot be reset by email because we do not collect your email or phone.
                  This code is shown <strong>ONLY ONCE</strong>.
                </p>

                <div className="bg-[#E8CF9C]/80 p-3 border-2 border-[#1E1610] flex items-center justify-between gap-2">
                  <code className="font-mono text-sm sm:text-base font-extrabold tracking-wider text-[#2B1B0F] select-all">
                    {recoveryCode}
                  </code>
                  <button
                    type="button"
                    onClick={copyRecoveryCode}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#6DB33F] hover:bg-[#8CCB55] text-[#1E1610] text-xs font-heading font-bold border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] transition-all active:translate-x-[1px] active:translate-y-[1px]"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedRecovery ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
              </div>

              <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer pt-1 font-semibold">
                <input
                  type="checkbox"
                  checked={savedRecoveryCodeCheckbox}
                  onChange={(e) => setSavedRecoveryCodeCheckbox(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded-none accent-[#5DAA3A]"
                />
                <span>I have written down or saved my recovery code in a safe place.</span>
              </label>

              <button
                type="button"
                disabled={!savedRecoveryCodeCheckbox}
                onClick={() => router.push("/student")}
                className="w-full min-h-[46px] py-2.5 bg-[#6DB33F] hover:bg-[#8CCB55] disabled:opacity-50 text-[#1E1610] text-xs font-heading font-extrabold border-3 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] transition-all cursor-pointer flex items-center justify-center gap-2 active:translate-x-[1px] active:translate-y-[1px]"
              >
                <span>Continue to Learning Path</span>
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
                <div className="bg-[#E8CF9C]/80 p-3 border-2 border-[#1E1610] flex items-center justify-between">
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
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#6DB33F] hover:bg-[#8CCB55] text-[#1E1610] text-xs font-heading font-bold border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] transition-all active:translate-x-[1px] active:translate-y-[1px]"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedRecovery ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => router.push("/teacher")}
                className="w-full min-h-[46px] py-2.5 bg-[#6DB33F] hover:bg-[#8CCB55] text-[#1E1610] text-xs font-heading font-extrabold border-3 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] transition-all cursor-pointer flex items-center justify-center gap-2 active:translate-x-[1px] active:translate-y-[1px]"
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
                      Email or username <span className="text-[#D9453D]">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#7A4B2A] absolute left-3 top-3.5" />
                      <input
                        type="text"
                        required
                        value={studentUsername}
                        onChange={(e) => setStudentUsername(e.target.value)}
                        placeholder="e.g. riya or riya@student.margam.local"
                        className="w-full pl-9 pr-3 py-2.5 bg-[#E8CF9C] border-3 border-[#1E1610] text-xs font-sans text-[#1E1610] placeholder:text-[#5A3720]/60 focus:outline-none focus:ring-2 focus:ring-[#2F4FB5]"
                      />
                    </div>
                    <p className="text-[11px] text-slate-600 font-sans">Use your email or username.</p>
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
                        className="w-full pl-9 pr-3 py-2.5 bg-[#E8CF9C] border-3 border-[#1E1610] text-xs font-sans text-[#1E1610] placeholder:text-[#5A3720]/60 focus:outline-none focus:ring-2 focus:ring-[#2F4FB5]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || isLocked}
                    className="w-full min-h-[46px] py-2.5 bg-[#6DB33F] hover:bg-[#8CCB55] disabled:opacity-50 text-[#1E1610] text-xs font-heading font-extrabold border-3 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] transition-all cursor-pointer flex items-center justify-center gap-2 active:translate-x-[1px] active:translate-y-[1px]"
                  >
                    <span>{loading ? "Signing in..." : "Log in as student"}</span>
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
                      className="w-full px-3 py-2.5 bg-[#E8CF9C] border-3 border-[#1E1610] text-xs font-sans text-[#1E1610] placeholder:text-[#5A3720]/60 focus:outline-none focus:ring-2 focus:ring-[#2F4FB5]"
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
                        className="w-full pl-9 pr-3 py-2.5 bg-[#E8CF9C] border-3 border-[#1E1610] text-xs font-sans text-[#1E1610] placeholder:text-[#5A3720]/60 focus:outline-none focus:ring-2 focus:ring-[#2F4FB5]"
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
                        className="w-full pl-9 pr-3 py-2.5 bg-[#E8CF9C] border-3 border-[#1E1610] text-xs font-sans text-[#1E1610] placeholder:text-[#5A3720]/60 focus:outline-none focus:ring-2 focus:ring-[#2F4FB5]"
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
                              ? "bg-[#6DB33F] text-[#1E1610] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610]"
                              : "bg-[#E8CF9C] text-[#1E1610] hover:bg-[#D9B87A] border-2 border-[#1E1610]"
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
                      placeholder="e.g. DEMO10A"
                      className="w-full px-3 py-2.5 bg-[#E8CF9C] border-3 border-[#1E1610] text-xs font-mono font-bold tracking-wider uppercase text-[#1E1610] focus:outline-none focus:ring-2 focus:ring-[#2F4FB5]"
                    />
                    <p className="text-[10px] text-slate-500 font-sans">Leave blank if studying independently</p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || isLocked}
                    className="w-full min-h-[46px] py-2.5 bg-[#6DB33F] hover:bg-[#8CCB55] disabled:opacity-50 text-[#1E1610] text-xs font-heading font-extrabold border-3 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] transition-all cursor-pointer flex items-center justify-center gap-2 active:translate-x-[1px] active:translate-y-[1px]"
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
                        className="w-full pl-9 pr-3 py-2.5 bg-[#E8CF9C] border-3 border-[#1E1610] text-xs font-sans text-[#1E1610] placeholder:text-[#5A3720]/60 focus:outline-none focus:ring-2 focus:ring-[#2F4FB5]"
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
                        className="w-full pl-9 pr-3 py-2.5 bg-[#E8CF9C] border-3 border-[#1E1610] text-xs font-sans text-[#1E1610] placeholder:text-[#5A3720]/60 focus:outline-none focus:ring-2 focus:ring-[#2F4FB5]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || isLocked}
                    className="w-full min-h-[46px] py-2.5 bg-[#78BDE8] hover:bg-[#4EDBD3] disabled:opacity-50 text-[#1E1610] text-xs font-heading font-extrabold border-3 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] transition-all cursor-pointer flex items-center justify-center gap-2 active:translate-x-[1px] active:translate-y-[1px]"
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
                      className="w-full px-3 py-2.5 bg-[#E8CF9C] border-3 border-[#1E1610] text-xs font-sans text-[#1E1610] placeholder:text-[#5A3720]/60 focus:outline-none focus:ring-2 focus:ring-[#2F4FB5]"
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
                        className="w-full pl-9 pr-3 py-2.5 bg-[#E8CF9C] border-3 border-[#1E1610] text-xs font-sans text-[#1E1610] placeholder:text-[#5A3720]/60 focus:outline-none focus:ring-2 focus:ring-[#2F4FB5]"
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
                        className="w-full pl-9 pr-3 py-2.5 bg-[#E8CF9C] border-3 border-[#1E1610] text-xs font-sans text-[#1E1610] placeholder:text-[#5A3720]/60 focus:outline-none focus:ring-2 focus:ring-[#2F4FB5]"
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
                      className="w-full px-3 py-2.5 bg-[#E8CF9C] border-3 border-[#1E1610] text-xs font-sans text-[#1E1610] placeholder:text-[#5A3720]/60 focus:outline-none focus:ring-2 focus:ring-[#2F4FB5]"
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
                              ? "bg-[#78BDE8] text-[#1E1610] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610]"
                              : "bg-[#E8CF9C] text-[#1E1610] hover:bg-[#D9B87A] border-2 border-[#1E1610]"
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
                    className="w-full min-h-[46px] py-2.5 bg-[#78BDE8] hover:bg-[#4EDBD3] disabled:opacity-50 text-[#1E1610] text-xs font-heading font-extrabold border-3 border-[#1E1610] shadow-[2px_2px_0px_#1E1610] transition-all cursor-pointer flex items-center justify-center gap-2 active:translate-x-[1px] active:translate-y-[1px]"
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
      </main>

      {/* Lightweight Glass Footer */}
      <footer className="max-w-[1200px] mx-auto px-4 my-6 text-center text-xs font-sans font-medium text-emerald-950/70">
        Margam • Adaptive Mathematics for NCERT Classes 6–10
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="glass-panel p-6 rounded-2xl text-center">
            <p className="font-heading text-xs text-emerald-950 animate-pulse">Loading Portal...</p>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

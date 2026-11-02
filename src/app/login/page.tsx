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
} from "lucide-react";
import { handleLoginSync, setStorageMode, createLearnerProfile } from "@/lib/storage";
import { WitchCat } from "@/components/ui/WitchCat";
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
    // If no existing profile, create a default guest profile
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
    <div className="min-h-screen text-slate-800 flex flex-col justify-between">
      {/* Floating Top Glass Header */}
      <header className="max-w-[1240px] mx-auto mt-3 px-3 sm:px-6 w-full">
        <div className="glass-panel px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3 shadow-[0_8px_32px_rgba(16,42,18,0.1)] border border-white/70">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-sm border border-white/60 flex items-center justify-center text-white">
              <Compass className="w-4 h-4" />
            </div>
            <span className="font-heading font-extrabold text-base sm:text-lg text-emerald-950">MARGAM</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-emerald-900 hover:text-emerald-950 py-1.5 px-3 rounded-xl bg-white/70 hover:bg-white border border-white/80 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Realm</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-md mx-auto px-4 py-8 w-full flex-1 flex flex-col justify-center">
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
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#422816] border border-[#7A4B2A] text-[10px] font-heading font-bold text-[#FFE9A8] uppercase tracking-wider mb-1">
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
            <h1 className="text-xl sm:text-2xl font-pixel text-[#2B1B0F]">
              {isTeacherFlow ? "Teacher Portal" : "Student Portal"}
            </h1>
            <p className="text-xs text-[#5A3720] font-sans font-semibold">
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
              className={`p-3.5 border-[2px] border-[#422816] text-xs font-semibold flex items-start gap-2 ${
                isLocked ? "bg-[#FFE9A8] text-[#2B1B0F]" : "bg-[#D9453D] text-white"
              }`}
            >
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && !recoveryCode && !createdClassCode && (
            <div className="p-3.5 border-[2px] border-[#422816] bg-[#5DAA3A] text-white text-xs font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0 text-white" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* RECOVERY CODE MODAL (STUDENT SIGN-UP ONLY) */}
          {recoveryCode && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 bg-[#FFE9A8] border-[2px] border-[#422816] space-y-2.5 text-[#2B1B0F]">
                <div className="flex items-center gap-2 font-pixel text-xs">
                  <KeyRound className="w-4 h-4 text-[#A06A3C]" />
                  <span>One-Time Account Recovery Code</span>
                </div>
                <p className="text-xs text-[#2B1B0F] leading-relaxed font-semibold font-sans">
                  ⚠️ <strong>IMPORTANT:</strong> Passwords cannot be reset by email because we do not collect your email or phone.
                  This code is shown <strong>ONLY ONCE</strong>.
                </p>

                <div className="bg-white p-3 border-[2px] border-[#422816] flex items-center justify-between gap-2">
                  <code className="font-mono text-sm sm:text-base font-extrabold tracking-wider text-[#2B1B0F] select-all">
                    {recoveryCode}
                  </code>
                  <button
                    type="button"
                    onClick={copyRecoveryCode}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#5DAA3A] hover:bg-[#4E9330] text-white text-xs font-pixel border border-[#422816] transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedRecovery ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
              </div>

              <label className="flex items-start gap-2.5 text-xs text-[#5A3720] cursor-pointer pt-1 font-semibold">
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
                className="w-full min-h-[48px] py-3 bg-[#5DAA3A] hover:bg-[#4E9330] disabled:opacity-50 text-white text-xs font-pixel border-[2px] border-[#422816] shadow-[3px_3px_0px_#1B120C] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Continue to Learning Path</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* TEACHER CLASS CODE MODAL */}
          {createdClassCode && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 bg-[#FFE9A8] border-[2px] border-[#422816] space-y-2.5 text-[#2B1B0F]">
                <div className="flex items-center gap-2 font-pixel text-xs">
                  <Sparkles className="w-4 h-4 text-[#5DAA3A]" />
                  <span>Class Code Generated!</span>
                </div>
                <p className="text-xs text-[#2B1B0F] leading-relaxed font-sans font-semibold">
                  Share this class code with your students so they can link their diagnostic quizzes to your teacher dashboard:
                </p>
                <div className="bg-white p-3 border-[2px] border-[#422816] flex items-center justify-between">
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
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#5DAA3A] hover:bg-[#4E9330] text-white text-xs font-pixel border border-[#422816] transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedRecovery ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => router.push("/teacher")}
                className="w-full min-h-[48px] py-3 bg-[#5DAA3A] hover:bg-[#4E9330] text-white text-xs font-pixel border-[2px] border-[#422816] shadow-[3px_3px_0px_#1B120C] transition-all cursor-pointer flex items-center justify-center gap-2"
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
                        className="w-full pl-9 pr-3 py-2.5 bg-white border-[2px] border-[#422816] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#5DAA3A]"
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
                        className="w-full pl-9 pr-3 py-2.5 bg-white border-[2px] border-[#422816] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#5DAA3A]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || isLocked}
                    className="w-full min-h-[48px] py-3 bg-[#5DAA3A] hover:bg-[#4E9330] disabled:opacity-50 text-white text-xs font-pixel border-[2px] border-[#422816] shadow-[3px_3px_0px_#1B120C] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>{loading ? "Signing In..." : "Log In to Student Realm"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={handleGuestContinue}
                      className="text-xs font-heading font-bold text-[#7A4B2A] hover:text-[#2B1B0F] underline"
                    >
                      Or continue without an account as Guest
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleStudentSignUp} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#2B1B0F] block">
                      Choose Username <span className="text-[#D9453D]">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#7A4B2A] absolute left-3 top-3.5" />
                      <input
                        type="text"
                        required
                        value={studentUsername}
                        onChange={(e) => setStudentUsername(e.target.value)}
                        placeholder="3–20 characters (e.g. rahul_quest)"
                        pattern="^[a-zA-Z0-9_]{3,20}$"
                        title="Username must be 3-20 characters long and contain only letters, numbers, and underscores"
                        className="w-full pl-9 pr-3 py-2.5 bg-white border-[2px] border-[#422816] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#5DAA3A]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#2B1B0F] block">
                      Player Name (Display Name)
                    </label>
                    <input
                      type="text"
                      value={studentFullName}
                      onChange={(e) => setStudentFullName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3 py-2.5 bg-white border-[2px] border-[#422816] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#5DAA3A]"
                    />
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
                        className="w-full pl-9 pr-3 py-2.5 bg-white border-[2px] border-[#422816] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#5DAA3A]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#2B1B0F] block">
                      Select Your Grade <span className="text-[#D9453D]">*</span>
                    </label>
                    <div className="grid grid-cols-5 gap-1.5">
                      {[6, 7, 8, 9, 10].map((grade) => (
                        <button
                          key={grade}
                          type="button"
                          onClick={() => setStudentClass(grade)}
                          className={`py-2 text-xs font-pixel border-[2px] border-[#422816] transition-all cursor-pointer ${
                            studentClass === grade
                              ? "bg-[#5DAA3A] text-white shadow-[2px_2px_0px_#1B120C]"
                              : "bg-white text-[#2B1B0F] hover:bg-[#FFE9A8]"
                          }`}
                        >
                          C{grade}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#2B1B0F] block">
                      Teacher Class Code <span className="text-[10px] text-[#7A4B2A] font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={studentClassCode}
                      onChange={(e) => setStudentClassCode(e.target.value)}
                      placeholder="e.g. MGM-C10-A1B2"
                      className="w-full px-3 py-2.5 bg-white border-[2px] border-[#422816] text-xs font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#5DAA3A]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || isLocked}
                    className="w-full min-h-[48px] py-3 bg-[#5DAA3A] hover:bg-[#4E9330] disabled:opacity-50 text-white text-xs font-pixel border-[2px] border-[#422816] shadow-[3px_3px_0px_#1B120C] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>{loading ? "Creating Account..." : "Create Student Account"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* Portal Switcher */}
              <div className="pt-4 border-t-2 border-[#E5D7BE] text-center">
                <Link
                  href="/login?role=teacher"
                  className="text-xs font-heading font-bold text-[#3FA7C9] hover:underline inline-flex items-center gap-1"
                >
                  <School className="w-3.5 h-3.5" />
                  <span>Educator or Teacher? Switch to Teacher Portal</span>
                </Link>
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
                        className="w-full pl-9 pr-3 py-2.5 bg-white border-[2px] border-[#422816] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#3FA7C9]"
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
                        className="w-full pl-9 pr-3 py-2.5 bg-white border-[2px] border-[#422816] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#3FA7C9]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || isLocked}
                    className="w-full min-h-[48px] py-3 bg-[#3FA7C9] hover:bg-[#348EA8] disabled:opacity-50 text-white text-xs font-pixel border-[2px] border-[#422816] shadow-[3px_3px_0px_#1B120C] transition-all cursor-pointer flex items-center justify-center gap-2"
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
                      className="w-full px-3 py-2.5 bg-white border-[2px] border-[#422816] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#3FA7C9]"
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
                        className="w-full pl-9 pr-3 py-2.5 bg-white border-[2px] border-[#422816] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#3FA7C9]"
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
                        className="w-full pl-9 pr-3 py-2.5 bg-white border-[2px] border-[#422816] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#3FA7C9]"
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
                      className="w-full px-3 py-2.5 bg-white border-[2px] border-[#422816] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#3FA7C9]"
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
                          className={`py-2 text-xs font-pixel border-[2px] border-[#422816] transition-all cursor-pointer ${
                            teacherGrade === grade
                              ? "bg-[#3FA7C9] text-white shadow-[2px_2px_0px_#1B120C]"
                              : "bg-white text-[#2B1B0F] hover:bg-[#FFE9A8]"
                          }`}
                        >
                          C{grade}
                        </button>
                      ))}
                    </div>
                  </div>

                  <label className="flex items-start gap-2.5 text-xs text-[#5A3720] cursor-pointer pt-1 font-semibold">
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
                    className="w-full min-h-[48px] py-3 bg-[#3FA7C9] hover:bg-[#348EA8] disabled:opacity-50 text-white text-xs font-pixel border-[2px] border-[#422816] shadow-[3px_3px_0px_#1B120C] transition-all cursor-pointer flex items-center justify-center gap-2"
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
      <footer className="max-w-[1240px] mx-auto px-4 my-6 text-center text-xs font-sans font-medium text-emerald-950/70">
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

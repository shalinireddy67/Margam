"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Lock,
  User,
  KeyRound,
  AlertTriangle,
  CheckCircle,
  Copy,
  ArrowRight,
  Mail,
} from "lucide-react";
import {
  handleLoginSync,
  setStorageMode,
  createLearnerProfile,
  getActiveProfile,
  saveProfile,
} from "@/lib/storage";
import { DEMO_SCHOOL_CONFIG, DEMO_STUDENTS } from "@/lib/demo/demo-school-data";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");
  const modeParam = searchParams.get("mode");
  const isTeacherFlow = roleParam === "teacher";

  // Mode: "signin" or "signup"
  const [subMode, setSubMode] = useState<"signin" | "signup">(
    modeParam === "signup" ? "signup" : "signin"
  );
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Demo submitting state
  const [demoSubmitting, setDemoSubmitting] = useState<string | null>(null);

  // Copy state for manual credentials
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

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

  // Recovery code & class code states
  const [recoveryCode, setRecoveryCode] = useState<string | null>(null);
  const [copiedRecovery, setCopiedRecovery] = useState(false);
  const [savedRecoveryCodeCheckbox, setSavedRecoveryCodeCheckbox] = useState(false);
  const [createdClassCode, setCreatedClassCode] = useState<string | null>(null);

  // Lockout state
  const [isLocked, setIsLocked] = useState(false);

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
        setStudentUsername("student07");
        setStudentPassword(DEMO_SCHOOL_CONFIG.demoPassword);
      }
    }
  }, [searchParams, isTeacherFlow]);

  const resetMessages = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const copyToClipboard = (key: string, text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const copyRecoveryCode = () => {
    if (recoveryCode) {
      copyToClipboard("recovery", recoveryCode);
      setCopiedRecovery(true);
      setTimeout(() => setCopiedRecovery(false), 2500);
    }
  };

  // Demo login handler
  const handleDemoLogin = async (role: "teacher" | "student", studentUser = "student07") => {
    resetMessages();
    setDemoSubmitting(role === "teacher" ? "teacher" : studentUser);
    try {
      const res = await fetch("/api/auth/demo-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          username: role === "student" ? studentUser : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Demo sign in failed.");
        return;
      }

      if (data.user) {
        await handleLoginSync(data.user);

        // Ensure unfixed gap is present on student profile so "Fix this first" renders live
        if (role === "student") {
          const demoStudent = DEMO_STUDENTS.find((s) => s.username === studentUser);
          if (demoStudent?.identifiedGap) {
            const active = getActiveProfile();
            if (active) {
              active.activeGap = {
                currentConceptId: "c10-quad-02",
                rootConceptId: demoStudent.identifiedGap.conceptId,
                plainLanguageReason: demoStudent.identifiedGap.reason,
                prerequisitePath: [
                  demoStudent.identifiedGap.conceptId,
                  "c8-dist-01",
                  "c9-id-01",
                  "c10-quad-02",
                ],
                confirmationQuestionIds: [],
                status: "confirmed",
              };
              saveProfile(active);
            }
          }
        }
      }

      if (data.role === "teacher") {
        setStorageMode("supabase");
      }
      router.push(data.redirectUrl || (data.role === "teacher" ? "/teacher" : "/student"));
    } catch {
      setErrorMessage("Network error during demo sign in.");
    } finally {
      setDemoSubmitting(null);
    }
  };

  // Student sign-in
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
        setErrorMessage(
          data.error ||
            "Account temporarily locked for 15 minutes due to consecutive failed attempts."
        );
        setLoading(false);
        return;
      }

      if (!res.ok) {
        const warning = data.attemptsRemaining
          ? ` (${data.attemptsRemaining} attempts remaining before 15-minute lockout)`
          : "";
        setErrorMessage((data.error || "Invalid username or password.") + warning);
        setLoading(false);
        return;
      }

      await handleLoginSync(data.user);
      router.push("/student");
    } catch {
      setErrorMessage("Network error during student sign in.");
    } finally {
      setLoading(false);
    }
  };

  // Student sign-up
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
      setSuccessMessage("Student account created successfully.");
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

  // Teacher sign-in
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
        setErrorMessage(
          data.error ||
            "Account temporarily locked for 15 minutes due to consecutive failed attempts."
        );
        setLoading(false);
        return;
      }

      if (!res.ok) {
        const warning = data.attemptsRemaining
          ? ` (${data.attemptsRemaining} attempts remaining before 15-minute lockout)`
          : "";
        setErrorMessage((data.error || "Invalid email or password.") + warning);
        setLoading(false);
        return;
      }

      setStorageMode("supabase");
      router.push("/teacher");
    } catch {
      setErrorMessage("Network error during teacher sign in.");
    } finally {
      setLoading(false);
    }
  };

  // Teacher sign-up
  const handleTeacherSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!teacherConsent) {
      setErrorMessage("Please confirm you are a teacher authorized to create a class.");
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
      setSuccessMessage(data.message || "Teacher account created.");
    } catch {
      setErrorMessage("Network error during teacher registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* ============================================================= */}
      {/* 1. REAL SIGN-IN FORM (COMES FIRST)                            */}
      {/* ============================================================= */}
      <div className="bg-white border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] rounded-[2px] p-6 sm:p-8 space-y-6 text-[#2B1B0F]">


        {/* Heading & Role Label */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 border-2 border-[#2B1B0F] text-[10px] font-heading font-extrabold uppercase tracking-wider mb-1 rounded-[2px] shadow-[1px_1px_0px_#2B1B0F] bg-[#FFF7E6] text-[#2B1B0F]">
            <span>{isTeacherFlow ? "Teacher" : "Student"}</span>
          </div>
          <h1 className="text-lg sm:text-xl font-pixel text-[#2B1B0F]">
            {isTeacherFlow ? "Teacher sign in" : "Student sign in"}
          </h1>
          <p className="text-xs sm:text-sm text-[#2B1B0F]/80 font-sans">
            {isTeacherFlow
              ? "Manage your class and see which earlier topics your students are missing."
              : "Diagnose prerequisite gaps and fix them one step at a time."}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        {!recoveryCode && !createdClassCode && (
          <div className="grid grid-cols-2 gap-1.5 bg-[#FFF7E6] p-1.5 border-2 border-[#2B1B0F] rounded-[2px] text-xs font-heading">
            <button
              type="button"
              onClick={() => {
                setSubMode("signin");
                resetMessages();
              }}
              className={`py-2 px-1.5 transition-all cursor-pointer min-h-[40px] flex items-center justify-center rounded-[2px] ${
                subMode === "signin"
                  ? "bg-[#5DAA3A] text-[#2B1B0F] font-bold border-2 border-[#2B1B0F] shadow-[2px_2px_0px_#2B1B0F]"
                  : "text-[#2B1B0F]/70 hover:text-[#2B1B0F]"
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => {
                setSubMode("signup");
                resetMessages();
              }}
              className={`py-2 px-1.5 transition-all cursor-pointer min-h-[40px] flex items-center justify-center rounded-[2px] ${
                subMode === "signup"
                  ? "bg-[#5DAA3A] text-[#2B1B0F] font-bold border-2 border-[#2B1B0F] shadow-[2px_2px_0px_#2B1B0F]"
                  : "text-[#2B1B0F]/70 hover:text-[#2B1B0F]"
              }`}
            >
              Create an account
            </button>
          </div>
        )}

        {/* Alerts */}
        {errorMessage && (
          <div
            className={`p-3.5 border-2 border-[#2B1B0F] rounded-[2px] text-xs font-semibold flex items-start gap-2 shadow-[2px_2px_0px_#2B1B0F] ${
              isLocked ? "bg-[#FFE9A8] text-[#2B1B0F]" : "bg-[#FEE2E2] text-[#991B1B]"
            }`}
          >
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && !recoveryCode && !createdClassCode && (
          <div className="p-3.5 border-2 border-[#2B1B0F] bg-[#E8F8E5] text-[#166534] text-xs font-semibold rounded-[2px] flex items-center gap-2 shadow-[2px_2px_0px_#2B1B0F]">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* RECOVERY CODE MODAL (STUDENT SIGN-UP ONLY) */}
        {recoveryCode && (
          <div className="space-y-4 animate-in fade-in">
            <div className="p-4 bg-[#FFFDF7] border-[3px] border-[#2B1B0F] shadow-[3px_3px_0px_#2B1B0F] space-y-3 text-[#2B1B0F] rounded-[2px]">
              <div className="flex items-center gap-2 font-heading font-bold text-xs text-[#2B1B0F]">
                <KeyRound className="w-4 h-4 text-[#7A4B2A]" />
                <span>Account recovery code</span>
              </div>
              <p className="text-xs text-[#2B1B0F] leading-relaxed font-sans">
                Save this code now. We do not ask for email or phone numbers, so passwords cannot be reset by email.
              </p>

              <div className="bg-white p-3 border-2 border-[#2B1B0F] shadow-[2px_2px_0px_#2B1B0F] flex items-center justify-between gap-2 rounded-[2px]">
                <code className="font-mono text-sm sm:text-base font-bold tracking-wider text-[#2B1B0F] select-all">
                  {recoveryCode}
                </code>
                <button
                  type="button"
                  onClick={copyRecoveryCode}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#5DAA3A] hover:bg-[#6EB5FF] text-[#2B1B0F] text-xs font-heading font-bold border-2 border-[#2B1B0F] shadow-[1px_1px_0px_#2B1B0F] transition-all cursor-pointer rounded-[2px]"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedRecovery ? "Copied" : "Copy"}</span>
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
              <span>I have safely noted down my recovery code.</span>
            </label>

            <button
              type="button"
              disabled={!savedRecoveryCodeCheckbox}
              onClick={() => router.push("/student")}
              className="w-full min-h-[44px] py-2.5 bg-[#5DAA3A] hover:bg-[#6EB5FF] disabled:opacity-40 disabled:cursor-not-allowed text-[#2B1B0F] text-xs font-heading font-bold border-[3px] border-[#2B1B0F] shadow-[3px_3px_0px_#2B1B0F] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-2 rounded-[2px]"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* TEACHER CLASS CODE MODAL */}
        {createdClassCode && (
          <div className="space-y-4 animate-in fade-in">
            <div className="p-4 bg-[#FFF7E6] border-2 border-[#2B1B0F] shadow-[3px_3px_0px_#2B1B0F] rounded-[2px] space-y-2 text-[#2B1B0F]">
              <h2 className="font-heading font-bold text-sm">Class code generated</h2>
              <p className="text-xs text-[#2B1B0F] leading-relaxed font-sans">
                Share this class code with your students to link them to your dashboard:
              </p>
              <div className="bg-white p-3 border-2 border-[#2B1B0F] rounded-[2px] shadow-[2px_2px_0px_#2B1B0F] flex items-center justify-between">
                <code className="font-mono text-base font-bold tracking-widest text-[#2B1B0F]">
                  {createdClassCode}
                </code>
                <button
                  type="button"
                  onClick={() => {
                    copyToClipboard("classCode", createdClassCode);
                    setCopiedRecovery(true);
                    setTimeout(() => setCopiedRecovery(false), 2000);
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#5DAA3A] text-[#2B1B0F] text-xs font-heading font-bold border-2 border-[#2B1B0F] rounded-[2px] shadow-[1px_1px_0px_#2B1B0F] transition-all"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedRecovery ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.push("/teacher")}
              className="w-full min-h-[44px] py-2.5 bg-[#5DAA3A] hover:bg-[#6EB5FF] text-[#2B1B0F] text-xs font-heading font-bold border-[3px] border-[#2B1B0F] rounded-[2px] shadow-[3px_3px_0px_#2B1B0F] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Open teacher dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STUDENT FLOW FORMS */}
        {!isTeacherFlow && !recoveryCode && (
          <>
            {subMode === "signin" ? (
              <form onSubmit={handleStudentSignIn} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#2B1B0F] block">
                    Student username <span className="text-[#D9453D]">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#7A4B2A] absolute left-3 top-3.5" />
                    <input
                      type="text"
                      required
                      value={studentUsername}
                      onChange={(e) => setStudentUsername(e.target.value)}
                      placeholder="e.g. priya_maths"
                      className="w-full pl-9 pr-3 py-2.5 bg-white rounded-[2px] border-2 border-[#2B1B0F] text-xs font-sans text-[#2B1B0F] placeholder:text-[#2B1B0F]/40 focus:outline-none focus:ring-2 focus:ring-[#5DAA3A] shadow-[2px_2px_0px_#2B1B0F]"
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
                      className="w-full pl-9 pr-3 py-2.5 bg-white rounded-[2px] border-2 border-[#2B1B0F] text-xs font-sans text-[#2B1B0F] placeholder:text-[#2B1B0F]/40 focus:outline-none focus:ring-2 focus:ring-[#5DAA3A] shadow-[2px_2px_0px_#2B1B0F]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || isLocked}
                  className="w-full min-h-[44px] py-2.5 bg-[#5DAA3A] hover:bg-[#6EB5FF] disabled:opacity-50 text-[#2B1B0F] text-xs font-heading font-bold border-[3px] border-[#2B1B0F] shadow-[3px_3px_0px_#2B1B0F] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-2 rounded-[2px]"
                >
                  <span>{loading ? "Signing in..." : "Sign in"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleStudentSignUp} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#2B1B0F] block">
                    Full name (optional)
                  </label>
                  <input
                    type="text"
                    value={studentFullName}
                    onChange={(e) => setStudentFullName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full px-3 py-2.5 bg-white rounded-[2px] border-2 border-[#2B1B0F] text-xs font-sans text-[#2B1B0F] placeholder:text-[#2B1B0F]/40 focus:outline-none focus:ring-2 focus:ring-[#5DAA3A] shadow-[2px_2px_0px_#2B1B0F]"
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
                      className="w-full pl-9 pr-3 py-2.5 bg-white rounded-[2px] border-2 border-[#2B1B0F] text-xs font-sans text-[#2B1B0F] placeholder:text-[#2B1B0F]/40 focus:outline-none focus:ring-2 focus:ring-[#5DAA3A] shadow-[2px_2px_0px_#2B1B0F]"
                    />
                  </div>
                  <p className="text-[10px] text-[#7A4B2A] font-sans">
                    3–20 characters, letters/numbers/underscores only
                  </p>
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
                      className="w-full pl-9 pr-3 py-2.5 bg-white rounded-[2px] border-2 border-[#2B1B0F] text-xs font-sans text-[#2B1B0F] placeholder:text-[#2B1B0F]/40 focus:outline-none focus:ring-2 focus:ring-[#5DAA3A] shadow-[2px_2px_0px_#2B1B0F]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#2B1B0F] block">
                    Select class <span className="text-[#D9453D]">*</span>
                  </label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {[6, 7, 8, 9, 10].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setStudentClass(c)}
                        className={`py-2 text-xs font-heading font-bold rounded-[2px] border-2 border-[#2B1B0F] transition-all cursor-pointer ${
                          studentClass === c
                            ? "bg-[#5DAA3A] text-[#2B1B0F] shadow-[2px_2px_0px_#2B1B0F]"
                            : "bg-white text-[#2B1B0F] hover:bg-[#FFF7E6]"
                        }`}
                      >
                        Class {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#2B1B0F] block">
                    Class code (optional)
                  </label>
                  <input
                    type="text"
                    value={studentClassCode}
                    onChange={(e) => setStudentClassCode(e.target.value.toUpperCase())}
                    placeholder="e.g. DEMO-10A"
                    className="w-full px-3 py-2.5 bg-white rounded-[2px] border-2 border-[#2B1B0F] text-xs font-mono font-bold tracking-wider uppercase focus:outline-none focus:ring-2 focus:ring-[#5DAA3A] shadow-[2px_2px_0px_#2B1B0F]"
                  />
                  <p className="text-[10px] text-[#7A4B2A] font-sans">
                    Leave blank if learning independently
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading || isLocked}
                  className="w-full min-h-[44px] py-2.5 bg-[#5DAA3A] hover:bg-[#6EB5FF] disabled:opacity-50 text-[#2B1B0F] text-xs font-heading font-bold border-[3px] border-[#2B1B0F] shadow-[3px_3px_0px_#2B1B0F] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-2 rounded-[2px]"
                >
                  <span>{loading ? "Creating account..." : "Create account"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Guest / Teacher Switcher */}
            <div className="pt-4 border-t-2 border-[#2B1B0F]/15 space-y-3 text-center">
              <button
                type="button"
                onClick={handleGuestContinue}
                className="text-xs font-sans font-semibold text-[#5A3720] hover:text-[#2B1B0F] underline cursor-pointer"
              >
                Continue as guest
              </button>
              <div>
                <Link
                  href="/login?role=teacher"
                  className="text-xs font-heading font-bold text-[#1E6F8C] hover:underline"
                >
                  Are you a teacher? Switch to teacher sign in
                </Link>
              </div>
            </div>
          </>
        )}

        {/* TEACHER FLOW FORMS */}
        {isTeacherFlow && !createdClassCode && (
          <>
            {subMode === "signin" ? (
              <form onSubmit={handleTeacherSignIn} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#2B1B0F] block">
                    Teacher email <span className="text-[#D9453D]">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#7A4B2A] absolute left-3 top-3.5" />
                    <input
                      type="email"
                      required
                      value={teacherEmail}
                      onChange={(e) => setTeacherEmail(e.target.value)}
                      placeholder="teacher@school.edu.in"
                      className="w-full pl-9 pr-3 py-2.5 bg-white rounded-[2px] border-2 border-[#2B1B0F] text-xs font-sans text-[#2B1B0F] placeholder:text-[#2B1B0F]/40 focus:outline-none focus:ring-2 focus:ring-[#3FA7C9] shadow-[2px_2px_0px_#2B1B0F]"
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
                      className="w-full pl-9 pr-3 py-2.5 bg-white rounded-[2px] border-2 border-[#2B1B0F] text-xs font-sans text-[#2B1B0F] placeholder:text-[#2B1B0F]/40 focus:outline-none focus:ring-2 focus:ring-[#3FA7C9] shadow-[2px_2px_0px_#2B1B0F]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || isLocked}
                  className="w-full min-h-[44px] py-2.5 bg-[#5DAA3A] hover:bg-[#6EB5FF] disabled:opacity-50 text-[#2B1B0F] text-xs font-heading font-bold border-[3px] border-[#2B1B0F] shadow-[3px_3px_0px_#2B1B0F] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-2 rounded-[2px]"
                >
                  <span>{loading ? "Signing in..." : "Sign in"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleTeacherSignUp} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#2B1B0F] block">
                    Full name <span className="text-[#D9453D]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={teacherFullName}
                    onChange={(e) => setTeacherFullName(e.target.value)}
                    placeholder="e.g. Shalini Reddy"
                    className="w-full px-3 py-2.5 bg-white rounded-[2px] border-2 border-[#2B1B0F] text-xs font-sans text-[#2B1B0F] placeholder:text-[#2B1B0F]/40 focus:outline-none focus:ring-2 focus:ring-[#3FA7C9] shadow-[2px_2px_0px_#2B1B0F]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#2B1B0F] block">
                    Teacher email <span className="text-[#D9453D]">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#7A4B2A] absolute left-3 top-3.5" />
                    <input
                      type="email"
                      required
                      value={teacherEmail}
                      onChange={(e) => setTeacherEmail(e.target.value)}
                      placeholder="teacher@school.edu.in"
                      className="w-full pl-9 pr-3 py-2.5 bg-white rounded-[2px] border-2 border-[#2B1B0F] text-xs font-sans text-[#2B1B0F] placeholder:text-[#2B1B0F]/40 focus:outline-none focus:ring-2 focus:ring-[#3FA7C9] shadow-[2px_2px_0px_#2B1B0F]"
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
                      className="w-full pl-9 pr-3 py-2.5 bg-white rounded-[2px] border-2 border-[#2B1B0F] text-xs font-sans text-[#2B1B0F] placeholder:text-[#2B1B0F]/40 focus:outline-none focus:ring-2 focus:ring-[#3FA7C9] shadow-[2px_2px_0px_#2B1B0F]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#2B1B0F] block">
                    Initial class name <span className="text-[#D9453D]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={teacherClassName}
                    onChange={(e) => setTeacherClassName(e.target.value)}
                    placeholder="e.g. Class 10-A Maths"
                    className="w-full px-3 py-2.5 bg-white rounded-[2px] border-2 border-[#2B1B0F] text-xs font-sans text-[#2B1B0F] placeholder:text-[#2B1B0F]/40 focus:outline-none focus:ring-2 focus:ring-[#3FA7C9] shadow-[2px_2px_0px_#2B1B0F]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#2B1B0F] block">
                    Class grade <span className="text-[#D9453D]">*</span>
                  </label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {[6, 7, 8, 9, 10].map((grade) => (
                      <button
                        key={grade}
                        type="button"
                        onClick={() => setTeacherGrade(grade)}
                        className={`py-2 text-xs font-heading font-bold rounded-[2px] border-2 border-[#2B1B0F] transition-all cursor-pointer ${
                          teacherGrade === grade
                            ? "bg-[#3FA7C9] text-[#2B1B0F] shadow-[2px_2px_0px_#2B1B0F]"
                            : "bg-white text-[#2B1B0F] hover:bg-[#FFF7E6]"
                        }`}
                      >
                        Class {grade}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="flex items-start gap-2.5 text-xs text-[#2B1B0F] cursor-pointer pt-1 font-semibold">
                  <input
                    type="checkbox"
                    checked={teacherConsent}
                    onChange={(e) => setTeacherConsent(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded-none accent-[#3FA7C9] border-2 border-[#2B1B0F]"
                  />
                  <span>
                    I confirm that I am a teacher setting up a classroom.
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={loading || isLocked}
                  className="w-full min-h-[44px] py-2.5 bg-[#5DAA3A] hover:bg-[#6EB5FF] disabled:opacity-50 text-[#2B1B0F] text-xs font-heading font-bold border-[3px] border-[#2B1B0F] shadow-[3px_3px_0px_#2B1B0F] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-2 rounded-[2px]"
                >
                  <span>{loading ? "Creating account..." : "Create account"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Role Switcher */}
            <div className="pt-4 border-t-2 border-[#2B1B0F]/15 text-center">
              <Link
                href="/login?role=student"
                className="text-xs font-heading font-bold text-[#5DAA3A] hover:underline"
              >
                Are you a student? Switch to student sign in
              </Link>
            </div>
          </>
        )}
      </div>

      {/* ============================================================= */}
      {/* 2. JUDGES PANEL (MOVES BELOW THE FORM AS COLLAPSED DETAILS)   */}
      {/* ============================================================= */}
      <details className="group border-[3px] border-[#2B1B0F] bg-white shadow-[4px_4px_0px_#2B1B0F] rounded-[2px] overflow-hidden">
        <summary className="px-5 py-4 cursor-pointer font-heading font-bold text-base sm:text-lg text-[#2B1B0F] bg-[#FFF7E6] hover:bg-[#FFE9A8] transition-colors flex items-center justify-between select-none">
          <span>Judges: try it without signing up</span>
          <span className="text-xs font-sans text-[#7A4B2A] font-semibold group-open:rotate-180 transition-transform">
            ▼
          </span>
        </summary>

        <div className="p-5 sm:p-6 space-y-5 bg-white border-t-[3px] border-[#2B1B0F]">
          <div>
            <h2 className="text-base sm:text-lg font-heading font-bold text-[#2B1B0F]">
              Judges: try it without signing up
            </h2>
            <p className="text-xs sm:text-sm text-[#2B1B0F]/80 font-sans mt-0.5">
              The data is made up: one class of 25 students. Pick a role.
            </p>
          </div>

          {/* Exactly two actions: Equal cards (student in sky, teacher in plank), 3px border, hard shadow, no gradients, no icons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Action 1: Student (Sky) */}
            <div className="p-5 bg-[#E8F4F8] border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] rounded-[2px] flex flex-col justify-between space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#1E6F8C] block">
                  Student role
                </span>
                <h3 className="font-heading font-bold text-base text-[#2B1B0F]">
                  Advik Verma
                </h3>
                <p className="text-xs text-[#2B1B0F]/85 font-sans leading-relaxed">
                  Advik hasn&apos;t fixed his gap in integer signs yet. Start at &apos;Fix this first&apos;.
                </p>
              </div>

              <button
                type="button"
                disabled={demoSubmitting !== null}
                onClick={() => handleDemoLogin("student", "student07")}
                className="w-full min-h-[44px] px-4 py-2.5 bg-[#5DAA3A] hover:bg-[#6EB5FF] text-[#2B1B0F] text-xs font-heading font-bold border-2 border-[#2B1B0F] shadow-[2px_2px_0px_#2B1B0F] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-1.5 rounded-[2px] disabled:opacity-60"
              >
                <span>
                  {demoSubmitting === "student07" ? "Signing in..." : "Open as Advik Verma"}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Action 2: Teacher (Plank) */}
            <div className="p-5 bg-[#F5EBE1] border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] rounded-[2px] flex flex-col justify-between space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#7A4B2A] block">
                  Teacher role
                </span>
                <h3 className="font-heading font-bold text-base text-[#2B1B0F]">
                  Demo Teacher
                </h3>
                <p className="text-xs text-[#2B1B0F]/85 font-sans leading-relaxed">
                  Class 10-A (demo) with 25 students and prerequisite gap heatmaps.
                </p>
              </div>

              <button
                type="button"
                disabled={demoSubmitting !== null}
                onClick={() => handleDemoLogin("teacher")}
                className="w-full min-h-[44px] px-4 py-2.5 bg-[#5DAA3A] hover:bg-[#6EB5FF] text-[#2B1B0F] text-xs font-heading font-bold border-2 border-[#2B1B0F] shadow-[2px_2px_0px_#2B1B0F] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-1.5 rounded-[2px] disabled:opacity-60"
              >
                <span>
                  {demoSubmitting === "teacher" ? "Signing in..." : "Open the teacher dashboard"}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Manual Credentials: Nested details "Sign in by hand instead" */}
          <details className="border-2 border-[#2B1B0F] bg-[#FFF7E6] rounded-[2px] p-3 text-xs text-[#2B1B0F]">
            <summary className="font-heading font-bold cursor-pointer hover:underline select-none">
              Sign in by hand instead
            </summary>
            <div className="pt-3 space-y-2.5 font-sans">
              <div className="flex flex-wrap items-center justify-between gap-1 border-b border-[#2B1B0F]/20 pb-2">
                <span>
                  Teacher email:{" "}
                  <code className="font-mono bg-white px-1.5 py-0.5 border border-[#2B1B0F]">
                    {DEMO_SCHOOL_CONFIG.teacher.email}
                  </code>
                </span>
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard("teacherEmail", DEMO_SCHOOL_CONFIG.teacher.email)
                  }
                  className="px-2 py-0.5 bg-white border border-[#2B1B0F] font-heading font-bold text-[10px] hover:bg-[#FFE9A8]"
                >
                  {copiedKey === "teacherEmail" ? "Copied" : "Copy"}
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-1 border-b border-[#2B1B0F]/20 pb-2">
                <span>
                  Teacher password:{" "}
                  <code className="font-mono bg-white px-1.5 py-0.5 border border-[#2B1B0F]">
                    {DEMO_SCHOOL_CONFIG.demoPassword}
                  </code>
                </span>
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard("teacherPass", DEMO_SCHOOL_CONFIG.demoPassword)
                  }
                  className="px-2 py-0.5 bg-white border border-[#2B1B0F] font-heading font-bold text-[10px] hover:bg-[#FFE9A8]"
                >
                  {copiedKey === "teacherPass" ? "Copied" : "Copy"}
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-1 border-b border-[#2B1B0F]/20 pb-2">
                <span>
                  Student username:{" "}
                  <code className="font-mono bg-white px-1.5 py-0.5 border border-[#2B1B0F]">
                    student07
                  </code>
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard("stuUser", "student07")}
                  className="px-2 py-0.5 bg-white border border-[#2B1B0F] font-heading font-bold text-[10px] hover:bg-[#FFE9A8]"
                >
                  {copiedKey === "stuUser" ? "Copied" : "Copy"}
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-1 border-b border-[#2B1B0F]/20 pb-2">
                <span>
                  Student password:{" "}
                  <code className="font-mono bg-white px-1.5 py-0.5 border border-[#2B1B0F]">
                    {DEMO_SCHOOL_CONFIG.demoPassword}
                  </code>
                </span>
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard("stuPass", DEMO_SCHOOL_CONFIG.demoPassword)
                  }
                  className="px-2 py-0.5 bg-white border border-[#2B1B0F] font-heading font-bold text-[10px] hover:bg-[#FFE9A8]"
                >
                  {copiedKey === "stuPass" ? "Copied" : "Copy"}
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-1">
                <span>
                  Class code:{" "}
                  <code className="font-mono bg-white px-1.5 py-0.5 border border-[#2B1B0F]">
                    {DEMO_SCHOOL_CONFIG.classCode}
                  </code>
                </span>
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard("classCode", DEMO_SCHOOL_CONFIG.classCode)
                  }
                  className="px-2 py-0.5 bg-white border border-[#2B1B0F] font-heading font-bold text-[10px] hover:bg-[#FFE9A8]"
                >
                  {copiedKey === "classCode" ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          </details>
        </div>
      </details>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Compass,
  ArrowLeft,
  Lock,
  User,
  GraduationCap,
  KeyRound,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  Copy,
  Info,
  Sparkles,
} from "lucide-react";
import { handleLoginSync, setStorageMode } from "@/lib/storage";

type AuthMode = "student-signup" | "teacher-signup" | "signin";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("student-signup");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form states
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [selectedClass, setSelectedClass] = useState<number>(8);
  const [classCode, setClassCode] = useState("");
  const [className, setClassName] = useState("");
  const [consentConfirmed, setConsentConfirmed] = useState(false);

  // Recovery code display for students
  const [recoveryCode, setRecoveryCode] = useState<string | null>(null);
  const [copiedRecovery, setCopiedRecovery] = useState(false);
  const [savedRecoveryCodeCheckbox, setSavedRecoveryCodeCheckbox] = useState(false);

  // Created class display for teachers
  const [createdClassCode, setCreatedClassCode] = useState<string | null>(null);

  // Lockout state
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutMinutes, setLockoutMinutes] = useState<number>(15);

  const resetMessages = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
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
          username,
          password,
          fullName: fullName || username,
          selectedClass: Number(selectedClass),
          classCode: classCode.trim() || undefined,
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

  const handleTeacherSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!consentConfirmed) {
      setErrorMessage("Please confirm school or guardian consent to register as a teacher.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/teacher-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          fullName,
          className,
          grade: Number(selectedClass),
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

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);

    const identifier = username.trim() || email.trim();

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier,
          password,
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

      // Successful login: sync local guest progress into Supabase account
      if (data.user?.role === "student") {
        await handleLoginSync(data.user);
        router.push("/student");
      } else {
        setStorageMode("supabase");
        router.push("/teacher");
      }
    } catch {
      setErrorMessage("Network error during sign in.");
      setLoading(false);
    }
  };

  const copyRecoveryCode = () => {
    if (recoveryCode) {
      navigator.clipboard.writeText(recoveryCode);
      setCopiedRecovery(true);
      setTimeout(() => setCopiedRecovery(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white">
              <Compass className="w-4 h-4" />
            </div>
            <span className="font-heading font-extrabold text-lg text-foreground">Margam</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Home</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-md mx-auto px-4 py-8 w-full flex-1 flex flex-col justify-center">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          {/* Logo & Headline */}
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-heading font-extrabold text-foreground">
              {mode === "student-signup" && "Student Sign-Up"}
              {mode === "teacher-signup" && "Teacher Sign-Up"}
              {mode === "signin" && "Sign In to Margam"}
            </h1>
            <p className="text-xs text-muted-foreground">
              {mode === "student-signup" && "No email or phone required. Pure privacy."}
              {mode === "teacher-signup" && "Organize classes and view student mastery paths."}
              {mode === "signin" && "Resume your cloud-synced learning journey."}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          {!recoveryCode && !createdClassCode && (
            <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold text-center">
              <button
                type="button"
                onClick={() => {
                  setMode("student-signup");
                  resetMessages();
                }}
                className={`py-2 px-1.5 rounded-xl transition-all cursor-pointer min-h-[44px] flex items-center justify-center ${
                  mode === "student-signup" ? "bg-white text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("teacher-signup");
                  resetMessages();
                }}
                className={`py-2 px-1.5 rounded-xl transition-all cursor-pointer min-h-[44px] flex items-center justify-center ${
                  mode === "teacher-signup" ? "bg-white text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Teacher
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  resetMessages();
                }}
                className={`py-2 px-1.5 rounded-xl transition-all cursor-pointer min-h-[44px] flex items-center justify-center ${
                  mode === "signin" ? "bg-white text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign In
              </button>
            </div>
          )}

          {/* Alerts */}
          {errorMessage && (
            <div
              className={`p-3.5 rounded-xl text-xs font-semibold flex items-start gap-2 ${
                isLocked ? "bg-amber-50 border border-amber-300 text-amber-900" : "bg-rose-50 border border-rose-200 text-rose-800"
              }`}
            >
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && !recoveryCode && !createdClassCode && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* RECOVERY CODE DISPLAY (STUDENT SIGN-UP ONLY) */}
          {recoveryCode && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 space-y-2.5">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <KeyRound className="w-4 h-4 text-amber-700" />
                  <span>One-Time Account Recovery Code</span>
                </div>
                <p className="text-xs text-amber-950 leading-relaxed font-semibold">
                  ⚠️ <strong>IMPORTANT:</strong> Passwords cannot be reset by email because we do not collect your email or phone.
                  This code is shown <strong>ONLY ONCE</strong>.
                </p>

                <div className="bg-white p-3 rounded-xl border border-amber-300 flex items-center justify-between gap-2">
                  <code className="font-mono text-sm sm:text-base font-extrabold tracking-wider text-foreground select-all">
                    {recoveryCode}
                  </code>
                  <button
                    type="button"
                    onClick={copyRecoveryCode}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedRecovery ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
              </div>

              <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={savedRecoveryCodeCheckbox}
                  onChange={(e) => setSavedRecoveryCodeCheckbox(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-primary focus:ring-primary"
                />
                <span>I have written down or saved my recovery code in a safe place.</span>
              </label>

              <button
                type="button"
                disabled={!savedRecoveryCodeCheckbox}
                onClick={() => router.push("/student")}
                className="w-full min-h-[48px] py-3 rounded-2xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-soft transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Continue to Learning Path</span>
              </button>
            </div>
          )}

          {/* TEACHER CLASS CREATED DISPLAY */}
          {createdClassCode && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2.5">
                <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  <span>Class Code Generated!</span>
                </div>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  Share this class code with your students so they can link their diagnostics and worksheets to your dashboard:
                </p>
                <div className="bg-white p-3 rounded-xl border border-emerald-300 flex items-center justify-between">
                  <code className="font-mono text-base font-extrabold tracking-widest text-foreground">
                    {createdClassCode}
                  </code>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(createdClassCode);
                      setCopiedRecovery(true);
                      setTimeout(() => setCopiedRecovery(false), 2000);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedRecovery ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => router.push("/teacher")}
                className="w-full min-h-[48px] py-3 rounded-2xl bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-bold shadow-soft transition-all cursor-pointer"
              >
                Open Teacher Dashboard
              </button>
            </div>
          )}

          {/* FORMS (when no success modal is active) */}
          {!recoveryCode && !createdClassCode && (
            <>
              {/* 1. STUDENT SIGN-UP FORM */}
              {mode === "student-signup" && (
                <form onSubmit={handleStudentSignUp} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground block">
                      Choose Username <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-muted-foreground absolute left-3 top-3.5" />
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="e.g. aryabhata_10"
                        className="w-full min-h-[48px] pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground block">
                      Password (6+ characters) <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-3.5" />
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full min-h-[48px] pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground block">
                        Class / Grade <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(Number(e.target.value))}
                        className="w-full min-h-[48px] px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value={6}>Class 6</option>
                        <option value={7}>Class 7</option>
                        <option value={8}>Class 8</option>
                        <option value={9}>Class 9</option>
                        <option value={10}>Class 10</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground block">
                        Class Code <span className="text-muted-foreground text-[10px]">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={classCode}
                        onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                        placeholder="MGM-8A"
                        className="w-full min-h-[48px] px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm uppercase focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
                    <Info className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                    <span>
                      Passwords cannot be reset by email because no email or phone number is collected. A one-time recovery code will be provided.
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full min-h-[48px] py-3 rounded-2xl bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-bold shadow-soft transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>{loading ? "Creating Student Account..." : "Create Student Account"}</span>
                  </button>
                </form>
              )}

              {/* 2. TEACHER SIGN-UP FORM */}
              {mode === "teacher-signup" && (
                <form onSubmit={handleTeacherSignUp} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground block">
                      Teacher Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. S. Ramanujan"
                      className="w-full min-h-[48px] px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground block">
                      School / Professional Email <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="teacher@school.edu.in"
                      className="w-full min-h-[48px] px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground block">
                      Password (6+ characters) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full min-h-[48px] px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground block">
                        First Class Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={className}
                        onChange={(e) => setClassName(e.target.value)}
                        placeholder="Class 8 Section A"
                        className="w-full min-h-[48px] px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground block">
                        Class Grade <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(Number(e.target.value))}
                        className="w-full min-h-[48px] px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value={6}>Class 6</option>
                        <option value={7}>Class 7</option>
                        <option value={8}>Class 8</option>
                        <option value={9}>Class 9</option>
                        <option value={10}>Class 10</option>
                      </select>
                    </div>
                  </div>

                  <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      required
                      checked={consentConfirmed}
                      onChange={(e) => setConsentConfirmed(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded text-primary focus:ring-primary"
                    />
                    <span>
                      I confirm school or guardian consent to manage student class data under applicable privacy guidelines.
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full min-h-[48px] py-3 rounded-2xl bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-bold shadow-soft transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>{loading ? "Creating Teacher Account..." : "Create Teacher Account & Class"}</span>
                  </button>
                </form>
              )}

              {/* 3. SIGN IN FORM */}
              {mode === "signin" && (
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground block">
                      Username or Email <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-muted-foreground absolute left-3 top-3.5" />
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Student username or teacher email"
                        className="w-full min-h-[48px] pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground block">
                      Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-3.5" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full min-h-[48px] pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || isLocked}
                    className="w-full min-h-[48px] py-3 rounded-2xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-soft transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>{loading ? "Authenticating..." : "Sign In"}</span>
                  </button>
                </form>
              )}
            </>
          )}

          {/* Guest Mode Navigation Link */}
          <div className="pt-4 border-t border-slate-100 text-center">
            <Link
              href="/student"
              className="text-xs font-semibold text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 min-h-[40px] px-2 py-1 rounded-lg"
            >
              <span>Continue in Guest Mode (Local Storage Only)</span>
              <ArrowLeft className="w-3 h-3 rotate-180" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-4 text-center text-xs text-muted-foreground bg-white">
        Margam • DPDP-Compliant Student & Teacher Authentication
      </footer>
    </div>
  );
}

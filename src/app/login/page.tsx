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
    <div className="min-h-screen bg-voxel-sky text-[#2B1B0F] flex flex-col justify-between">
      {/* Header */}
      <header className="border-b-[3px] border-[#422816] bg-[#5A3720] text-[#FFF7E6] shadow-[0px_4px_0px_#1B120C]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#5DAA3A] border-[2px] border-[#422816] shadow-[2px_2px_0px_#1B120C] flex items-center justify-center text-white">
              <Compass className="w-4 h-4" />
            </div>
            <span className="font-pixel text-base text-[#FFE9A8]">MARGAM</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-pixel text-[#FFE9A8] hover:text-white"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Realm</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-md mx-auto px-4 py-8 w-full flex-1 flex flex-col justify-center">
        <div className="bg-[#FFF7E6] p-6 sm:p-8 border-[3px] border-[#422816] shadow-[6px_6px_0px_#1B120C] space-y-6 text-[#2B1B0F]">
          {/* Logo & Headline */}
          <div className="text-center space-y-1">
            <h1 className="text-xl sm:text-2xl font-pixel text-[#2B1B0F]">
              {mode === "student-signup" && "Student Sign-Up"}
              {mode === "teacher-signup" && "Teacher Sign-Up"}
              {mode === "signin" && "Sign In to Margam"}
            </h1>
            <p className="text-xs text-[#5A3720] font-sans font-semibold">
              {mode === "student-signup" && "No email or phone required. Pure privacy."}
              {mode === "teacher-signup" && "Organize classes and view student mastery paths."}
              {mode === "signin" && "Resume your cloud-synced learning journey."}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          {!recoveryCode && !createdClassCode && (
            <div className="grid grid-cols-3 gap-1 bg-[#5A3720] p-1 border-[2px] border-[#422816] text-xs font-pixel text-center">
              <button
                type="button"
                onClick={() => {
                  setMode("student-signup");
                  resetMessages();
                }}
                className={`py-2 px-1.5 transition-all cursor-pointer min-h-[44px] flex items-center justify-center ${
                  mode === "student-signup" ? "bg-[#5DAA3A] text-white shadow-[2px_2px_0px_#1B120C]" : "text-[#FFE9A8] hover:text-white"
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
                className={`py-2 px-1.5 transition-all cursor-pointer min-h-[44px] flex items-center justify-center ${
                  mode === "teacher-signup" ? "bg-[#5DAA3A] text-white shadow-[2px_2px_0px_#1B120C]" : "text-[#FFE9A8] hover:text-white"
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
                className={`py-2 px-1.5 transition-all cursor-pointer min-h-[44px] flex items-center justify-center ${
                  mode === "signin" ? "bg-[#5DAA3A] text-white shadow-[2px_2px_0px_#1B120C]" : "text-[#FFE9A8] hover:text-white"
                }`}
              >
                Sign In
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

          {/* RECOVERY CODE DISPLAY (STUDENT SIGN-UP ONLY) */}
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
              </button>
            </div>
          )}

          {/* TEACHER CLASS CREATED DISPLAY */}
          {createdClassCode && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 bg-[#FFE9A8] border-[2px] border-[#422816] space-y-2.5 text-[#2B1B0F]">
                <div className="flex items-center gap-2 font-pixel text-xs">
                  <Sparkles className="w-4 h-4 text-[#5DAA3A]" />
                  <span>Class Code Generated!</span>
                </div>
                <p className="text-xs text-[#2B1B0F] leading-relaxed font-sans font-semibold">
                  Share this class code with your students so they can link their diagnostics and worksheets to your dashboard:
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
                className="w-full min-h-[48px] py-3 bg-[#5DAA3A] hover:bg-[#4E9330] text-white text-xs font-pixel border-[2px] border-[#422816] shadow-[3px_3px_0px_#1B120C] transition-all cursor-pointer"
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
                    <label className="text-xs font-bold text-[#2B1B0F] block">
                      Choose Username <span className="text-[#D9453D]">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#7A4B2A] absolute left-3 top-3.5" />
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="e.g. aryabhata_10"
                        className="w-full min-h-[48px] pl-9 pr-3 py-2.5 border-[2px] border-[#422816] bg-white text-xs sm:text-sm font-semibold focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#2B1B0F] block">
                      Password (6+ characters) <span className="text-[#D9453D]">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#7A4B2A] absolute left-3 top-3.5" />
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full min-h-[48px] pl-9 pr-3 py-2.5 border-[2px] border-[#422816] bg-white text-xs sm:text-sm font-semibold focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#2B1B0F] block">
                        Class / Grade <span className="text-[#D9453D]">*</span>
                      </label>
                      <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(Number(e.target.value))}
                        className="w-full min-h-[48px] px-3 py-2.5 border-[2px] border-[#422816] text-xs sm:text-sm bg-white font-semibold focus:outline-none"
                      >
                        <option value={6}>Class 6</option>
                        <option value={7}>Class 7</option>
                        <option value={8}>Class 8</option>
                        <option value={9}>Class 9</option>
                        <option value={10}>Class 10</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#2B1B0F] block">
                        Class Code <span className="text-[#7A4B2A] text-[10px]">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={classCode}
                        onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                        placeholder="MGM-8A"
                        className="w-full min-h-[48px] px-3 py-2.5 border-[2px] border-[#422816] bg-white text-xs sm:text-sm font-semibold uppercase focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-[#FFE9A8] border-[2px] border-[#422816] text-[11px] text-[#2B1B0F] flex items-start gap-2">
                    <Info className="w-3.5 h-3.5 text-[#5A3720] shrink-0 mt-0.5" />
                    <span className="font-semibold">
                      Passwords cannot be reset by email because no email or phone number is collected. A one-time recovery code will be provided.
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full min-h-[48px] py-3 bg-[#5DAA3A] hover:bg-[#4E9330] text-white text-xs font-pixel border-[2px] border-[#422816] shadow-[3px_3px_0px_#1B120C] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>{loading ? "Creating Student Account..." : "Create Student Account"}</span>
                  </button>
                </form>
              )}

              {/* 2. TEACHER SIGN-UP FORM */}
              {mode === "teacher-signup" && (
                <form onSubmit={handleTeacherSignUp} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#2B1B0F] block">
                      Teacher Full Name <span className="text-[#D9453D]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. S. Ramanujan"
                      className="w-full min-h-[48px] px-3 py-2.5 border-[2px] border-[#422816] bg-white text-xs sm:text-sm font-semibold focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#2B1B0F] block">
                      School / Professional Email <span className="text-[#D9453D]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="teacher@school.edu.in"
                      className="w-full min-h-[48px] px-3 py-2.5 border-[2px] border-[#422816] bg-white text-xs sm:text-sm font-semibold focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#2B1B0F] block">
                      Password (6+ characters) <span className="text-[#D9453D]">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full min-h-[48px] px-3 py-2.5 border-[2px] border-[#422816] bg-white text-xs sm:text-sm font-semibold focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#2B1B0F] block">
                        First Class Name <span className="text-[#D9453D]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={className}
                        onChange={(e) => setClassName(e.target.value)}
                        placeholder="Class 8 Section A"
                        className="w-full min-h-[48px] px-3 py-2.5 border-[2px] border-[#422816] bg-white text-xs sm:text-sm font-semibold focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#2B1B0F] block">
                        Class Grade <span className="text-[#D9453D]">*</span>
                      </label>
                      <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(Number(e.target.value))}
                        className="w-full min-h-[48px] px-3 py-2.5 border-[2px] border-[#422816] text-xs sm:text-sm bg-white font-semibold focus:outline-none"
                      >
                        <option value={6}>Class 6</option>
                        <option value={7}>Class 7</option>
                        <option value={8}>Class 8</option>
                        <option value={9}>Class 9</option>
                        <option value={10}>Class 10</option>
                      </select>
                    </div>
                  </div>

                  <label className="flex items-start gap-2.5 text-xs text-[#5A3720] cursor-pointer pt-1 font-semibold">
                    <input
                      type="checkbox"
                      required
                      checked={consentConfirmed}
                      onChange={(e) => setConsentConfirmed(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded-none accent-[#5DAA3A]"
                    />
                    <span>
                      I confirm school or guardian consent to manage student class data under applicable privacy guidelines.
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full min-h-[48px] py-3 bg-[#5DAA3A] hover:bg-[#4E9330] text-white text-xs font-pixel border-[2px] border-[#422816] shadow-[3px_3px_0px_#1B120C] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>{loading ? "Creating Teacher Account..." : "Create Teacher Account & Class"}</span>
                  </button>
                </form>
              )}

              {/* 3. SIGN IN FORM */}
              {mode === "signin" && (
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#2B1B0F] block">
                      Username or Email <span className="text-[#D9453D]">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#7A4B2A] absolute left-3 top-3.5" />
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Student username or teacher email"
                        className="w-full min-h-[48px] pl-9 pr-3 py-2.5 border-[2px] border-[#422816] bg-white text-xs sm:text-sm font-semibold focus:outline-none"
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full min-h-[48px] pl-9 pr-3 py-2.5 border-[2px] border-[#422816] bg-white text-xs sm:text-sm font-semibold focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || isLocked}
                    className="w-full min-h-[48px] py-3 bg-[#5DAA3A] hover:bg-[#4E9330] disabled:opacity-50 text-white text-xs font-pixel border-[2px] border-[#422816] shadow-[3px_3px_0px_#1B120C] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>{loading ? "Authenticating..." : "Sign In"}</span>
                  </button>
                </form>
              )}
            </>
          )}

          {/* Guest Mode Navigation Link */}
          <div className="pt-4 border-t-2 border-[#E5D7BE] text-center">
            <Link
              href="/student"
              className="text-xs font-pixel text-[#5A3720] hover:text-[#2B1B0F] inline-flex items-center gap-1.5 min-h-[40px] px-2 py-1"
            >
              <span>Continue in Guest Mode (Local Storage Only)</span>
              <ArrowLeft className="w-3 h-3 rotate-180" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-[#422816]/20 py-4 text-center text-xs text-[#5A3720] bg-[#FFF7E6]">
        Margam • DPDP-Compliant Student & Teacher Authentication
      </footer>
    </div>
  );
}

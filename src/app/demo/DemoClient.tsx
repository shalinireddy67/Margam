"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Copy, User, Users, BookOpen, GraduationCap, Shield } from "lucide-react";

interface DemoClientProps {
  demoPassword?: string;
}

export default function DemoClient({ demoPassword }: DemoClientProps) {
  const router = useRouter();
  const [loadingRole, setLoadingRole] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (key: string, text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const handleLaunch = async (role: "student" | "teacher", username?: string) => {
    setErrorMessage(null);
    setLoadingRole(username || role);

    try {
      const res = await fetch("/api/auth/demo-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          username: role === "student" ? username : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Could not sign in to demo. Try again.");
        setLoadingRole(null);
        return;
      }

      const destination = data.redirectUrl || (role === "teacher" ? "/teacher" : "/student");
      router.push(destination);
      router.refresh();
    } catch (err: any) {
      setErrorMessage("Network error during demo sign-in. Check your connection.");
      setLoadingRole(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Error alert if launch fails */}
      {errorMessage && (
        <div
          role="alert"
          className="p-4 bg-[#FFE5E5] border-[3px] border-[#E04A3F] text-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] rounded-[2px] font-sans text-xs sm:text-sm"
        >
          <strong>Notice: </strong>
          {errorMessage}
        </div>
      )}

      {/* Two Big Cards: Student and Teacher */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Card 1: Student (Riya) */}
        <div className="p-6 sm:p-7 bg-[#E8F4F8] border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] rounded-[2px] flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#1E6F8C] text-white font-heading font-extrabold text-[10px] uppercase tracking-wider rounded-[2px] border border-[#2B1B0F]">
              <User className="w-3.5 h-3.5" />
              <span>Student role</span>
            </div>

            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#2B1B0F] leading-tight">
              Open as Riya (student)
            </h2>

            <p className="font-sans text-sm sm:text-base text-[#2B1B0F]/90 leading-relaxed">
              Riya has not fixed her integer-sign gap yet. Start at Fix this first.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              disabled={loadingRole !== null}
              onClick={() => handleLaunch("student", "demo_riya")}
              className="w-full min-h-[48px] px-5 py-3 bg-[#5DAA3A] hover:bg-[#6EB5FF] text-[#2B1B0F] font-heading font-bold text-sm sm:text-base border-[3px] border-[#2B1B0F] shadow-[3px_3px_0px_#2B1B0F] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-2 rounded-[2px] disabled:opacity-60"
            >
              <span>{loadingRole === "demo_riya" ? "Opening student dashboard..." : "Open as Riya (student)"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Card 2: Teacher */}
        <div className="p-6 sm:p-7 bg-[#F5EBE1] border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] rounded-[2px] flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#7A4B2A] text-white font-heading font-extrabold text-[10px] uppercase tracking-wider rounded-[2px] border border-[#2B1B0F]">
              <Users className="w-3.5 h-3.5" />
              <span>Teacher role</span>
            </div>

            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#2B1B0F] leading-tight">
              Open the teacher dashboard
            </h2>

            <p className="font-sans text-sm sm:text-base text-[#2B1B0F]/90 leading-relaxed">
              See class topic gaps, heatmap, and student progress across Class 10-A.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              disabled={loadingRole !== null}
              onClick={() => handleLaunch("teacher")}
              className="w-full min-h-[48px] px-5 py-3 bg-[#5DAA3A] hover:bg-[#6EB5FF] text-[#2B1B0F] font-heading font-bold text-sm sm:text-base border-[3px] border-[#2B1B0F] shadow-[3px_3px_0px_#2B1B0F] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-2 rounded-[2px] disabled:opacity-60"
            >
              <span>{loadingRole === "teacher" ? "Opening teacher dashboard..." : "Open the teacher dashboard"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Credentials Block with Copy Buttons */}
      <div className="bg-[#FFFDF7] border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] p-6 sm:p-7 rounded-[2px] space-y-4">
        <div className="space-y-1">
          <h3 className="font-heading font-extrabold text-base sm:text-lg text-[#2B1B0F]">
            Sign in by hand instead
          </h3>
          <p className="text-xs sm:text-sm font-sans text-[#2B1B0F]/80">
            Use these test accounts to try signing in on the main sign-in form.
          </p>
        </div>

        <div className="space-y-3 font-sans text-xs sm:text-sm pt-2">
          {/* Row 1: Riya */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-white border-2 border-[#2B1B0F]/20 rounded-[2px]">
            <div>
              <span className="font-bold text-[#2B1B0F]">Student (gap unfixed): </span>
              <code className="font-mono bg-[#FFF7E6] px-1.5 py-0.5 border border-[#2B1B0F] text-[#2B1B0F]">
                demo_riya
              </code>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard("demo_riya", "demo_riya")}
              className="self-start sm:self-auto min-h-[36px] px-3 py-1 bg-[#FFF7E6] hover:bg-[#FFE9A8] text-[#2B1B0F] font-heading font-bold text-xs border border-[#2B1B0F] shadow-[1px_1px_0px_#2B1B0F] flex items-center gap-1.5 rounded-[2px] cursor-pointer"
            >
              {copiedKey === "demo_riya" ? <Check className="w-3.5 h-3.5 text-[#5DAA3A]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === "demo_riya" ? "Copied" : "Copy"}</span>
            </button>
          </div>

          {/* Row 2: Aarav */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-white border-2 border-[#2B1B0F]/20 rounded-[2px]">
            <div>
              <span className="font-bold text-[#2B1B0F]">Student (all mastered): </span>
              <code className="font-mono bg-[#FFF7E6] px-1.5 py-0.5 border border-[#2B1B0F] text-[#2B1B0F]">
                demo_aarav
              </code>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard("demo_aarav", "demo_aarav")}
              className="self-start sm:self-auto min-h-[36px] px-3 py-1 bg-[#FFF7E6] hover:bg-[#FFE9A8] text-[#2B1B0F] font-heading font-bold text-xs border border-[#2B1B0F] shadow-[1px_1px_0px_#2B1B0F] flex items-center gap-1.5 rounded-[2px] cursor-pointer"
            >
              {copiedKey === "demo_aarav" ? <Check className="w-3.5 h-3.5 text-[#5DAA3A]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === "demo_aarav" ? "Copied" : "Copy"}</span>
            </button>
          </div>

          {/* Row 3: New */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-white border-2 border-[#2B1B0F]/20 rounded-[2px]">
            <div>
              <span className="font-bold text-[#2B1B0F]">Student (clean empty state): </span>
              <code className="font-mono bg-[#FFF7E6] px-1.5 py-0.5 border border-[#2B1B0F] text-[#2B1B0F]">
                demo_new
              </code>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard("demo_new", "demo_new")}
              className="self-start sm:self-auto min-h-[36px] px-3 py-1 bg-[#FFF7E6] hover:bg-[#FFE9A8] text-[#2B1B0F] font-heading font-bold text-xs border border-[#2B1B0F] shadow-[1px_1px_0px_#2B1B0F] flex items-center gap-1.5 rounded-[2px] cursor-pointer"
            >
              {copiedKey === "demo_new" ? <Check className="w-3.5 h-3.5 text-[#5DAA3A]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === "demo_new" ? "Copied" : "Copy"}</span>
            </button>
          </div>

          {/* Row 4: Teacher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-white border-2 border-[#2B1B0F]/20 rounded-[2px]">
            <div>
              <span className="font-bold text-[#2B1B0F]">Teacher email: </span>
              <code className="font-mono bg-[#FFF7E6] px-1.5 py-0.5 border border-[#2B1B0F] text-[#2B1B0F]">
                demo.teacher@margam.example
              </code>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard("teacher_email", "demo.teacher@margam.example")}
              className="self-start sm:self-auto min-h-[36px] px-3 py-1 bg-[#FFF7E6] hover:bg-[#FFE9A8] text-[#2B1B0F] font-heading font-bold text-xs border border-[#2B1B0F] shadow-[1px_1px_0px_#2B1B0F] flex items-center gap-1.5 rounded-[2px] cursor-pointer"
            >
              {copiedKey === "teacher_email" ? <Check className="w-3.5 h-3.5 text-[#5DAA3A]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === "teacher_email" ? "Copied" : "Copy"}</span>
            </button>
          </div>

          {/* Row 5: Class Code */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-white border-2 border-[#2B1B0F]/20 rounded-[2px]">
            <div>
              <span className="font-bold text-[#2B1B0F]">Class code: </span>
              <code className="font-mono bg-[#FFF7E6] px-1.5 py-0.5 border border-[#2B1B0F] text-[#2B1B0F]">
                DEMO10A
              </code>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard("class_code", "DEMO10A")}
              className="self-start sm:self-auto min-h-[36px] px-3 py-1 bg-[#FFF7E6] hover:bg-[#FFE9A8] text-[#2B1B0F] font-heading font-bold text-xs border border-[#2B1B0F] shadow-[1px_1px_0px_#2B1B0F] flex items-center gap-1.5 rounded-[2px] cursor-pointer"
            >
              {copiedKey === "class_code" ? <Check className="w-3.5 h-3.5 text-[#5DAA3A]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === "class_code" ? "Copied" : "Copy"}</span>
            </button>
          </div>

          {/* Row 6: Password (Hidden if unset in process.env) */}
          {demoPassword && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-white border-2 border-[#2B1B0F]/20 rounded-[2px]">
              <div>
                <span className="font-bold text-[#2B1B0F]">Password: </span>
                <code className="font-mono bg-[#FFF7E6] px-1.5 py-0.5 border border-[#2B1B0F] text-[#2B1B0F]">
                  {demoPassword}
                </code>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard("demo_password", demoPassword)}
                className="self-start sm:self-auto min-h-[36px] px-3 py-1 bg-[#FFF7E6] hover:bg-[#FFE9A8] text-[#2B1B0F] font-heading font-bold text-xs border border-[#2B1B0F] shadow-[1px_1px_0px_#2B1B0F] flex items-center gap-1.5 rounded-[2px] cursor-pointer"
              >
                {copiedKey === "demo_password" ? <Check className="w-3.5 h-3.5 text-[#5DAA3A]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === "demo_password" ? "Copied" : "Copy"}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Return to Sign-in Form Link */}
      <div className="text-center pt-2">
        <Link
          href="/login"
          className="text-xs sm:text-sm font-heading font-bold text-[#5DAA3A] hover:underline"
        >
          Want to use your own account? Go to sign in
        </Link>
      </div>
    </div>
  );
}


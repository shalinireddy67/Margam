"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { RotateCcw, Home, AlertTriangle } from "lucide-react";

export default function LessonErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Lesson section error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#FFF8DC] flex items-center justify-center p-4 text-[#111111]">
      <div className="max-w-md w-full bg-white border-[3px] border-[#111111] rounded-2xl p-6 sm:p-8 shadow-[6px_6px_0_#111111] space-y-6 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-[#FFE14D] border-[3px] border-[#111111] flex items-center justify-center shadow-[3px_3px_0_#111111]">
          <AlertTriangle className="w-8 h-8 text-[#111111]" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-[#111111] tracking-tight">
            Lesson Could Not Load
          </h1>
          <p className="text-sm font-semibold text-[#444444] leading-relaxed">
            There was a temporary issue reading this lesson. Your study progress is safe.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="flex-1 min-h-[48px] px-5 py-3 rounded-xl bg-[#FFE14D] hover:bg-[#FFD700] text-[#111111] font-black text-sm border-2 border-[#111111] shadow-[3px_3px_0_#111111] active:translate-x-[2px] active:translate-y-[2px] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reload Lesson</span>
          </button>
          <Link
            href="/"
            className="flex-1 min-h-[48px] px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-[#111111] font-black text-sm border-2 border-[#111111] shadow-[3px_3px_0_#111111] active:translate-x-[2px] active:translate-y-[2px] transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Return to Lessons</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { RotateCcw, Home, AlertTriangle } from "lucide-react";

export default function StudentErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Student section error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#102610] minecraft-grid-bg flex items-center justify-center p-4 text-[#F2F0DF]">
      <div className="max-w-md w-full bg-[#173B19] border-3 border-[#315B2A] p-6 sm:p-8 shadow-[6px_6px_0px_#102610] space-y-6 text-center">
        <div className="w-16 h-16 mx-auto bg-[#F2D16B] border-2 border-[#102610] flex items-center justify-center shadow-[2px_2px_0px_#102610]">
          <AlertTriangle className="w-8 h-8 text-[#102610]" />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-[#F2F0DF] tracking-wide">
            Learning Screen Paused
          </h1>
          <p className="text-xs sm:text-sm text-[#D8D8D0] leading-relaxed">
            Your progress is preserved. You can retry this question or return to your chapter list.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="flex-1 min-h-[48px] px-5 py-3 bg-[#79B82A] hover:bg-[#8CD033] text-[#102610] font-heading font-extrabold text-xs border-2 border-[#102610] shadow-[2px_2px_0px_#102610] active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retry Screen</span>
          </button>
          <Link
            href="/"
            className="flex-1 min-h-[48px] px-5 py-3 bg-[#102610] hover:bg-[#315B2A] text-[#F2F0DF] font-heading font-bold text-xs border-2 border-[#315B2A] shadow-[2px_2px_0px_#102610] active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center justify-center gap-2 no-underline"
          >
            <Home className="w-4 h-4" />
            <span>Class Lessons</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

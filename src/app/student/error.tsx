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
    <div className="min-h-screen bg-[#FFF7E6] flex items-center justify-center p-4 text-[#2B1B0F]">
      <div className="max-w-md w-full bg-[#FFFDF7] border-[3px] border-[#2B1B0F] p-6 sm:p-8 shadow-[4px_4px_0px_#2B1B0F] space-y-6 text-center">
        <div className="w-16 h-16 mx-auto bg-[#FFE9A8] border-[3px] border-[#2B1B0F] flex items-center justify-center shadow-[3px_3px_0px_#2B1B0F]">
          <AlertTriangle className="w-8 h-8 text-[#2B1B0F]" />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-[#2B1B0F]">
            Something went wrong.
          </h1>
          <p className="text-xs sm:text-sm font-sans font-medium text-[#2B1B0F]/80 leading-relaxed">
            We could not load this part of Margam.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="flex-1 min-h-[48px] px-5 py-3 bg-[#5DAA3A] hover:brightness-105 text-[#2B1B0F] font-heading font-bold text-sm border-[3px] border-[#2B1B0F] shadow-[3px_3px_0px_#2B1B0F] active:translate-x-[2px] active:translate-y-[2px] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try again</span>
          </button>
          <Link
            href="/student"
            className="flex-1 min-h-[48px] px-5 py-3 bg-[#FFFDF7] hover:bg-[#FFF7E6] text-[#2B1B0F] font-heading font-bold text-sm border-[3px] border-[#2B1B0F] shadow-[3px_3px_0px_#2B1B0F] active:translate-x-[2px] active:translate-y-[2px] transition-all flex items-center justify-center gap-2 no-underline"
          >
            <Home className="w-4 h-4" />
            <span>View lessons</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

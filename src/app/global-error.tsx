"use client";

import React, { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global application error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#FFF7E6] text-[#2B1B0F] flex items-center justify-center p-4 antialiased font-sans">
        <div className="max-w-md w-full bg-[#FFFDF7] border-[3px] border-[#2B1B0F] p-6 sm:p-8 shadow-[4px_4px_0px_#2B1B0F] space-y-6 text-center">
          <div className="w-16 h-16 mx-auto bg-[#FFE9A8] border-[3px] border-[#2B1B0F] flex items-center justify-center shadow-[3px_3px_0px_#2B1B0F]">
            <svg
              className="w-8 h-8 text-[#2B1B0F]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="square"
              strokeLinejoin="miter"
              aria-hidden="true"
            >
              <polygon points="12 2 2 22 22 22" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>

          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#2B1B0F]">
              Something went wrong.
            </h1>
            <p className="text-xs sm:text-sm font-medium text-[#2B1B0F]/80 leading-relaxed">
              We could not load this part of Margam.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => reset()}
              className="w-full min-h-[48px] px-5 py-3 bg-[#5DAA3A] hover:brightness-105 text-[#2B1B0F] font-bold text-sm border-[3px] border-[#2B1B0F] shadow-[3px_3px_0px_#2B1B0F] active:translate-x-[2px] active:translate-y-[2px] transition-all cursor-pointer"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}


"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { RotateCcw, Home, AlertTriangle } from "lucide-react";

export default function RootErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Uncaught application error captured by RootErrorBoundary:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-voxel-sky flex items-center justify-center p-4 text-[#2B1B0F]">
      <div className="max-w-md w-full bg-[#FFF7E6] border-[3px] border-[#1E1610] p-6 sm:p-8 shadow-[6px_6px_0px_#1B120C] space-y-6 text-center">
        {/* Warning Icon Badge */}
        <div className="w-16 h-16 mx-auto bg-[#FFE9A8] border-[2px] border-[#1E1610] flex items-center justify-center shadow-[2px_2px_0px_#1B120C]">
          <AlertTriangle className="w-8 h-8 text-[#2B1B0F]" />
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h1 className="text-lg sm:text-xl font-heading font-extrabold text-[#2B1B0F] tracking-wide">
            Something Took a Wrong Turn
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-[#5A3720] leading-relaxed font-sans">
            Don&apos;t worry — your profile and math progress are safely preserved on this device.
          </p>
          {error.message && (
            <div className="mt-3 p-3 bg-[#5A3720] border-[2px] border-[#1E1610] text-left text-xs font-mono text-[#FFF7E6] overflow-x-auto">
              {error.message}
            </div>
          )}
        </div>

        {/* Action Buttons with >= 48px touch targets */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="flex-1 min-h-[48px] px-5 py-3 bg-[#5DAA3A] hover:bg-[#4E9330] text-[#1E1610] font-heading font-extrabold text-xs border-[2px] border-[#1E1610] shadow-[2px_2px_0px_#1B120C] active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="flex-1 min-h-[48px] px-5 py-3 bg-[#FFF7E6] hover:bg-[#FFE9A8] text-[#2B1B0F] font-heading font-extrabold text-xs border-[2px] border-[#1E1610] shadow-[2px_2px_0px_#1B120C] active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center justify-center gap-2 no-underline"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

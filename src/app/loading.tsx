import React from "react";
import { SkeletonLine } from "@/components/ui/LoadingSkeleton";

export default function GlobalLoading() {
  return (
    <div className="min-h-[100dvh] bg-[#FFF7E6] text-[#2B1B0F] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#FFFDF7] border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] p-6 text-center space-y-4">
        <div className="w-12 h-12 bg-[#5DAA3A] border-[2px] border-[#2B1B0F] shadow-[2px_2px_0px_#2B1B0F] mx-auto flex items-center justify-center animate-pulse">
          <div className="w-5 h-5 bg-[#FFE9A8] border border-[#2B1B0F]" />
        </div>
        <div className="space-y-2">
          <h2 className="font-heading font-extrabold text-base text-[#2B1B0F]">
            Margam
          </h2>
          <p className="text-xs text-[#2B1B0F]/80 font-sans">
            Loading next quest...
          </p>
        </div>
        <div className="pt-2 space-y-2">
          <SkeletonLine width="80%" height="12px" className="mx-auto bg-[#2B1B0F]/15 border-[#2B1B0F]/20" />
          <SkeletonLine width="60%" height="12px" className="mx-auto bg-[#2B1B0F]/10 border-[#2B1B0F]/20" />
        </div>
      </div>
    </div>
  );
}

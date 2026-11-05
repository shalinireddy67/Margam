import React from "react";
import { SkeletonCard, SkeletonPathMap, SkeletonLine } from "@/components/ui/LoadingSkeleton";

export default function StudentLoading() {
  return (
    <div className="min-h-[100dvh] bg-[#FFF7E6] text-[#2B1B0F] py-6 px-4">
      <div className="max-w-[1200px] mx-auto space-y-6">
        {/* Top Status Header Skeleton */}
        <div className="bg-[#FFFDF7] border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-12 h-12 bg-[#FFE9A8] border-[2px] border-[#2B1B0F] shrink-0" />
            <div className="space-y-1.5 flex-1">
              <SkeletonLine width="140px" height="20px" className="bg-[#2B1B0F]/20 border-[#2B1B0F]/30" />
              <SkeletonLine width="90px" height="14px" className="bg-[#2B1B0F]/10 border-[#2B1B0F]/20" />
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-24 h-10 bg-[#5DAA3A]/30 border-[2px] border-[#2B1B0F]" />
            <div className="w-24 h-10 bg-[#F4C542]/30 border-[2px] border-[#2B1B0F]" />
          </div>
        </div>

        {/* Quest Card Skeleton */}
        <SkeletonCard className="w-full" />

        {/* Concept Path Map Skeleton */}
        <div className="bg-[#FFFDF7] border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] p-6 space-y-4">
          <div className="space-y-1">
            <SkeletonLine width="200px" height="24px" className="bg-[#FFE9A8] border-[#2B1B0F]" />
            <SkeletonLine width="320px" height="14px" className="bg-[#2B1B0F]/10 border-[#2B1B0F]/20" />
          </div>
          <SkeletonPathMap />
        </div>
      </div>
    </div>
  );
}

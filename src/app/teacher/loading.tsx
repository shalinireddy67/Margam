import React from "react";
import { SkeletonList, SkeletonLine } from "@/components/ui/LoadingSkeleton";

export default function TeacherLoading() {
  return (
    <div className="min-h-[100dvh] bg-[#FFF7E6] text-[#2B1B0F] py-6 px-4">
      <div className="max-w-[1200px] mx-auto space-y-6">
        {/* Header Skeleton */}
        <div className="bg-[#FFFDF7] border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 w-full sm:w-auto">
            <SkeletonLine width="220px" height="26px" className="bg-[#FFE9A8] border-[#2B1B0F]" />
            <SkeletonLine width="180px" height="14px" className="bg-[#2B1B0F]/10 border-[#2B1B0F]/20" />
          </div>
          <div className="w-36 h-10 bg-[#5DAA3A]/40 border-[2px] border-[#2B1B0F]" />
        </div>

        {/* Metrics Row Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((idx) => (
            <div
              key={idx}
              className="bg-[#FFFDF7] border-[3px] border-[#2B1B0F] shadow-[3px_3px_0px_#2B1B0F] p-4 space-y-2 animate-pulse"
            >
              <SkeletonLine width="50%" height="14px" className="bg-[#2B1B0F]/20 border-[#2B1B0F]/30" />
              <SkeletonLine width="40%" height="32px" className="bg-[#FFE9A8] border-[#2B1B0F]" />
            </div>
          ))}
        </div>

        {/* Class Roster / Gaps Table Skeleton */}
        <div className="bg-[#FFFDF7] border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] p-6 space-y-4">
          <SkeletonLine width="240px" height="22px" className="bg-[#FFE9A8] border-[#2B1B0F]" />
          <SkeletonList count={4} />
        </div>
      </div>
    </div>
  );
}

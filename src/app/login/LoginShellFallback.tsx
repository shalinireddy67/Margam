import React from "react";
import { Sparkles, Users } from "lucide-react";

export default function LoginShellFallback() {
  return (
    <div className="space-y-6 w-full animate-pulse motion-reduce:animate-none">
      {/* Demo Section Skeleton */}
      <section className="bg-white border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b-2 border-[#2B1B0F]/20 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-[#FFE9A8] text-[#2B1B0F] text-[10px] font-heading font-black border border-[#2B1B0F]">
              DEMO ENVIRONMENT
            </span>
            <span className="text-xs font-heading font-extrabold text-[#2B1B0F]">
              Vignan School • Class 10-A4
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <h2 className="text-base sm:text-lg font-heading font-extrabold text-[#2B1B0F] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#F4C542]" />
            <span>Demo Access for Live Hackathon Judging</span>
          </h2>
          <p className="text-xs text-[#2B1B0F]/70 font-sans">
            Loading interactive demo selector...
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="h-16 bg-[#FFF7E6] border-2 border-[#2B1B0F] shadow-[2px_2px_0px_#2B1B0F]" />
          <div className="h-16 bg-[#FFF7E6] border-2 border-[#2B1B0F] shadow-[2px_2px_0px_#2B1B0F]" />
        </div>
      </section>

      {/* Main Form Card Skeleton */}
      <div className="bg-white border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] p-6 sm:p-8 space-y-6">
        {/* Role Tabs */}
        <div className="grid grid-cols-2 gap-2 bg-[#FFF7E6] p-1.5 border-2 border-[#2B1B0F]">
          <div className="h-9 bg-[#5DAA3A] border-2 border-[#2B1B0F] flex items-center justify-center text-white text-xs font-heading font-bold">
            Student Portal
          </div>
          <div className="h-9 bg-transparent flex items-center justify-center text-[#2B1B0F]/60 text-xs font-heading font-bold">
            Teacher Portal
          </div>
        </div>

        {/* Input Fields */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="h-3.5 w-24 bg-[#2B1B0F]/20" />
            <div className="h-11 bg-[#FFF7E6] border-2 border-[#2B1B0F] shadow-[2px_2px_0px_#2B1B0F]" />
          </div>
          <div className="space-y-1.5">
            <div className="h-3.5 w-20 bg-[#2B1B0F]/20" />
            <div className="h-11 bg-[#FFF7E6] border-2 border-[#2B1B0F] shadow-[2px_2px_0px_#2B1B0F]" />
          </div>
          <div className="h-12 bg-[#5DAA3A] border-2 border-[#2B1B0F] shadow-[3px_3px_0px_#2B1B0F] mt-2" />
        </div>
      </div>
    </div>
  );
}

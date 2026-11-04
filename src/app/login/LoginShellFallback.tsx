import React from "react";

export default function LoginShellFallback() {
  return (
    <div className="space-y-6 w-full animate-pulse motion-reduce:animate-none">
      {/* Real sign in form skeleton with semantic headings and frame */}
      <div className="bg-white border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] rounded-[2px] p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-pixel text-[#5DAA3A] uppercase tracking-wider block">
            PORTAL
          </span>
          <h1 className="font-pixel text-xl sm:text-2xl text-[#2B1B0F]">
            Sign in to Margam
          </h1>
          <p className="text-xs text-[#2B1B0F]/70 font-sans max-w-sm mx-auto">
            Choose your role to continue your mathematics learning journey.
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 gap-2 bg-[#FFF7E6] p-1.5 border-2 border-[#2B1B0F] rounded-[2px]">
          <div className="h-9 bg-[#5DAA3A] border-2 border-[#2B1B0F] rounded-[2px] flex items-center justify-center font-heading font-extrabold text-xs text-white">
            Student Sign In
          </div>
          <div className="h-9 bg-transparent flex items-center justify-center font-heading font-bold text-xs text-[#2B1B0F]/60">
            Teacher Sign In
          </div>
        </div>

        {/* Form Layout Fields */}
        <div className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-[#2B1B0F] block">Username</span>
            <div className="h-11 bg-[#FFF7E6] border-2 border-[#2B1B0F] shadow-[2px_2px_0px_#2B1B0F] rounded-[2px]" />
          </div>
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-[#2B1B0F] block">Password</span>
            <div className="h-11 bg-[#FFF7E6] border-2 border-[#2B1B0F] shadow-[2px_2px_0px_#2B1B0F] rounded-[2px]" />
          </div>
          <div className="h-11 bg-[#5DAA3A] border-[3px] border-[#2B1B0F] shadow-[3px_3px_0px_#2B1B0F] rounded-[2px] mt-2 flex items-center justify-center font-heading font-extrabold text-xs text-white">
            Sign In
          </div>
        </div>
      </div>

      {/* Judge Panel Shell (as a details element) */}
      <details className="border-[3px] border-[#2B1B0F] bg-white shadow-[4px_4px_0px_#2B1B0F] rounded-[2px]">
        <summary className="px-5 py-4 cursor-pointer font-heading font-bold text-base sm:text-lg text-[#2B1B0F] bg-[#FFF7E6] select-none flex items-center justify-between">
          <span>Judges: try it without signing up</span>
          <span className="text-xs font-sans text-[#7A4B2A]">▼</span>
        </summary>
        <div className="p-5 sm:p-6 space-y-4 border-t-[3px] border-[#2B1B0F]">
          <p className="text-xs text-[#2B1B0F]/70 font-sans">
            Instant evaluation accounts with pre-seeded diagnostic data.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="h-32 bg-[#E8F4F8] border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] rounded-[2px]" />
            <div className="h-32 bg-[#F5EBE1] border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] rounded-[2px]" />
          </div>
        </div>
      </details>
    </div>
  );
}

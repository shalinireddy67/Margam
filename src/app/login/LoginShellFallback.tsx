import React from "react";

export default function LoginShellFallback() {
  return (
    <div className="space-y-6 w-full animate-pulse motion-reduce:animate-none">
      {/* Real Sign In Form Skeleton (Comes FIRST) */}
      <div className="bg-white border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] rounded-[2px] p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="h-4 w-16 bg-[#2B1B0F]/15 mx-auto rounded-[2px]" />
          <div className="h-7 w-44 bg-[#2B1B0F]/20 mx-auto rounded-[2px]" />
          <div className="h-3.5 w-64 bg-[#2B1B0F]/10 mx-auto rounded-[2px]" />
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 gap-2 bg-[#FFF7E6] p-1.5 border-2 border-[#2B1B0F] rounded-[2px]">
          <div className="h-9 bg-[#5DAA3A] border-2 border-[#2B1B0F] rounded-[2px]" />
          <div className="h-9 bg-transparent" />
        </div>

        {/* Input Fields */}
        <div className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <div className="h-3 w-28 bg-[#2B1B0F]/15" />
            <div className="h-11 bg-[#FFF7E6] border-2 border-[#2B1B0F] shadow-[2px_2px_0px_#2B1B0F] rounded-[2px]" />
          </div>
          <div className="space-y-1.5">
            <div className="h-3 w-20 bg-[#2B1B0F]/15" />
            <div className="h-11 bg-[#FFF7E6] border-2 border-[#2B1B0F] shadow-[2px_2px_0px_#2B1B0F] rounded-[2px]" />
          </div>
          <div className="h-11 bg-[#5DAA3A] border-[3px] border-[#2B1B0F] shadow-[3px_3px_0px_#2B1B0F] rounded-[2px] mt-2" />
        </div>
      </div>

      {/* Judge Panel Shell (BELOW the form as a details element) */}
      <details className="border-[3px] border-[#2B1B0F] bg-white shadow-[4px_4px_0px_#2B1B0F] rounded-[2px]">
        <summary className="px-5 py-4 cursor-pointer font-heading font-bold text-base sm:text-lg text-[#2B1B0F] bg-[#FFF7E6] select-none flex items-center justify-between">
          <span>Judges: try it without signing up</span>
          <span className="text-xs font-sans text-[#7A4B2A]">▼</span>
        </summary>
        <div className="p-5 sm:p-6 space-y-4 border-t-[3px] border-[#2B1B0F]">
          <div className="h-3.5 w-3/4 bg-[#2B1B0F]/15 rounded-[2px]" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="h-32 bg-[#E8F4F8] border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] rounded-[2px]" />
            <div className="h-32 bg-[#F5EBE1] border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] rounded-[2px]" />
          </div>
        </div>
      </details>
    </div>
  );
}

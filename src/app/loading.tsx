import React from "react";

export default function GlobalLoading() {
  return (
    <div className="min-h-[100dvh] bg-[#FFF7E6] text-[#2B1B0F] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] p-6 text-center space-y-4">
        <div className="w-12 h-12 bg-[#5DAA3A] border-[2px] border-[#2B1B0F] shadow-[2px_2px_0px_#2B1B0F] mx-auto flex items-center justify-center animate-bounce motion-reduce:animate-none">
          <div className="w-5 h-5 bg-[#FFE9A8]" />
        </div>
        <div className="space-y-1">
          <h2 className="font-heading font-extrabold text-base text-[#2B1B0F]">
            Margam
          </h2>
          <p className="text-xs text-[#2B1B0F]/70 font-sans">
            Loading next quest...
          </p>
        </div>
      </div>
    </div>
  );
}

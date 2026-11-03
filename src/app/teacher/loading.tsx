import React from "react";

export default function TeacherLoading() {
  return (
    <div className="min-h-[100dvh] bg-[#FFF7E6] text-[#2B1B0F] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] p-6 sm:p-8 text-center space-y-4">
        <div className="w-14 h-14 bg-[#5DAA3A] border-[3px] border-[#2B1B0F] shadow-[3px_3px_0px_#2B1B0F] mx-auto flex items-center justify-center animate-pulse motion-reduce:animate-none">
          <div className="w-6 h-6 bg-[#A4D2FF]" />
        </div>
        <div className="space-y-1.5">
          <h2 className="font-heading font-extrabold text-lg text-[#2B1B0F]">
            Loading Teacher Portal
          </h2>
          <p className="text-xs text-[#2B1B0F]/75 font-sans leading-relaxed">
            Gathering classroom diagnostics and concept analytics...
          </p>
        </div>
      </div>
    </div>
  );
}

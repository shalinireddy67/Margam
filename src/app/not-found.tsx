"use client";

import Link from "next/link";
import { Compass, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-voxel-sky text-[#2B1B0F] flex flex-col justify-between">
      <header className="border-b-[3px] border-[#1E1610] bg-[#5A3720] text-[#FFF7E6] shadow-[0px_4px_0px_#1B120C]">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#5DAA3A] border-[2px] border-[#1E1610] shadow-[2px_2px_0px_#1B120C] flex items-center justify-center text-[#1E1610]">
              <Compass className="w-4 h-4" />
            </div>
            <span className="font-heading font-extrabold text-base text-[#FFE9A8]">MARGAM</span>
          </Link>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="bg-[#FFF7E6] border-[3px] border-[#1E1610] shadow-[6px_6px_0px_#1B120C] p-8 space-y-4">
          <span className="font-heading font-extrabold text-3xl sm:text-4xl text-[#D9453D] block">404</span>
          <h1 className="font-heading font-extrabold text-lg text-[#2B1B0F]">
            {t("errors.pageNotFoundTitle") || "Page Not Found"}
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-[#5A3720] leading-relaxed font-sans">
            {t("errors.pageNotFoundDesc") || "This page was not found. Tap below to return home."}
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center justify-center min-h-[48px] gap-2 px-6 py-2.5 bg-[#5DAA3A] hover:bg-[#4E9330] text-[#1E1610] border-[2px] border-[#1E1610] font-heading font-extrabold text-xs shadow-[3px_3px_0px_#1E1610] no-underline"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t("errors.goHomeBtn") || "Go home"}</span>
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t-2 border-[#1E1610]/20 py-4 text-center text-xs text-[#5A3720] bg-[#FFF7E6]">
        Margam Educational Platform
      </footer>
    </div>
  );
}

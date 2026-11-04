"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, RotateCcw, ShieldAlert } from "lucide-react";
import { LearnerProfile } from "@/lib/types";
import { getActiveProfile, clearActiveProfile } from "@/lib/storage";
import { Companion } from "@/components/ui/Companion";
import { Logo } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ResetClassPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [profile, setProfile] = useState<LearnerProfile | null>(null);

  useEffect(() => {
    const active = getActiveProfile();
    if (!active) {
      router.replace("/");
      return;
    }
    setProfile(active);
  }, [router]);

  if (!profile) return null;

  const handleConfirmReset = () => {
    clearActiveProfile();
    router.replace("/");
  };

  return (
    <div className="min-h-[100dvh] bg-transparent text-[#1E1610] flex flex-col justify-between">
      <header
        data-panel="header"
        className="border-b-[3px] border-[#1E1610] bg-[#232634]/92 text-[#F3E3BC] shadow-[0px_3px_0px_#1E1610]"
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 border-2 border-[#1E1610] bg-[#6DB33F] shadow-[2px_2px_0px_#1E1610] flex items-center justify-center shrink-0">
              <Logo className="w-5 h-5 text-[#1E1610]" ariaLabel="Margam" />
            </div>
            <span className="font-heading font-extrabold text-base text-[#F3E3BC] tracking-wider">
              MARGAM
            </span>
          </Link>
          <span className="font-heading font-bold text-xs text-[#D9B87A]">
            {t("profile.classSwitchProtocol") || "Class Switch Protocol"}
          </span>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-12 w-full flex-1 flex flex-col justify-center items-center my-auto">
        <div
          data-panel="reset-card"
          className="bg-[#D9B87A]/90 p-6 sm:p-8 border-[3px] border-[#1E1610] shadow-[4px_4px_0px_#1E1610] rounded-xs space-y-6 text-center"
        >
          <div className="flex justify-center mb-2">
            <Companion pose="oops" size={80} sticker={false} alt="Margam companion warning" />
          </div>

          <div>
            <h1 className="font-heading font-extrabold text-lg sm:text-xl text-[#1E1610]">
              {profile.name} • Class {profile.selectedClass}
            </h1>
            <p className="text-xs sm:text-sm text-[#5A3720] mt-2 leading-relaxed font-sans font-semibold">
              {t("profile.dangerZone") || "Reset Progress"}
            </p>
          </div>

          <div className="p-4 bg-[#E8CF9C] border-[2px] border-[#1E1610] text-left space-y-2 text-xs text-[#1E1610] rounded-xs">
            <div className="flex items-center gap-2 font-heading font-extrabold text-xs text-[#D1362B]">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{t("common.error") || "Caution"}</span>
            </div>
            <p className="font-semibold leading-relaxed m-0">
              {t("profile.classSwitchProtocol") || "Switching to another class will reset your active study session on this browser."}
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={handleConfirmReset}
              className="w-full min-h-[48px] px-4 py-2.5 bg-[#D1362B] hover:bg-[#A82820] text-[#F3E3BC] border-[3px] border-[#1E1610] font-heading font-extrabold text-xs shadow-[3px_3px_0px_#1E1610] active:translate-x-[2px] active:translate-y-[2px] flex items-center justify-center gap-2 transition-colors cursor-pointer rounded-xs"
            >
              <RotateCcw className="w-4 h-4 text-[#F3E3BC]" />
              <span>{t("profile.resetProgress") || "Reset and Switch Class"}</span>
            </button>

            <Link
              href="/"
              className="w-full min-h-[48px] px-4 py-2.5 bg-[#6DB33F] hover:bg-[#8CCB55] text-[#1E1610] border-[3px] border-[#1E1610] font-heading font-extrabold text-xs shadow-[3px_3px_0px_#1E1610] active:translate-x-[2px] active:translate-y-[2px] flex items-center justify-center gap-2 transition-colors cursor-pointer no-underline rounded-xs"
            >
              <ArrowLeft className="w-4 h-4 text-[#1E1610]" />
              <span>{t("common.back") || "Cancel and Return"}</span>
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t-2 border-[#1E1610]/20 py-4 text-center text-xs text-[#1E1610] font-bold">
        Margam • {t("footer.description") || "Adaptive Mathematics for NCERT Classes 6–10"}
      </footer>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, RotateCcw, ShieldAlert, Compass } from "lucide-react";
import { LearnerProfile } from "@/lib/types";
import { getActiveProfile, clearActiveProfile } from "@/lib/storage";
import { WitchCat } from "@/components/ui/WitchCat";

export default function ResetClassPage() {
  const router = useRouter();
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
    <div className="min-h-[100dvh] bg-[#FFF7E6] text-[#2B1B0F] flex flex-col justify-between">
      {/* Header */}
      <header className="border-b-[3px] border-[#2B1B0F] bg-white text-[#2B1B0F] shadow-[0px_3px_0px_rgba(43,27,15,0.1)]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/student" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-[#5DAA3A] border-2 border-[#2B1B0F] shadow-[2px_2px_0px_#2B1B0F] flex items-center justify-center text-[#2B1B0F] shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <span className="font-heading font-extrabold text-base text-[#2B1B0F]">
              MARGAM
            </span>
          </Link>
          <span className="text-xs font-heading font-bold text-[#2B1B0F]/70">Grade Switch</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-xl mx-auto px-4 py-12 w-full flex-1 flex flex-col justify-center items-center my-auto">
        <div className="bg-white p-6 sm:p-8 border-[3px] border-[#2B1B0F] shadow-[4px_4px_0px_#2B1B0F] space-y-6 text-center w-full">
          <div className="flex justify-center mb-2">
            <WitchCat pose="oops" size={80} sticker={false} alt="Margam companion warning" />
          </div>

          <div>
            <h1 className="font-heading font-extrabold text-2xl text-[#2B1B0F]">
              Switch Grade for {profile.name}?
            </h1>
            <p className="text-xs sm:text-sm text-[#2B1B0F]/80 mt-2 leading-relaxed font-sans font-medium">
              You are currently enrolled in <strong className="text-[#2F6B22] font-bold">Class {profile.selectedClass}</strong>.
            </p>
          </div>

          <div className="p-4 bg-[#FFE9A8] border-[2px] border-[#2B1B0F] text-left space-y-2 text-xs text-[#2B1B0F]">
            <div className="flex items-center gap-2 font-heading font-bold text-sm text-[#E04A3F]">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Progress Note</span>
            </div>
            <p className="font-sans font-medium leading-relaxed">
              Switching to another grade will reset your active Class {profile.selectedClass} practice streak and topic completions for this browser profile.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={handleConfirmReset}
              className="w-full min-h-[48px] px-4 py-2.5 bg-[#E04A3F] hover:brightness-105 text-white border-[3px] border-[#2B1B0F] font-heading font-bold text-sm shadow-[3px_3px_0px_#2B1B0F] active:translate-x-[2px] active:translate-y-[2px] flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Class {profile.selectedClass} Progress & Switch Grade</span>
            </button>

            <Link
              href="/student"
              className="w-full min-h-[48px] px-4 py-2.5 bg-[#5DAA3A] hover:brightness-105 text-[#2B1B0F] border-[3px] border-[#2B1B0F] font-heading font-bold text-sm shadow-[3px_3px_0px_#2B1B0F] active:translate-x-[2px] active:translate-y-[2px] flex items-center justify-center gap-2 transition-all cursor-pointer no-underline"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Cancel and Return to Class {profile.selectedClass}</span>
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t-[3px] border-[#422816] py-4 text-center text-xs text-[#FFF7E6] bg-[#5A3720]">
        Margam Educational Platform • Safe & Deterministic Storage
      </footer>
    </div>
  );
}

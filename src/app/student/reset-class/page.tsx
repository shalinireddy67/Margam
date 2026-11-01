"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, RotateCcw, ShieldAlert } from "lucide-react";
import { LearnerProfile } from "@/lib/types";
import { getActiveProfile, clearActiveProfile } from "@/lib/storage";
import { WitchCat } from "@/components/ui/WitchCat";
import { Logo } from "@/components/ui";

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
    <div className="min-h-screen bg-[#102610] minecraft-grid-bg text-[#F2F0DF] flex flex-col justify-between">
      <header className="border-b-3 border-[#315B2A] bg-[#173B19] shadow-[0px_4px_0px_#102610]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 border-2 border-[#102610] shadow-[2px_2px_0px_#102610] flex items-center justify-center shrink-0">
              <Logo className="w-full h-full" ariaLabel="Margam" />
            </div>
            <span className="font-heading font-extrabold text-xl text-[#79B82A] tracking-wider drop-shadow-[2px_2px_0px_#102610]">
              MARGAM
            </span>
          </Link>
          <span className="text-xs font-heading font-bold text-[#D8D8D0]">Realm Switch Protocol</span>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-12 w-full flex-1 flex flex-col justify-center">
        <div className="bg-[#173B19] p-6 sm:p-8 border-3 border-[#D9453D] shadow-[6px_6px_0px_#102610] space-y-6 text-center">
          <div className="flex justify-center mb-2">
            <WitchCat pose="oops" size={80} sticker={false} alt="Margam companion warning" />
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-[#F2F0DF]">
              Reset Realm for {profile.name}?
            </h1>
            <p className="text-xs sm:text-sm text-[#D8D8D0] mt-2 leading-relaxed">
              You are currently enrolled in <strong className="text-[#79B82A]">Class {profile.selectedClass}</strong>.
            </p>
          </div>

          <div className="p-4 bg-[#102610] border-2 border-[#D9453D]/60 text-left space-y-2 text-xs text-[#D8D8D0]">
            <div className="flex items-center gap-2 font-heading font-bold text-[#D9453D]">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Progress Caution</span>
            </div>
            <p>
              Switching to another grade will reset your active Class {profile.selectedClass} quest streak and topic completions for this browser session.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={handleConfirmReset}
              className="w-full min-h-[48px] px-4 py-2.5 bg-[#D9453D] hover:bg-[#C2362E] text-white border-3 border-[#102610] font-heading font-extrabold text-xs shadow-[3px_3px_0px_#102610] active:translate-x-[2px] active:translate-y-[2px] flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Class {profile.selectedClass} Progress & Switch Grade</span>
            </button>

            <Link
              href="/"
              className="w-full min-h-[48px] px-4 py-2.5 bg-[#4F8A24] hover:bg-[#5E9E2C] text-[#F2F0DF] border-3 border-[#102610] font-heading font-extrabold text-xs shadow-[3px_3px_0px_#102610] active:translate-x-[2px] active:translate-y-[2px] flex items-center justify-center gap-2 transition-colors cursor-pointer no-underline"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Cancel and Return to Class {profile.selectedClass}</span>
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t-2 border-[#315B2A] py-4 text-center text-xs text-[#D8D8D0]/60">
        Margam Educational Platform • Safe & Deterministic Storage
      </footer>
    </div>
  );
}

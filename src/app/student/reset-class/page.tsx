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
    <div className="min-h-[100dvh] bg-voxel-sky text-[#2B1B0F] flex flex-col justify-between">
      <header className="border-b-[3px] border-[#422816] bg-[#5A3720] text-[#FFF7E6] shadow-[0px_4px_0px_#1B120C]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 border-2 border-[#422816] shadow-[2px_2px_0px_#1B120C] flex items-center justify-center shrink-0">
              <Logo className="w-full h-full" ariaLabel="Margam" />
            </div>
            <span className="font-pixel text-base text-[#FFE9A8] tracking-wider">
              MARGAM
            </span>
          </Link>
          <span className="font-pixel text-xs text-[#E5D7BE]">Realm Switch Protocol</span>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-12 w-full flex-1 flex flex-col justify-center items-center my-auto">
        <div className="bg-[#FFF7E6] p-6 sm:p-8 border-[3px] border-[#422816] shadow-[6px_6px_0px_#1B120C] space-y-6 text-center">
          <div className="flex justify-center mb-2">
            <WitchCat pose="oops" size={80} sticker={false} alt="Margam companion warning" />
          </div>

          <div>
            <h1 className="font-pixel text-lg sm:text-xl text-[#2B1B0F]">
              Reset Realm for {profile.name}?
            </h1>
            <p className="text-xs sm:text-sm text-[#5A3720] mt-2 leading-relaxed font-sans font-semibold">
              You are currently enrolled in <strong className="text-[#5DAA3A]">Class {profile.selectedClass}</strong>.
            </p>
          </div>

          <div className="p-4 bg-[#FFE9A8] border-[2px] border-[#422816] text-left space-y-2 text-xs text-[#2B1B0F]">
            <div className="flex items-center gap-2 font-pixel text-xs text-[#D9453D]">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Progress Caution</span>
            </div>
            <p className="font-semibold leading-relaxed">
              Switching to another grade will reset your active Class {profile.selectedClass} quest streak and topic completions for this browser session.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={handleConfirmReset}
              className="w-full min-h-[48px] px-4 py-2.5 bg-[#D9453D] hover:bg-[#B3352D] text-white border-[3px] border-[#422816] font-pixel text-xs shadow-[3px_3px_0px_#1B120C] active:translate-x-[2px] active:translate-y-[2px] flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Class {profile.selectedClass} Progress & Switch Grade</span>
            </button>

            <Link
              href="/"
              className="w-full min-h-[48px] px-4 py-2.5 bg-[#5DAA3A] hover:bg-[#4E9330] text-white border-[3px] border-[#422816] font-pixel text-xs shadow-[3px_3px_0px_#1B120C] active:translate-x-[2px] active:translate-y-[2px] flex items-center justify-center gap-2 transition-colors cursor-pointer no-underline"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Cancel and Return to Class {profile.selectedClass}</span>
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t-2 border-[#422816]/20 py-4 text-center text-xs text-[#5A3720]">
        Margam Educational Platform • Safe & Deterministic Storage
      </footer>
    </div>
  );
}

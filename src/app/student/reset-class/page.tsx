"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, RotateCcw, ShieldAlert, Compass } from "lucide-react";
import { LearnerProfile } from "@/lib/types";
import { getActiveProfile, clearActiveProfile } from "@/lib/storage";

export default function ResetClassPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<LearnerProfile | null>(null);

  useEffect(() => {
    const active = getActiveProfile();
    if (!active) {
      router.replace("/student/select-class");
      return;
    }
    setProfile(active);
  }, [router]);

  if (!profile) return null;

  const handleConfirmReset = () => {
    clearActiveProfile();
    router.replace("/student/select-class");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href={`/student/class/${profile.selectedClass}`} className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-soft">
              <Compass className="w-5 h-5" />
            </div>
            <span className="font-heading font-extrabold text-xl text-foreground tracking-tight">
              Margam
            </span>
          </Link>
          <span className="text-xs font-semibold text-muted-foreground">Class Reset Protocol</span>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-12 w-full flex-1 flex flex-col justify-center">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto border border-amber-200">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div>
            <h1 className="text-2xl font-heading font-extrabold text-foreground">
              Reset Grade for {profile.name}?
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              You are currently enrolled in <strong className="text-foreground">Class {profile.selectedClass}</strong>.
            </p>
          </div>

          {/* Explanation Box */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-left space-y-2 text-xs text-amber-950">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <ShieldAlert className="w-4 h-4 shrink-0 text-amber-700" />
              <span>Consequences of Switching Class</span>
            </div>
            <ul className="list-disc pl-4 space-y-1 leading-relaxed text-slate-700">
              <li>
                <strong>Zero Grade-Mixing:</strong> Margam strictly prevents progress from multiple classes from being merged into one learner profile.
              </li>
              <li>
                <strong>Progress Wipe:</strong> Switching to another grade will permanently clear your current Class {profile.selectedClass} topic completions, lesson reads, and worksheet scores.
              </li>
              <li>
                <strong>Multi-Grade Learners:</strong> If you are sharing this device with a sibling in another grade, please use a separate browser profile.
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleConfirmReset}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-heading font-bold text-sm shadow-soft transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Class {profile.selectedClass} Progress & Pick New Grade</span>
            </button>

            <Link
              href={`/student/class/${profile.selectedClass}`}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-foreground font-semibold text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Cancel and Return to Class {profile.selectedClass}</span>
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 py-4 text-center text-xs text-muted-foreground bg-white">
        Margam • Strict Single-Grade Learner Isolation
      </footer>
    </div>
  );
}

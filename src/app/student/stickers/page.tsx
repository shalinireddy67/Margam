"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowLeft, Award, Star } from "lucide-react";
import { LearnerProfile } from "@/lib/types";
import { getActiveProfile } from "@/lib/storage";
import { BottomTabBar } from "@/components/ui/BottomTabBar";

export default function StickersPage() {
  const [profile, setProfile] = useState<LearnerProfile | null>(null);

  useEffect(() => {
    const active = getActiveProfile();
    setProfile(active);
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF8DC] text-[#111111] pb-28 flex flex-col justify-between">
      <header className="border-b-[3px] border-[#111111] bg-[#FFFFFF]">
        <div className="max-w-xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center justify-center min-h-[48px] min-w-[48px] gap-2 text-sm font-extrabold text-[#111111] no-underline"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Home</span>
          </Link>
          <span className="font-heading font-extrabold text-base text-[#111111]">
            Sticker Showcase
          </span>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-8 w-full flex-1 space-y-6">
        <div className="p-6 bg-[#FFFFFF] border-[3px] border-[#111111] rounded-3xl shadow-[4px_4px_0px_#111111] text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-[#FFE14D] border-[3px] border-[#111111] shadow-[2px_2px_0px_#111111] flex items-center justify-center mx-auto text-[#111111]">
            <Award className="w-8 h-8" />
          </div>

          <h1 className="font-heading font-extrabold text-2xl text-[#111111]">
            Learner Trophy Badges
          </h1>
          <p className="text-xs sm:text-sm font-bold text-[#111111]/70 leading-relaxed">
            Earn stickers and companion badges as you master sequential concepts and complete diagnostics!
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 bg-[#FFFFFF] border-[3px] border-[#111111] rounded-2xl shadow-[3px_3px_0px_#111111] text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#8DE86A] border-[2px] border-[#111111] flex items-center justify-center mx-auto text-[#111111]">
              <Star className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-extrabold text-sm text-[#111111]">
              First Step
            </h3>
            <p className="text-[11px] font-bold text-[#111111]/70">
              Completed onboarding
            </p>
          </div>

          <div className="p-4 bg-[#FFFFFF] border-[3px] border-[#111111] rounded-2xl shadow-[3px_3px_0px_#111111] text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#4DD9E8] border-[2px] border-[#111111] flex items-center justify-center mx-auto text-[#111111]">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-extrabold text-sm text-[#111111]">
              Witch Cat Friend
            </h3>
            <p className="text-[11px] font-bold text-[#111111]/70">
              Learned with study companion
            </p>
          </div>
        </div>
      </main>

      <BottomTabBar currentTab="stickers" />
    </div>
  );
}

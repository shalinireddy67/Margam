"use client";

import React from "react";
import { SupportedLanguage, LearnerProfile } from "@/lib/types";
import Navigation from "./Navigation";

interface NavbarProps {
  currentLang: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  profile?: LearnerProfile | null;
  currentTab?: "home" | "learn" | "stickers" | "profile";
}

export default function Navbar({
  currentLang,
  onLanguageChange,
  profile,
  currentTab,
}: NavbarProps) {
  return (
    <Navigation
      currentLang={currentLang}
      onLanguageChange={onLanguageChange}
      profile={profile}
      currentTab={currentTab}
    />
  );
}

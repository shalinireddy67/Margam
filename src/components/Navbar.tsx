"use client";

import React, { useState } from "react";
import { Compass, Menu, X, ArrowRight, ShieldCheck } from "lucide-react";
import { SITE_NAME, SITE_CONFIG } from "@/config/site";
import { SupportedLanguage } from "@/lib/types";

interface NavbarProps {
  currentLang: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
}

export default function Navbar({ currentLang, onLanguageChange }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modalNotice, setModalNotice] = useState<string | null>(null);

  const navLinks = [
    { label: "01 Cover", href: "#cover" },
    { label: "02 Dilemma", href: "#problem" },
    { label: "03 Workflow", href: "#approach" },
    { label: "04 Simulator", href: "#try-diagnostic" },
    { label: "05 DAG", href: "#concept-pathway" },
    { label: "06 Classrooms", href: "#indian-classrooms" },
    { label: "07 Teachers", href: "#teachers" },
    { label: "08 FAQ", href: "#faq" },
    { label: "09 Pilot", href: "#pilot" },
  ];

  return (
    <>
      {/* Top Banner Bar matching ShikshaGap */}
      <div className="bg-[#FFF7E6] dark:bg-[#1A2615] border-b border-[#C7DDAE]/60 dark:border-[#3B5428] px-3 sm:px-8 py-2 text-xs font-sans text-foreground/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Mobile top text */}
          <div className="flex sm:hidden items-center justify-between w-full text-[12px] font-bold text-primary">
            <span className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-accent" />
              <span>MARGAM • MATH CLASSES 6–10</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#C7DDAE]/50 text-foreground text-[11px]">
              Free for Schools
            </span>
          </div>

          {/* Desktop top text */}
          <div className="hidden sm:flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block shrink-0" aria-hidden="true">
              <circle cx="12" cy="7.2" r="4.2" fill="#F4C542" />
              <circle cx="16.6" cy="10.5" r="4.2" fill="#F4C542" />
              <circle cx="14.8" cy="16" r="4.2" fill="#F4C542" />
              <circle cx="9.2" cy="16" r="4.2" fill="#F4C542" />
              <circle cx="7.4" cy="10.5" r="4.2" fill="#F4C542" />
              <circle cx="12" cy="12" r="3.2" fill="#F28C38" />
            </svg>
            <span className="font-bold text-primary tracking-wide">
              MARGAM • MATHEMATICS CLASSES 6 TO 10
            </span>
            <span className="opacity-40 hidden md:inline">|</span>
            <span className="hidden md:inline italic text-muted-foreground font-serif">
              Every learner has a path. Find yours.
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#C7DDAE]/50 text-foreground font-semibold">
              Free for Govt Schools
            </span>
            <span className="opacity-40 hidden sm:inline">|</span>
            <span className="text-primary font-semibold hidden sm:inline">
              DPDP Act 2023 Principles
            </span>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-50 bg-[#FFF7E6]/90 dark:bg-[#1C2817]/90 backdrop-blur-md border-b border-[#C7DDAE]/60 dark:border-[#3B5428] px-3 sm:px-8 py-2.5 sm:py-3 transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo & Category Badge */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a className="font-heading text-xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2 group" href="#cover">
              <span className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-primary text-primary-foreground font-heading text-sm sm:text-base flex items-center justify-center font-bold shadow-warm group-hover:rotate-6 transition-transform">
                <Compass className="w-5 h-5 text-[#FFF7E6]" />
              </span>
              <span className="tracking-tight text-primary font-extrabold">
                Mar<span className="text-accent">gam</span>
              </span>
            </a>

            <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-[#C7DDAE] text-xs font-sans px-3 py-1 bg-[#C7DDAE]/30 text-foreground font-bold">
              AI Diagnostic (6–10)
            </span>
          </div>

          {/* Nav Links & Controls */}
          <div className="flex items-center gap-1.5 sm:gap-4">
            <nav className="hidden lg:flex items-center gap-1.5 text-xs sm:text-sm font-sans font-semibold text-foreground/80" aria-label="Main Navigation">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-2.5 py-1 rounded-full hover:bg-[#C7DDAE]/40 hover:text-primary transition-all text-xs"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Language Selector Pill */}
            <div
              className="flex items-center border border-[#C7DDAE] dark:border-[#3B5428] rounded-full p-0.5 text-xs font-sans bg-[#FFF7E6] dark:bg-[#1A2615] shadow-xs"
              role="group"
              aria-label="Language selection"
            >
              <button
                type="button"
                onClick={() => onLanguageChange("en")}
                className={`min-h-[36px] sm:min-h-[40px] px-2.5 sm:px-3 rounded-full font-bold cursor-pointer transition-all text-xs ${
                  currentLang === "en"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-foreground/70 hover:text-foreground hover:bg-[#C7DDAE]/30"
                }`}
                aria-pressed={currentLang === "en"}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange("hi")}
                className={`min-h-[36px] sm:min-h-[40px] px-2.5 sm:px-3 rounded-full font-bold cursor-pointer transition-all text-xs ${
                  currentLang === "hi"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-foreground/70 hover:text-foreground hover:bg-[#C7DDAE]/30"
                }`}
                aria-pressed={currentLang === "hi"}
              >
                हिन्दी
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange("te")}
                className={`min-h-[36px] sm:min-h-[40px] px-2.5 sm:px-3 rounded-full font-bold cursor-pointer transition-all text-xs ${
                  currentLang === "te"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-foreground/70 hover:text-foreground hover:bg-[#C7DDAE]/30"
                }`}
                aria-pressed={currentLang === "te"}
              >
                తెలుగు
              </button>
            </div>

            {/* Student Join Button */}
            <button
              type="button"
              onClick={() =>
                setModalNotice(
                  "Student Access (Class Code & Roll Number onboarding) is part of Phase 2. Try the interactive 3-question diagnostic below on this page!"
                )
              }
              className="hidden sm:inline-flex rounded-full border border-[#C7DDAE] dark:border-[#3B5428] bg-transparent text-foreground px-4 py-2 min-h-[44px] items-center text-xs font-sans uppercase font-bold hover:bg-[#C7DDAE]/30 cursor-pointer transition-colors"
            >
              Student Join
            </button>

            {/* Start Practice / Diagnostic Primary Button */}
            <div className="hidden sm:inline-block">
              <a
                href="#try-diagnostic"
                className="inline-flex rounded-full bg-accent text-accent-foreground px-5 sm:px-6 py-2.5 min-h-[44px] items-center text-sm font-sans font-bold hover:bg-accent/90 focus-visible:outline-2 focus-visible:outline-ring cursor-pointer shadow-warm tracking-wide transition-all active:scale-95"
              >
                <span>Start Diagnostic</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </a>
            </div>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
              className="lg:hidden w-11 h-11 rounded-full flex items-center justify-center border border-[#C7DDAE] bg-[#FFF7E6] text-foreground cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#C7DDAE]/60 bg-[#FFF7E6] px-4 py-4 space-y-3 mt-2">
            <nav className="flex flex-col space-y-1.5 text-xs font-semibold text-foreground">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1.5 px-3 rounded-lg hover:bg-[#C7DDAE]/30"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="pt-3 border-t border-[#C7DDAE]/60 flex flex-col gap-2">
              <a
                href="#try-diagnostic"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-full bg-accent text-accent-foreground text-center text-xs font-bold shadow-warm"
              >
                Start Diagnostic
              </a>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setModalNotice(
                    "Teacher Portal is part of Phase 3. Synthetic Class 8A data is structured in data/demo-class.json."
                  );
                }}
                className="w-full py-2 rounded-full border border-[#C7DDAE] text-center text-xs font-bold text-foreground"
              >
                Teacher Portal (Phase 3)
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Phase Boundary Modal */}
      {modalNotice && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
        >
          <div className="bg-[#FFF7E6] rounded-[24px] max-w-md w-full p-6 border-2 border-[#C7DDAE] shadow-warm space-y-4">
            <div className="flex items-center justify-between border-b border-[#C7DDAE]/60 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-accent font-sans">
                Roadmap Boundary
              </span>
              <button
                type="button"
                onClick={() => setModalNotice(null)}
                className="text-foreground/70 hover:text-foreground p-1 cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-sans">
              {modalNotice}
            </p>
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setModalNotice(null)}
                className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-xs font-bold cursor-pointer hover:bg-primary/90"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import React, { useState } from "react";
import { Compass, BookOpen, Users, Globe, Menu, X, ArrowUpRight } from "lucide-react";
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
    { label: "The Problem", href: "#problem" },
    { label: "How It Works", href: "#approach" },
    { label: "Learn • Solve • Test", href: "#three-stages" },
    { label: "Concept Path", href: "#concept-pathway" },
    { label: "Classrooms", href: "#indian-classrooms" },
    { label: "Teachers", href: "#teachers" },
    { label: "Chapters", href: "#chapters" },
    { label: "Roadmap", href: "#roadmap" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-margam-cream/95 backdrop-blur-md border-b border-margam-border transition-colors">
        {/* Top notice bar */}
        <div className="bg-margam-navy text-white text-xs py-1.5 px-4 sm:px-8 font-medium">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-margam-terracotta animate-pulse" />
              <span className="font-bold tracking-wide">CODE KERNEL &apos;26 | DECODE ROUND</span>
              <span className="hidden md:inline opacity-60">•</span>
              <span className="hidden md:inline text-gray-300">
                Adaptive Mathematics Learning for Classes 6–10
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-gray-300">
              <span className="hidden sm:inline">Zero Tracking Cookies • DPDP Act 2023 Principles</span>
              <span className="bg-white/10 px-2 py-0.5 rounded text-white font-mono font-bold">
                Phase 1 MVP
              </span>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-margam-navy text-white flex items-center justify-center font-bold shadow-warm group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 text-margam-terracotta" />
            </div>
            <div>
              <span className="font-serif text-2xl font-black tracking-tight text-margam-navy group-hover:text-margam-terracotta transition-colors">
                {SITE_NAME}
              </span>
              <span className="hidden sm:block text-[10px] uppercase tracking-widest text-margam-slate font-bold -mt-1">
                Adaptive Learning Path
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-5 text-xs font-bold text-margam-navy/80">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-margam-terracotta transition-colors py-1"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5">
            {/* Language Selector */}
            <div
              className="flex items-center bg-white border border-margam-border rounded-lg p-0.5 shadow-xs"
              role="group"
              aria-label="Language Selector"
            >
              {SITE_CONFIG.languages.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => onLanguageChange(l.code as SupportedLanguage)}
                  className={`min-h-[32px] px-2.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    currentLang === l.code
                      ? "bg-margam-navy text-white shadow-xs"
                      : "text-margam-slate hover:text-margam-navy"
                  }`}
                  aria-pressed={currentLang === l.code}
                >
                  {l.nativeName}
                </button>
              ))}
            </div>

            {/* Student Entry (Phase 2 preview notice) */}
            <button
              type="button"
              onClick={() =>
                setModalNotice(
                  "Student Access (Class Code & Roll Number onboarding) is part of Phase 2. Explore the live 3-question diagnostic simulator below on this page!"
                )
              }
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-margam-border bg-white hover:bg-margam-cream-paper text-margam-navy text-xs font-bold transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-margam-slate" />
              <span>Student Join</span>
            </button>

            {/* Teacher Entry (Phase 3 preview notice) */}
            <button
              type="button"
              onClick={() =>
                setModalNotice(
                  "Teacher Portal (Mastery Heatmap & 1-page A4 Worksheet Generator) is planned for Phase 3. Synthetic Class 8A dataset is ready in data/demo-class.json!"
                )
              }
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-margam-terracotta hover:bg-margam-terracotta-hover text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Teacher Portal</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg border border-margam-border text-margam-navy hover:bg-margam-cream-paper"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-margam-border bg-white px-4 py-4 space-y-3">
            <nav className="flex flex-col space-y-2 text-sm font-semibold text-margam-navy">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1.5 px-2 rounded-md hover:bg-margam-cream-paper"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="pt-3 border-t border-margam-border flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setModalNotice(
                    "Student Access is part of Phase 2. Try the interactive 3-question diagnostic below!"
                  );
                }}
                className="w-full py-2.5 rounded-lg border border-margam-border text-center text-xs font-bold text-margam-navy"
              >
                Student Join (Phase 2)
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setModalNotice(
                    "Teacher Portal is part of Phase 3. Synthetic Class 8A data is structured in data/demo-class.json."
                  );
                }}
                className="w-full py-2.5 rounded-lg bg-margam-terracotta text-white text-center text-xs font-bold"
              >
                Teacher Portal (Phase 3)
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Notice Modal */}
      {modalNotice && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border-2 border-margam-border shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-margam-terracotta">
                Phase Boundary Notice
              </span>
              <button
                type="button"
                onClick={() => setModalNotice(null)}
                className="text-margam-slate hover:text-margam-navy p-1"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-margam-navy/90 leading-relaxed font-sans">
              {modalNotice}
            </p>
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setModalNotice(null)}
                className="px-5 py-2 rounded-lg bg-margam-navy text-white text-xs font-bold"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

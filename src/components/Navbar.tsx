"use client";

import React, { useState } from "react";
import { Home, Sparkles, Network, Users, Globe, Compass, ArrowRight } from "lucide-react";
import { SITE_NAME } from "@/config/site";
import { SupportedLanguage } from "@/lib/types";
import { Logo } from "@/components/ui";

interface NavbarProps {
  currentLang: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
}

export default function Navbar({ currentLang, onLanguageChange }: NavbarProps) {
  const [activeTab, setActiveTab] = useState("home");

  const navLinks = [
    { id: "home", label: "Home", href: "/", icon: Home },
    { id: "learn", label: "Student Path", href: "/student", icon: Sparkles },
    { id: "diagnostic", label: "Diagnostic", href: "/#try-diagnostic", icon: Compass },
    { id: "concepts", label: "Concept Map", href: "/#concept-pathway", icon: Network },
    { id: "teachers", label: "Teachers", href: "/teacher", icon: Users },
  ];

  return (
    <>
      {/* Top Navigation Bar (Always visible) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E0E5D4] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3">
          {/* Logo & Brand Identity */}
          <a
            href="#home"
            className="flex items-center gap-2.5 min-h-[48px] rounded-2xl pr-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
            aria-label="Margam Home"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-none border-2 border-[#111111] flex items-center justify-center shrink-0">
              <Logo className="w-full h-full" ariaLabel="Margam Logo" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-xl sm:text-2xl text-foreground tracking-tight leading-none">
                Margam
              </span>
              <span className="text-[11px] font-semibold text-muted-foreground leading-tight hidden sm:block">
                Math for Classes 6–10
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links (Max 5 items, Big labels with icons) */}
          <nav className="hidden md:flex items-center gap-1.5" aria-label="Main Navigation">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => setActiveTab(item.id)}
                  className={`min-h-[48px] px-3.5 py-2 rounded-2xl text-sm font-heading font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    isActive
                      ? "bg-coral text-white shadow-soft"
                      : "text-foreground hover:bg-background text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-coral"}`} />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Right Actions: Big Language Switcher + Main CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Large Accessible Language Switcher */}
            <div
              className="flex items-center bg-background p-1 rounded-2xl border border-[#E0E5D4]"
              role="group"
              aria-label="Select Language"
            >
              <button
                type="button"
                onClick={() => onLanguageChange("en")}
                className={`min-h-[40px] px-3 rounded-xl text-xs sm:text-sm font-heading font-bold transition-all cursor-pointer ${
                  currentLang === "en"
                    ? "bg-foreground text-white shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange("hi")}
                className={`min-h-[40px] px-3 rounded-xl text-xs sm:text-sm font-heading font-bold transition-all cursor-pointer ${
                  currentLang === "hi"
                    ? "bg-foreground text-white shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                हिन्दी
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange("te")}
                className={`min-h-[40px] px-3 rounded-xl text-xs sm:text-sm font-heading font-bold transition-all cursor-pointer ${
                  currentLang === "te"
                    ? "bg-foreground text-white shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                తెలుగు
              </button>
            </div>

            {/* Desktop CTA Button */}
            <a
              href="/student"
              className="hidden lg:inline-flex min-h-[48px] px-5 py-2.5 rounded-2xl bg-coral hover:bg-coral-hover text-white text-sm font-heading font-bold items-center gap-2 transition-all shadow-soft cursor-pointer"
            >
              <span>Start Learning</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      {/* Mobile Sticky Bottom Tab Bar (Strictly on phones, max 5 items, min 48px touch targets) */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#E0E5D4] py-1 px-2 flex items-center justify-around md:hidden shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
        aria-label="Mobile Navigation"
      >
        {navLinks.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <a
              key={item.id}
              href={item.href}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center min-h-[52px] min-w-[54px] px-2 py-1 rounded-2xl transition-all cursor-pointer ${
                isActive
                  ? "text-coral font-bold"
                  : "text-muted-foreground hover:text-foreground font-medium"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  isActive ? "bg-coral-light text-coral" : "text-muted-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] leading-tight mt-0.5">{item.label}</span>
            </a>
          );
        })}
      </nav>
    </>
  );
}

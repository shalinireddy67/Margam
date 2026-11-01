"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Home, Sparkles, Network, Users, Compass, ArrowRight } from "lucide-react";
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
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#173B19]/95 backdrop-blur-md border-b-3 border-[#315B2A] shadow-[0px_4px_0px_#102610] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3">
          {/* Logo & Brand Identity */}
          <Link
            href="/"
            className="flex items-center gap-2.5 min-h-[48px] pr-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5B834]"
            aria-label="Margam Home"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-none border-2 border-[#102610] shadow-[2px_2px_0px_#102610] flex items-center justify-center shrink-0">
              <Logo className="w-full h-full" ariaLabel="Margam Logo" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-xl sm:text-2xl text-[#79B82A] tracking-wider leading-none drop-shadow-[2px_2px_0px_#102610]">
                MARGAM
              </span>
              <span className="text-[10px] font-heading font-bold text-[#D8D8D0] leading-tight hidden sm:block mt-0.5">
                Math Realm • Classes 6–10
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5" aria-label="Main Navigation">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => setActiveTab(item.id)}
                  className={`min-h-[44px] px-3.5 py-2 text-xs font-heading font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#4F8A24] text-[#F2F0DF] border-2 border-[#102610] shadow-[2px_2px_0px_#102610]"
                      : "text-[#D8D8D0] hover:text-[#F2F0DF] hover:bg-[#315B2A]/60"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#E5B834]" : "text-[#79B82A]"}`} />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Right Actions: Large Accessible Language Switcher + Main CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <div
              className="flex items-center bg-[#102610] p-1 border-2 border-[#315B2A] shadow-[2px_2px_0px_#102610]"
              role="group"
              aria-label="Select Language"
            >
              <button
                type="button"
                data-l="en"
                onClick={() => onLanguageChange("en")}
                className={`min-h-[38px] min-w-[38px] px-2 text-xs font-bold transition-all cursor-pointer ${
                  currentLang === "en"
                    ? "bg-[#79B82A] text-[#102610] shadow-[inset_1px_1px_0px_rgba(255,255,255,0.4)]"
                    : "text-[#D8D8D0] hover:text-[#F2F0DF]"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                data-l="hi"
                onClick={() => onLanguageChange("hi")}
                className={`min-h-[38px] min-w-[42px] px-2 text-xs font-bold transition-all cursor-pointer ${
                  currentLang === "hi"
                    ? "bg-[#79B82A] text-[#102610] shadow-[inset_1px_1px_0px_rgba(255,255,255,0.4)]"
                    : "text-[#D8D8D0] hover:text-[#F2F0DF]"
                }`}
              >
                हिन्दी
              </button>
              <button
                type="button"
                data-l="te"
                onClick={() => onLanguageChange("te")}
                className={`min-h-[38px] min-w-[42px] px-2 text-xs font-bold transition-all cursor-pointer ${
                  currentLang === "te"
                    ? "bg-[#79B82A] text-[#102610] shadow-[inset_1px_1px_0px_rgba(255,255,255,0.4)]"
                    : "text-[#D8D8D0] hover:text-[#F2F0DF]"
                }`}
              >
                తెలుగు
              </button>
            </div>

            {/* Desktop Sign In & CTA */}
            <Link
              href="/login"
              className="hidden sm:inline-flex min-h-[44px] px-3.5 py-2 bg-[#173B19] hover:bg-[#315B2A] border-2 border-[#315B2A] text-[#F2F0DF] text-xs font-heading font-bold items-center shadow-[2px_2px_0px_#102610] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            >
              <span>Sign In</span>
            </Link>
            <Link
              href="/student"
              className="hidden lg:inline-flex min-h-[46px] px-4 py-2 bg-[#79B82A] hover:bg-[#8CD033] text-[#102610] text-xs font-heading font-extrabold items-center gap-2 border-3 border-[#102610] shadow-[3px_3px_0px_#102610] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            >
              <span>Start Learning</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Sticky Bottom Tab Bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 bg-[#173B19] border-t-3 border-[#315B2A] py-1 px-2 flex items-center justify-around md:hidden shadow-[0px_-4px_0px_#102610]"
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
              className={`flex flex-col items-center justify-center min-h-[48px] min-w-[50px] px-1.5 py-1 transition-all cursor-pointer ${
                isActive
                  ? "text-[#79B82A] font-bold"
                  : "text-[#D8D8D0] hover:text-[#F2F0DF]"
              }`}
            >
              <div
                className={`w-7 h-7 flex items-center justify-center ${
                  isActive ? "bg-[#4F8A24] border border-[#102610] text-[#E5B834]" : "text-[#D8D8D0]"
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-heading leading-tight mt-0.5">{item.label}</span>
            </a>
          );
        })}
      </nav>
    </>
  );
}

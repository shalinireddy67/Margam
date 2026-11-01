"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Home, Sparkles, Network, Users, Compass } from "lucide-react";
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
      {/* Top Navigation Bar with Wood Panel Style & Grass Accents */}
      <header className="sticky top-0 z-40 bg-[#5A3720]/95 backdrop-blur-md border-b-4 border-[#422816] shadow-[0px_4px_0px_rgba(0,0,0,0.35)] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3">
          {/* Logo & Brand Identity */}
          <Link
            href="/"
            className="flex items-center gap-2.5 min-h-[48px] pr-2 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#FFE9A8]"
            aria-label="Margam Home"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-[2px] border-3 border-[#422816] shadow-[2px_2px_0px_rgba(0,0,0,0.35)] flex items-center justify-center shrink-0 bg-[#7A4B2A]">
              <Logo className="w-full h-full" ariaLabel="Margam Logo" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-xl sm:text-2xl text-[#FFE9A8] tracking-wider leading-none drop-shadow-[2px_2px_0px_#2B1B0F]">
                MARGAM
              </span>
              <span className="text-[10px] font-heading font-bold text-[#FFB36B] leading-tight hidden sm:block mt-0.5">
                Voxel Realm • Classes 6–10
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
                  className={`min-h-[44px] px-3.5 py-2 text-xs font-heading font-bold flex items-center gap-2 rounded-[2px] transition-all cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-b from-[#5DAA3A] to-[#2F6B22] text-[#FFF7E6] border-2 border-[#204514] shadow-[inset_1px_1px_0px_rgba(255,255,255,0.4),2px_2px_0px_rgba(0,0,0,0.35)]"
                      : "text-[#FFF7E6] hover:text-[#FFE9A8] hover:bg-[#7A4B2A]/80"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#FFE9A8]" : "text-[#6EB5FF]"}`} />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Right Actions: Large Accessible Language Switcher + Main CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <div
              className="flex items-center bg-[#422816] p-1 border-2 border-[#7A4B2A] rounded-[2px] shadow-[2px_2px_0px_rgba(0,0,0,0.35)]"
              role="group"
              aria-label="Select Language"
            >
              <button
                type="button"
                data-l="en"
                onClick={() => onLanguageChange("en")}
                className={`min-h-[38px] min-w-[38px] px-2 text-xs font-bold rounded-[2px] transition-all cursor-pointer ${
                  currentLang === "en"
                    ? "bg-[#FFE9A8] text-[#2B1B0F] shadow-[inset_1px_1px_0px_rgba(255,255,255,0.9)]"
                    : "text-[#FFF7E6] hover:text-[#FFE9A8]"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                data-l="hi"
                onClick={() => onLanguageChange("hi")}
                className={`min-h-[38px] min-w-[42px] px-2 text-xs font-bold rounded-[2px] transition-all cursor-pointer ${
                  currentLang === "hi"
                    ? "bg-[#FFE9A8] text-[#2B1B0F] shadow-[inset_1px_1px_0px_rgba(255,255,255,0.9)]"
                    : "text-[#FFF7E6] hover:text-[#FFE9A8]"
                }`}
              >
                हिन्दी
              </button>
              <button
                type="button"
                data-l="te"
                onClick={() => onLanguageChange("te")}
                className={`min-h-[38px] min-w-[42px] px-2 text-xs font-bold rounded-[2px] transition-all cursor-pointer ${
                  currentLang === "te"
                    ? "bg-[#FFE9A8] text-[#2B1B0F] shadow-[inset_1px_1px_0px_rgba(255,255,255,0.9)]"
                    : "text-[#FFF7E6] hover:text-[#FFE9A8]"
                }`}
              >
                తెలుగు
              </button>
            </div>

            {/* CTA: Enter Realm */}
            <Link
              href="/student"
              className="hidden sm:inline-flex items-center justify-center min-h-[44px] px-4 py-2 bg-gradient-to-b from-[#FFE9A8] via-[#F4C542] to-[#C6961E] text-[#2B1B0F] border-3 border-[#7A4B2A] rounded-[2px] font-heading font-extrabold text-xs shadow-[inset_2px_2px_0px_rgba(255,255,255,0.6),3px_3px_0px_rgba(0,0,0,0.35)] active:translate-x-[1px] active:translate-y-[1px] select-none"
            >
              Enter Realm →
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}

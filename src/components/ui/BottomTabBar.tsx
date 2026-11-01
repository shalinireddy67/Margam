"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/components/Navigation";

export interface BottomTabBarProps {
  currentTab?: "home" | "learn" | "stickers" | "me" | "profile";
  className?: string;
}

/**
 * Responsive Navigation Bar (Backwards-Compatible Drop-In Component)
 * Mobile (<768px): Fixed bottom tab bar (64px height, safe-area-inset, no label cut-off).
 * Tablet (768px-1024px): Collapsed left rail with icons + labels under them.
 * Desktop (>=1024px): HIDE the bottom bar entirely (desktop uses top navbar).
 */
export function BottomTabBar({ currentTab, className = "" }: BottomTabBarProps) {
  const pathname = usePathname() || "";

  // Hide tab bar on diagnostic and test screens as strictly instructed
  if (
    pathname.includes("/student/diagnostic") ||
    pathname.includes("/student/test")
  ) {
    return null;
  }

  // Derive active tab from pathname if not explicitly passed
  let active = currentTab === "me" ? "profile" : currentTab;
  if (!active) {
    if (pathname.includes("/stickers")) active = "stickers";
    else if (pathname.includes("/lesson") || pathname === "/student") active = "learn";
    else if (pathname.includes("/select-class") || pathname.includes("/reset-class")) active = "profile";
    else active = "home";
  }

  return (
    <>
      {/* 1. Tablet Left Rail (768px to 1023px only) */}
      <aside
        aria-label="Tablet navigation rail"
        className={`hidden md:flex lg:hidden fixed left-0 top-16 bottom-0 w-20 z-40 bg-[#5A3720] border-r-4 border-[#422816] shadow-[4px_0px_0px_rgba(0,0,0,0.35)] flex-col items-center py-4 gap-3 select-none ${className}`}
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;

          return (
            <Link
              key={item.id}
              href={item.href}
              prefetch={false}
              aria-current={isActive ? "page" : undefined}
              className={`w-16 min-h-[56px] p-2 flex flex-col items-center justify-center gap-1 rounded-[2px] transition-all no-underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFE9A8] ${
                isActive
                  ? "bg-gradient-to-b from-[#5DAA3A] to-[#2F6B22] text-[#FFF7E6] border-2 border-[#204514] shadow-[inset_1px_1px_0px_rgba(255,255,255,0.4),2px_2px_0px_rgba(0,0,0,0.35)]"
                  : "text-[#FFF7E6] hover:text-[#FFE9A8] hover:bg-[#7A4B2A]/70"
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-[#FFE9A8]" : "text-[#6EB5FF]"}`} aria-hidden="true" />
              <span className="text-[10px] font-heading font-extrabold text-center leading-tight truncate max-w-[60px]">
                {item.label.en}
              </span>
            </Link>
          );
        })}
      </aside>

      {/* 2. Mobile Bottom Tab Bar (<768px only, strictly hidden on >=768px) */}
      <nav
        aria-label="Mobile bottom navigation"
        className={`
          md:hidden fixed left-0 right-0 bottom-0 z-40
          bg-[#5A3720] border-t-4 border-[#422816]
          shadow-[0px_-4px_0px_rgba(0,0,0,0.35)]
          pb-[env(safe-area-inset-bottom,0px)]
          ${className}
        `.trim()}
      >
        <div className="flex w-full h-16 min-h-[64px] max-w-[600px] mx-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;

            return (
              <Link
                key={item.id}
                href={item.href}
                prefetch={false}
                aria-current={isActive ? "page" : undefined}
                className={`
                  flex-1 min-h-[48px] h-full
                  flex flex-col items-center justify-center gap-1
                  font-heading font-extrabold text-[10px] leading-normal
                  no-underline select-none transition-colors px-1
                  ${isActive
                    ? "bg-[#5DAA3A] text-[#FFF7E6] border-t-4 border-t-[#FFE9A8] shadow-[inset_1px_1px_0px_rgba(255,255,255,0.4)]"
                    : "text-[#FFF7E6] hover:text-[#FFE9A8] hover:bg-[#7A4B2A]/60"
                  }
                `.trim()}
              >
                <Icon className="w-5 h-5 shrink-0" aria-hidden="true" />
                <span className="text-center truncate max-w-full">{item.label.en}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

export default BottomTabBar;

"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, BookOpen, Trophy, User } from "lucide-react";

export interface BottomTabBarProps {
  currentTab?: "home" | "learn" | "stickers" | "me" | "profile";
  className?: string;
}

const LOCAL_NAV_ITEMS = [
  {
    id: "learn",
    href: "/student",
    label: "Home",
    icon: Compass,
  },
  {
    id: "diagnostic",
    href: "/student/diagnostic",
    label: "Quick Check",
    icon: BookOpen,
  },
  {
    id: "stickers",
    href: "/student/stickers",
    label: "Stickers",
    icon: Trophy,
  },
  {
    id: "profile",
    href: "/student/profile",
    label: "Profile",
    icon: User,
  },
];

export function BottomTabBar({ currentTab, className = "" }: BottomTabBarProps) {
  const pathname = usePathname() || "";

  // Hide tab bar on diagnostic and test screens
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
    else active = "learn";
  }

  return (
    <>
      {/* 1. Tablet Left Rail (768px to 1023px only: Night panel, parchment text) */}
      <aside
        aria-label="Tablet navigation rail"
        data-panel="tablet-nav-rail"
        className={`hidden md:flex lg:hidden fixed left-0 top-16 bottom-0 w-20 z-40 bg-[#232634]/95 border-r-[3px] border-[#1E1610] shadow-[3px_0px_0px_#1E1610] flex-col items-center py-4 gap-3 select-none ${className}`}
      >
        {LOCAL_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;

          return (
            <Link
              key={item.id}
              href={item.href}
              prefetch={false}
              aria-current={isActive ? "page" : undefined}
              className={`w-16 min-h-[56px] p-2 flex flex-col items-center justify-center gap-1 rounded-xs transition-all no-underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F4FB5] ${
                isActive
                  ? "bg-[#6DB33F] text-[#1E1610] border-2 border-[#1E1610] shadow-[2px_2px_0px_#1E1610]"
                  : "text-[#F3E3BC] hover:text-[#1E1610] hover:bg-[#E8CF9C]"
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-[#1E1610]" : "text-[#78BDE8]"}`} aria-hidden="true" />
              <span className="text-[10px] font-heading font-extrabold text-center leading-tight truncate max-w-[60px]">
                {item.label}
              </span>
            </Link>
          );
        })}
      </aside>

      {/* 2. Mobile Bottom Tab Bar (<768px only: Night panel, parchment text) */}
      <nav
        aria-label="Mobile bottom navigation"
        data-panel="mobile-bottom-tab-bar"
        className={`
          md:hidden fixed left-0 right-0 bottom-0 z-40
          bg-[#232634]/95 border-t-[3px] border-[#1E1610]
          shadow-[0px_-3px_0px_#1E1610]
          pb-[env(safe-area-inset-bottom,0px)]
          ${className}
        `.trim()}
      >
        <div className="flex w-full h-16 min-h-[64px] max-w-[600px] mx-auto">
          {LOCAL_NAV_ITEMS.map((item) => {
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
                    ? "bg-[#6DB33F] text-[#1E1610] border-t-4 border-t-[#F2C230]"
                    : "text-[#F3E3BC] hover:text-[#1E1610] hover:bg-[#E8CF9C]"
                  }
                `.trim()}
              >
                <Icon className="w-5 h-5 shrink-0" aria-hidden="true" />
                <span className="text-center truncate max-w-full">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

export default BottomTabBar;

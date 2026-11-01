"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Sparkles, Award, User } from "lucide-react";

export interface BottomTabBarProps {
  currentTab?: "home" | "learn" | "stickers" | "me";
  className?: string;
}

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
  let active = currentTab;
  if (!active) {
    if (pathname.includes("/stickers")) active = "stickers";
    else if (pathname.includes("/lesson")) active = "learn";
    else if (pathname.includes("/select-class") || pathname.includes("/reset-class")) active = "me";
    else active = "home";
  }

  return (
    <nav
      aria-label="Main navigation"
      className={`
        fixed left-0 right-0 bottom-0 z-40
        flex justify-center
        bg-[#5A3720] border-t-4 border-[#422816]
        shadow-[0px_-4px_0px_rgba(0,0,0,0.35)]
        pb-[env(safe-area-inset-bottom,0px)]
        ${className}
      `.trim()}
    >
      <div className="flex w-full max-w-[480px]">
        {/* Tab 1: Home */}
        <Link
          href="/"
          prefetch={false}
          aria-current={active === "home" ? "page" : undefined}
          className={`
            flex-1 min-h-[58px]
            flex flex-col items-center justify-center gap-1
            font-heading font-extrabold text-[10px]
            no-underline select-none transition-colors
            ${active === "home"
              ? "bg-[#5DAA3A] text-[#FFF7E6] border-t-4 border-t-[#FFE9A8] shadow-[inset_1px_1px_0px_rgba(255,255,255,0.4)]"
              : "text-[#FFF7E6] hover:text-[#FFE9A8] hover:bg-[#7A4B2A]/60"
            }
          `.trim()}
        >
          <Home className="w-5 h-5 shrink-0" aria-hidden="true" />
          <span>Home</span>
        </Link>

        {/* Tab 2: Learn */}
        <Link
          href="/student"
          prefetch={false}
          aria-current={active === "learn" ? "page" : undefined}
          className={`
            flex-1 min-h-[58px]
            flex flex-col items-center justify-center gap-1
            font-heading font-extrabold text-[10px]
            no-underline select-none transition-colors
            ${active === "learn"
              ? "bg-[#5DAA3A] text-[#FFF7E6] border-t-4 border-t-[#FFE9A8] shadow-[inset_1px_1px_0px_rgba(255,255,255,0.4)]"
              : "text-[#FFF7E6] hover:text-[#FFE9A8] hover:bg-[#7A4B2A]/60"
            }
          `.trim()}
        >
          <Sparkles className="w-5 h-5 shrink-0" aria-hidden="true" />
          <span>Learn</span>
        </Link>

        {/* Tab 3: Badges / Stickers */}
        <Link
          href="/student/stickers"
          prefetch={false}
          aria-current={active === "stickers" ? "page" : undefined}
          className={`
            flex-1 min-h-[58px]
            flex flex-col items-center justify-center gap-1
            font-heading font-extrabold text-[10px]
            no-underline select-none transition-colors
            ${active === "stickers"
              ? "bg-[#5DAA3A] text-[#FFF7E6] border-t-4 border-t-[#FFE9A8] shadow-[inset_1px_1px_0px_rgba(255,255,255,0.4)]"
              : "text-[#FFF7E6] hover:text-[#FFE9A8] hover:bg-[#7A4B2A]/60"
            }
          `.trim()}
        >
          <Award className="w-5 h-5 shrink-0" aria-hidden="true" />
          <span>Badges</span>
        </Link>

        {/* Tab 4: Me / Profile */}
        <Link
          href="/student/select-class"
          prefetch={false}
          aria-current={active === "me" ? "page" : undefined}
          className={`
            flex-1 min-h-[58px]
            flex flex-col items-center justify-center gap-1
            font-heading font-extrabold text-[10px]
            no-underline select-none transition-colors
            ${active === "me"
              ? "bg-[#5DAA3A] text-[#FFF7E6] border-t-4 border-t-[#FFE9A8] shadow-[inset_1px_1px_0px_rgba(255,255,255,0.4)]"
              : "text-[#FFF7E6] hover:text-[#FFE9A8] hover:bg-[#7A4B2A]/60"
            }
          `.trim()}
        >
          <User className="w-5 h-5 shrink-0" aria-hidden="true" />
          <span>Profile</span>
        </Link>
      </div>
    </nav>
  );
}

export default BottomTabBar;

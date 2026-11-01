"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
        bg-[#FFFFFF] border-t-4 border-[#111111]
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
            flex-1 min-h-[64px]
            flex flex-col items-center justify-center gap-1
            font-heading font-extrabold text-[10px] sm:text-xs text-[#111111]
            no-underline select-none
            ${active === "home"
              ? "bg-[#F2D16B] border-l-4 border-r-4 border-[#111111] shadow-[inset_2px_2px_0px_rgba(255,255,255,0.6)]"
              : "hover:bg-[#F2D16B]/20"
            }
          `.trim()}
        >
          <svg viewBox="0 0 16 16" className="w-6 h-6" aria-hidden="true" shapeRendering="crispEdges">
            <rect x="7" y="1" width="2" height="2" fill="#111111" />
            <rect x="5" y="3" width="6" height="2" fill="#111111" />
            <rect x="3" y="5" width="10" height="2" fill="#111111" />
            <rect x="1" y="7" width="14" height="2" fill="#111111" />
            <rect x="2" y="9" width="12" height="6" fill={active === "home" ? "#111111" : "#FFFFFF"} stroke="#111111" strokeWidth="1" />
            <rect x="6" y="10" width="4" height="5" fill={active === "home" ? "#F2D16B" : "#111111"} />
          </svg>
          <span>Home</span>
        </Link>

        {/* Tab 2: Learn */}
        <Link
          href="/#chapters"
          prefetch={false}
          aria-current={active === "learn" ? "page" : undefined}
          className={`
            flex-1 min-h-[64px]
            flex flex-col items-center justify-center gap-1
            font-heading font-extrabold text-[10px] sm:text-xs text-[#111111]
            no-underline select-none
            ${active === "learn"
              ? "bg-[#F2D16B] border-l-4 border-r-4 border-[#111111] shadow-[inset_2px_2px_0px_rgba(255,255,255,0.6)]"
              : "hover:bg-[#F2D16B]/20"
            }
          `.trim()}
        >
          <svg viewBox="0 0 16 16" className="w-6 h-6" aria-hidden="true" shapeRendering="crispEdges">
            <rect x="2" y="2" width="12" height="12" fill={active === "learn" ? "#111111" : "#FFFFFF"} stroke="#111111" strokeWidth="2" />
            <rect x="7" y="2" width="2" height="12" fill="#111111" />
            <rect x="4" y="5" width="2" height="2" fill={active === "learn" ? "#F2D16B" : "#111111"} />
            <rect x="10" y="5" width="2" height="2" fill={active === "learn" ? "#F2D16B" : "#111111"} />
            <rect x="4" y="9" width="2" height="2" fill={active === "learn" ? "#F2D16B" : "#111111"} />
            <rect x="10" y="9" width="2" height="2" fill={active === "learn" ? "#F2D16B" : "#111111"} />
          </svg>
          <span>Learn</span>
        </Link>

        {/* Tab 3: Stickers */}
        <Link
          href="/student/stickers"
          prefetch={false}
          aria-current={active === "stickers" ? "page" : undefined}
          className={`
            flex-1 min-h-[64px]
            flex flex-col items-center justify-center gap-1
            font-heading font-extrabold text-[10px] sm:text-xs text-[#111111]
            no-underline select-none
            ${active === "stickers"
              ? "bg-[#F2D16B] border-l-4 border-r-4 border-[#111111] shadow-[inset_2px_2px_0px_rgba(255,255,255,0.6)]"
              : "hover:bg-[#F2D16B]/20"
            }
          `.trim()}
        >
          <svg viewBox="0 0 16 16" className="w-6 h-6" aria-hidden="true" shapeRendering="crispEdges">
            <rect x="7" y="1" width="2" height="2" fill="#111111" />
            <rect x="6" y="3" width="4" height="2" fill={active === "stickers" ? "#111111" : "#F2D16B"} />
            <rect x="1" y="5" width="14" height="2" fill={active === "stickers" ? "#111111" : "#F2D16B"} />
            <rect x="3" y="7" width="10" height="2" fill={active === "stickers" ? "#111111" : "#F2D16B"} />
            <rect x="4" y="9" width="8" height="2" fill={active === "stickers" ? "#111111" : "#F2D16B"} />
            <rect x="3" y="11" width="4" height="2" fill={active === "stickers" ? "#111111" : "#F2D16B"} />
            <rect x="9" y="11" width="4" height="2" fill={active === "stickers" ? "#111111" : "#F2D16B"} />
            <rect x="2" y="13" width="3" height="2" fill="#111111" />
            <rect x="11" y="13" width="3" height="2" fill="#111111" />
          </svg>
          <span>Stickers</span>
        </Link>

        {/* Tab 4: Me */}
        <Link
          href="/student/select-class"
          prefetch={false}
          aria-current={active === "me" ? "page" : undefined}
          className={`
            flex-1 min-h-[64px]
            flex flex-col items-center justify-center gap-1
            font-heading font-extrabold text-[10px] sm:text-xs text-[#111111]
            no-underline select-none
            ${active === "me"
              ? "bg-[#F2D16B] border-l-4 border-r-4 border-[#111111] shadow-[inset_2px_2px_0px_rgba(255,255,255,0.6)]"
              : "hover:bg-[#F2D16B]/20"
            }
          `.trim()}
        >
          <svg viewBox="0 0 16 16" className="w-6 h-6" aria-hidden="true" shapeRendering="crispEdges">
            <rect x="5" y="2" width="6" height="5" fill={active === "me" ? "#111111" : "#FFFFFF"} stroke="#111111" strokeWidth="2" />
            <rect x="2" y="9" width="12" height="6" fill={active === "me" ? "#111111" : "#FFFFFF"} stroke="#111111" strokeWidth="2" />
          </svg>
          <span>Me</span>
        </Link>
      </div>
    </nav>
  );
}

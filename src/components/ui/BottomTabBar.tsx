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
        bg-[#173B19] border-t-3 border-[#315B2A]
        shadow-[0px_-3px_0px_#102610]
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
              ? "bg-[#4F8A24] text-[#F2F0DF] border-t-3 border-t-[#79B82A] shadow-[inset_1px_1px_0px_rgba(255,255,255,0.4)]"
              : "text-[#D8D8D0] hover:text-[#F2F0DF] hover:bg-[#315B2A]/40"
            }
          `.trim()}
        >
          <svg viewBox="0 0 16 16" className="w-5 h-5" aria-hidden="true" shapeRendering="crispEdges">
            <rect x="7" y="1" width="2" height="2" fill="currentColor" />
            <rect x="5" y="3" width="6" height="2" fill="currentColor" />
            <rect x="3" y="5" width="10" height="2" fill="currentColor" />
            <rect x="1" y="7" width="14" height="2" fill="currentColor" />
            <rect x="2" y="9" width="12" height="6" fill={active === "home" ? "#173B19" : "#102610"} stroke="currentColor" strokeWidth="1" />
            <rect x="6" y="10" width="4" height="5" fill={active === "home" ? "#79B82A" : "currentColor"} />
          </svg>
          <span>Home</span>
        </Link>

        {/* Tab 2: Learn */}
        <Link
          href="/#chapters"
          prefetch={false}
          aria-current={active === "learn" ? "page" : undefined}
          className={`
            flex-1 min-h-[58px]
            flex flex-col items-center justify-center gap-1
            font-heading font-extrabold text-[10px]
            no-underline select-none transition-colors
            ${active === "learn"
              ? "bg-[#4F8A24] text-[#F2F0DF] border-t-3 border-t-[#79B82A] shadow-[inset_1px_1px_0px_rgba(255,255,255,0.4)]"
              : "text-[#D8D8D0] hover:text-[#F2F0DF] hover:bg-[#315B2A]/40"
            }
          `.trim()}
        >
          <svg viewBox="0 0 16 16" className="w-5 h-5" aria-hidden="true" shapeRendering="crispEdges">
            <rect x="2" y="2" width="12" height="12" fill={active === "learn" ? "#173B19" : "#102610"} stroke="currentColor" strokeWidth="2" />
            <rect x="7" y="2" width="2" height="12" fill="currentColor" />
            <rect x="4" y="5" width="2" height="2" fill={active === "learn" ? "#79B82A" : "currentColor"} />
            <rect x="10" y="5" width="2" height="2" fill={active === "learn" ? "#79B82A" : "currentColor"} />
            <rect x="4" y="9" width="2" height="2" fill={active === "learn" ? "#79B82A" : "currentColor"} />
            <rect x="10" y="9" width="2" height="2" fill={active === "learn" ? "#79B82A" : "currentColor"} />
          </svg>
          <span>Learn</span>
        </Link>

        {/* Tab 3: Stickers */}
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
              ? "bg-[#4F8A24] text-[#F2F0DF] border-t-3 border-t-[#79B82A] shadow-[inset_1px_1px_0px_rgba(255,255,255,0.4)]"
              : "text-[#D8D8D0] hover:text-[#F2F0DF] hover:bg-[#315B2A]/40"
            }
          `.trim()}
        >
          <svg viewBox="0 0 16 16" className="w-5 h-5" aria-hidden="true" shapeRendering="crispEdges">
            <rect x="7" y="1" width="2" height="2" fill="currentColor" />
            <rect x="6" y="3" width="4" height="2" fill={active === "stickers" ? "#E5B834" : "currentColor"} />
            <rect x="1" y="5" width="14" height="2" fill={active === "stickers" ? "#E5B834" : "currentColor"} />
            <rect x="3" y="7" width="10" height="2" fill={active === "stickers" ? "#E5B834" : "currentColor"} />
            <rect x="4" y="9" width="8" height="2" fill={active === "stickers" ? "#E5B834" : "currentColor"} />
            <rect x="3" y="11" width="4" height="2" fill={active === "stickers" ? "#E5B834" : "currentColor"} />
            <rect x="9" y="11" width="4" height="2" fill={active === "stickers" ? "#E5B834" : "currentColor"} />
            <rect x="2" y="13" width="3" height="2" fill="currentColor" />
            <rect x="11" y="13" width="3" height="2" fill="currentColor" />
          </svg>
          <span>Stickers</span>
        </Link>

        {/* Tab 4: Me */}
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
              ? "bg-[#4F8A24] text-[#F2F0DF] border-t-3 border-t-[#79B82A] shadow-[inset_1px_1px_0px_rgba(255,255,255,0.4)]"
              : "text-[#D8D8D0] hover:text-[#F2F0DF] hover:bg-[#315B2A]/40"
            }
          `.trim()}
        >
          <svg viewBox="0 0 16 16" className="w-5 h-5" aria-hidden="true" shapeRendering="crispEdges">
            <rect x="5" y="2" width="6" height="5" fill={active === "me" ? "#173B19" : "#102610"} stroke="currentColor" strokeWidth="2" />
            <rect x="2" y="9" width="12" height="6" fill={active === "me" ? "#173B19" : "#102610"} stroke="currentColor" strokeWidth="2" />
          </svg>
          <span>Me</span>
        </Link>
      </div>
    </nav>
  );
}

export default BottomTabBar;

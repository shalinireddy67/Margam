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
        bg-[#FFFFFF] border-t-[3px] border-[#111111]
        pb-[env(safe-area-inset-bottom,0px)]
        ${className}
      `.trim()}
    >
      <div className="flex w-full max-w-[480px]">
        {/* Tab 1: Home */}
        <Link
          href="/"
          aria-current={active === "home" ? "page" : undefined}
          className={`
            flex-1 min-h-[64px]
            flex flex-col items-center justify-center gap-0.5
            font-heading font-extrabold text-xs text-[#111111]
            no-underline select-none
            transition-colors
            ${active === "home"
              ? "bg-[#FFE14D] border-l-[3px] border-r-[3px] border-[#111111]"
              : "hover:bg-[#FFF8DC]"
            }
          `.trim()}
        >
          <svg
            viewBox="0 0 26 26"
            className="w-6 h-6"
            aria-hidden="true"
          >
            <path
              d="M3 13L13 4l10 9v9H3z"
              fill={active === "home" ? "#111111" : "none"}
              stroke="#111111"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
          </svg>
          <span>Home</span>
        </Link>

        {/* Tab 2: Learn */}
        <Link
          href="/#chapters"
          aria-current={active === "learn" ? "page" : undefined}
          className={`
            flex-1 min-h-[64px]
            flex flex-col items-center justify-center gap-0.5
            font-heading font-extrabold text-xs text-[#111111]
            no-underline select-none
            transition-colors
            ${active === "learn"
              ? "bg-[#FFE14D] border-l-[3px] border-r-[3px] border-[#111111]"
              : "hover:bg-[#FFF8DC]"
            }
          `.trim()}
        >
          <svg
            viewBox="0 0 26 26"
            className="w-6 h-6"
            aria-hidden="true"
          >
            <path
              d="M3 5h9v16H3zM14 5h9v16h-9z"
              fill={active === "learn" ? "#111111" : "none"}
              stroke="#111111"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
          </svg>
          <span>Learn</span>
        </Link>

        {/* Tab 3: Stickers */}
        <Link
          href="/student/stickers"
          aria-current={active === "stickers" ? "page" : undefined}
          className={`
            flex-1 min-h-[64px]
            flex flex-col items-center justify-center gap-0.5
            font-heading font-extrabold text-xs text-[#111111]
            no-underline select-none
            transition-colors
            ${active === "stickers"
              ? "bg-[#FFE14D] border-l-[3px] border-r-[3px] border-[#111111]"
              : "hover:bg-[#FFF8DC]"
            }
          `.trim()}
        >
          <svg
            viewBox="0 0 26 26"
            className="w-6 h-6"
            aria-hidden="true"
          >
            <path
              d="M13 3l3 7 7 1-5 5 1 7-6-4-6 4 1-7-5-5 7-1z"
              fill={active === "stickers" ? "#111111" : "none"}
              stroke="#111111"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
          </svg>
          <span>Stickers</span>
        </Link>

        {/* Tab 4: Me */}
        <Link
          href="/student/select-class"
          aria-current={active === "me" ? "page" : undefined}
          className={`
            flex-1 min-h-[64px]
            flex flex-col items-center justify-center gap-0.5
            font-heading font-extrabold text-xs text-[#111111]
            no-underline select-none
            transition-colors
            ${active === "me"
              ? "bg-[#FFE14D] border-l-[3px] border-r-[3px] border-[#111111]"
              : "hover:bg-[#FFF8DC]"
            }
          `.trim()}
        >
          <svg
            viewBox="0 0 26 26"
            className="w-6 h-6"
            aria-hidden="true"
          >
            <circle
              cx="13"
              cy="9"
              r="5"
              fill={active === "me" ? "#111111" : "none"}
              stroke="#111111"
              strokeWidth="2.5"
            />
            <path
              d="M4 23c1-6 17-6 18 0"
              fill="none"
              stroke="#111111"
              strokeWidth="2.5"
            />
          </svg>
          <span>Me</span>
        </Link>
      </div>
    </nav>
  );
}

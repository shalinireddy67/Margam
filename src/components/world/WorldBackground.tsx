"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";

export type WorldTime = "day" | "sunset" | "night";

interface WorldBackgroundProps {
  initialTime?: WorldTime;
  showToggle?: boolean;
}

export default function WorldBackground({
  initialTime,
  showToggle = true,
}: WorldBackgroundProps) {
  const pathname = usePathname();
  const isDraggablePage = pathname === "/" || pathname === "/login";

  // Determine initial time from local clock or prop
  const [time, setTime] = useState<WorldTime>(() => {
    if (initialTime) return initialTime;
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("margam_world_time");
      if (saved === "day" || saved === "sunset" || saved === "night") return saved;
      const hour = new Date().getHours();
      if (hour >= 6 && hour < 17) return "day";
      if (hour >= 17 && hour < 20) return "sunset";
      return "night";
    }
    return "day";
  });

  const [isStatic, setIsStatic] = useState(false);

  // Parallax offsets (smoothly lerped)
  const targetX = useRef(0);
  const currentX = useRef(0);
  const targetY = useRef(0);
  const currentY = useRef(0);

  // Drag state for landing/login pages
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartPan = useRef(0);
  const dragPanTarget = useRef(0);
  const dragPanCurrent = useRef(0);

  // Auto cloud drift
  const cloudOffset = useRef(0);

  // Layer DOM refs for direct transform updates (zero React re-renders during animation)
  const sunMoonRef = useRef<HTMLDivElement>(null);
  const cloudsRef = useRef<HTMLDivElement>(null);
  const farHillsRef = useRef<HTMLDivElement>(null);
  const midHillsRef = useRef<HTMLDivElement>(null);
  const nearGroundRef = useRef<HTMLDivElement>(null);

  const rafId = useRef<number | null>(null);
  const lastTime = useRef<number>(0);

  // Device capability check & reduced motion
  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nav = navigator as unknown as { deviceMemory?: number; hardwareConcurrency?: number; connection?: { saveData?: boolean } };
    const isLowEnd =
      (nav.deviceMemory && nav.deviceMemory <= 2) ||
      (nav.hardwareConcurrency && nav.hardwareConcurrency <= 4) ||
      (nav.connection && nav.connection.saveData);

    if (prefersReducedMotion || isLowEnd) {
      setIsStatic(true);
    }
  }, []);

  // Save selected time
  const handleTimeChange = useCallback((newTime: WorldTime) => {
    setTime(newTime);
    if (typeof window !== "undefined") {
      localStorage.setItem("margam_world_time", newTime);
      // Update theme-color meta tag
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) {
        meta.setAttribute(
          "content",
          newTime === "day" ? "#78BDE8" : newTime === "sunset" ? "#E07A5F" : "#232634"
        );
      }
    }
  }, []);

  // Drag interaction on landing / login pages
  useEffect(() => {
    if (isStatic || !isDraggablePage || typeof window === "undefined") return;

    const handlePointerDown = (e: PointerEvent) => {
      // Must not initiate drag on panels, buttons, inputs, links, cards
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (
        target.closest("button") ||
        target.closest("input") ||
        target.closest("textarea") ||
        target.closest("select") ||
        target.closest("a") ||
        target.closest("[role='button']") ||
        target.closest("[data-panel]") ||
        target.closest(".panel") ||
        target.closest(".card")
      ) {
        return;
      }

      isDragging.current = true;
      dragStartX.current = e.clientX;
      dragStartPan.current = dragPanTarget.current;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - dragStartX.current;
      // Clamp drag pan between -160px and +160px
      dragPanTarget.current = Math.max(-160, Math.min(160, dragStartPan.current + dx));
    };

    const handlePointerUp = () => {
      isDragging.current = false;
    };

    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    window.addEventListener("pointercancel", handlePointerUp, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [isStatic, isDraggablePage]);

  // Pointer & Scroll Parallax Listeners
  useEffect(() => {
    if (isStatic || typeof window === "undefined") return;

    const handlePointerMove = (e: PointerEvent) => {
      // Normalize pointer from center (-1 to +1)
      const cx = (e.clientX / window.innerWidth - 0.5) * 2;
      const cy = (e.clientY / window.innerHeight - 0.5) * 2;
      targetX.current = cx * 40; // max 40px shift
      targetY.current = cy * 20; // max 20px shift
    };

    const handleScroll = () => {
      // Subtle vertical shift with scroll
      const sy = window.scrollY;
      targetY.current = Math.min(60, sy * 0.08);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isStatic]);

  // Animation Loop (requestAnimationFrame, throttled, pause on hidden)
  useEffect(() => {
    if (isStatic || typeof window === "undefined") return;

    let isDocumentVisible = !document.hidden;

    const handleVisibility = () => {
      isDocumentVisible = !document.hidden;
      if (isDocumentVisible) {
        lastTime.current = performance.now();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    const animate = (timestamp: number) => {
      if (!lastTime.current) lastTime.current = timestamp;
      const delta = timestamp - lastTime.current;
      lastTime.current = timestamp;

      if (isDocumentVisible && delta < 200) {
        // Smooth lerping of parallax
        const lerpFactor = 0.06;
        currentX.current += (targetX.current - currentX.current) * lerpFactor;
        currentY.current += (targetY.current - currentY.current) * lerpFactor;

        // Smooth lerping of drag pan
        dragPanCurrent.current += (dragPanTarget.current - dragPanCurrent.current) * 0.08;

        // Cloud drift: ~10px per second
        cloudOffset.current = (cloudOffset.current + (delta * 0.012)) % 1200;

        const totalPanX = currentX.current + dragPanCurrent.current;
        const totalPanY = currentY.current;

        // Apply transforms using translate3d for GPU compositing
        if (sunMoonRef.current) {
          sunMoonRef.current.style.transform = `translate3d(${(totalPanX * 0.08).toFixed(2)}px, ${(totalPanY * 0.05).toFixed(2)}px, 0)`;
        }
        if (cloudsRef.current) {
          cloudsRef.current.style.transform = `translate3d(${(cloudOffset.current + totalPanX * 0.15).toFixed(2)}px, ${(totalPanY * 0.08).toFixed(2)}px, 0)`;
        }
        if (farHillsRef.current) {
          farHillsRef.current.style.transform = `translate3d(${(totalPanX * 0.3).toFixed(2)}px, ${(totalPanY * 0.12).toFixed(2)}px, 0)`;
        }
        if (midHillsRef.current) {
          midHillsRef.current.style.transform = `translate3d(${(totalPanX * 0.6).toFixed(2)}px, ${(totalPanY * 0.2).toFixed(2)}px, 0)`;
        }
        if (nearGroundRef.current) {
          nearGroundRef.current.style.transform = `translate3d(${(totalPanX * 0.9).toFixed(2)}px, ${(totalPanY * 0.28).toFixed(2)}px, 0)`;
        }
      }

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [isStatic]);

  // Color theme definitions
  const skyTheme = {
    day: {
      top: "#65AEDC",
      mid: "#78BDE8",
      bot: "#9AD0F2",
      sunMoonColor: "#F2C230",
      sunMoonInner: "#FCE588",
      cloudColor: "#E8CF9C", // warm plankLight/parchment tone instead of pure white
      farHills: "#528EA8",
      midHills: "#3B7D50",
      treesFoliage: "#2E683E",
      treesTrunk: "#5A3720",
      grassTop: "#8CCB55",
      grassBody: "#6DB33F",
      dirtTop: "#8B5A2B",
      dirtBedrock: "#5A3720",
    },
    sunset: {
      top: "#4A2B4B",
      mid: "#B8553A",
      bot: "#E07A5F",
      sunMoonColor: "#F4A261",
      sunMoonInner: "#E76F51",
      cloudColor: "#D9B87A",
      farHills: "#5E3048",
      midHills: "#4C3B30",
      treesFoliage: "#362822",
      treesTrunk: "#2E1A12",
      grassTop: "#A08A45",
      grassBody: "#7A6430",
      dirtTop: "#6A4222",
      dirtBedrock: "#402414",
    },
    night: {
      top: "#141620",
      mid: "#1B1D28",
      bot: "#232634",
      sunMoonColor: "#F3E3BC",
      sunMoonInner: "#D9B87A",
      cloudColor: "#2F3345",
      farHills: "#1F2332",
      midHills: "#192823",
      treesFoliage: "#121F1B",
      treesTrunk: "#2E1A12",
      grassTop: "#335C2B",
      grassBody: "#24421E",
      dirtTop: "#422C1A",
      dirtBedrock: "#2B1A0E",
    },
  }[time];

  return (
    <>
      {/* Movable World Background */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none -z-20 overflow-hidden select-none"
        style={{
          width: "100vw",
          height: "100vh",
          backgroundColor: skyTheme.mid,
        }}
      >
        {/* Layer 1: Flat Sky Bands (No gradients, pure stepped flat bands) */}
        <div className="absolute inset-0 flex flex-col pointer-events-none">
          <div className="h-[28%] w-full" style={{ backgroundColor: skyTheme.top }} />
          <div className="h-[36%] w-full" style={{ backgroundColor: skyTheme.mid }} />
          <div className="h-[36%] w-full" style={{ backgroundColor: skyTheme.bot }} />
        </div>

        {/* Layer 2: Blocky Sun or Moon */}
        <div
          ref={sunMoonRef}
          className="absolute pointer-events-none"
          style={{
            top: time === "sunset" ? "42%" : "12%",
            right: time === "night" ? "14%" : "18%",
            willChange: isStatic ? "auto" : "transform",
          }}
        >
          {time === "night" ? (
            /* Stepped Blocky Crescent Moon */
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <rect x="8" y="8" width="48" height="48" fill={skyTheme.sunMoonColor} />
              <rect x="16" y="16" width="32" height="32" fill={skyTheme.sunMoonInner} />
              {/* Stepped shadow cut-out to create blocky crescent */}
              <rect x="4" y="4" width="24" height="24" fill={skyTheme.top} />
            </svg>
          ) : (
            /* Stepped Blocky Sun */
            <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
              <rect x="4" y="4" width="64" height="64" fill={skyTheme.sunMoonColor} />
              <rect x="12" y="12" width="48" height="48" fill={skyTheme.sunMoonInner} />
              <rect x="20" y="20" width="32" height="32" fill={skyTheme.sunMoonColor} />
            </svg>
          )}
        </div>

        {/* Layer 3: Drifting Stepped Blocky Clouds */}
        <div
          ref={cloudsRef}
          className="absolute pointer-events-none w-[2400px] h-[160px] top-[14%]"
          style={{ willChange: isStatic ? "auto" : "transform" }}
        >
          <svg width="2400" height="120" viewBox="0 0 2400 120" fill="none">
            {/* Cloud 1 */}
            <g fill={skyTheme.cloudColor} opacity="0.85">
              <rect x="60" y="40" width="160" height="32" />
              <rect x="84" y="24" width="112" height="48" />
              <rect x="112" y="16" width="56" height="56" />
            </g>
            {/* Cloud 2 */}
            <g fill={skyTheme.cloudColor} opacity="0.8">
              <rect x="460" y="50" width="200" height="30" />
              <rect x="500" y="30" width="120" height="50" />
              <rect x="540" y="20" width="60" height="60" />
            </g>
            {/* Cloud 3 */}
            <g fill={skyTheme.cloudColor} opacity="0.85">
              <rect x="940" y="36" width="180" height="36" />
              <rect x="970" y="20" width="120" height="52" />
              <rect x="1000" y="10" width="60" height="62" />
            </g>
            {/* Cloud 4 (wrapped replica for endless drift) */}
            <g fill={skyTheme.cloudColor} opacity="0.85">
              <rect x="1380" y="44" width="170" height="30" />
              <rect x="1410" y="28" width="110" height="46" />
              <rect x="1440" y="18" width="50" height="56" />
            </g>
            {/* Cloud 5 */}
            <g fill={skyTheme.cloudColor} opacity="0.8">
              <rect x="1820" y="38" width="190" height="32" />
              <rect x="1860" y="22" width="110" height="48" />
              <rect x="1900" y="14" width="50" height="56" />
            </g>
          </svg>
        </div>

        {/* Layer 4: Far Stepped-Block Hills */}
        <div
          ref={farHillsRef}
          className="absolute bottom-[160px] sm:bottom-[180px] -left-[10%] w-[120%] pointer-events-none"
          style={{ willChange: isStatic ? "auto" : "transform" }}
        >
          <svg
            viewBox="0 0 1440 260"
            className="w-full h-auto"
            preserveAspectRatio="none"
            fill="none"
          >
            {/* Stepped blocky hill skyline */}
            <path
              d="M0 260 L0 180 L90 180 L90 150 L180 150 L180 120 L280 120 L280 100 L380 100 L380 130 L460 130 L460 160 L560 160 L560 140 L680 140 L680 110 L780 110 L780 90 L880 90 L880 120 L990 120 L990 150 L1100 150 L1100 130 L1220 130 L1220 100 L1320 100 L1320 140 L1440 140 L1440 260 Z"
              fill={skyTheme.farHills}
            />
          </svg>
        </div>

        {/* Layer 5: Mid Hills with Block Trees */}
        <div
          ref={midHillsRef}
          className="absolute bottom-[100px] sm:bottom-[120px] -left-[10%] w-[120%] pointer-events-none"
          style={{ willChange: isStatic ? "auto" : "transform" }}
        >
          <svg
            viewBox="0 0 1440 240"
            className="w-full h-auto"
            preserveAspectRatio="none"
            fill="none"
          >
            {/* Stepped green hill ridge */}
            <path
              d="M0 240 L0 150 L120 150 L120 120 L220 120 L220 90 L340 90 L340 130 L440 130 L440 100 L560 100 L560 80 L680 80 L680 110 L800 110 L800 140 L920 140 L920 100 L1040 100 L1040 70 L1160 70 L1160 110 L1280 110 L1280 130 L1440 130 L1440 240 Z"
              fill={skyTheme.midHills}
            />
            {/* Block Trees atop the ridge */}
            {/* Tree 1 */}
            <rect x="228" y="66" width="12" height="24" fill={skyTheme.treesTrunk} />
            <rect x="216" y="42" width="36" height="24" fill={skyTheme.treesFoliage} />
            <rect x="222" y="32" width="24" height="10" fill={skyTheme.treesFoliage} />
            {/* Tree 2 */}
            <rect x="568" y="56" width="12" height="24" fill={skyTheme.treesTrunk} />
            <rect x="556" y="32" width="36" height="24" fill={skyTheme.treesFoliage} />
            <rect x="562" y="22" width="24" height="10" fill={skyTheme.treesFoliage} />
            {/* Tree 3 */}
            <rect x="1048" y="46" width="12" height="24" fill={skyTheme.treesTrunk} />
            <rect x="1036" y="22" width="36" height="24" fill={skyTheme.treesFoliage} />
            <rect x="1042" y="12" width="24" height="10" fill={skyTheme.treesFoliage} />
          </svg>
        </div>

        {/* Layer 6: Near Ground (Grass top strip, dirt fill, bedrock base) */}
        <div
          ref={nearGroundRef}
          className="absolute bottom-0 -left-[10%] w-[120%] pointer-events-none"
          style={{ willChange: isStatic ? "auto" : "transform" }}
        >
          <div className="w-full flex flex-col">
            {/* Stepped Grass Top Edge */}
            <div
              className="w-full h-5 sm:h-6"
              style={{
                backgroundColor: skyTheme.grassTop,
                borderTop: "3px solid #1E1610",
              }}
            />
            {/* Grass Body */}
            <div
              className="w-full h-7 sm:h-8"
              style={{ backgroundColor: skyTheme.grassBody }}
            />
            {/* Dirt Layer */}
            <div
              className="w-full h-20 sm:h-24"
              style={{
                backgroundColor: skyTheme.dirtTop,
                borderTop: "2px solid #5A3720",
              }}
            />
            {/* Lower Bedrock Foundation */}
            <div
              className="w-full h-16 sm:h-20"
              style={{ backgroundColor: skyTheme.dirtBedrock }}
            />
          </div>
        </div>
      </div>

      {/* Discrete Ambient Time-of-Day Toggle (Fixed in bottom-right corner for judges/demo) */}
      {showToggle && (
        <div
          className="fixed bottom-3 right-3 z-50 flex items-center gap-1 p-1 bg-[#232634]/90 border-[2px] border-[#1E1610] shadow-[2px_2px_0px_#1E1610] rounded-xs text-xs select-none"
          role="toolbar"
          aria-label="World scene time of day"
        >
          <button
            type="button"
            onClick={() => handleTimeChange("day")}
            className={`px-2 py-1 font-heading font-extrabold text-[11px] rounded-xs transition-colors cursor-pointer ${
              time === "day"
                ? "bg-[#F2C230] text-[#1E1610] shadow-[1px_1px_0px_#1E1610]"
                : "text-[#F3E3BC] hover:bg-[#D9B87A]/20"
            }`}
            title="Switch to Day Scene"
          >
            Day
          </button>
          <button
            type="button"
            onClick={() => handleTimeChange("sunset")}
            className={`px-2 py-1 font-heading font-extrabold text-[11px] rounded-xs transition-colors cursor-pointer ${
              time === "sunset"
                ? "bg-[#E07A5F] text-[#1E1610] shadow-[1px_1px_0px_#1E1610]"
                : "text-[#F3E3BC] hover:bg-[#D9B87A]/20"
            }`}
            title="Switch to Sunset Scene"
          >
            Sunset
          </button>
          <button
            type="button"
            onClick={() => handleTimeChange("night")}
            className={`px-2 py-1 font-heading font-extrabold text-[11px] rounded-xs transition-colors cursor-pointer ${
              time === "night"
                ? "bg-[#4EDBD3] text-[#1E1610] shadow-[1px_1px_0px_#1E1610]"
                : "text-[#F3E3BC] hover:bg-[#D9B87A]/20"
            }`}
            title="Switch to Night Scene"
          >
            Night
          </button>
        </div>
      )}
    </>
  );
}

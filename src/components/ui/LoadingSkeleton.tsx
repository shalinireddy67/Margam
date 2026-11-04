"use client";

import React, { useState, useEffect } from "react";
import { Button } from "./Button";
import { ProgressBar } from "./ProgressBar";

export function SkeletonLine({
  width = "100%",
  height = "18px",
  className = "",
}: {
  width?: string;
  height?: string;
  className?: string;
}) {
  return (
    <div
      style={{ width, height }}
      className={`bg-[#B9BCC0]/60 border-2 border-[#1E1610] rounded-xs animate-pulse ${className}`.trim()}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div
      aria-label="Loading..."
      role="status"
      data-panel="skeleton-card"
      className={`border-[3px] border-[#1E1610] rounded-xs p-5 bg-[#D9B87A]/90 shadow-[3px_3px_0px_#1E1610] space-y-3 ${className}`.trim()}
    >
      <SkeletonLine width="60%" height="24px" className="bg-[#8B5A2B]/40 border-[#1E1610]" />
      <SkeletonLine width="90%" height="16px" className="bg-[#8B5A2B]/20 border-[#1E1610]" />
      <SkeletonLine width="75%" height="16px" className="bg-[#8B5A2B]/20 border-[#1E1610]" />
      <div className="pt-2">
        <SkeletonLine width="40%" height="36px" className="bg-[#6DB33F]/40 border-[#1E1610]" />
      </div>
      <span className="sr-only">Loading content...</span>
    </div>
  );
}

export interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      data-panel="empty-state"
      className={`border-[3px] border-dashed border-[#1E1610] rounded-xs p-6 text-center bg-[#D9B87A]/90 text-[#1E1610] shadow-[3px_3px_0px_#1E1610] space-y-3 ${className}`.trim()}
    >
      <svg
        viewBox="0 0 16 16"
        className="w-16 h-16 mx-auto text-[#8B5A2B]"
        aria-hidden="true"
        shapeRendering="crispEdges"
      >
        <rect x="2" y="2" width="12" height="12" fill="#E8CF9C" stroke="#1E1610" strokeWidth="2" />
        <rect x="5" y="6" width="2" height="2" fill="#1E1610" />
        <rect x="9" y="6" width="2" height="2" fill="#1E1610" />
        <rect x="5" y="10" width="6" height="1" fill="#1E1610" />
      </svg>
      <h3 className="font-heading font-extrabold text-base sm:text-lg text-[#1E1610]">
        {title}
      </h3>
      <p className="text-sm font-bold text-[#5A3720] max-w-sm mx-auto">
        {description}
      </p>
      {actionLabel && onAction && (
        <div className="pt-2">
          <Button variant="gold" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

const MATH_TIPS = [
  "Every topic you practice helps you build strong math skills.",
  "Starting with earlier basics makes new math easier.",
  "Check integer sign rules before solving algebra.",
  "One step at a time helps solve hard equations.",
  "Fixing earlier topics opens up your chapter lessons.",
];

export function VoxelRealmLoader({
  message = "Loading maths...",
  subtext,
  progress = 65,
}: {
  message?: string;
  subtext?: string;
  progress?: number;
}) {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % MATH_TIPS.length);
    }, 3800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      data-panel="loader"
      className="min-h-[320px] flex flex-col items-center justify-center p-6 text-center select-none"
    >
      {/* Voxel Rising Sun Animation */}
      <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
        {/* Ground horizon */}
        <div className="absolute inset-x-0 bottom-3 h-2 bg-[#6DB33F] border-t-2 border-[#1E1610] z-10" />
        {/* Sun Block rising */}
        <div
          className="w-12 h-12 bg-[#F2C230] border-[3px] border-[#1E1610] shadow-[2px_2px_0px_#1E1610] animate-bounce z-0"
          aria-hidden="true"
        />
      </div>

      <h2 className="font-heading font-extrabold text-base sm:text-lg text-[#F3E3BC] tracking-wider drop-shadow-[2px_2px_0px_#1E1610] mb-3">
        {message}
      </h2>

      {/* Segmented XP Progress */}
      <div className="w-full max-w-xs mb-4">
        <ProgressBar value={progress} max={100} segments={12} color="grass" />
      </div>

      <p className="text-xs sm:text-sm font-bold text-[#F3E3BC] max-w-md bg-[#232634]/90 border-2 border-[#1E1610] px-4 py-2 shadow-[2px_2px_0px_#1E1610] min-h-[44px] flex items-center justify-center">
        💡 {subtext || MATH_TIPS[tipIndex]}
      </p>
    </div>
  );
}

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
      className={`bg-[#8B8B8B]/60 border-2 border-[#5E5E5E] rounded-[2px] animate-pulse ${className}`.trim()}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div
      aria-label="Loading..."
      role="status"
      className={`border-[3px] border-[#2B1B0F] p-5 bg-[#FFFDF7] shadow-[4px_4px_0px_#2B1B0F] space-y-3 ${className}`.trim()}
    >
      <SkeletonLine width="60%" height="24px" className="bg-[#FFE9A8] border-[#2B1B0F]" />
      <SkeletonLine width="90%" height="16px" className="bg-[#2B1B0F]/10 border-[#2B1B0F]/30" />
      <SkeletonLine width="75%" height="16px" className="bg-[#2B1B0F]/10 border-[#2B1B0F]/30" />
      <div className="pt-2">
        <SkeletonLine width="40%" height="36px" className="bg-[#5DAA3A]/40 border-[#2B1B0F]" />
      </div>
      <span className="sr-only">Loading content...</span>
    </div>
  );
}

export function SkeletonPathMap({ className = "" }: { className?: string }) {
  return (
    <div
      aria-label="Loading concept path..."
      role="status"
      className={`space-y-4 p-4 ${className}`.trim()}
    >
      {[1, 2, 3].map((node) => (
        <div key={node} className="relative flex items-center gap-4">
          {/* Node Block */}
          <div className="w-14 h-14 bg-[#FFFDF7] border-[3px] border-[#2B1B0F] shadow-[3px_3px_0px_#2B1B0F] flex items-center justify-center shrink-0 animate-pulse">
            <div className="w-6 h-6 bg-[#FFE9A8] border border-[#2B1B0F]" />
          </div>

          {/* Node Details */}
          <div className="flex-1 bg-[#FFFDF7] border-[3px] border-[#2B1B0F] shadow-[3px_3px_0px_#2B1B0F] p-4 space-y-2">
            <SkeletonLine width="50%" height="20px" className="bg-[#2B1B0F]/20 border-[#2B1B0F]/30" />
            <SkeletonLine width="80%" height="14px" className="bg-[#2B1B0F]/10 border-[#2B1B0F]/20" />
          </div>
        </div>
      ))}
      <span className="sr-only">Loading concept path...</span>
    </div>
  );
}

export function SkeletonList({ count = 3, className = "" }: { count?: number; className?: string }) {
  return (
    <div
      aria-label="Loading list..."
      role="status"
      className={`space-y-3 ${className}`.trim()}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-[#FFFDF7] border-[3px] border-[#2B1B0F] shadow-[3px_3px_0px_#2B1B0F] p-4 flex items-center justify-between gap-4 animate-pulse"
        >
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 bg-[#FFE9A8] border-[2px] border-[#2B1B0F] shrink-0" />
            <div className="space-y-1.5 flex-1">
              <SkeletonLine width="65%" height="18px" className="bg-[#2B1B0F]/20 border-[#2B1B0F]/30" />
              <SkeletonLine width="45%" height="12px" className="bg-[#2B1B0F]/10 border-[#2B1B0F]/20" />
            </div>
          </div>
          <div className="w-24 h-10 bg-[#5DAA3A]/40 border-[2px] border-[#2B1B0F] shrink-0" />
        </div>
      ))}
      <span className="sr-only">Loading list items...</span>
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
      className={`border-4 border-dashed border-[#7A4B2A] rounded-[2px] p-6 text-center bg-[#FFF7E6] text-[#2B1B0F] shadow-[4px_4px_0px_rgba(0,0,0,0.35)] space-y-3 ${className}`.trim()}
    >
      <svg
        viewBox="0 0 16 16"
        className="w-16 h-16 mx-auto text-[#7A4B2A]"
        aria-hidden="true"
        shapeRendering="crispEdges"
      >
        <rect x="2" y="2" width="12" height="12" fill="#FFE9A8" stroke="#5A3720" strokeWidth="2" />
        <rect x="5" y="6" width="2" height="2" fill="#2B1B0F" />
        <rect x="9" y="6" width="2" height="2" fill="#2B1B0F" />
        <rect x="5" y="10" width="6" height="1" fill="#2B1B0F" />
      </svg>
      <h3 className="font-heading font-extrabold text-base sm:text-lg text-[#2B1B0F]">
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

const STUDY_TIPS = [
  "Reviewing earlier topics makes advanced maths easier.",
  "Building strong foundations prevents mistakes in later classes.",
  "Understand integer rules before starting algebraic equations.",
  "Take one small step at a time.",
  "Checking earlier topics clarifies where to start.",
];

export function VoxelRealmLoader({
  message = "Loading dashboard...",
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
      setTipIndex((prev) => (prev + 1) % STUDY_TIPS.length);
    }, 3800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[320px] flex flex-col items-center justify-center p-6 text-center select-none">
      {/* Voxel Rising Sun Animation */}
      <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
        {/* Sky horizon */}
        <div className="absolute inset-x-0 bottom-3 h-2 bg-[#5DAA3A] border-t-2 border-[#2F6B22] z-10" />
        {/* Sun Block rising */}
        <div
          className="w-12 h-12 bg-[#FFE9A8] border-3 border-[#7A4B2A] shadow-[inset_2px_2px_0px_#FFFFFF,inset_-2px_-2px_0px_#F4C542,0_0_16px_#FFE9A8] animate-bounce z-0"
          aria-hidden="true"
        />
      </div>

      <h2 className="font-heading font-extrabold text-base sm:text-lg text-[#FFE9A8] tracking-wider drop-shadow-[2px_2px_0px_#2B1B0F] mb-3">
        {message}
      </h2>

      {/* Segmented XP Progress */}
      <div className="w-full max-w-xs mb-4">
        <ProgressBar value={progress} max={100} segments={12} color="grass" />
      </div>

      <p className="text-xs sm:text-sm font-bold text-[#FFF7E6] max-w-md bg-[#422816]/70 border-2 border-[#7A4B2A] px-4 py-2 shadow-[2px_2px_0px_rgba(0,0,0,0.35)] min-h-[44px] flex items-center justify-center">
        💡 {subtext || STUDY_TIPS[tipIndex]}
      </p>
    </div>
  );
}

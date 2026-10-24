"use client";

import React from "react";
import { Button } from "./Button";

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
      className={`bg-[#E8E0BD] rounded-lg border-[2px] border-[#111111]/10 ${className}`.trim()}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div
      aria-label="Loading..."
      role="status"
      className={`border-[3px] border-[#111111] rounded-[18px_14px_20px_15px/15px_20px_14px_18px] p-5 bg-[#FFFFFF] shadow-[4px_4px_0px_#111111] space-y-3 ${className}`.trim()}
    >
      <SkeletonLine width="60%" height="24px" />
      <SkeletonLine width="90%" height="16px" />
      <SkeletonLine width="75%" height="16px" />
      <div className="pt-2">
        <SkeletonLine width="40%" height="36px" />
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
      className={`border-[3px] border-dashed border-[#111111] rounded-[18px_14px_20px_15px/15px_20px_14px_18px] p-6 text-center bg-[#FFFFFF] space-y-3 ${className}`.trim()}
    >
      <svg
        viewBox="0 0 64 64"
        className="w-16 h-16 mx-auto"
        aria-hidden="true"
      >
        <rect
          x="10"
          y="10"
          width="44"
          height="44"
          rx="12"
          fill="#FFF8DC"
          stroke="#111111"
          strokeWidth="3"
        />
        <circle cx="24" cy="28" r="3.5" fill="#111111" />
        <circle cx="40" cy="28" r="3.5" fill="#111111" />
        <path
          d="M24 42q8-6 16 0"
          fill="none"
          stroke="#111111"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      <h3 className="font-heading font-extrabold text-xl text-[#111111]">
        {title}
      </h3>
      <p className="text-sm font-bold text-[#666666] max-w-sm mx-auto">
        {description}
      </p>
      {actionLabel && onAction && (
        <div className="pt-2">
          <Button variant="yellow" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

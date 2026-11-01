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
      className={`bg-[#9AA0A6] border-2 border-[#111111] rounded-none ${className}`.trim()}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div
      aria-label="Loading..."
      role="status"
      className={`border-4 border-[#111111] rounded-none p-5 bg-[#FFFFFF] shadow-[4px_4px_0px_#111111] space-y-3 ${className}`.trim()}
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
      className={`border-4 border-dashed border-[#111111] rounded-none p-6 text-center bg-[#FFFFFF] space-y-3 ${className}`.trim()}
    >
      <svg
        viewBox="0 0 16 16"
        className="w-16 h-16 mx-auto text-[#111111]"
        aria-hidden="true"
        shapeRendering="crispEdges"
      >
        <rect x="2" y="2" width="12" height="12" fill="#F2D16B" stroke="#111111" strokeWidth="2" />
        <rect x="5" y="6" width="2" height="2" fill="#111111" />
        <rect x="9" y="6" width="2" height="2" fill="#111111" />
        <rect x="5" y="10" width="6" height="1" fill="#111111" />
      </svg>
      <h3 className="font-heading font-extrabold text-base sm:text-lg text-[#111111]">
        {title}
      </h3>
      <p className="text-sm font-bold text-[#444444] max-w-sm mx-auto">
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

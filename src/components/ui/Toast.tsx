"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./Button";

export interface ToastProps {
  type?: "info" | "error" | "success" | "offline";
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function Toast({
  type = "info",
  title,
  message,
  onRetry,
  className = "",
}: ToastProps) {
  const bg =
    type === "error"
      ? "bg-[#D9453D] text-[#FFF7E6]"
      : type === "success"
        ? "bg-[#5DAA3A] text-[#FFF7E6]"
        : type === "offline"
          ? "bg-[#FFE9A8] text-[#2B1B0F]"
          : "bg-[#FFF7E6] text-[#2B1B0F]";

  return (
    <div
      role="alert"
      className={`
        w-full p-4 border-[3px] border-[#422816]
        rounded-none
        shadow-[4px_4px_0px_#1B120C]
        ${bg}
        flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3
        ${className}
      `.trim()}
    >
      <div>
        {title && (
          <h4 className="font-pixel text-sm mb-1 tracking-wide">
            {title}
          </h4>
        )}
        <p className="text-sm font-semibold m-0 leading-snug">
          {message}
        </p>
      </div>

      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="shrink-0"
        >
          Retry
        </Button>
      )}
    </div>
  );
}

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);
  const [hasLocalSave, setHasLocalSave] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const checkState = () => {
      const offline = !navigator.onLine;
      setIsOffline(offline);
      if (offline) {
        try {
          const hasSave = Boolean(
            localStorage.getItem("margam_active_learner") ||
            localStorage.getItem("margam_offline_progress") ||
            localStorage.getItem("margam_learner_profile")
          );
          setHasLocalSave(hasSave);
        } catch {
          setHasLocalSave(false);
        }
      } else {
        setDismissed(false);
      }
    };

    if (typeof window !== "undefined") {
      checkState();
      window.addEventListener("online", checkState);
      window.addEventListener("offline", checkState);
    }

    return () => {
      window.removeEventListener("online", checkState);
      window.removeEventListener("offline", checkState);
    };
  }, []);

  if (!isOffline || dismissed) return null;

  return (
    <div
      role="status"
      className="fixed top-2 sm:top-4 left-4 right-4 sm:left-auto sm:right-6 z-50 max-w-[480px] sm:max-w-md mx-auto sm:mx-0 p-3 bg-[#FFE9A8] border-[3px] border-[#2B1B0F] rounded-none shadow-[4px_4px_0px_#2B1B0F] flex items-center justify-between gap-3 text-[#2B1B0F]"
    >
      <p className="text-xs font-heading font-bold m-0 leading-snug">
        {hasLocalSave
          ? "No internet. Your work is saved on this phone."
          : "No internet. Try again when you are back online."}
      </p>

      {hasLocalSave ? (
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="px-3 py-1.5 min-h-[36px] bg-[#5DAA3A] hover:brightness-105 text-[#2B1B0F] border-[2px] border-[#2B1B0F] shadow-[2px_2px_0px_#2B1B0F] font-heading font-bold text-xs shrink-0 cursor-pointer"
        >
          Keep learning
        </button>
      ) : (
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="px-3 py-1.5 min-h-[36px] bg-[#5DAA3A] hover:brightness-105 text-[#2B1B0F] border-[2px] border-[#2B1B0F] shadow-[2px_2px_0px_#2B1B0F] font-heading font-bold text-xs shrink-0 cursor-pointer"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export function SlowNetworkToast() {
  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.fetch) return;

    const originalFetch = window.fetch;
    let pendingSlowCount = 0;

    window.fetch = async (...args) => {
      let timer: ReturnType<typeof setTimeout> | null = setTimeout(() => {
        pendingSlowCount++;
        setIsSlow(true);
        timer = null;
      }, 4000);

      try {
        const response = await originalFetch(...args);
        return response;
      } finally {
        if (timer) {
          clearTimeout(timer);
        } else {
          pendingSlowCount = Math.max(0, pendingSlowCount - 1);
          if (pendingSlowCount === 0) {
            setIsSlow(false);
          }
        }
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  if (!isSlow) return null;

  return (
    <div
      role="status"
      className="fixed bottom-4 right-4 z-50 p-3 bg-[#FFE9A8] text-[#2B1B0F] border-[3px] border-[#2B1B0F] shadow-[3px_3px_0px_#2B1B0F] flex items-center gap-2.5 pointer-events-auto"
    >
      <div className="w-3 h-3 bg-[#D9453D] border border-[#2B1B0F] animate-pulse" />
      <span className="text-xs font-heading font-bold">This is slow. Still trying.</span>
    </div>
  );
}

export function NetworkStatusMonitor() {
  return (
    <>
      <OfflineBanner />
      <SlowNetworkToast />
    </>
  );
}

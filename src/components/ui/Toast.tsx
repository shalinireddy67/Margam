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
      ? "bg-[#FF4F9A]"
      : type === "success"
      ? "bg-[#8DE86A]"
      : type === "offline"
      ? "bg-[#FFE14D]"
      : "bg-[#FFFFFF]";

  return (
    <div
      role="alert"
      className={`
        w-full p-4 border-[3px] border-[#111111]
        rounded-[18px_14px_20px_15px/15px_20px_14px_18px]
        shadow-[4px_4px_0px_#111111]
        ${bg} text-[#111111]
        flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3
        ${className}
      `.trim()}
    >
      <div>
        {title && (
          <h4 className="font-heading font-extrabold text-base mb-0.5">
            {title}
          </h4>
        )}
        <p className="text-sm font-bold m-0 leading-snug">
          {message}
        </p>
      </div>

      {onRetry && (
        <Button
          variant="white"
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

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    if (typeof window !== "undefined") {
      setIsOffline(!navigator.onLine);
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div
      role="status"
      className="fixed top-2 left-4 right-4 z-50 max-w-[480px] mx-auto p-3 bg-[#FFE14D] border-[3px] border-[#111111] rounded-[18px_14px_20px_15px/15px_20px_14px_18px] shadow-[4px_4px_0px_#111111] flex items-center justify-between gap-2"
    >
      <p className="text-xs font-bold text-[#111111] m-0">
        You are offline. Saved lessons and questions still work.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-2.5 py-1 min-h-[36px] bg-[#FFFFFF] border-[2px] border-[#111111] rounded-xl font-heading font-bold text-xs"
      >
        Retry
      </button>
    </div>
  );
}

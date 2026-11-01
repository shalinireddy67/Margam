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
      className="fixed top-2 sm:top-4 left-4 right-4 sm:left-auto sm:right-6 z-50 max-w-[480px] sm:max-w-md mx-auto sm:mx-0 p-3 bg-[#FFE9A8] border-[3px] border-[#422816] rounded-none shadow-[4px_4px_0px_#1B120C] flex items-center justify-between gap-2"
    >
      <p className="text-xs font-bold text-[#2B1B0F] m-0">
        You are offline. Saved lessons and questions still work.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-2.5 py-1 min-h-[36px] bg-[#5DAA3A] text-[#FFF7E6] border-[2px] border-[#422816] shadow-[2px_2px_0px_#1B120C] rounded-none font-pixel text-xs hover:bg-[#4E9330]"
      >
        Retry
      </button>
    </div>
  );
}

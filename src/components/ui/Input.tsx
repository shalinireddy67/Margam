"use client";

import React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          ref={ref}
          className={`
            w-full min-h-[50px] px-4 py-3
            text-base font-bold text-[#111111] bg-[#FFFFFF]
            border-[3px] border-[#111111]
            rounded-[18px_14px_20px_15px/15px_20px_14px_18px]
            shadow-[4px_4px_0px_#111111]
            placeholder:text-[#777777] placeholder:font-normal
            focus:outline-none focus:ring-0
            ${error ? "border-[#FF4F9A] wobble" : ""}
            ${className}
          `.trim()}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm font-bold text-[#FF4F9A] px-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

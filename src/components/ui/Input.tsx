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
            border-4 border-[#111111] rounded-none
            shadow-[4px_4px_0px_#111111]
            placeholder:text-[#666666] placeholder:font-normal
            focus:outline-none focus:shadow-[4px_4px_0px_#5DB84A]
            ${error ? "border-[#D9453D] shadow-[4px_4px_0px_#D9453D]" : ""}
            ${className}
          `.trim()}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs font-bold text-[#D9453D] font-heading px-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

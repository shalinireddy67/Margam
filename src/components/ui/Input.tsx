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
            text-[16px] sm:text-base font-bold text-[#2B1B0F] bg-[#FFF7E6]
            border-4 border-[#5A3720] rounded-[2px]
            shadow-[inset_2px_2px_0px_rgba(0,0,0,0.2),4px_4px_0px_rgba(0,0,0,0.35)]
            placeholder:text-[#7A4B2A]/70 placeholder:font-normal
            focus:outline-none focus:border-[#3FA7C9] focus:shadow-[inset_2px_2px_0px_rgba(0,0,0,0.2),4px_4px_0px_#FFE9A8]
            ${error ? "border-[#E04A3F] shadow-[4px_4px_0px_#E04A3F]" : ""}
            ${className}
          `.trim()}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs font-bold text-[#E04A3F] font-heading px-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;

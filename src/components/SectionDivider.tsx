import React from "react";

export default function SectionDivider() {
  return (
    <div className="flex items-center justify-center gap-3 py-6 opacity-80" aria-hidden="true">
      <div className="h-[1.5px] w-16 sm:w-28 bg-gradient-to-r from-transparent to-[#C7DDAE]" />
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="inline-block shrink-0 -rotate-45"
        aria-hidden="true"
      >
        <path d="M 4 20 C 6 12 14 5 21 3 C 21 11 15 19 4 20 Z" fill="#6CA24A" />
        <path d="M 6 18 Q 13 13 19 5" stroke="#FFF7E6" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="inline-block shrink-0"
        aria-hidden="true"
      >
        <circle cx="12" cy="7.2" r="4.2" fill="#F4C542" />
        <circle cx="16.6" cy="10.5" r="4.2" fill="#F4C542" />
        <circle cx="14.8" cy="16" r="4.2" fill="#F4C542" />
        <circle cx="9.2" cy="16" r="4.2" fill="#F4C542" />
        <circle cx="7.4" cy="10.5" r="4.2" fill="#F4C542" />
        <circle cx="12" cy="12" r="3.2" fill="#F28C38" />
      </svg>
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="inline-block shrink-0 rotate-45 scale-x-[-1]"
        aria-hidden="true"
      >
        <path d="M 4 20 C 6 12 14 5 21 3 C 21 11 15 19 4 20 Z" fill="#6CA24A" />
        <path d="M 6 18 Q 13 13 19 5" stroke="#FFF7E6" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <div className="h-[1.5px] w-16 sm:w-28 bg-gradient-to-l from-transparent to-[#C7DDAE]" />
    </div>
  );
}

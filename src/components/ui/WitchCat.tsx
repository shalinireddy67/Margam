"use client";

import React from "react";

export type WitchCatPose = "greet" | "read" | "think" | "cheer" | "oops";

export interface WitchCatProps {
  pose?: WitchCatPose;
  size?: number | "sm" | "default" | "lg";
  className?: string;
  alt?: string;
  sticker?: boolean;
  simplified?: boolean;
}

/**
 * Original hand-drawn Neo-Brutalist Witch Cat SVG
 * Option 1 Palette:
 * - Hat: Bright Pink (#FF4F9A) with Yellow (#FFE14D) band
 * - Body: Sky Blue (#A9D8F0)
 * - Book/Accent: Yellow (#FFE14D)
 * - Inner Ears & Blush: Bright Pink (#FF4F9A)
 * - Outlines & Ink details: #111111 (3-3.8px stroke, rounded joints)
 *
 * Backing & Scale Rules:
 * - Bare cat is placed only on White (#FFFFFF), Yellow (#FFE14D), or Ink (#111111).
 * - When placed on Cyan (#4DD9E8), Pink (#FF4F9A), or colored tiles, `sticker={true}`
 *   draws a white circular badge with 3px ink outline so pink hat and sky-blue body never vanish.
 * - At 64px (or `simplified={true}`), details are simplified for ultra-clear readability.
 */
export function WitchCat({
  pose = "greet",
  size = "default",
  className = "",
  alt,
  sticker = false,
  simplified,
}: WitchCatProps) {
  let dimension = 120;
  if (typeof size === "number") {
    dimension = size;
  } else if (size === "sm") {
    dimension = 64;
  } else if (size === "default") {
    dimension = 120;
  } else if (size === "lg") {
    dimension = 240;
  }

  const isSimplified = simplified ?? (dimension <= 64);

  const defaultAlt = {
    greet: "Margam Witch Cat waving hello",
    read: "Margam Witch Cat reading a maths book",
    think: "Margam Witch Cat thinking about a maths problem",
    cheer: "Margam Witch Cat celebrating a correct answer",
    oops: "Margam Witch Cat offering a sympathetic hint",
  }[pose];

  const strokeProps = {
    stroke: "#111111",
    strokeWidth: isSimplified ? "3.8" : "3.5",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <svg
      data-testid="witch-cat"
      data-pose={pose}
      width={dimension}
      height={dimension}
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={alt || defaultAlt}
      className={`shrink-0 select-none motion-reduce:animate-none motion-reduce:transition-none ${className}`}
    >
      {/* ----------------- STICKER BACKING (Optional / for Pink & Cyan) ----------------- */}
      {sticker && (
        <g>
          {/* Hard offset shadow */}
          <circle cx="83" cy="83" r="74" fill="#111111" />
          {/* White circle with 3px ink outline */}
          <circle cx="80" cy="80" r="74" fill="#FFFFFF" stroke="#111111" strokeWidth="3" />
        </g>
      )}

      {/* ----------------- POSE: GREET ----------------- */}
      {pose === "greet" && (
        <g>
          {/* Ground shadow (bare only) */}
          {!sticker && (
            <ellipse cx="80" cy="150" rx="46" ry="6" fill="#111111" opacity="0.9" />
          )}

          {/* Tail curling to the left */}
          <path
            d="M 44 135 C 24 135 16 115 22 96 C 26 84 36 84 36 92 C 36 104 32 118 46 126"
            fill="#A9D8F0"
            {...strokeProps}
          />

          {/* Cat Body */}
          <path
            d="M 46 142 C 44 110 50 86 64 78 C 74 74 86 74 96 78 C 110 86 116 110 114 142 Z"
            fill="#A9D8F0"
            {...strokeProps}
          />
          {/* White chest bib */}
          <path
            d="M 66 88 C 66 112 94 112 94 88 C 94 82 66 82 66 88 Z"
            fill="#FFFFFF"
            stroke="#111111"
            strokeWidth="2.5"
          />

          {/* Left paw resting on belly */}
          <ellipse cx="62" cy="116" rx="8" ry="6" fill="#A9D8F0" {...strokeProps} />

          {/* Right arm waving high */}
          <path
            d="M 104 96 C 118 84 126 68 128 54 C 132 50 140 54 138 62 C 134 76 122 96 108 106 Z"
            fill="#A9D8F0"
            {...strokeProps}
          />
          {/* Waving paw pad */}
          <circle
            cx="132"
            cy="56"
            r={isSimplified ? 6.5 : 6}
            fill="#FF4F9A"
            stroke="#111111"
            strokeWidth="2.5"
          />
          {/* Motion lines for wave (standard only) */}
          {!isSimplified && (
            <>
              <path d="M 144 48 C 146 54 146 62 144 68" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 150 52 C 152 56 152 60 150 64" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" />
            </>
          )}

          {/* Head */}
          <ellipse cx="80" cy="62" rx="36" ry="28" fill="#A9D8F0" {...strokeProps} />

          {/* Ears */}
          <path d="M 52 46 L 42 22 L 62 36 Z" fill="#A9D8F0" {...strokeProps} />
          <path d="M 51 42 L 46 27 L 58 36 Z" fill="#FF4F9A" />
          <path d="M 108 46 L 118 22 L 98 36 Z" fill="#A9D8F0" {...strokeProps} />
          <path d="M 109 42 L 114 27 L 102 36 Z" fill="#FF4F9A" />

          {/* Eyes */}
          <circle cx="68" cy="60" r={isSimplified ? 5.5 : 5} fill="#111111" />
          <circle cx="66.5" cy="58.5" r={isSimplified ? 2 : 1.8} fill="#FFFFFF" />
          <circle cx="92" cy="60" r={isSimplified ? 5.5 : 5} fill="#111111" />
          <circle cx="90.5" cy="58.5" r={isSimplified ? 2 : 1.8} fill="#FFFFFF" />

          {/* Pink Blush */}
          <ellipse cx="58" cy="68" rx="5" ry="3" fill="#FF4F9A" />
          <ellipse cx="102" cy="68" rx="5" ry="3" fill="#FF4F9A" />

          {/* Cute Nose and Mouth */}
          <polygon points="78,66 82,66 80,69" fill="#FF4F9A" stroke="#111111" strokeWidth="1.5" />
          <path d="M 76 71 Q 80 74 84 71" fill="none" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" />

          {/* Whiskers (simplified: 2 bold strokes per side; standard: 3 strokes) */}
          {isSimplified ? (
            <>
              <path d="M 50 63 L 34 61 M 50 71 L 34 75" stroke="#111111" strokeWidth="3" strokeLinecap="round" />
              <path d="M 110 63 L 126 61 M 110 71 L 126 75" stroke="#111111" strokeWidth="3" strokeLinecap="round" />
            </>
          ) : (
            <>
              <path d="M 52 64 L 38 62 M 52 68 L 36 70 M 52 72 L 38 78" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 108 64 L 122 62 M 108 68 L 124 70 M 108 72 L 122 78" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" />
            </>
          )}

          {/* Witch Hat */}
          <ellipse cx="80" cy="38" rx="44" ry="10" fill="#FF4F9A" {...strokeProps} />
          <path
            d="M 50 36 C 54 20 66 4 94 2 C 86 14 96 22 108 36 Z"
            fill="#FF4F9A"
            {...strokeProps}
          />
          <path
            d="M 52 35 C 64 30 94 30 106 35 L 105 39 C 93 34 65 34 53 39 Z"
            fill="#FFE14D"
            stroke="#111111"
            strokeWidth="2.5"
          />
          {!isSimplified && (
            <polygon
              points="80,28 82,33 87,33 83,36 85,41 80,38 75,41 77,36 73,33 78,33"
              fill="#FFE14D"
              stroke="#111111"
              strokeWidth="1.8"
            />
          )}
        </g>
      )}

      {/* ----------------- POSE: READ ----------------- */}
      {pose === "read" && (
        <g>
          {/* Ground shadow (bare only) */}
          {!sticker && (
            <ellipse cx="80" cy="150" rx="48" ry="6" fill="#111111" opacity="0.9" />
          )}

          {/* Cat Body */}
          <path
            d="M 44 142 C 42 104 52 82 80 82 C 108 82 118 104 116 142 Z"
            fill="#A9D8F0"
            {...strokeProps}
          />

          {/* Head */}
          <ellipse cx="80" cy="62" rx="35" ry="27" fill="#A9D8F0" {...strokeProps} />

          {/* Ears */}
          <path d="M 53 45 L 43 20 L 63 35 Z" fill="#A9D8F0" {...strokeProps} />
          <path d="M 52 41 L 47 25 L 59 35 Z" fill="#FF4F9A" />
          <path d="M 107 45 L 117 20 L 97 35 Z" fill="#A9D8F0" {...strokeProps} />
          <path d="M 108 41 L 113 25 L 101 35 Z" fill="#FF4F9A" />

          {/* Round Glasses */}
          <circle cx="68" cy="63" r={isSimplified ? 8.5 : 8} fill="#FFFFFF" fillOpacity="0.8" stroke="#111111" strokeWidth={isSimplified ? "3" : "2.5"} />
          <circle cx="92" cy="63" r={isSimplified ? 8.5 : 8} fill="#FFFFFF" fillOpacity="0.8" stroke="#111111" strokeWidth={isSimplified ? "3" : "2.5"} />
          <path d="M 76 63 L 84 63" stroke="#111111" strokeWidth={isSimplified ? "3" : "2.5"} />

          {/* Eyes looking down at book */}
          <ellipse cx="68" cy="65" rx="3.5" ry="4" fill="#111111" />
          <circle cx="67" cy="64" r="1.2" fill="#FFFFFF" />
          <ellipse cx="92" cy="65" rx="3.5" ry="4" fill="#111111" />
          <circle cx="91" cy="64" r="1.2" fill="#FFFFFF" />

          {/* Cheeks blush */}
          <ellipse cx="56" cy="68" rx="4.5" ry="2.5" fill="#FF4F9A" />
          <ellipse cx="104" cy="68" rx="4.5" ry="2.5" fill="#FF4F9A" />

          {/* Nose & Mouth */}
          <polygon points="78,71 82,71 80,74" fill="#FF4F9A" stroke="#111111" strokeWidth="1.5" />
          <path d="M 77 75 Q 80 77 83 75" fill="none" stroke="#111111" strokeWidth="2" strokeLinecap="round" />

          {/* Open Yellow Math Book */}
          <path
            d="M 32 108 L 78 116 L 78 146 L 30 138 Z"
            fill="#FFE14D"
            {...strokeProps}
          />
          <path
            d="M 128 108 L 82 116 L 82 146 L 130 138 Z"
            fill="#FFE14D"
            {...strokeProps}
          />
          {/* White pages */}
          <path
            d="M 36 112 L 77 118 L 77 142 L 34 136 Z"
            fill="#FFFFFF"
            stroke="#111111"
            strokeWidth="2.2"
          />
          <path
            d="M 124 112 L 83 118 L 83 142 L 126 136 Z"
            fill="#FFFFFF"
            stroke="#111111"
            strokeWidth="2.2"
          />

          {/* Math content inside book */}
          {isSimplified ? (
            <>
              {/* Bold square root on left page */}
              <path d="M 44 130 L 48 135 L 53 122 L 68 122" stroke="#111111" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
              {/* Bold ± symbol on right page */}
              <path d="M 94 124 L 108 124 M 101 117 L 101 131 M 94 137 L 108 137" stroke="#111111" strokeWidth="2.6" strokeLinecap="round" />
            </>
          ) : (
            <>
              <path d="M 42 120 L 52 120 M 42 125 L 68 125 M 42 130 L 60 130" stroke="#111111" strokeWidth="2" strokeLinecap="round" />
              <path d="M 90 126 L 94 130 L 98 120 L 112 120" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <polygon points="98,136 108,136 103,127" fill="none" stroke="#111111" strokeWidth="1.8" />
            </>
          )}

          {/* Paws holding edges of book */}
          <ellipse cx="40" cy="122" rx="6" ry="7" fill="#A9D8F0" {...strokeProps} />
          <ellipse cx="120" cy="122" rx="6" ry="7" fill="#A9D8F0" {...strokeProps} />

          {/* Witch Hat */}
          <ellipse cx="80" cy="38" rx="42" ry="10" fill="#FF4F9A" {...strokeProps} />
          <path
            d="M 52 36 C 56 20 68 4 94 2 C 86 14 96 22 108 36 Z"
            fill="#FF4F9A"
            {...strokeProps}
          />
          <path
            d="M 54 35 C 66 30 94 30 106 35 L 105 39 C 93 34 65 34 55 39 Z"
            fill="#FFE14D"
            stroke="#111111"
            strokeWidth="2.5"
          />
        </g>
      )}

      {/* ----------------- POSE: THINK ----------------- */}
      {pose === "think" && (
        <g>
          {/* Ground shadow (bare only) */}
          {!sticker && (
            <ellipse cx="80" cy="150" rx="46" ry="6" fill="#111111" opacity="0.9" />
          )}

          {/* Body */}
          <path
            d="M 46 142 C 44 110 50 86 64 78 C 74 74 86 74 96 78 C 110 86 116 110 114 142 Z"
            fill="#A9D8F0"
            {...strokeProps}
          />

          {/* Left paw on lap */}
          <ellipse cx="58" cy="124" rx="8" ry="6" fill="#A9D8F0" {...strokeProps} />

          {/* Right paw tapped to chin */}
          <path
            d="M 98 116 C 108 106 106 90 92 84 C 88 88 88 94 92 100 Z"
            fill="#A9D8F0"
            {...strokeProps}
          />
          <ellipse cx="86" cy="80" rx="7" ry="6" fill="#A9D8F0" {...strokeProps} />

          {/* Head */}
          <ellipse cx="78" cy="60" rx="36" ry="28" fill="#A9D8F0" {...strokeProps} />

          {/* Ears */}
          <path d="M 50 44 L 40 20 L 60 34 Z" fill="#A9D8F0" {...strokeProps} />
          <path d="M 49 40 L 44 25 L 56 34 Z" fill="#FF4F9A" />
          <path d="M 106 44 L 116 20 L 96 34 Z" fill="#A9D8F0" {...strokeProps} />
          <path d="M 107 40 L 112 25 L 100 34 Z" fill="#FF4F9A" />

          {/* Curious eyes looking up and right */}
          <circle cx="68" cy="56" r={isSimplified ? 5.5 : 5} fill="#111111" />
          <circle cx="70" cy="54" r={isSimplified ? 2.2 : 2} fill="#FFFFFF" />
          <circle cx="92" cy="56" r={isSimplified ? 5.5 : 5} fill="#111111" />
          <circle cx="94" cy="54" r={isSimplified ? 2.2 : 2} fill="#FFFFFF" />

          {/* Eyebrows */}
          <path d="M 64 48 Q 70 46 74 50" fill="none" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 88 50 Q 92 45 98 48" fill="none" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" />

          {/* Small pondering mouth */}
          <ellipse cx="78" cy="69" rx="3" ry="2" fill="#FF4F9A" stroke="#111111" strokeWidth="1.5" />

          {/* Whiskers */}
          {isSimplified ? (
            <>
              <path d="M 48 62 L 32 60 M 48 70 L 32 74" stroke="#111111" strokeWidth="3" strokeLinecap="round" />
              <path d="M 108 62 L 124 60 M 108 70 L 124 74" stroke="#111111" strokeWidth="3" strokeLinecap="round" />
            </>
          ) : (
            <>
              <path d="M 50 62 L 36 60 M 50 66 L 34 68 M 50 70 L 36 76" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 106 62 L 120 60 M 106 66 L 122 68 M 106 70 L 120 76" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" />
            </>
          )}

          {/* Thought bubbles leading to question mark */}
          {isSimplified ? (
            <>
              <circle cx="120" cy="42" r="4" fill="#FFFFFF" stroke="#111111" strokeWidth="2" />
              <circle cx="134" cy="24" r="18" fill="#FFE14D" stroke="#111111" strokeWidth="3" />
              <text
                x="134"
                y="25"
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily="sans-serif"
                fontSize="24"
                fontWeight="900"
                fill="#111111"
              >
                ?
              </text>
            </>
          ) : (
            <>
              <circle cx="118" cy="46" r="3" fill="#FFFFFF" stroke="#111111" strokeWidth="2" />
              <circle cx="126" cy="36" r="4.5" fill="#FFFFFF" stroke="#111111" strokeWidth="2" />
              <circle cx="138" cy="22" r="14" fill="#FFE14D" stroke="#111111" strokeWidth="2.5" />
              <text
                x="138"
                y="23"
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily="sans-serif"
                fontSize="18"
                fontWeight="bold"
                fill="#111111"
              >
                ?
              </text>
            </>
          )}

          {/* Witch Hat */}
          <ellipse cx="78" cy="36" rx="42" ry="10" fill="#FF4F9A" {...strokeProps} />
          <path
            d="M 48 34 C 52 18 64 2 92 0 C 84 12 94 20 106 34 Z"
            fill="#FF4F9A"
            {...strokeProps}
          />
          <path
            d="M 50 33 C 62 28 92 28 104 33 L 103 37 C 91 32 63 32 51 37 Z"
            fill="#FFE14D"
            stroke="#111111"
            strokeWidth="2.5"
          />
        </g>
      )}

      {/* ----------------- POSE: CHEER ----------------- */}
      {pose === "cheer" && (
        <g>
          {/* Ground shadow (bare only) */}
          {!sticker && (
            <ellipse cx="80" cy="152" rx="36" ry="5" fill="#111111" opacity="0.8" />
          )}

          {/* Floating Sparkle Stars */}
          <path
            d="M 24 44 L 27 52 L 35 55 L 27 58 L 24 66 L 21 58 L 13 55 L 21 52 Z"
            fill="#FFE14D"
            stroke="#111111"
            strokeWidth={isSimplified ? "2.5" : "2"}
          />
          <path
            d="M 136 44 L 139 52 L 147 55 L 139 58 L 136 66 L 133 58 L 125 55 L 133 52 Z"
            fill="#FFE14D"
            stroke="#111111"
            strokeWidth={isSimplified ? "2.5" : "2"}
          />

          {/* Cat Body */}
          <path
            d="M 48 138 C 44 104 52 82 80 80 C 108 80 116 104 112 138 Z"
            fill="#A9D8F0"
            {...strokeProps}
          />

          {/* Both paws raised high */}
          <path
            d="M 52 92 C 40 76 34 58 38 46 C 44 44 50 50 48 60 C 46 72 58 84 66 92 Z"
            fill="#A9D8F0"
            {...strokeProps}
          />
          <circle cx="40" cy="48" r="6" fill="#FF4F9A" stroke="#111111" strokeWidth="2.5" />

          <path
            d="M 108 92 C 120 76 126 58 122 46 C 116 44 110 50 112 60 C 114 72 102 84 94 92 Z"
            fill="#A9D8F0"
            {...strokeProps}
          />
          <circle cx="120" cy="48" r="6" fill="#FF4F9A" stroke="#111111" strokeWidth="2.5" />

          {/* Head */}
          <ellipse cx="80" cy="58" rx="36" ry="28" fill="#A9D8F0" {...strokeProps} />

          {/* Ears */}
          <path d="M 52 42 L 42 16 L 64 32 Z" fill="#A9D8F0" {...strokeProps} />
          <path d="M 51 38 L 46 22 L 59 32 Z" fill="#FF4F9A" />
          <path d="M 108 42 L 118 16 L 96 32 Z" fill="#A9D8F0" {...strokeProps} />
          <path d="M 109 38 L 114 22 L 101 32 Z" fill="#FF4F9A" />

          {/* Happy closed eyes (^ ^) */}
          <path
            d="M 62 58 Q 70 50 78 58"
            fill="none"
            stroke="#111111"
            strokeWidth={isSimplified ? "4" : "3.5"}
            strokeLinecap="round"
          />
          <path
            d="M 82 58 Q 90 50 98 58"
            fill="none"
            stroke="#111111"
            strokeWidth={isSimplified ? "4" : "3.5"}
            strokeLinecap="round"
          />

          {/* Happy open mouth */}
          <path
            d="M 72 66 Q 80 82 88 66 Z"
            fill="#FF4F9A"
            stroke="#111111"
            strokeWidth={isSimplified ? "3" : "2.5"}
          />

          {/* Cheerful Blush */}
          <ellipse cx="56" cy="64" rx="5" ry="3" fill="#FFE14D" />
          <ellipse cx="104" cy="64" rx="5" ry="3" fill="#FFE14D" />

          {/* Whiskers */}
          {isSimplified ? (
            <>
              <path d="M 48 62 L 32 60 M 48 70 L 32 74" stroke="#111111" strokeWidth="3" strokeLinecap="round" />
              <path d="M 112 62 L 128 60 M 112 70 L 128 74" stroke="#111111" strokeWidth="3" strokeLinecap="round" />
            </>
          ) : (
            <>
              <path d="M 50 62 L 36 60 M 50 66 L 34 68 M 50 70 L 36 76" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 110 62 L 124 60 M 110 66 L 126 68 M 110 70 L 124 76" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" />
            </>
          )}

          {/* Witch Hat */}
          <ellipse cx="80" cy="34" rx="42" ry="10" fill="#FF4F9A" {...strokeProps} />
          <path
            d="M 50 32 C 54 16 66 0 94 0 C 86 12 96 20 108 32 Z"
            fill="#FF4F9A"
            {...strokeProps}
          />
          <path
            d="M 52 31 C 64 26 94 26 106 31 L 105 35 C 93 30 65 30 53 35 Z"
            fill="#FFE14D"
            stroke="#111111"
            strokeWidth="2.5"
          />
        </g>
      )}

      {/* ----------------- POSE: OOPS ----------------- */}
      {pose === "oops" && (
        <g>
          {/* Ground shadow (bare only) */}
          {!sticker && (
            <ellipse cx="80" cy="150" rx="44" ry="6" fill="#111111" opacity="0.9" />
          )}

          {/* Body */}
          <path
            d="M 48 142 C 46 112 52 88 66 80 C 76 76 86 76 96 80 C 110 88 116 112 114 142 Z"
            fill="#A9D8F0"
            {...strokeProps}
          />

          {/* Paw gently on chest */}
          <path
            d="M 88 118 C 96 110 96 98 84 92 C 78 96 78 104 82 112 Z"
            fill="#A9D8F0"
            {...strokeProps}
          />
          <ellipse cx="78" cy="94" rx="7" ry="6" fill="#A9D8F0" {...strokeProps} />

          {/* Other paw reassuringly outward */}
          <ellipse cx="106" cy="118" rx="8" ry="6" fill="#A9D8F0" {...strokeProps} />

          {/* Head */}
          <ellipse cx="76" cy="62" rx="35" ry="27" fill="#A9D8F0" {...strokeProps} />

          {/* Drooped sympathetic ears */}
          <path d="M 48 46 L 36 28 L 58 38 Z" fill="#A9D8F0" {...strokeProps} />
          <path d="M 47 43 L 40 31 L 54 38 Z" fill="#FF4F9A" />
          <path d="M 104 46 L 118 30 L 96 38 Z" fill="#A9D8F0" {...strokeProps} />
          <path d="M 104 43 L 113 33 L 99 38 Z" fill="#FF4F9A" />

          {/* Sympathetic round eyes */}
          <ellipse cx="66" cy="62" rx={isSimplified ? 5 : 4.5} ry={isSimplified ? 6 : 5.5} fill="#111111" />
          <circle cx="68" cy="60" r={isSimplified ? 2.2 : 1.8} fill="#FFFFFF" />
          <ellipse cx="90" cy="62" rx={isSimplified ? 5 : 4.5} ry={isSimplified ? 6 : 5.5} fill="#111111" />
          <circle cx="92" cy="60" r={isSimplified ? 2.2 : 1.8} fill="#FFFFFF" />

          {/* Sympathetic mouth */}
          <path
            d={isSimplified ? "M 73 73 Q 78 69 83 73" : "M 74 72 Q 78 70 82 72"}
            fill="none"
            stroke="#111111"
            strokeWidth={isSimplified ? "3.2" : "2.5"}
            strokeLinecap="round"
          />

          {/* Cheeks soft blush */}
          <ellipse cx="54" cy="66" rx="4.5" ry="2.5" fill="#FF4F9A" />
          <ellipse cx="100" cy="66" rx="4.5" ry="2.5" fill="#FF4F9A" />

          {/* Encouraging sparkle (standard only) */}
          {!isSimplified && (
            <path d="M 120 54 L 122 58 L 126 60 L 122 62 L 120 66 L 118 62 L 114 60 L 118 58 Z" fill="#FFE14D" stroke="#111111" strokeWidth="1.5" />
          )}

          {/* Whiskers */}
          {isSimplified ? (
            <>
              <path d="M 46 64 L 30 63 M 46 71 L 30 76" stroke="#111111" strokeWidth="3" strokeLinecap="round" />
              <path d="M 106 64 L 122 63 M 106 71 L 122 76" stroke="#111111" strokeWidth="3" strokeLinecap="round" />
            </>
          ) : (
            <>
              <path d="M 48 64 L 34 64 M 48 68 L 34 72 M 48 72 L 36 78" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 104 64 L 118 64 M 104 68 L 118 72 M 104 72 L 116 78" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" />
            </>
          )}

          {/* Witch Hat tilted sympathetically */}
          <g transform="rotate(-6 76 38)">
            <ellipse cx="76" cy="38" rx="42" ry="10" fill="#FF4F9A" {...strokeProps} />
            <path
              d="M 48 36 C 52 20 64 4 92 2 C 84 14 94 22 106 36 Z"
              fill="#FF4F9A"
              {...strokeProps}
            />
            <path
              d="M 50 35 C 62 30 92 30 104 35 L 103 39 C 91 34 63 34 51 39 Z"
              fill="#FFE14D"
              stroke="#111111"
              strokeWidth="2.5"
            />
          </g>
        </g>
      )}
    </svg>
  );
}

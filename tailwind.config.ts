import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{json,js,ts}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: "#111111",
        cream: "#FFF8DC",
        canvas: "#FFF8DC",
        yellow: {
          DEFAULT: "#FFE14D",
          bright: "#FFE14D",
          light: "#FFF199",
        },
        cyan: {
          DEFAULT: "#4DD9E8",
          bright: "#4DD9E8",
          light: "#B8F3FA",
        },
        pink: {
          DEFAULT: "#FF4F9A",
          bright: "#FF4F9A",
          light: "#FFB0D2",
        },
        green: {
          DEFAULT: "#8DE86A",
          bright: "#8DE86A",
          light: "#CCF7BC",
        },
        sky: {
          DEFAULT: "#A9D8F0",
          bright: "#A9D8F0",
          light: "#D8EFFB",
        },
        orange: {
          DEFAULT: "#FF8A3D",
          bright: "#FF8A3D",
          light: "#FFC299",
        },
        white: "#FFFFFF",
        // Semantic mappings
        background: "#FFF8DC",
        foreground: "#111111",
        muted: "#E5E0C8",
      },
      fontFamily: {
        heading: [
          "'Baloo 2'",
          "'Baloo Tammudu 2'",
          "sans-serif",
        ],
        sans: [
          "'Nunito'",
          "'Noto Sans Devanagari'",
          "'Noto Sans Telugu'",
          "sans-serif",
        ],
      },
      borderWidth: {
        "3": "3px",
      },
      boxShadow: {
        hard: "4px 4px 0px #111111",
        "hard-sm": "2px 2px 0px #111111",
        "hard-lg": "6px 6px 0px #111111",
      },
      borderRadius: {
        hand: "18px 14px 20px 15px / 15px 20px 14px 18px",
        pill: "9999px",
      },
    },
  },
  plugins: [],
};

export default config;

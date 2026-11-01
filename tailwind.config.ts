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
        grass: {
          DEFAULT: "#5DB84A",
          dark: "#3C8A2E",
          light: "#79CE67",
        },
        darkgrass: "#3C8A2E",
        dirt: {
          DEFAULT: "#8B5A2B",
          light: "#A57342",
        },
        stone: {
          DEFAULT: "#9AA0A6",
          light: "#B8BDC2",
          dark: "#7B8187",
        },
        sky: {
          DEFAULT: "#7EC8E3",
          light: "#A8DCEF",
          dark: "#5AA7C4",
        },
        sand: {
          DEFAULT: "#F2D16B",
          light: "#F7E298",
          dark: "#D4B34F",
        },
        red: {
          DEFAULT: "#D9453D",
          light: "#E4726C",
          dark: "#B8322B",
        },
        white: "#FFFFFF",

        // Palette mapping aliases to support existing component tokens
        cream: "#7EC8E3",
        canvas: "#7EC8E3",
        yellow: {
          DEFAULT: "#F2D16B",
          bright: "#F2D16B",
          light: "#F7E298",
        },
        cyan: {
          DEFAULT: "#7EC8E3",
          bright: "#7EC8E3",
          light: "#A8DCEF",
        },
        pink: {
          DEFAULT: "#D9453D",
          bright: "#D9453D",
          light: "#E4726C",
        },
        green: {
          DEFAULT: "#5DB84A",
          bright: "#5DB84A",
          light: "#79CE67",
        },
        orange: {
          DEFAULT: "#8B5A2B",
          bright: "#8B5A2B",
          light: "#A57342",
        },

        // Semantic mappings
        background: "#7EC8E3",
        foreground: "#111111",
        muted: "#9AA0A6",
      },
      fontFamily: {
        heading: [
          "'Press Start 2P'",
          "'Baloo 2'",
          "'Baloo Tammudu 2'",
          "monospace",
          "sans-serif",
        ],
        pixel: [
          "'Press Start 2P'",
          "monospace",
        ],
        sans: [
          "'Nunito'",
          "'Noto Sans Devanagari'",
          "'Noto Sans Telugu'",
          "sans-serif",
        ],
      },
      borderWidth: {
        DEFAULT: "1px",
        "0": "0px",
        "1": "1px",
        "2": "2px",
        "3": "4px",
        "4": "4px",
      },
      boxShadow: {
        hard: "4px 4px 0px #111111",
        "hard-sm": "2px 2px 0px #111111",
        "hard-lg": "6px 6px 0px #111111",
        pixel: "4px 4px 0px #111111",
        "pixel-sm": "2px 2px 0px #111111",
        "pixel-lg": "6px 6px 0px #111111",
        "pixel-pressed": "0px 0px 0px #111111",
      },
      borderRadius: {
        DEFAULT: "0px",
        none: "0px",
        sm: "0px",
        md: "0px",
        lg: "0px",
        xl: "0px",
        "2xl": "0px",
        "3xl": "0px",
        full: "0px",
        hand: "0px",
        pill: "0px",
      },
    },
  },
  plugins: [],
};

export default config;

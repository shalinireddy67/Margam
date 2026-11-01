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
        charcoal: "#20251F",
        darkgreen: "#102610",
        forest: {
          DEFAULT: "#173B19",
          dark: "#0F2610",
          light: "#214E23",
        },
        grass: {
          DEFAULT: "#4F8A24",
          dark: "#3C6C1B",
          light: "#6BB034",
        },
        pixelgreen: {
          DEFAULT: "#79B82A",
          dark: "#5E931E",
          light: "#95D83C",
        },
        mutedgreen: {
          DEFAULT: "#315B2A",
          dark: "#23421E",
          light: "#43793A",
        },
        warmwhite: "#F2F0DF",
        lightgrey: "#D8D8D0",
        gold: {
          DEFAULT: "#E5B834",
          light: "#F2D16B",
          dark: "#B88E1F",
        },
        darkgrass: "#3C6C1B",
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
          DEFAULT: "#4F8A24",
          light: "#79B82A",
          dark: "#173B19",
        },
        sand: {
          DEFAULT: "#E5B834",
          light: "#F2D16B",
          dark: "#B88E1F",
        },
        red: {
          DEFAULT: "#D9453D",
          light: "#E4726C",
          dark: "#B8322B",
        },
        white: "#FFFFFF",

        // Palette mapping aliases to support existing component tokens
        cream: "#F2F0DF",
        canvas: "#102610",
        yellow: {
          DEFAULT: "#E5B834",
          bright: "#F2D16B",
          light: "#F7E298",
        },
        cyan: {
          DEFAULT: "#79B82A",
          bright: "#79B82A",
          light: "#95D83C",
        },
        pink: {
          DEFAULT: "#D9453D",
          bright: "#D9453D",
          light: "#E4726C",
        },
        green: {
          DEFAULT: "#4F8A24",
          bright: "#79B82A",
          light: "#6BB034",
        },
        orange: {
          DEFAULT: "#E5B834",
          bright: "#F2D16B",
          light: "#F7E298",
        },

        // Semantic mappings
        background: "#102610",
        foreground: "#F2F0DF",
        muted: "#D8D8D0",
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
        hard: "4px 4px 0px #102610",
        "hard-sm": "2px 2px 0px #102610",
        "hard-lg": "6px 6px 0px #102610",
        pixel: "4px 4px 0px #102610",
        "pixel-sm": "2px 2px 0px #102610",
        "pixel-lg": "6px 6px 0px #102610",
        "pixel-pressed": "0px 0px 0px #102610",
        block: "4px 4px 0px #20251F",
        "block-sm": "2px 2px 0px #20251F",
        "block-lg": "6px 6px 0px #20251F",
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

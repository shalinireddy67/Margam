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
    screens: {
      xs: "360px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        // Block-World Palette (Phase 2 Official Tokens)
        ink: "#1E1610",
        plank: "#D9B87A",
        plankLight: "#E8CF9C",
        stone: "#B9BCC0",
        stoneDark: "#6B6F76",
        night: "#232634",
        parchment: "#F3E3BC",
        grass: "#6DB33F",
        grassTop: "#8CCB55",
        dirt: "#8B5A2B",
        dirtDark: "#5A3720",
        sky: "#78BDE8",
        gold: "#F2C230",
        redstone: "#D1362B",
        diamond: "#4EDBD3",
        emerald: "#17B862",
        lapis: "#2F4FB5",

        // Palette Aliases for seamless migration
        cream: {
          DEFAULT: "#D9B87A",
          light: "#E8CF9C",
          dark: "#B9BCC0",
        },
        sand: {
          DEFAULT: "#E8CF9C",
          light: "#F3E3BC",
          dark: "#D9B87A",
        },
        wood: {
          DEFAULT: "#8B5A2B",
          dark: "#5A3720",
          light: "#D9B87A",
        },
        charcoal: "#1E1610",
        background: "transparent",
        foreground: "#1E1610",
        muted: "#B9BCC0",
      },
      fontFamily: {
        heading: [
          "'Baloo 2'",
          "'Baloo Tammudu 2'",
          "sans-serif",
        ],
        pixel: [
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
        DEFAULT: "1px",
        "0": "0px",
        "1": "1px",
        "2": "2px",
        "3": "3px",
        "4": "4px",
      },
      boxShadow: {
        hard: "3px 3px 0px #1E1610",
        "hard-sm": "2px 2px 0px #1E1610",
        "hard-lg": "4px 4px 0px #1E1610",
        "hard-xl": "6px 6px 0px #1E1610",
        block: "3px 3px 0px #1E1610",
        "block-sm": "2px 2px 0px #1E1610",
        "block-lg": "4px 4px 0px #1E1610",
        pixel: "3px 3px 0px #1E1610",
        "pixel-sm": "2px 2px 0px #1E1610",
        "pixel-lg": "4px 4px 0px #1E1610",
        "pixel-pressed": "0px 0px 0px #1E1610",
        voxel: "inset 2px 2px 0px rgba(243,227,188,0.4), inset -2px -2px 0px rgba(30,22,16,0.4), 3px 3px 0px #1E1610",
        "voxel-pressed": "inset 2px 2px 0px rgba(30,22,16,0.5), inset -2px -2px 0px rgba(243,227,188,0.3)",
      },
      borderRadius: {
        DEFAULT: "0px",
        none: "0px",
        xs: "2px",
        sm: "2px",
        md: "2px",
        lg: "4px",
        xl: "4px",
        "2xl": "4px",
        "3xl": "4px",
        full: "4px",
        hand: "2px",
        pill: "4px",
      },
    },
  },
  plugins: [],
};

export default config;

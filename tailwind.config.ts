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
        // Blocky Voxel World Design Tokens
        ink: "#2B1B0F",
        charcoal: "#20251F",
        
        // Sky (day blue to sunset orange-pink)
        sky: {
          DEFAULT: "#6EB5FF",
          blue: "#6EB5FF",
          sunset: "#FFB36B",
          pink: "#FF8FA3",
          light: "#A4D2FF",
          dark: "#1E6F8C",
        },
        sunglow: {
          DEFAULT: "#FFE9A8",
          light: "#FFF4D1",
          dark: "#F4C542",
        },

        // Grass Accent (Buttons, success, progress only)
        grass: {
          DEFAULT: "#5DAA3A",
          dark: "#2F6B22",
          light: "#7BC458",
        },

        // Dirt & Wood (Cards, panels, borders)
        dirt: {
          DEFAULT: "#7A4B2A",
          dark: "#422816",
          light: "#A06A3C",
          bedrock: "#1B120C",
        },
        wood: {
          DEFAULT: "#A06A3C",
          dark: "#5A3720",
          light: "#C68B59",
        },

        // Stone & Redstone Accents
        stone: {
          DEFAULT: "#6B7280",
          dark: "#374151",
          light: "#9CA3AF",
        },
        redstone: {
          DEFAULT: "#E04A3F",
          dark: "#991B1B",
          light: "#F87171",
        },
        diamond: {
          DEFAULT: "#3FA7C9",
          dark: "#1E6F8C",
          light: "#6ED3F5",
        },
        gold: {
          DEFAULT: "#F4C542",
          dark: "#B88E14",
          light: "#FFE9A8",
        },
        iron: {
          DEFAULT: "#D8D8D8",
          dark: "#8B8B8B",
          light: "#F0F0F0",
        },

        // UI Neutral Backgrounds
        cream: {
          DEFAULT: "#FFF7E6",
          dark: "#E5D7BE",
          light: "#FFFDF7",
        },
        sand: {
          DEFAULT: "#FFE9A8",
          light: "#FFF4D1",
          dark: "#F4C542",
        },

        // Semantic mappings: Cream background, Ink foreground
        background: "#FFF7E6",
        foreground: "#2B1B0F",
        muted: "#D9D9D9",
      },
      fontFamily: {
        heading: [
          "'Baloo 2'",
          "'Baloo Tammudu 2'",
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
        "3": "3px",
        "4": "4px",
      },
      boxShadow: {
        hard: "4px 4px 0px rgba(0, 0, 0, 0.35)",
        "hard-sm": "2px 2px 0px rgba(0, 0, 0, 0.35)",
        "hard-lg": "6px 6px 0px rgba(0, 0, 0, 0.35)",
        pixel: "4px 4px 0px rgba(0, 0, 0, 0.35)",
        "pixel-sm": "2px 2px 0px rgba(0, 0, 0, 0.35)",
        "pixel-lg": "6px 6px 0px rgba(0, 0, 0, 0.35)",
        "pixel-pressed": "0px 0px 0px rgba(0, 0, 0, 0.35)",
        block: "4px 4px 0px #2B1B0F",
        "block-sm": "2px 2px 0px #2B1B0F",
        "block-lg": "6px 6px 0px #2B1B0F",
        voxel: "inset 2px 2px 0px rgba(255,255,255,0.35), inset -2px -2px 0px rgba(0,0,0,0.35), 4px 4px 0px rgba(0,0,0,0.35)",
        "voxel-pressed": "inset 2px 2px 0px rgba(0,0,0,0.45), inset -2px -2px 0px rgba(255,255,255,0.2)",
      },
      borderRadius: {
        DEFAULT: "0px",
        none: "0px",
        sm: "2px",
        md: "2px",
        lg: "2px",
        xl: "2px",
        "2xl": "2px",
        "3xl": "2px",
        full: "2px",
        hand: "2px",
        pill: "2px",
      },
    },
  },
  plugins: [],
};

export default config;

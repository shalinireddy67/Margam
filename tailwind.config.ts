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
          dark: "#5A3720",
          light: "#A06A3C",
          border: "#422816",
        },
        wood: {
          DEFAULT: "#7A4B2A",
          dark: "#5A3720",
          light: "#A06A3C",
        },

        // Stone (Neutral surfaces, disabled)
        stone: {
          DEFAULT: "#8B8B8B",
          dark: "#5E5E5E",
          light: "#D9D9D9",
          border: "#3F3F3F",
        },

        // Water (Info, links, graph edges)
        water: {
          DEFAULT: "#3FA7C9",
          dark: "#1E6F8C",
          light: "#62C4E3",
        },

        // Flower Accents
        flower: {
          red: "#E04A3F",
          yellow: "#F4C542",
          purple: "#B070C9",
          white: "#FFFFFF",
        },

        // Typography Colors
        voxel: {
          textLight: "#2B1B0F",
          textDark: "#FFF7E6",
          panelLight: "#FFF7E6",
          panelDark: "#5A3720",
          panelWood: "#7A4B2A",
          panelStone: "#8B8B8B",
          bevelLight: "rgba(255, 255, 255, 0.4)",
          bevelDark: "rgba(0, 0, 0, 0.45)",
        },

        // Backwards compatibility aliases mapped to new voxel tokens
        forest: {
          DEFAULT: "#2F6B22",
          dark: "#1C4514",
          light: "#5DAA3A",
        },
        darkgreen: "#2F6B22",
        pixelgreen: {
          DEFAULT: "#5DAA3A",
          dark: "#2F6B22",
          light: "#7BC458",
        },
        mutedgreen: {
          DEFAULT: "#2F6B22",
          dark: "#1C4514",
          light: "#5DAA3A",
        },
        darkgrass: "#2F6B22",
        warmwhite: "#FFF7E6",
        lightgrey: "#D9D9D9",
        cream: "#FFF7E6",
        canvas: "#5A3720",
        white: "#FFFFFF",

        gold: {
          DEFAULT: "#F4C542",
          light: "#FFE9A8",
          dark: "#C6961E",
        },
        yellow: {
          DEFAULT: "#F4C542",
          bright: "#F4C542",
          light: "#FFE9A8",
        },
        cyan: {
          DEFAULT: "#3FA7C9",
          bright: "#3FA7C9",
          light: "#62C4E3",
        },
        pink: {
          DEFAULT: "#FF8FA3",
          bright: "#FF8FA3",
          light: "#FFB36B",
        },
        red: {
          DEFAULT: "#E04A3F",
          light: "#FF756B",
          dark: "#A32B22",
        },
        green: {
          DEFAULT: "#5DAA3A",
          bright: "#7BC458",
          light: "#7BC458",
        },
        orange: {
          DEFAULT: "#FFB36B",
          bright: "#FFB36B",
          light: "#FFE9A8",
        },
        sand: {
          DEFAULT: "#FFE9A8",
          light: "#FFF4D1",
          dark: "#F4C542",
        },

        // Semantic mappings
        background: "#5A3720",
        foreground: "#FFF7E6",
        muted: "#D9D9D9",
      },
      fontFamily: {
        heading: [
          "'Nunito'",
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

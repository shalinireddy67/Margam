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
        margam: {
          cream: "#FAF8F5",
          "cream-paper": "#F4EFEA",
          "cream-subtle": "#EDE7DF",
          border: "#DED6CA",
          "border-dark": "#364152",
          navy: "#0B192C",
          "navy-card": "#132238",
          "navy-muted": "#3D4F66",
          terracotta: "#C2410C",
          "terracotta-hover": "#9A3412",
          amber: "#D97706",
          "amber-light": "#FEF3C7",
          emerald: "#047857",
          "emerald-light": "#D1FAE5",
          "emerald-dark": "#064E3B",
          slate: "#475569",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Roboto",
          "sans-serif",
        ],
        serif: [
          "var(--font-serif)",
          "Georgia",
          "Cambria",
          "'Times New Roman'",
          "serif",
        ],
        mono: [
          "var(--font-mono)",
          "'Courier New'",
          "monospace",
        ],
      },
      boxShadow: {
        warm: "0 2px 8px -2px rgba(11, 25, 44, 0.06), 0 4px 16px -2px rgba(11, 25, 44, 0.08)",
        card: "0 4px 20px -4px rgba(11, 25, 44, 0.08), 0 1px 3px rgba(11, 25, 44, 0.05)",
        highlight: "0 0 0 2px #C2410C",
      },
    },
  },
  plugins: [],
};

export default config;

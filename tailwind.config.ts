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
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
          subtle: "var(--card-subtle)",
        },
        sidebar: {
          DEFAULT: "#140513",
          foreground: "#FFFFFF",
          muted: "#8A94A6",
          active: "#AC427C",
        },
        plum: {
          DEFAULT: "#140513",
          light: "#2B142A",
        },
        berry: {
          DEFAULT: "#AC427C",
          hover: "#8E3264",
          light: "#FDF0F6",
          border: "#E8BBD5",
        },
        peach: {
          DEFAULT: "#EAA291",
          hover: "#D98E7D",
          light: "#FDF5F3",
          border: "#F5CECA",
        },
        warmBrown: {
          DEFAULT: "#B07040",
          light: "#FAF1EA",
        },
        grey: {
          DEFAULT: "#646464",
          light: "#F5F5F5",
          border: "#E0E0E0",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        border: "var(--border)",
        ring: "var(--ring)",
      },
      fontFamily: {
        sans: [
          "var(--font-outfit)",
          "var(--font-nunito)",
          "var(--font-devanagari)",
          "var(--font-telugu)",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Roboto",
          "sans-serif",
        ],
        heading: [
          "var(--font-outfit)",
          "var(--font-devanagari)",
          "var(--font-telugu)",
          "system-ui",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      boxShadow: {
        soft: "0 8px 30px rgba(23, 28, 38, 0.04)",
        card: "0 4px 20px -2px rgba(23, 28, 38, 0.05)",
        floating: "0 12px 36px -4px rgba(211, 62, 26, 0.15)",
      },
      borderRadius: {
        "3xl": "24px",
        "4xl": "32px",
      },
    },
  },
  plugins: [],
};

export default config;

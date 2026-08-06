import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1E293B", // Slate 800
        secondary: "#334155", // Slate 700
        cta: "#22C55E", // Green 500
        background: "#0F172A", // Slate 900
        foreground: "#F8FAFC", // Slate 50
        accent: {
          light: "#4ADE80", // Green 400
          DEFAULT: "#22C55E", // Green 500
          dark: "#16A34A", // Green 600
        },
        card: {
          DEFAULT: "rgba(255, 255, 255, 0.03)",
          hover: "rgba(255, 255, 255, 0.06)",
        }
      },
      boxShadow: {
        'premium': '0 20px 50px -12px rgba(0, 0, 0, 0.5)',
        'glow': '0 0 30px -5px var(--tw-shadow-color)',
        'glass': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.05)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '3rem',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        dark: {
          "primary": "#1E293B",
          "secondary": "#334155",
          "accent": "#22C55E",
          "neutral": "#334155",
          "base-100": "#0F172A",
          "info": "#3b82f6",
          "success": "#22C55E",
          "warning": "#eab308",
          "error": "#ef4444",
        },
      },
    ],
  },
};

export default config;


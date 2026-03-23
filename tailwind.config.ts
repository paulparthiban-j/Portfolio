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
        primary: "#6366f1", // Indigo
        background: "#0a0a0b",
        foreground: "#f8fafc",
        accent: {
          light: "#818cf8",
          DEFAULT: "#6366f1",
          dark: "#4f46e5",
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
          "primary": "#6366f1",
          "secondary": "#a855f7",
          "accent": "#f472b6",
          "neutral": "#1e293b",
          "base-100": "#0a0a0b",
          "info": "#3b82f6",
          "success": "#22c55e",
          "warning": "#eab308",
          "error": "#ef4444",
        },
      },
    ],
  },
};

export default config;


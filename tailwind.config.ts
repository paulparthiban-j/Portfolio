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
        primary: "#8b5cf6", // Purple
        secondary: "#3b82f6", // Blue
        accent: "#6366f1", // Indigo (purple-blue mix)
        neutral: "#000000", // Black
        base: "#ffffff", // White
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        custom: {
          primary: "#8b5cf6", // Purple
          secondary: "#3b82f6", // Blue
          accent: "#6366f1", // Indigo
          neutral: "#000000", // Black
          "base-100": "#ffffff", // White
          "base-200": "#f3f4f6", // Light gray
          "base-300": "#e5e7eb", // Gray
          info: "#3b82f6", // Blue
          success: "#10b981",
          warning: "#f59e0b",
          error: "#ef4444",
        },
      },
    ],
  },
};

export default config;


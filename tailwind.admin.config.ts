import type { Config } from "tailwindcss";
import baseConfig from "./tailwind.config";

// Admin-only Tailwind build: adds DaisyUI (buttons, loaders, toggles used by
// the admin screens) on top of the site's theme. Loaded via app/admin/admin.css
// so public visitors never download it.
const config: Config = {
  ...baseConfig,
  content: ["./app/admin/**/*.{js,ts,jsx,tsx,mdx}"],
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        dark: {
          "primary": "#1E293B",
          "secondary": "#334155",
          "accent": "#8B5CF6",
          "neutral": "#334155",
          "base-100": "#0F172A",
          "info": "#3b82f6",
          "success": "#8B5CF6",
          "warning": "#eab308",
          "error": "#ef4444",
        },
      },
    ],
  },
};

export default config;

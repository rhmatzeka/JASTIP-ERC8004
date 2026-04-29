import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        body: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Times New Roman", "ui-serif", "Georgia", "serif"]
      },
      colors: {
        ink: "#e8e8ed",
        muted: "#888",
        accent: "#d4ff00",
        accentMuted: "#e0ff40",
        success: "#22c55e",
        warn: "#f59e0b",
        danger: "#ef4444",
        surface: "#000000",
        surfaceRaised: "#080808",
        surfaceOverlay: "#0a0a0a",
        border: "rgba(255, 255, 255, 0.05)",
        borderHover: "rgba(255, 255, 255, 0.12)",
        /* backward compat */
        ocean: "#d4ff00",
        saffron: "#e0ff40",
        mint: "#22c55e",
        coral: "#ef4444",
        cloud: "#000000",
        line: "#111111"
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "20px"
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        }
      },
      animation: {
        fadeIn: "fadeIn 0.4s ease-out forwards",
        slideUp: "slideUp 0.5s ease-out forwards",
        shimmer: "shimmer 2s linear infinite",
        float: "none",
        floatDelayed: "none",
        pulseGlow: "none",
        gradientXY: "none"
      }
    }
  },
  plugins: []
};

export default config;

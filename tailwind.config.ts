import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#f0f0f5",
        muted: "#71717a",
        accent: "#6366f1",
        accentMuted: "#818cf8",
        success: "#22c55e",
        warn: "#f59e0b",
        danger: "#ef4444",
        surface: "#0c0c10",
        surfaceRaised: "#141419",
        surfaceOverlay: "#1c1c24",
        border: "rgba(255, 255, 255, 0.06)",
        borderHover: "rgba(255, 255, 255, 0.12)",
        /* keep old color names mapped for backward compat during migration */
        ocean: "#6366f1",
        saffron: "#a78bfa",
        mint: "#22c55e",
        coral: "#ef4444",
        cloud: "#0c0c10",
        line: "#1c1c24"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"]
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "20px"
      },
      boxShadow: {
        soft: "0 1px 2px rgba(0,0,0,0.3), 0 4px 16px rgba(0,0,0,0.2)",
        card: "0 2px 8px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.03)",
        elevated: "0 8px 32px rgba(0,0,0,0.4)",
        button: "0 1px 3px rgba(0,0,0,0.3)",
        glow: "0 0 0 transparent",
        glowSaffron: "0 0 0 transparent"
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
        /* remove old flashy animations */
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

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
        ink: "#17202a",
        muted: "#657485",
        ocean: "#1d6fd9",
        mint: "#10a37f",
        saffron: "#f59e0b",
        coral: "#f9735b",
        cloud: "#f4f8f6",
        line: "#dbe6e1"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(23, 32, 42, 0.08)",
        button: "0 10px 24px rgba(23, 32, 42, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;

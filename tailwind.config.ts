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
        ink: "#102033",
        muted: "#5c6b7a",
        ocean: "#1268db",
        mint: "#10b981",
        cloud: "#f5f8fb",
        line: "#dde7ef"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(16, 32, 51, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;

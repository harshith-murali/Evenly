import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#171717",
        paper: "#f6f3ee",
        cloud: "#fbfaf7",
        line: "#e7e0d6",
        mint: "#cfeedd",
        sky: "#cfe8ff",
        butter: "#f9e7a8",
        rose: "#f8cfd8",
        peach: "#f7d0b5"
      },
      boxShadow: {
        soft: "0 24px 80px rgba(55, 45, 35, 0.08)",
        lift: "0 18px 44px rgba(42, 35, 28, 0.12)"
      },
      borderRadius: {
        soft: "1.5rem",
        pill: "999px"
      }
    }
  },
  plugins: []
};

export default config;

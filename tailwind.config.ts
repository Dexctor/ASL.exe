import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "neon-cyan": "#2dfaff",
        "neon-pink": "#ff5edb",
        "neon-lime": "#b7ff2a",
        "neon-blue": "#4c6bff",
        "deep-space": "#05070c",
        "midnight": "#0b1220",
      },
      boxShadow: {
        neon: "0 0 12px rgba(45, 250, 255, 0.55), 0 0 30px rgba(45, 250, 255, 0.25)",
        "neon-pink":
          "0 0 12px rgba(255, 94, 219, 0.55), 0 0 30px rgba(255, 94, 219, 0.25)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.65" },
          "50%": { opacity: "1" },
        },
        sweep: {
          "0%": { transform: "translateX(-120%)" },
          "100%": { transform: "translateX(120%)" },
        },
      },
      animation: {
        shimmer: "shimmer 3s linear infinite",
        pulseGlow: "pulseGlow 2.6s ease-in-out infinite",
        sweep: "sweep 2.8s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;

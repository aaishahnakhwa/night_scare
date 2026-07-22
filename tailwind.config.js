/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        horror: {
          black: "#050505",
          red: "#991b1b",
          darkred: "#450a0a",
          grey: "#1c1917",
          lightgrey: "#78716c",
        }
      },
      fontFamily: {
        horror: ["Creepster", "cursive"],
        cinzel: ["Cinzel Decorative", "serif"],
        special: ["Special Elite", "monospace"],
        sans: ["Inter", "sans-serif"],
      },
      animation: {
        flicker: "flicker 0.15s infinite alternate",
        glitch: "glitch 1s linear infinite",
        pulseFast: "pulse 0.6s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        heartbeat: "heartbeat 1s infinite",
        vignettePulse: "vignettePulse 4s infinite ease-in-out",
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: 1 },
          "30%, 70%": { opacity: 0.9 },
          "35%": { opacity: 0.3 },
          "40%": { opacity: 0.8 },
          "45%": { opacity: 0.2 },
          "50%": { opacity: 0.9 },
          "80%": { opacity: 0.4 },
          "85%": { opacity: 0.9 },
        },
        glitch: {
          "0%": { transform: "translate(0)" },
          "20%": { transform: "translate(-2px, 2px)" },
          "40%": { transform: "translate(-2px, -2px)" },
          "60%": { transform: "translate(2px, 2px)" },
          "80%": { transform: "translate(2px, -2px)" },
          "100%": { transform: "translate(0)" },
        },
        heartbeat: {
          "0%, 100%": { transform: "scale(1)" },
          "25%": { transform: "scale(1.1)" },
          "35%": { transform: "scale(1.05)" },
          "45%": { transform: "scale(1.15)" },
        },
        vignettePulse: {
          "0%, 100%": { opacity: 0.75 },
          "50%": { opacity: 0.95 },
        }
      }
    },
  },
  plugins: [],
}

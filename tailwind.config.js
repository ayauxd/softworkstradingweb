/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      // All theme extensions go here
      colors: {
        border: "hsl(var(--border, 214 32% 91%))",
        navy: {
          DEFAULT: "#0A2A43",
          light: "#0F3A59",
          dark: "#071E30",
        },
        cyan: {
          DEFAULT: "#00BCD4",
          light: "#33C9DB",
          dark: "#00A5BB",
        },
        "soft-white": "#F9FAFC",
        "neutral-gray": "#4A5568",
      },
      animation: {
        "pulse-slow": "pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-glow": "pulse-glow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography")
  ],
}
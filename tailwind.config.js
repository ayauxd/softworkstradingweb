/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      // All theme extensions go here
      colors: {
        background: "#FFFFFF",
        foreground: "#1A1A1A",
        border: "hsl(var(--border, 214 32% 91%))",
        navy: {
          DEFAULT: "#0A2A43",
          light: "#0F3A59",
          dark: "#071E30",
        },
        cyan: {
          DEFAULT: "#00A5BB", // Darkened for better contrast with white backgrounds
          light: "#00C3DD", // Brightened for better contrast in dark mode
          dark: "#008A9B", // Deepened for emphasis
        },
        "soft-white": "#F9FAFC",
        "neutral-gray": "#3D4A5C", // Darkened for better contrast on light backgrounds
        "gray": {
          400: "#6B7A90", // Darkened for better contrast
          500: "#556275", // Darkened for better contrast
        },
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
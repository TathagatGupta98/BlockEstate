import type { Config } from "tailwindcss";

export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        blood: "#2A0E12",      // Primary base
        oxblood: "#3B1418",    // Hero / identity
        merlot: "#4A1C22",     // Secondary surface
        taupe: "#6B5E54",      // Borders / muted text
        cream: "#D4CCBF",      // Primary text
        gold: "#B3956B"        // Accent (rare)
      },
      borderRadius: {
        DEFAULT: "4px"
      },
      transitionProperty: {
        DEFAULT: "color, background-color, border-color, opacity"
      },
      transitionDuration: {
        DEFAULT: "200ms"
      },
      fontSize: {
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem"
      }
    }
  },
  plugins: []
} satisfies Config;

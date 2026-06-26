const { heroui } = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Brass / gold gallery-plaque accent ramp (replaces the old purple "brand" ramp)
        brand: {
          50: "#fbf6e9",
          100: "#f5eac9",
          200: "#e9d48f",
          300: "#dcbe5e",
          400: "#cfa73b",
          500: "#c9a227",
          600: "#a8861e",
          700: "#826615",
          800: "#5c480e",
          900: "#382b08",
        },
        // Secondary accent: a deep clay/terracotta, used sparingly (sold tags, category chips)
        clay: {
          50: "#fbeee9",
          400: "#b9624a",
          500: "#9c4c36",
          600: "#7e3b2a",
        },
        ink: "#17140f",
        paper: "#f6f1e6",
        cream: "#f6f1e6",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "ui-serif", "Georgia", "serif"],
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: "#17140f",
              50: "#f6f1e6",
              500: "#3a352c",
              900: "#17140f",
            },
            secondary: {
              DEFAULT: "#c9a227",
              50: "#fbf6e9",
              100: "#f5eac9",
              200: "#e9d48f",
              300: "#dcbe5e",
              400: "#cfa73b",
              500: "#c9a227",
              600: "#a8861e",
              700: "#826615",
              800: "#5c480e",
              900: "#382b08",
            },
          },
        },
      },
    }),
  ],
};

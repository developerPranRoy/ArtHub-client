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
        brand: {
          50: "#fdf4ff",
          100: "#fae8ff",
          200: "#f3c9ff",
          300: "#e89bff",
          400: "#d75fff",
          500: "#b829e8",
          600: "#9518c0",
          700: "#75139a",
          800: "#58107a",
          900: "#3d0b56",
        },
        ink: "#161221",
        cream: "#fffaf2",
      },
      fontFamily: {
        display: ["ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: "#9518c0",
              50: "#fdf4ff",
              100: "#fae8ff",
              200: "#f3c9ff",
              300: "#e89bff",
              400: "#d75fff",
              500: "#b829e8",
              600: "#9518c0",
              700: "#75139a",
              800: "#58107a",
              900: "#3d0b56",
            },
          },
        },
      },
    }),
  ],
};

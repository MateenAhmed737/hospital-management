/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: "Poppins",
        mont: "Montserrat",
        emoji: "Noto Color Emoji",
      },
      colors: {
        "primary-100": "#ca9fe5",
        "primary-200": "#c18fe0",
        "primary-300": "#b97fdc",
        "primary-400": "#b06fd7",
        "primary-500": "#a75fd3",
        "primary-600": "#9656be",
        "primary-700": "#864ca9",
        "primary-800": "#754394",
        "primary-900": "#64397f",
        "primary-950": "#54306a",
      },
      screens: {
        xs: "480px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
    },
  },
  plugins: [],
};

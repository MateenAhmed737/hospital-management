/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: "Poppins",
        mont: "Montserrat",
        emoji: "Noto Color Emoji",
      },
      colors: {
        "primary-100": "#dea5c2",
        "primary-200": "#d792b5",
        "primary-300": "#d080a9",
        "primary-400": "#c96e9d",
        "primary-500": "#c35c90",
        "primary-600": "#bc4a84",
        "primary-700": "#a94377",
        "primary-800": "#963b6a",
        "primary-900": "#84345c",
        "primary-950": "#712c4f",
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

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}",
  ],
  theme: {
    extend: {
      colors: {
        'dnd-red': '#8b0000',
        'parchment': '#fdf6e3',
      },
      fontFamily: {
        'libre': ['"Libre Baskerville"', 'serif'],
        'metamorphous': ['"Metamorphous"', 'cursive'],
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // atau 'media' kalau ingin otomatis

  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

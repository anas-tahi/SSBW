/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        prado: {
          red: '#c8102e',
          dark: '#1a1a1a',
          gray: '#f5f5f5',
          light: '#ffffff',
        }
      }
    },
  },
  plugins: [],
}

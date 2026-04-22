/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          400: '#d4af37',
          500: '#c9a84c',
          600: '#b8941d',
        },
        dark: {
          900: '#0a0a0f',
          800: '#1a1a2e',
          700: '#16213e',
        }
      }
    },
  },
  plugins: [],
}

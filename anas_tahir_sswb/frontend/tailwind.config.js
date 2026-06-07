/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // As shown in Tarea 9: font-montserrat class
        montserrat: ['Montserrat', 'sans-serif'],
        garamond: ['EB Garamond', 'serif'],
      },
      colors: {
        'prado-red': '#C41E3A',
        'prado-dark': '#1a1a1a',
        'prado-light': '#f5f5f5',
      },
    },
  },
  plugins: [],
}

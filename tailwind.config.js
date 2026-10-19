/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        beehiiv: {
          orange: '#FF5A36',
          yellow: '#FFDE43',
          purple: '#795290',
          dark: '#0A0A0B',
          card: '#141416',
          border: '#26262B',
          gray: '#8C8D94',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

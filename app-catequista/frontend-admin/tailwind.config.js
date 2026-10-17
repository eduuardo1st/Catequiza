/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parish: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc5fb',
          400: '#38a5f6',
          500: '#0e86e5',
          600: '#026ac5',
          700: '#03549f',
          800: '#074883',
          900: '#0c3c6d',
          950: '#082649',
        },
      },
      fontFamily: {
        heading: ['Montserrat', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 20px -2px rgba(12, 60, 109, 0.08), 0 2px 6px -1px rgba(12, 60, 109, 0.04)',
        glow: '0 0 25px rgba(14, 134, 229, 0.25)',
      }
    },
  },
  plugins: [],
}

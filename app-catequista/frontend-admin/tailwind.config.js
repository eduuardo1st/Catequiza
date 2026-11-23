/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        carmel: {
          50: '#FAF6EE',
          100: '#F3EBD9',
          200: '#E5DAC8',
          300: '#D2C1A9',
          400: '#8F755C',
          500: '#785C45',
          600: '#6D4B34',
          700: '#5A3621',
          800: '#4A2916',
          900: '#3B2112',
          950: '#26150B',
        },
        gold: {
          50: '#FCF9F2',
          100: '#F6EEDB',
          200: '#EAD9B4',
          300: '#D9BE87',
          400: '#C5A56B',
          500: '#AF915D',
          600: '#92733F',
          700: '#75592C',
          800: '#5A431F',
          900: '#3E2D13',
        },
        parish: {
          50: '#FAF6EE',
          100: '#F3EBD9',
          200: '#E5DAC8',
          300: '#D9BE87',
          400: '#AF915D',
          500: '#75592C',
          600: '#4A2916',
          700: '#3B2112',
          800: '#331C0F',
          900: '#2A170C',
          950: '#1F1008',
        },
      },
      fontFamily: {
        heading: ['Marcellus', 'Georgia', 'serif'],
        sans: ['"Source Sans 3"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        card: '0 2px 10px -2px rgba(59, 33, 18, 0.06), 0 1px 3px 0 rgba(59, 33, 18, 0.04)',
        'card-hover': '0 10px 24px -6px rgba(59, 33, 18, 0.12), 0 4px 8px -2px rgba(59, 33, 18, 0.05)',
        modal: '0 24px 48px -12px rgba(38, 21, 11, 0.28)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}

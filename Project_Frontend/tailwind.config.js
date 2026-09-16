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
        academic: {
          50: '#f4f6fb',
          100: '#e8edf6',
          200: '#cbd7eb',
          300: '#9eb7dc',
          400: '#6b92c9',
          500: '#4773b4',
          600: '#345998',
          700: '#2a477b',
          800: '#253c65',
          900: '#1b2a47',
          950: '#0f172a',
        },
        bharat: {
          saffron: '#FF671F',
          navy: '#06038D',
          green: '#046A38',
          gold: '#D97706',
          teal: '#0D9488',
          indigo: '#4F46E5',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
        mono: ['Fira Code', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'glow': '0 0 25px -5px rgba(79, 70, 229, 0.25)',
        'glow-saffron': '0 0 25px -5px rgba(255, 103, 31, 0.25)',
      }
    },
  },
  plugins: [],
}

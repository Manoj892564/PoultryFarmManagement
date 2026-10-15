/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src_react/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          900: '#0f291e',
          800: '#1b4332',
          700: '#2d6a4f',
          600: '#40916c',
          500: '#52b788',
          400: '#74c69d',
          300: '#95d5b2',
          200: '#b7e4c7',
          100: '#d8f3dc',
        },
        amber: {
          500: '#f59e0b',
          600: '#d97706',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

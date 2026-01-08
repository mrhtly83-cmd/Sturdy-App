/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        coral: {
          500: '#FF8A80',
          600: '#FF7567',
          700: '#FF5252',
        },
        teal: {
          300: '#4DD0E1',
          500: '#4DB6AC',
          600: '#26A69A',
        },
      },
    },
  },
  plugins: [],
}

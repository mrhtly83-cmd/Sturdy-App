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
        primary: '#208092', // Teal - trust & calm
        accent: '#CA8A04', // Muted Gold
        'deep-navy': '#0F172A', // Deep Navy for dark backgrounds
        coral: {
          500: '#FF8A80',
          600: '#FF7567',
          700: '#FF5252',
        },
        teal: {
          300: '#4DD0E1',
          500: '#208092', // Primary teal
          600: '#26A69A',
        },
      },
      dropShadow: {
        '2xl': '0 25px 25px rgba(0, 0, 0, 0.5)',
        'text': '0 2px 4px rgba(0, 0, 0, 0.8)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

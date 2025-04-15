/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7ECBC3',
          light: '#B5E5E0',
          dark: '#6BA59E',
        },
        secondary: {
          DEFAULT: '#F7EDE2',
          light: '#F9F5F0',
          dark: '#E5D5C5',
        },
        success: {
          DEFAULT: '#84A98C',
          light: '#A7C4BC',
          dark: '#6B8C7D',
        },
        pink: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
      },
    },
  },
  plugins: [],
}
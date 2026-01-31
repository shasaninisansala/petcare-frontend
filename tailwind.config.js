/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4CAF50',
          dark: '#45a049',
          light: '#66BB6A',
        },
        secondary: {
          DEFAULT: '#2C3E50',
          light: '#34495E',
        },
        accent: {
          blue: '#2196F3',
          yellow: '#FFC107',
          red: '#F44336',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

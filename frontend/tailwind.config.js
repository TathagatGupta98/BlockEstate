/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          50: '#fdf2f2',
          100: '#fde8e8',
          600: '#9b1c1c',
          800: '#771d1d',
          900: '#4a0404', // Deep Maroon
        }
      }
    },
  },
  plugins: [],
}
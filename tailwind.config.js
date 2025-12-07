/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#F15A24',
          dark: '#d94e1f',
          light: '#ff7e50',
        }
      }
    },
  },
  plugins: [],
}

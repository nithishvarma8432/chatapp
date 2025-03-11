/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}", // Scans all JS/JSX/TS/TSX files in src/app
    "./components/**/*.{js,jsx,ts,tsx}", // If you have a components folder
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

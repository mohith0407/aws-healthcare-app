/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0ea5e9', // Sky blue for medical theme
        secondary: '#64748b',
        accent: '#3b82f6',
      }
    },
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        danger: '#EF4444',
        warning: '#F59E0B',
        safe: '#10B981',
      }
    },
  },
  plugins: [],
}


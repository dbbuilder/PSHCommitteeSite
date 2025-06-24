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
        'wa-blue': '#003366',
        'wa-green': '#6D972D',
        'wa-gray': '#f5f5f5',
        'wa-dark-gray': '#333333',
      },
      fontFamily: {
        'sans': ['Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

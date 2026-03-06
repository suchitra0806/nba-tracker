/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#050816',
        surface: '#0f172a',
        accent: {
          primary: '#38bdf8',
          secondary: '#a855f7',
        },
      },
      fontFamily: {
        sans: ['system-ui', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 20px 40px rgba(15, 23, 42, 0.7)',
      },
    },
  },
  plugins: [],
}


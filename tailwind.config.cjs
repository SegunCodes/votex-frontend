// tailwind.config.cjs
/** @type {import('tailwindcss').Config} */
module.exports = { // Changed from export default
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          'from': { opacity: 0, transform: 'translateY(20px)' },
          'to': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 1s ease-out forwards',
        'fadeIn-delay-200': 'fadeIn 1s ease-out 0.2s forwards',
      },
    },
  },
  plugins: [],
}
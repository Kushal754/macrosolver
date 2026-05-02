/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 1. Aquí creamos la animación personalizada del escáner
      keyframes: {
        scan: {
          '0%, 100%': { top: '5%' },
          '50%': { top: '95%' },
        }
      },
      animation: {
        scan: 'scan 2s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
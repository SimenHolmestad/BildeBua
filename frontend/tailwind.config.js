/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
      },
      colors: {
        base: {
          50: '#f6f7f2',
          100: '#ecefdf',
          200: '#d7ddbe',
          300: '#bdc697',
          400: '#a2ae73',
          500: '#889653',
          600: '#6b7640',
          700: '#525c32',
          800: '#383f24',
          900: '#1f2516',
        },
      },
      boxShadow: {
        soft: '0 16px 40px rgba(22, 22, 18, 0.15)',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 400ms ease-out forwards',
      },
    },
  },
  plugins: [],
};

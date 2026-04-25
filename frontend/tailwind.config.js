/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        rock: {
          50:  '#f5f3f0',
          100: '#e8e3da',
          200: '#d0c5b3',
          300: '#b5a285',
          400: '#9b7e5a',
          500: '#856440',
          600: '#6d5035',
          700: '#57402d',
          800: '#473529',
          900: '#3d2d24',
        },
        chalk: {
          50:  '#fafafa',
          100: '#f5f5f5',
          500: '#737373',
          900: '#171717',
        },
        summit: {
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
        },
      },
      fontFamily: {
        sans: ['Inter var', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'badge-pop':  'badge-pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'slide-up':   'slide-up 0.25s ease-out',
        'slide-down': 'slide-down 0.25s ease-out',
        'fade-in':    'fade-in 0.2s ease-out',
        'shimmer':    'shimmer 1.6s ease-in-out infinite',
        'bounce-in':  'bounce-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'pulse-dot':  'pulse-dot 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'badge-pop': {
          '0%':   { transform: 'scale(0) rotate(-10deg)', opacity: '0' },
          '80%':  { transform: 'scale(1.1) rotate(2deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        'slide-up': {
          '0%':   { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%':   { transform: 'translateY(-12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        'bounce-in': {
          '0%':   { transform: 'scale(0)', opacity: '0' },
          '70%':  { transform: 'scale(1.08)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.4' },
        },
      },
      boxShadow: {
        'fab': '0 4px 20px -2px rgba(109, 80, 53, 0.45)',
        'fab-hover': '0 6px 24px -2px rgba(109, 80, 53, 0.55)',
      },
    },
  },
  plugins: [],
};

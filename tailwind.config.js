/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        sans: ['"Quicksand"', 'sans-serif'],
      },
      boxShadow: {
        dream: '0 24px 60px -22px rgba(176, 90, 137, 0.45)',
        glass: '0 20px 55px -28px rgba(126, 72, 107, 0.48)',
        bloom: '0 0 0 1px rgba(255, 255, 255, 0.35), 0 18px 45px -20px rgba(224, 127, 181, 0.42)',
      },
      backgroundImage: {
        'hero-wash':
          'radial-gradient(circle at top left, rgba(255,255,255,0.85), transparent 40%), radial-gradient(circle at bottom right, rgba(255,214,231,0.55), transparent 35%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        drift: {
          '0%, 100%': { transform: 'translate3d(0px, 0px, 0px)' },
          '50%': { transform: 'translate3d(14px, -18px, 0px)' },
        },
        glow: {
          '0%, 100%': { opacity: '0.45', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.07)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%) rotate(12deg)' },
          '100%': { transform: 'translateX(220%) rotate(12deg)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        drift: 'drift 11s ease-in-out infinite',
        glow: 'glow 7s ease-in-out infinite',
        shimmer: 'shimmer 8s linear infinite',
      },
    },
  },
  plugins: [],
};

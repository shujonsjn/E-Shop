/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          // Darkened from #F48721 so white-on-brand and brand-on-white text
          // both meet WCAG AA (4.5:1) instead of failing at 2.5:1.
          DEFAULT: '#C0560A',
          dark: '#9E4508',
          // Original orange stays readable on dark (ink) backgrounds.
          onDark: '#F48721',
          light: '#FFF3E7',
          soft: '#FEF7F0',
        },
        ink: {
          DEFAULT: '#222831',
          soft: '#3A414C',
          muted: '#666666',
        },
        cream: '#FBF9F5',
        success: '#18864B',
      },
      fontFamily: {
        sans: ['"Open Sans"', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(34, 40, 49, 0.06)',
        lift: '0 12px 32px rgba(34, 40, 49, 0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

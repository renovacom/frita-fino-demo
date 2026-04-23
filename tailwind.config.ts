import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paleta quente, típica de salgaderia (tostado + dourado)
        brand: {
          DEFAULT: '#B93C10',
          50: '#FEF3EC',
          100: '#FCE1D0',
          200: '#F8BC9B',
          300: '#F39466',
          400: '#ED6C31',
          500: '#E04A0F',
          600: '#B93C10',
          700: '#8E2E0C',
          800: '#651F08',
          900: '#3F1405',
        },
        accent: {
          DEFAULT: '#FFB020',
          50: '#FFF7E5',
          100: '#FFE9B8',
          200: '#FFD77A',
          300: '#FFC43C',
          400: '#FFB020',
          500: '#E69500',
          600: '#B87700',
          700: '#8A5A00',
          800: '#5C3C00',
          900: '#2E1E00',
        },
        cream: {
          50: '#FFFBF5',
          100: '#FFF3E1',
          200: '#FDE4C0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 2px 8px rgba(89, 43, 15, 0.06)',
        card: '0 8px 24px rgba(89, 43, 15, 0.10)',
        hover: '0 12px 32px rgba(89, 43, 15, 0.14)',
        warm: '0 10px 28px rgba(185, 60, 16, 0.18)',
      },
      animation: {
        'fade-in': 'fadeIn 240ms ease-out',
        'slide-up': 'slideUp 320ms cubic-bezier(0.2, 0.8, 0.2, 1)',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'steam': 'steam 2.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        steam: {
          '0%': { opacity: '0', transform: 'translateY(0) scale(1)' },
          '30%': { opacity: '0.8' },
          '100%': { opacity: '0', transform: 'translateY(-20px) scale(1.4)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;

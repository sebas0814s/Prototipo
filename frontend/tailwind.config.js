/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'shimmer': 'shimmer 1.8s ease-in-out infinite',
        'cart-bounce': 'cart-bounce 0.5s ease-out',
        'heart-pulse': 'heart-pulse 0.4s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'testimonial': 'slide-left 30s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'cart-bounce': {
          '0%, 100%': { transform: 'scale(1)' },
          '25%': { transform: 'scale(1.3)' },
          '50%': { transform: 'scale(0.9)' },
          '75%': { transform: 'scale(1.1)' },
        },
        'heart-pulse': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.3)' },
          '100%': { transform: 'scale(1)' },
        },
        'slide-up': {
          from: { transform: 'translateY(20px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        testimonial: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      colors: {
        /*
         * Paleta Jalac — basada en Light Pink #FFB6C1
         * Femenina, elegante y moderna sin ser recargada.
         * Se mapea sobre "rose" para que todos los componentes
         * existentes hereden el nuevo color automáticamente.
         */
        rose: {
          50:  '#fff5f7',   /* fondos sutiles         */
          100: '#ffe4ea',   /* fondos con más tono     */
          200: '#ffc8d4',   /* bordes suaves            */
          300: '#FFB6C1',   /* ★ color principal Jalac  */
          400: '#f0889a',   /* botones (legible en blanco) */
          500: '#d4607a',   /* textos de acento         */
          600: '#b83d5a',   /* hover oscuro             */
          700: '#942d45',   /* textos oscuros           */
          800: '#6e1f31',
          900: '#4a1220',
          950: '#2e0a15',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

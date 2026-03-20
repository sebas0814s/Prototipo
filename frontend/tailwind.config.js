/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
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

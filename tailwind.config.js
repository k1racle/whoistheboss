/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/server/views/**/*.ejs",
    "./src/server/**/*.ts",
    "./src/admin/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        terracotta: {
          DEFAULT: '#DB2A00',
          50: '#FEF2F0',
          100: '#FEE2DC',
          200: '#FEC9C0',
          300: '#FDA299',
          400: '#F97066',
          500: '#DB2A00',
          600: '#C22500',
          700: '#A01F00',
          800: '#7E1900',
          900: '#521000',
        },
        site: {
          gray: '#E5E5E5',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      aspectRatio: {
        'video': '16 / 9',
        'reel': '9 / 16',
      },
    },
  },
  plugins: [],
}

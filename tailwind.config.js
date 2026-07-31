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
          50: '#DB2A00',
          100: '#DB2A00',
          200: '#DB2A00',
          300: '#DB2A00',
          400: '#DB2A00',
          500: '#DB2A00',
          600: '#DB2A00',
          700: '#DB2A00',
          800: '#DB2A00',
          900: '#DB2A00',
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

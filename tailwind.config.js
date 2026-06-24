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
          DEFAULT: '#D94A2B',
          50: '#FCECE9',
          100: '#F8D0C9',
          200: '#F2A99C',
          300: '#EB826F',
          400: '#E45B42',
          500: '#D94A2B',
          600: '#AE3B22',
          700: '#832C1A',
          800: '#581E11',
          900: '#2D0F09',
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

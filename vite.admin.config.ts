import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import autoprefixer from 'autoprefixer'

export default defineConfig({
  root: resolve(__dirname, 'src/admin'),
  plugins: [tailwindcss()],
  css: {
    postcss: {
      plugins: [autoprefixer()],
    },
  },
  base: '/admin/',
  build: {
    outDir: resolve(__dirname, 'dist/admin'),
    emptyOutDir: true,
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    hmr: {
      host: '127.0.0.1',
      clientPort: 5173,
    },
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
      },
    },
  },
})

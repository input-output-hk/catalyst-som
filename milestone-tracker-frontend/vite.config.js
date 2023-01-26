import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import eslint from 'vite-plugin-eslint'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    eslint({
      extensions: ['.js', '.vue'],
      ignorePath: '../.gitignore'
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'path': './src/empty.js',
      'url': './src/empty.js',
      'fs': './src/empty.js'
    }
  },
  test: {
    globals: true,
    environment: 'happy-dom'
  }
})

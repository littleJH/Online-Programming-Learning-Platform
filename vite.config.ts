import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://api_oj.mgaronya.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      },
      '/test': {
        target: 'http://test_oj.mgaronya.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/test/, '')
      },
      '/tag_api': {
        target: 'http://api_tag.mgaronya.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/tag_api/, '')
      },
      '/translate_api': {
        target: 'http://api_translate.mgaronya.com/translator/translate',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/tag_api/, '')
      }
    }
  }
})

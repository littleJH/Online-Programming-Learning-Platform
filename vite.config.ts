import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@src': path.resolve(__dirname, './src'),
      '@api': path.resolve(__dirname, './src/api'),
      '@components': path.resolve(__dirname, './src/components'),
      '@config': path.resolve(__dirname, './src/config'),
      '@views': path.resolve(__dirname, './src/views'),
      '@tool': path.resolve(__dirname, './src/tool'),
      '@store': path.resolve(__dirname, './src/store'),
    },
  },
  server: {
    host: '172.29.186.11',
    port: 5175,
    proxy: {
      '/api': {
        target: 'http://106.53.120.252:2024',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/test': {
        target: 'http://test_oj.mgaronya.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/test/, ''),
      },
      '/tag_api': {
        target: 'http://api_tag.mgaronya.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/tag_api/, ''),
      },
      '/translate_api': {
        target: 'http://api_translate.mgaronya.com/translator',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/translate_api/, ''),
      },
      '/file_api': {
        target: 'http://106.53.120.252:2024',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/file_api/, ''),
      },
    },
  },
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 生产环境是否移除console.log
      },
    },
  },
})

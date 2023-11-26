import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import ViteGraphQLPlugin from 'vite-plugin-graphql'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    ViteGraphQLPlugin
  ],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3005',
        secure: false,
        changeOrigin: true
      }
    }
  }
})

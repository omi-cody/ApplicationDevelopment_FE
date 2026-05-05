import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  server: {
    port: 5174,
    proxy: {
      // Any request starting with /api gets forwarded to the backend
      '/api': {
        target: 'http://localhost:5221',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
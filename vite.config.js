import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/abuseipdb': {
        target: 'https://api.abuseipdb.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/abuseipdb/, ''),
      },
    },
  },
})
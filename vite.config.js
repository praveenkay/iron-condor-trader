import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: '/iron-condor-trader/',
  server: {
    host: '0.0.0.0',
    port: 5174,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '.e2b.dev',
      '5173-inh6ijg9scxc9xs6d4pul-6532622b.e2b.dev',
      '5174-inh6ijg9scxc9xs6d4pul-6532622b.e2b.dev'
    ],
    hmr: {
      port: 5174
    }
  }
})

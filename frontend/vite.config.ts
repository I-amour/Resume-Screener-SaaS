import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base must match the GitHub Pages repo path so assets load correctly
export default defineConfig({
  plugins: [react()],
  base: '/Resume-Screener-SaaS/',
  build: { chunkSizeWarningLimit: 1200 },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/service-locale/',    // ← IMPORTANT : nom du dépôt
})
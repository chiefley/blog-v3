import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// Development config for local preview
export default defineConfig({
  plugins: [react()],
  root: 'components/examples',
  publicDir: resolve(__dirname, 'components/examples/public'),
  server: {
    port: 3000,
    open: true
  }
})

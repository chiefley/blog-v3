import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// Development config for local preview
export default defineConfig({
  plugins: [react()],
  root: 'components/examples',
  publicDir: resolve(__dirname, 'components/examples/public'),
  resolve: {
    alias: {
      '/src': resolve(__dirname, 'wordpress/sites/applefinch/react'),
      '@shared': resolve(__dirname, 'components/src/shared')
    }
  },
  server: {
    port: 3000,
    open: true
  }
})

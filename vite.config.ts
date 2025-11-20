import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: 'components/examples', // Point to examples folder for dev server
  resolve: {
    alias: {
      '/src': resolve(__dirname, 'components/src')
    }
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'components/src/Calculator/index.tsx'),
      name: 'Calculator',
      fileName: (format) => `calculator.${format}.js`,
      formats: ['iife'] // IIFE for embedding in WordPress
    },
    rollupOptions: {
      // Bundle React with the component for portability
      output: {
        globals: {}
      }
    },
    outDir: 'components/dist',
    emptyOutDir: false // Don't clear dist when building individual components
  }
})

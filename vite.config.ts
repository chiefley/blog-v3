import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: 'components/examples', // Point to examples folder for dev server
  resolve: {
    alias: {
      '/src': resolve(__dirname, 'wordpress/sites/applefinch/react'),
      '@shared': resolve(__dirname, 'components/src/shared')
    }
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'wordpress/sites/applefinch/react/Calculator/index.tsx'),
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

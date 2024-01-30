import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy()
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
  server: {
    port: 3000
  },
  optimizeDeps: {
    exclude: ['@ionic/react', '@ionic/react-router'],
    /**
     * ESM dependencies that have a CJS dependency need to 
     * include that dependency for optimization.
     */
    include: ['@ionic/react > react-dom']
  },
  build: {
    rollupOptions: {
      external: ['@stencil/core'],
    }
  }
})

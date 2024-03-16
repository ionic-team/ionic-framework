import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: 'jsdom'
  },
  // Server applies to "vite" command
  server: {
    port: 8080
  },
  // Preview applies to "vite preview" command
  preview: {
    port: 8080
  },
  optimizeDeps: {
    exclude: ['@ionic/vue', '@ionic/vue-router']
  }
})

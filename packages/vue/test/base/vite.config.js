import { defineConfig } from 'vite';
import { configDefaults } from 'vitest/config';
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
    environment: 'jsdom',
    // Vitest runs alongside Playwright in this app; exclude Playwright's
    // tests/e2e/playwright/ tree so Vitest doesn't try to run @playwright/test
    // specs (which would fail because they expect Playwright's runtime).
    exclude: [...configDefaults.exclude, '**/tests/e2e/playwright/**']
  },
  server: {
    port: 8080
  },
  preview: {
    port: 8080
  },
  define: {
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
  }
})

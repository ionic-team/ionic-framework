import { stencilSpecPage } from '@stencil/unplugin';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [stencilSpecPage()],
  resolve: {
    alias: [
      { find: '@utils/test', replacement: '/src/utils/test/utils' },
      { find: '@utils', replacement: '/src/utils' },
      { find: '@global', replacement: '/src/global' },
    ],
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.spec.{ts,tsx}'],
    setupFiles: ['./vitest.setup.ts'],
  },
});

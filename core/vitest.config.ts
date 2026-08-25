import { stencilSpecPage } from '@stencil/unplugin';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    stencilSpecPage({
      transpileOptions: {
        // Stencil's spec-page transpile defaults to `target: 'latest'`, which emits
        // native ES2022+ class fields. That hoists `@Prop()` initializers above
        // Stencil's registerInstance() call in the constructor, so every default
        // gets silently dropped (see the matching note in tsconfig.json). Forcing
        // an older target makes the compiler emit constructor-assigned class
        // fields instead, preserving the assignment order registerInstance() needs.
        target: 'es2017',
      },
    }),
  ],
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

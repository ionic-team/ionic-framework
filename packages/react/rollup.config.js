import resolve from '@rollup/plugin-node-resolve';
import sourcemaps from 'rollup-plugin-sourcemaps';
// import json from '@rollup/plugin-json';

export default {
  input: {
    index: 'dist-transpiled/index',
    // 'routing/index': 'dist-transpiled/routing/index'
  },
  output: [
    {
      dir: 'dist/',
      entryFileNames: '[name].esm.js',
      chunkFileNames: '[name]-[hash].esm.js',
      format: 'es',
      sourcemap: true,
    },
    {
      dir: 'dist/',
      format: 'commonjs',
      preferConst: true,
      sourcemap: true,
    },
  ],
  external: (id) => !/^(\.|\/)/.test(id),
  plugins: [
    resolve(),
    sourcemaps(),
    // json()
  ],
};

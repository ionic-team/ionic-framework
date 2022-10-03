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
      entryFileNames: '[name].js',
      chunkFileNames: '[name]-[hash].js',
      format: 'es',
      sourcemap: true,
    }
  ],
  external: (id) => !/^(\.|\/)/.test(id),
  plugins: [
    resolve(),
    sourcemaps(),
    // json()
  ],
};

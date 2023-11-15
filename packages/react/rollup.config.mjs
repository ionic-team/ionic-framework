import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
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
    typescript(),
  ],
};

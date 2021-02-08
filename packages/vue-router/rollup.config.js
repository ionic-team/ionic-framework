export default {
  input: 'dist-transpiled/index.js',
  output: [
    {
      file: 'dist/index.esm.js',
      format: 'es',
      sourcemap: true,
    },
    {
      file: 'dist/index.js',
      format: 'commonjs',
      sourcemap: true,
    }
  ],
  external: ['vue-router', 'vue']
};

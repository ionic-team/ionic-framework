export default {
  input: 'dist-transpiled/index.js',
  output: [
    {
      file: 'dist/index.js',
      format: 'es',
      sourcemap: true,
    }
  ],
  external: ['vue-router', 'vue']
};

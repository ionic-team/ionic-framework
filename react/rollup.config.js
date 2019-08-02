import resolve from 'rollup-plugin-node-resolve';

export default {
  input: 'dist-transpiled/index.js',
  output: [
    {
      file: 'dist/index.esm.js',
      format: 'es'
    },
    {
      file: 'dist/index.js',
      format: 'commonjs',
      preferConst: true
    }
  ],
  external: (id) => !/^(\.|\/)/.test(id),
  plugins: [
    resolve()
  ]
};

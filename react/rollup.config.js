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
      format: 'commonjs'
    }
  ],
  external: [
    '@ionic/core',
    '@ionic/core/loader',
    'ionicons',
    'ionicons/icons',
    'react',
    'tslib',
    'react-dom',
    'react-router',
    'react-router-dom',
    'react-testing-library',
  ],
  plugins: [
    resolve()
  ]
};

import resolve from 'rollup-plugin-node-resolve';
import sourcemaps from 'rollup-plugin-sourcemaps';

export default {
  input: 'dist-transpiled/index.js',
  output: [
    {
      file: 'dist/index.esm.js',
      format: 'es',
      sourcemap: true
    },
    {
      file: 'dist/index.js',
      format: 'commonjs',
      sourcemap: true
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
    resolve(),
    sourcemaps()
  ]
};

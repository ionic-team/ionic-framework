import resolve from 'rollup-plugin-node-resolve';

export default {
  input: 'build/es2015/core.js',
  output: {
    file: 'dist/fesm2015.js',
    format: 'es'
  },
  external: (id) => {
    // inline @ionic/core deps
    if (id === '@ionic/core') {
      return false;
    }
    // anything else is external
    return !(id.startsWith('.') || id.startsWith('/'));
  },
  plugins: [
    resolve({
      module: true,
    })
  ]
};
import resolve from 'rollup-plugin-node-resolve';

export default {
  input: 'dist/index.js',
  output: {
    file: 'dist/fesm5.js',
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
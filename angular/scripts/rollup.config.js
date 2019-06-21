import resolve from 'rollup-plugin-node-resolve';

export default {
  input: 'build/es2015/core.js',
  output: {
    file: 'dist/fesm2015.js',
    format: 'es'
  },
  external: (id) => {
    // anything else is external
    // Windows: C:\xxxxxx\xxx
    const colonPosition = 1;
    return !(id.startsWith('.') || id.startsWith('/') || id.charAt(colonPosition) === ':');
  },
  plugins: [
    resolve({
      module: true,
    })
  ]
};
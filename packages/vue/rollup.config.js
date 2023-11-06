import typescript from '@rollup/plugin-typescript';
const external = ['vue', 'vue-router'];

export default {
  input: 'src/index.ts',
  output: [
    {
      dir: 'dist/',
      entryFileNames: '[name].js',
      chunkFileNames: '[name]-[hash].js',
      format: 'es',
      sourcemap: true
    },
  ],
  plugins: [typescript()],
  external: id => external.includes(id) || id.startsWith('@ionic/core') || id.startsWith('ionicons')
};

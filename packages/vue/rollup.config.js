import { terser } from "rollup-plugin-terser";

export default {
  input: 'dist-transpiled/index.js',
  output: [
    {
      dir: 'dist/',
      entryFileNames: '[name].esm.js',
      chunkFileNames: '[name]-[hash].esm.js',
      format: 'es',
      sourcemap: true
    },
    {
      dir: 'dist/',
      format: 'commonjs',
      preferConst: true,
      sourcemap: true,
      plugins: [terser()]
    }
  ],
  external: ['ionicons', 'ionicons/icons', '@ionic/core', '@ionic/core/loader', 'vue', 'vue-router']
};

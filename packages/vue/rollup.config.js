import { terser } from "rollup-plugin-terser";

export default {
  input: 'dist-transpiled/index.js',
  output: [
    {
      file: 'dist/index.js',
      format: 'esm',
      sourcemap: true
    },
    {
      file: 'dist/index.min.js',
      format: 'esm',
      sourcemap: true,
      plugins: [terser()]
    }
  ],
  external: ['ionicons', 'ionicons/icons', '@ionic/core', '@ionic/core/loader', 'vue', 'vue-router']
};

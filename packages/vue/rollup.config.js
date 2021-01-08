import { terser } from "rollup-plugin-terser";

const external = ['vue', 'vue-router'];

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
  external: id => external.includes(id) || id.startsWith('@ionic/core') || id.startsWith('ionicons')
};

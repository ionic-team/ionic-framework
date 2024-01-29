import typescript from '@rollup/plugin-typescript';
const external = ['react', 'react-dom', 'react-router', 'react-router-dom', 'history'];

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'es',
      sourcemap: true,
    }
  ],
  plugins: [
    typescript(),
  ],
  external: id => external.includes(id) || id.startsWith('@ionic/core') || id.startsWith('ionicons') || id.startsWith('@ionic/react'),
};

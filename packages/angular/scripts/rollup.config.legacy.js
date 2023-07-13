import config from './rollup.config';

const newConfig = {
  ...config,
  input: 'build/es5/core.js',
};
newConfig.output = [
  {
    file: 'dist/fesm5.js',
    format: 'es'
  },
  {
    file: 'dist/fesm5.cjs.js',
    format: 'cjs'
  }
];

export { newConfig as default };

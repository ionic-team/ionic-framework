const tsc = require('typescript');
const tsConfig = require('../tsconfig.json');

// force the output to use commonjs modules required by jest
tsConfig.compilerOptions.module = 'commonjs';

module.exports = {
  process(src, path) {
    if (path.endsWith('.ts') || path.endsWith('.tsx')) {
      return tsc.transpile(src, tsConfig.compilerOptions, path, []);
    }
    return src;
  },
};

const stencil = require('@stencil/core/testing');

module.exports = {
  process(src, path) {
    if (path.endsWith('.tsx')) {
      return stencil.transpile(path, './src');
    }
    return src;
  }
};

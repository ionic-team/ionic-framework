// we don't want to run copy for the demos, so just override the config for now
var path = require('path');

module.exports = {
  copyAssets: { },
  copyIndexContent: {
    src: [path.join(process.cwd(), 'scripts', 'e2e', 'index.html')],
    dest: '{{WWW}}'
  },
  copyFonts: { },
  copyPolyfills: {
    src: [path.join(process.cwd(), 'dist', 'e2e', 'polyfills', 'polyfills.ng.js')],
    dest: '{{BUILD}}'
  }
}
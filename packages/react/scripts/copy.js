const fs = require('fs-extra');
const path = require('path');

function copyCSS() {
  const src = path.join(__dirname, '..', '..', '..', 'core', 'css');
  const dst = path.join(__dirname, '..', 'css');

  fs.removeSync(dst);
  fs.copySync(src, dst);
}

function main() {
  copyCSS();
}

main();

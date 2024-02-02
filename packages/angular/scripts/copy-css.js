const fs = require('fs-extra');
const path = require('path');

/**
 * Copy the CSS from the core package to the angular package.
 *
 * This allows developers to import the global stylesheets
 * from the @ionic/angular package instead of @ionic/core.
 */
function copyCSS() {
  const src = path.join(__dirname, '..', '..', '..', 'core', 'css');
  const dst = path.join(__dirname, '..', 'dist', 'css');

  fs.removeSync(dst);
  fs.copySync(src, dst);
}

copyCSS();

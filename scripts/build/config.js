
import path = require('path');

module.exports = {
  dist: 'dist',
  src: {
    spec: [path.join('src', '**', 'test', '*.spec.js')],
    js: [path.join('src', '**', '*.js')],

    // Get all the non-js files and main.js
    e2e: [path.join('src', 'components', '*', 'test', '*', '**', '*')],
    html: path.join('src', '**', '*.html'),
    scss: path.join('src', '**', '*.scss'),
  },

  scripts: [
    path.join('node_modules', 'systemjs', 'node_modules', 'es6-module-loader', 'dist', 'es6-module-loader.js'),
    path.join('node_modules', 'systemjs', 'dist', 'system.js'),
    path.join('node_modules', 'angular2', 'bundles', 'angular2.dev.js'),
    path.join('node_modules', 'angular2', 'bundles', 'router.dev.js'),
    path.join('node_modules', 'angular2', 'bundles', 'http.dev.js'),
    path.join('node_modules', 'es6-shim', 'es6-shim.min.js'),
    path.join('dist', 'js', 'ionic.js')
  ],

  protractorPort: 8876,

  autoprefixer: {
    browsers: [
      'last 2 versions',
      'iOS >= 8',
      'Android >= 4.4',
      'Explorer >= 11',
      'ExplorerMobile >= 11'
    ],
    cascade: false
  }

};

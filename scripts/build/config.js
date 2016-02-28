
module.exports = {
  dist: 'dist',
  src: {
    spec: ['ionic/**/test/*.spec.js'],
    js: ['ionic/**/*.js'],

    // Get all the non-js files and main.js
    e2e: ['ionic/components/*/test/*/**/*'],
    html: 'ionic/**/*.html',
    scss: 'ionic/**/*.scss',
  },

  scripts: [
    'node_modules/systemjs/node_modules/es6-module-loader/dist/es6-module-loader.js',
    'node_modules/systemjs/dist/system.js',
    'node_modules/angular2/bundles/angular2.dev.js',
    'node_modules/angular2/bundles/router.dev.js',
    'node_modules/angular2/bundles/http.dev.js',
    'node_modules/es6-shim/es6-shim.min.js',
    'dist/js/ionic.js'
  ],

  protractorPort: 8876,

  autoprefixer: {
    browsers: [
      'last 2 versions',
      'iOS >= 7',
      'Android >= 4',
      'Explorer >= 10',
      'ExplorerMobile >= 11'
    ],
    cascade: false
  }

};

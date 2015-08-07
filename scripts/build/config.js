module.exports = {
  dist: 'dist',
  distLib: 'dist/lib',
  src: {
    spec: ['ionic/**/test/*.spec.js'],
    js: ['ionic/**/*.js'],

    // Get all the non-js files and main.js
    e2e: ['ionic/components/*/test/*/**/*'],
    html: 'ionic/**/*.html',
    scss: 'ionic/**/*.scss',
  },

  scripts: [
    'node_modules/traceur/bin/traceur-runtime.js',
    'node_modules/systemjs/node_modules/es6-module-loader/dist/es6-module-loader.js',
    'node_modules/systemjs/dist/system.js',
    'node_modules/angular2-bundle/angular2.dev.js',
    'dist/js/ionic.js',
    'node_modules/web-animations-js/web-animations.min.js'
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

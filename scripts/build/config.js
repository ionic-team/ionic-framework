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
    'scripts/resources/traceur-runtime.js',
    { pattern: 'jspm_packages/es6-module-loader.js', included: false },
    'jspm_packages/system.src.js',
    'config.js',
    'scripts/resources/angular2.dev.js',
    'dist/js/ionic.bundle.js',
    'dist/vendor/web-animations-js/web-animations.min.js'
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

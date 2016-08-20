var buildConfig = require('../build/config');



module.exports = function(config) {
  config.set({
    singleRun: true,
    basePath: '../../',

    frameworks: ['jasmine'],

    files: [
      'node_modules/es6-shim/es6-shim.min.js',

      'node_modules/es6-module-loader/dist/es6-module-loader.js', //npm3
      'node_modules/reflect-metadata/Reflect.js',
      'node_modules/zone.js/dist/zone.js',
      'node_modules/systemjs/dist/system-polyfills.js',
      'node_modules/systemjs/dist/system.src.js',
      'scripts/karma/system.config.js',
      'node_modules/rxjs/bundles/Rx.min.js',
      'dist-test/bundles/ionic.system.js',
      { pattern: 'node_modules/@angular/common/**/*.js', included: false},
      { pattern: 'node_modules/@angular/compiler/**/*.js', included: false},
      { pattern: 'node_modules/@angular/core/**/*.js', included: false},
      { pattern: 'node_modules/@angular/forms/**/*.js', included: false},
      { pattern: 'node_modules/@angular/http/**/*.js', included: false},
      { pattern: 'node_modules/@angular/platform-browser/**/*.js', included: false},
      { pattern: 'node_modules/@angular/platform-browser-dynamic/**/*.js', included: false},
      { pattern: 'dist-test/tests/**/*.spec.js', included: false },
      // { pattern: 'dist/tests/components/nav/**/*.spec.js', included: false },
      { pattern: 'src/**/*.js', included: false },
      'scripts/karma/test-main.js'
    ],

    exclude: ['src/components/*/test/*/**/*'],

    logLevel: 'warn',

    browsers: ['Chrome'],
    port: 9876
  });
};

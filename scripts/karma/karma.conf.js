var buildConfig = require('../build/config');



module.exports = function(config) {
  config.set({
    singleRun: true,
    basePath: '../../',

    frameworks: ['jasmine'],

    files: [
      'node_modules/systemjs/node_modules/es6-module-loader/dist/es6-module-loader.js', //npm2
      'node_modules/es6-module-loader/dist/es6-module-loader.src.js', //npm3
      'node_modules/systemjs/dist/system.js',
      'scripts/karma/system.config.js',
      'node_modules/angular2/bundles/angular2-polyfills.min.js',
      'node_modules/angular2/bundles/angular2.min.js',
      'node_modules/angular2/bundles/router.min.js',
      'node_modules/angular2/bundles/http.min.js',
      'node_modules/rxjs/bundles/Rx.min.js',
      'dist/bundles/ionic.system.js',
      //'node_modules/angular2/bundles/test_lib.js',
      { pattern: 'dist/tests/**/*.spec.js', included: false },
      'scripts/karma/test-main.js'
    ],

    exclude: ['ionic/components/*/test/*/**/*'],

    logLevel: 'warn',

    browsers: ['Chrome'],
    port: 9876
  });
};

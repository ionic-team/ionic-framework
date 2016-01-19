var buildConfig = require('../build/config');

module.exports = function(config) {
  config.set({
    singleRun: true,
    basePath: '../../',

    frameworks: ['jasmine'],

    files: [
      'node_modules/systemjs/node_modules/es6-module-loader/dist/es6-module-loader.js',
      'node_modules/systemjs/dist/system.js',
      'node_modules/angular2/bundles/angular2-polyfills.min.js',
      'node_modules/angular2/bundles/angular2.min.js',
      'node_modules/angular2/bundles/router.min.js',
      'node_modules/angular2/bundles/http.min.js',
      'node_modules/rxjs/bundles/Rx.min.js',
      'dist/bundles/ionic.system.js',
      //'node_modules/angular2/bundles/test_lib.js',
      { pattern: 'dist/tests/**/nav-controller.spec.js', included: false },
      'scripts/karma/test-main.js'
    ],

    exclude: ['ionic/components/*/test/*/**/*'],

    logLevel: 'warn',

    browsers: ['Chrome'],
    port: 9876
  });
};

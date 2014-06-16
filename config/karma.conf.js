var buildConfig = require('./build.config.js');
var path = require('canonical-path');

module.exports = {
  files: [
    // Include jQuery only for testing convience (lots of DOM checking for unit tests on directives)
    'http://codeorigin.jquery.com/jquery-1.10.2.min.js',
    'config/lib/js/angular/angular.js',
    'config/lib/js/angular/angular-animate.js',
    'config/lib/js/angular/angular-sanitize.js',
    'config/lib/js/angular/angular-mocks.js',
    'config/lib/js/angular-ui/angular-ui-router.js',
    'config/lib/testutil.js'
  ]
    .concat(buildConfig.ionicFiles)
    .concat(buildConfig.angularIonicFiles)
    .concat('test/unit/**/*.js'),

  exclude: [
    'js/ext/angular/test/dom-trace.js'
  ],

  frameworks: ['jasmine'],
  reporters: ['progress'],
  port: 9876,
  colors: true,
  // possible values: 'OFF', 'ERROR', 'WARN', 'INFO', 'DEBUG'
  logLevel: 'INFO',
  autoWatch: true,
  captureTimeout: 60000,
  singleRun: false,

  // Start these browsers, currently available:
  // - Chrome
  // - ChromeCanary
  // - Firefox
  // - Opera (has to be installed with `npm install karma-opera-launcher`)
  // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
  // - PhantomJS
  // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
  browsers: ['Chrome']
};

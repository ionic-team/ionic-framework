var buildConfig = require('./build.config.js');
var path = require('canonical-path');

module.exports = function(includeCodeCoverage){
  var config = {};

  config.files = [
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
  .concat('test/unit/**/*.js');

  config.exclude = ['js/ext/angular/test/dom-trace.js'];

  config.frameworks = ['jasmine'];

  config.reporters = ['progress'];

  config.port = 9876;
  config.colors = true;
  config.logLevel = 'INFO';
  config.autoWatch = true;
  config.captureTimeout = 60000;
  config.singleRun = false;
  config.mochaReporter = {
    output: 'full'
  };

  config.browsers = ['Chrome'];

  if ( includeCodeCoverage ){
    config.preprocessors = {'js/**/*.js': 'coverage'};
    config.reporters.push('coverage');
    config.coverageReporter = {
      reporters: [
        {
          type: 'text'
        },
        {
          type: 'text-summary'
        },
        {
          type: 'cobertura',
          file: 'coverage.xml'
        },
        {
          type: 'lcov'
        }
      ]
    };
  }

  return config;
}

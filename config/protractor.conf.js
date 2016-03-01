var buildConfig = require('./build.config');
var path = require('canonical-path');
var projectRoot = path.resolve(__dirname, '..');

exports.config = {

  // Spec patterns are relative to the location of the spec file. They may
  // include glob patterns.
  specs: [
    path.resolve(projectRoot, 'test/css/**/*.scenario.js'),
    path.resolve(projectRoot, 'demos/**/*.scenario.js'),
  ],

  // Options to be passed to Jasmine-node.
  jasmineNodeOpts: {
    showColors: true, // Use colors in the command line report.
    defaultTimeoutInterval: 120000,
    isVerbose: true
  },

  baseUrl: 'http://localhost:' + buildConfig.protractorPort,

  onPrepare: function() {
    var ionicSnapshot = require('./lib/ionic-snapshot.js');
    ionicSnapshot({
      groupId: 'ionic',
      appId: 'kitchen-sink',
      accessKey: process.env.IONIC_SNAPSHOT_KEY
    });
  }

};

// protractor config/protractor.conf.js --browser chrome --params.width 400 --params.height 800 --params.test_id 123

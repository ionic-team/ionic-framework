var buildConfig = require('./build.config');

exports.config = {

  // Spec patterns are relative to the location of the spec file. They may
  // include glob patterns.
  specs: ['../dist/ionic-demo/nightly/**/*.scenario.js'],

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


var buildConfig = require('../build/config');
var path = require('canonical-path');
var projectRoot = path.resolve(__dirname, '../..');

exports.config = {

  // Spec patterns are relative to the location of the spec file. They may
  // include glob patterns.
  specs: [
    path.resolve(projectRoot, 'dist/e2e/**/e2e.js'),
  ],

  // Options to be passed to Jasmine-node.
  jasmineNodeOpts: {
    showColors: true, // Use colors in the command line report.
    defaultTimeoutInterval: 120000,
    isVerbose: true
  },

  baseUrl: 'http://localhost:' + buildConfig.protractorPort,

  onPrepare: function() {
    var ionicSnapshot = require('./ionic.snapshot.js');
    ionicSnapshot({
      groupId: 'ionic2',
      appId: 'snapshots',
      accessKey: process.env.IONIC_SNAPSHOT_KEY
    });
  }

};

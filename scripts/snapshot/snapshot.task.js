var _ = require('lodash');
var http = require('http');
var connect = require('connect');
var serveStatic = require('serve-static');
var cp = require('child_process');
var path = require('canonical-path');
var uuid = require('node-uuid');

var projectRoot = path.resolve(__dirname, '../..');


module.exports = function(gulp, argv, buildConfig) {

  var protractorHttpServer;
  gulp.task('protractor-server', function() {
    var app = connect().use(serveStatic(projectRoot + '/' + buildConfig.dist));  // serve everything that is static
    protractorHttpServer = http.createServer(app).listen(buildConfig.protractorPort);
    console.log('Serving `dist` on http://localhost:' + buildConfig.protractorPort);
  });

  gulp.task('snapshot', ['e2e', 'protractor-server'], function(done) {
    var protractorConfigFile = path.resolve(projectRoot, 'scripts/snapshot/protractor.config.js');
    snapshot(done, protractorConfigFile);
  });

  var snapshotValues = _.merge({
    browser: 'chrome',
    platform: 'linux',
    params: {
      platform_id: 'chrome_local_test',
      platform_index: 0,
      platform_count: 1,
      width: 400,
      height: 800,
      test_id: uuid.v4()
    }
  }, argv);

  function snapshot(done, protractorConfigFile) {
    var protractorArgs = [
      '--browser <%= browser %>',
      '--platform <%= platform %>',
      '--params.platform_id=<%= params.platform_id %>',
      '--params.platform_index=<%= params.platform_index %>',
      '--params.platform_count=<%= params.platform_count %>',
      '--params.width=<%= params.width %>',
      '--params.height=<%= params.height %>',
      '--params.test_id=<%= params.test_id %>',
    ].map(function(argument) {
      return _.template(argument, snapshotValues);
    });

    e2ePublish(snapshotValues.params.test_id);

    return protractor(done, [protractorConfigFile].concat(protractorArgs));
  }

  function protractor(done, args) {
    console.log('Start protractor');

    var child = cp.spawn('protractor', args, {
      stdio: [process.stdin, process.stdout, 'pipe']
    });

    var finish = _.once(function(err) {
      err && done(err) || done();
      protractorHttpServer.close();
    });

    child.stderr.on('data', function(data) {
      finish('Protractor tests failed. Error:', data.toString());
    });
    child.on('exit', function() {
      finish();
    });
  }

  function e2ePublish(testId) {
    var snapshotConfig = require('./snapshot.config').config;
    snapshotConfig.testId = testId;

    require('../e2e/e2e-publish')(snapshotConfig);
  }

};

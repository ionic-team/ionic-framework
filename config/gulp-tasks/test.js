var _ = require('lodash');
var buildConfig = require('../build.config');
var connect = require('connect');
var cp = require('child_process');
var gutil = require('gulp-util');
var http = require('http');
var karma = require('karma').server;
var path = require('canonical-path');
var uuid = require('node-uuid');

var projectRoot = path.resolve(__dirname, '../..');

var karmaSauceConf = require('../karma-sauce.conf.js');

module.exports = function(gulp, argv) {

  var includeCodeCoverage = true;
  if ( argv.skipCoverage ){
    includeCodeCoverage = false;
  }
  var karmaConf = require('../karma.conf')(includeCodeCoverage);

  /*
   * Connect to Saucelabs
   */
  var sauceInstance;
  gulp.task('sauce-connect', function(done) {
    gutil.log('sauce-connect parameters: ', _.pick(process.env, ['SAUCE_USER', 'SAUCE_KEY', 'SAUCE_TUNNEL_ID', 'SAUCE_BUILD_ID']));
    require('sauce-connect-launcher')({
      username: process.env.SAUCE_USER,
      accessKey: process.env.SAUCE_KEY,
      tunnelIdentifier: process.env.SAUCE_TUNNEL_ID || 0,
      // verbose: true
    }, function(err, instance) {
      if (err) return done('Failed to launch sauce connect!');
      sauceInstance = instance;
      done();
    });
  });

  function sauceDisconnect(done) {
    sauceInstance ? sauceInstance.close(done) : done();
  }


  /*
   * Karma
   */
  argv.browsers && (karmaConf.browsers = argv.browsers.trim().split(','));
  argv.reporters && (karmaConf.reporters = argv.reporters.trim().split(','));

  gulp.task('karma', function(done) {
    karmaConf.singleRun = true;
    karma.start(karmaConf, done);
  });

  gulp.task('karma-watch', function(done) {
    karmaConf.singleRun = false;
    karma.start(karmaConf, done);
  });

  gulp.task('karma-sauce', ['run-karma-sauce'], sauceDisconnect);
  gulp.task('run-karma-sauce', ['sauce-connect'], function(done) {
    return karma.start(karmaSauceConf, done);
  });


  /*
   * Protractor Snapshot Tests
   */
  var protractorHttpServer;
  gulp.task('protractor-server', function() {
    var app = connect().use(connect.static(projectRoot));
    protractorHttpServer = http.createServer(app).listen(buildConfig.protractorPort);
  });

  gulp.task('snapshot', ['protractor-server', 'demos'], function(done) {
    snapshot(done, 'config/protractor.conf.js');
  });

  gulp.task('snapshot-sauce', ['run-snapshot-sauce'], sauceDisconnect);
  gulp.task('run-snapshot-sauce', ['sauce-connect', 'protractor-server'], function(done) {
    snapshot(done, 'config/protractor-sauce.conf.js');
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
  function snapshot(done, configFile) {
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

    return protractor(done, [configFile].concat(protractorArgs));
  }

  function protractor(done, args) {
    var errored = false;
        var child = cp.spawn('protractor', args, {
      stdio: [process.stdin, process.stdout, 'pipe']
    });

    child.stderr.on('data', function(data) {
      protractorHttpServer.close();
      console.error(data.toString());
      if (!errored) {
        errored = true;
        done('Protractor tests failed.');
      }

    });
    child.on('exit', function() {
      protractorHttpServer.close();
      done();
    });
  }
};

var _ = require('lodash');
var buildConfig = require('../build.config');
var connect = require('connect');
var cp = require('child_process');
var gutil = require('gulp-util');
var http = require('http');
var karma = require('karma').server;
var uuid = require('node-uuid');

var karmaConf = require('../karma.conf.js');
var karmaSauceConf = require('../karma-sauce.conf.js');

module.exports = function(gulp, argv) {

  /*
   * Connect to Saucelabs
   */
  var sauceInstance;
  gulp.task('sauce-connect', function(done) {
    gutil.log('sauce-connect parameters: ', _.pick(process.env, ['SAUCE_USER', 'SAUCE_KEY', 'SAUCE_TUNNEL_ID']));
    require('sauce-connect-launcher')({
      username: process.env.SAUCE_USER,
      accessKey: process.env.SAUCE_KEY,
      tunnelIdentifier: process.env.SAUCE_TUNNEL_ID || 0,
      verbose: true
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
  gulp.task('karma', function(done) {
    karmaConf.singleRun = true;
    argv.browsers && (karmaConf.browsers = argv.browsers.trim().split(','));
    argv.reporters && (karmaConf.reporters = argv.reporters.trim().split(','));

    karma.start(karmaConf, done);
  });

  gulp.task('karma-watch', function(done) {
    karmaConf.singleRun = false;
    karma.start(karmaConf, done);
  });

  gulp.task('karm-sauce', ['run-karma-sauce'], sauceDisconnect);
  gulp.task('run-karma-sauce', ['sauce-connect'], function(done) {
    return karma.start(karmaSauceConf, done);
  });


  /*
   * Protractor Snapshot Tests
   */
  var protractorHttpServer;
  gulp.task('protractor-server', function() {
    var app = connect().use(connect.static(__dirname + '/../../dist/ionic-demo'));
    protractorHttpServer = http.createServer(app).listen(buildConfig.protractorPort);
  });

  gulp.task('snapshot', ['snapshot-server'], function(done) {
    snapshot(done, 'config/protractor.conf.js');
  });

  gulp.task('snapshot-sauce', ['run-snapshot-sauce'], sauceDisconnect);
  gulp.task('run-snapshot-sauce', ['sauce-connect', 'protractor-server'], function(done) {
    snapshot(done, 'config/protractor-sauce.conf.js');
  });

  var snapshotValues = _.merge({
    browser: 'chrome',
    params: {
      platform_id: 'chrome_local_test',
      width: 400,
      height: 800,
      test_id: uuid.v4()
    }
  }, argv);
  function snapshot(done, configFile) {
    var protractorArgs = [
      '--browser <%= browser %>',
      '--params.platform_id=<%= params.platform_id %>',
      '--params.width=<%= params.width %>',
      '--params.height=<%= params.height %>',
      '--params.test_id=<%= params.test_id %>',
    ].map(function(argument) {
      return _.template(argument, snapshotValues);
    });

    return protractor(done, [configFile].concat(protractorArgs));
  }

  function protractor(done, args) {
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
};

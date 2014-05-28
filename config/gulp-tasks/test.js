var cp = require('child_process');
var connect = require('connect');
var http = require('http');
var buildConfig = require('../build.config');
var karma = require('karma').server;

var karmaConf = require('../karma.conf.js');
var karmaSauceConf = require('../karma-sauce.conf.js');

module.exports = function(gulp, argv) {

  /*
   * Connect to Saucelabs
   */
  var sauceInstance;
  gulp.task('sauce-connect', function(done) {
    require('sauce-connect-launcher')({
      username: process.env.SAUCE_USER,
      accessKey: process.env.SAUCE_KEY,
      verbose: true,
      tunnelIdentifier: process.env.TRAVIS_BUILD_NUMBER
    }, function(err, instance) {
      if (err) return done('Failed to launch sauce connect!');
      sauceInstance = instance;
      done();
    });
  });

  gulp.task('sauce-disconnect', function(done) {
    sauceInstance && sauceInstance.close(done) || done();
  });


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

  gulp.task('karma-sauce', ['sauce-connect'], function(done) {
    return karma.start(karmaSauceConf, function() {
      sauceDisconnect(done);
    });
  });


  /*
   * Protractor Snapshot Tests
   */
  var connectServer;
  gulp.task('snapshot-server', function() {
    var app = connect().use(connect.static(__dirname + '/../../dist/ionic-demo'));
    connectServer = http.createServer(app).listen(buildConfig.protractorPort);
  });

  gulp.task('snapshot', ['snapshot-server'], function(done) {
    var uuid = require('node-uuid');
    var testId = uuid.v4();

    return protractor(done, [
      'config/protractor.conf.js',
      '--browser chrome',
      '--params.platform_id=chrome_desktop_narrow',
      '--params.width=400',
      '--params.height=800',
      '--params.test_id=' + testId,
    ]);
  });

  gulp.task('snapshot-sauce', ['sauce-connect', 'snapshot-server'], function(done) {
    return protractor(done, ['config/protractor-sauce.conf.js']);
  });

  function protractor(done, args) {
    cp.spawn('protractor', args, { stdio: 'inherit' })
    .on('exit', function(code) {
      connectServer && connectServer.close();
      if (code) return done('Protector test(s) failed. Exit code: ' + code);
      done();
    });
  }
};

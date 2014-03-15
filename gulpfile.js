var _ = require('lodash');
var buildConfig = require('./config/build.config.js');
var changelog = require('conventional-changelog');
var connect = require('connect');
var dgeni = require('dgeni');
var http = require('http');
var cp = require('child_process');
var gulp = require('gulp');
var pkg = require('./package.json');
var semver = require('semver');
var through = require('through');

var argv = require('minimist')(process.argv.slice(2));

var concat = require('gulp-concat');
var gulpif = require('gulp-if');
var header = require('gulp-header');
var jshint = require('gulp-jshint');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var stripDebug = require('gulp-strip-debug');
var template = require('gulp-template');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');

var banner = _.template(buildConfig.banner, { pkg: pkg });

var IS_RELEASE_BUILD = !!argv.release;
if (IS_RELEASE_BUILD) {
  gutil.log(
    gutil.colors.red('--release:'),
    'Building release version (minified, debugs stripped)...'
  );
}


gulp.task('default', ['build']);
gulp.task('build', ['bundle', 'sass']);

gulp.task('docs', function(done) {
  var docVersion = argv['doc-version'];
  if (docVersion != 'nightly' && !semver.valid(docVersion)) {
    console.log('Usage: gulp docs --doc-version=(nightly|versionName)');
    return process.exit(1);
  }
  process.env.DOC_VERSION = docVersion;
  return dgeni('docs/docs.config.js').generateDocs().then(function() {
    gutil.log('Docs for', gutil.colors.cyan(docVersion), 'generated!');
  });
});

var IS_WATCH = false;
gulp.task('watch', function() {
  IS_WATCH = true;
  gulp.watch('js/**/*.js', ['bundle']);
  gulp.watch('scss/**/*.scss', ['sass']);
});

gulp.task('changelog', function(done) {
  changelog({
    repository: pkg.repository.url,
    version: pkg.version,
  }, function(err, data) {
    if (err) return done(err);
    require('fs').writeFileSync('CHANGELOG.md', data);
    done();
  });
});

gulp.task('bundle', [
  'scripts',
  'scripts-ng',
  'vendor',
  'version',
], function() {
  IS_RELEASE_BUILD && gulp.src(buildConfig.ionicBundleFiles.map(function(src) {
      return src.replace(/.js$/, '.min.js');
    }))
      .pipe(header(buildConfig.bundleBanner))
      .pipe(concat('ionic.bundle.min.js'))
      .pipe(gulp.dest(buildConfig.distJs));

  return gulp.src(buildConfig.ionicBundleFiles)
    .pipe(header(buildConfig.bundleBanner))
    .pipe(concat('ionic.bundle.js'))
    .pipe(gulp.dest(buildConfig.distJs));
});

gulp.task('jshint', function() {
  return gulp.src(['js/**/*.js', 'test/**/*.js'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('ddescribe-iit', function() {
  return gulp.src(['test/**/*.js', 'js/**/*.js'])
    .pipe(notContains([
      'ddescribe',
      'iit',
      'xit',
      'xdescribe'
    ]));
});

gulp.task('vendor', function() {
  return gulp.src(buildConfig.vendorFiles, {
      cwd: 'config/lib/',
      base: 'config/lib/'
    })
    .pipe(gulp.dest(buildConfig.dist));
});

gulp.task('scripts', function() {
  return gulp.src(buildConfig.ionicFiles)
    .pipe(gulpif(IS_RELEASE_BUILD, stripDebug()))
    .pipe(concat('ionic.js'))
    .pipe(header(banner))
    .pipe(gulp.dest(buildConfig.distJs))
    .pipe(gulpif(IS_RELEASE_BUILD, uglify()))
    .pipe(rename({ extname: '.min.js' }))
    .pipe(header(banner))
    .pipe(gulp.dest(buildConfig.distJs));
});

gulp.task('scripts-ng', function() {
  return gulp.src(buildConfig.angularIonicFiles)
    // .pipe(gulpif(IS_RELEASE_BUILD, stripDebug()))
    .pipe(concat('ionic-angular.js'))
    .pipe(header(banner))
    .pipe(gulp.dest(buildConfig.distJs))
    .pipe(gulpif(IS_RELEASE_BUILD, uglify()))
    .pipe(rename({ extname: '.min.js' }))
    .pipe(header(banner))
    .pipe(gulp.dest(buildConfig.distJs));
});

gulp.task('sass', function(done) {
  gulp.src('scss/ionic.scss')
    .pipe(header(banner))
    .pipe(sass({
      onError: function(err) {
        //If we're watching, don't exit on error
        if (IS_WATCH) {
          console.log(gutil.colors.red(err));
        } else {
          done(err);
        }
      }
    }))
    .pipe(concat('ionic.css'))
    .pipe(header(banner))
    .pipe(gulp.dest(buildConfig.distCss))
    .pipe(gulpif(IS_RELEASE_BUILD, minifyCss({
      keepSpecialComments: 0
    })))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(header(banner))
    .pipe(gulp.dest(buildConfig.distCss))
    .on('end', done);
});

gulp.task('version', function() {
  var d = new Date();
  var date = d.toISOString().substring(0,10);
  var time = pad(d.getUTCHours()) +
      ':' + pad(d.getUTCMinutes()) +
      ':' + pad(d.getUTCSeconds());
  return gulp.src('config/version.template.json')
    .pipe(template({
      pkg: pkg,
      date: date,
      time: time
    }))
    .pipe(rename('version.json'))
    .pipe(gulp.dest('dist'));
});


gulp.task('sauce-connect', sauceConnect);

gulp.task('cloudtest', ['protractor-sauce'], function(cb) {
  sauceDisconnect(cb);
});

gulp.task('karma', function(cb) {
  return karma(cb, ['config/karma.conf.js', '--single-run=true']);
});
gulp.task('karma-watch', function(cb) {
  return karma(cb, ['config/karma.conf.js']);
});

var connectServer;
gulp.task('connect-server', function() {
  var app = connect().use(connect.static(__dirname));
  connectServer = http.createServer(app).listen(8765);
});
gulp.task('protractor', ['connect-server'], function(cb) {
  return protractor(cb, ['config/protractor.conf.js']);
});
gulp.task('protractor-sauce', ['sauce-connect', 'connect-server'], function(cb) {
  return protractor(cb, ['config/protractor-sauce.conf.js']);
});

function karma(cb, args) {
  if (argv.browsers) {
    args.push('--browsers='+argv.browsers.trim());
  }
  if (argv.reporters) {
    args.push('--reporters='+argv.reporters.trim());
  }
  cp.spawn('node', [
    './node_modules/karma/bin/karma',
    'start'
  ].concat(args), { stdio: 'inherit' })
  .on('exit', function(code) {
    if (code) return cb('Karma test(s) failed. Exit code: ' + code);
    cb();
  });
}

function pad(n) {
  if (n<10) { return '0' + n; }
  return n;
}

function protractor(cb, args) {
  cp.spawn('protractor', args, { stdio: 'inherit' })
  .on('exit', function(code) {
    connectServer && connectServer.close();
    if (code) return cb('Protector test(s) failed. Exit code: ' + code);
    cb();
  });
}

var sauceInstance;
function sauceConnect(cb) {
  require('sauce-connect-launcher')({
    username: process.env.SAUCE_USER,
    accessKey: process.env.SAUCE_KEY,
    verbose: true,
    tunnelIdentifier: process.env.TRAVIS_BUILD_NUMBER
  }, function(err, instance) {
    if (err) return cb('Failed to launch sauce connect!');
    sauceInstance = instance;
    cb();
  });
}

function sauceDisconnect(cb) {
  if (sauceInstance) {
    return sauceInstance.close(cb);
  }
  cb();
}

function notContains(disallowed) {
  disallowed = disallowed || [];

  return through(function(file) {
    var error;
    var contents = file.contents.toString();
    disallowed.forEach(function(str) {
      var idx = disallowedIndex(contents, str);
      if (idx !== -1) {
        error = error || file.path + ' contains ' + str + ' on line ' +
          contents.substring(0, idx, str).split('\n').length + '!';
      }
    });
    if (error) {
      throw new Error(error);
    } else {
      this.emit('data', file);
    }
  });

  function disallowedIndex(content, disallowedString) {
    var notFunctionName = '[^A-Za-z0-9$_]';
    var regex = new RegExp('(^|' + notFunctionName + ')(' + disallowedString + ')' + notFunctionName + '*\\(', 'gm');
    var match = regex.exec(content);
    // Return the match accounting for the first submatch length.
    return match !== null ? match.index + match[1].length : -1;
  }
}

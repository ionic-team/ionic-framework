/////
// Mostly stolen from https://github.com/pkozlowski-opensource/ng2-play
/////

var SystemJsBuilder = require('systemjs-builder');
var exec = require('child_process').exec;
var gulp = require('gulp');
var karma = require('karma').server;
var path = require('path');
var buildConfig = require('./scripts/build/config');
var through2 = require('through2');

var concat = require('gulp-concat');
var debug = require('gulp-debug');
var del = require('del');
var gulpif = require('gulp-if');
var karma = require('karma').server;
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var shell = require('gulp-shell');
var traceur = require('gulp-traceur');
var wrap = require('gulp-wrap');
var argv = require('yargs').argv;

gulp.task('default', ['sass', 'examples', 'ng2']);

gulp.task('watch', ['default'], function() {
  gulp.watch(buildConfig.src.scss, ['sass']);
  return gulp.watch(buildConfig.src.examples.concat('scripts/examples/index.template.html'), ['examples']);
});

gulp.task('karma', function() {
  return karma.start({ configFile: __dirname + '/scripts/test/karma.conf.js' });
});
gulp.task('karma-watch', function() {
  return karma.start({ configFile: __dirname + '/scripts/test/karma-watch.conf.js' });
});

gulp.task('sass', function(done) {
  gulp.src('src/components/app/ionic.scss')
    .pipe(sass({
      onError: function(err) {
        console.log(err);
      }
    }))
    .pipe(gulp.dest('dist/css'))
    .on('end', done);
});

gulp.task('clean', function(done) {
  del([buildConfig.dist], done);
});

gulp.task('examples', ['sass'], function() {
  var exampleSrc = path.join(__dirname, 'src/components/**/examples/**/*');
  var templateSrc = path.join(__dirname, 'scripts/examples/index.template.html');
  var exampleDest = path.join(__dirname, 'dist/examples/');

  return gulp.src(exampleSrc)
    .pipe(gulpif(/index.html/, wrap({
      src: templateSrc
    })))
    .pipe(rename(function(file) {
      file.dirname = file.dirname.replace('/examples/', '/');
    }))
    .pipe(gulp.dest(exampleDest));
});

require('./scripts/snapshot/snapshot.task')(gulp, argv, buildConfig);

// Take es6 files from angular2's output, rename to js, and move to dist/lib/
gulp.task('ng2-rename', function(done) {
  exec('test -e dist/angular-master', function(err) {
    if (err) {
      console.log('You have not installed angular master.\n' +
                  'Please run ./scripts/build/update-angular.sh.\n' +
                  'Aborting.');
      return process.exit(1);
    }
    gulp.src([
      'dist/angular-master/dist/js/dev/es6/{angular2,rtts_assert}/**/*.es6'
    ])
      .pipe(rename({ extname: '.js' }))
      .pipe(gulp.dest('dist/lib'))
      .on('end', done);
  });
});
gulp.task('ng2', ['ng2-rename'], function() {
  var builder = new SystemJsBuilder();
  return builder.loadConfig('jspm-config.js')
  .then(function() {
    builder.config({
      map: {
        'angular2': 'dist/lib/angular2',
        'rtts_assert': 'dist/lib/rtts_assert'
      },
      paths: {
        dist: undefined,
      }
    });
    return builder.build('angular2/angular2', 'dist/lib/angular2.js');
  });
});


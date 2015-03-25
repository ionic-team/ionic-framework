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

gulp.task('default', ['sass', 'e2e', 'ng2']);

gulp.task('watch', ['default'], function() {
  gulp.watch(buildConfig.src.scss, ['sass']);
  gulp.watch([].concat(
    buildConfig.src.js, buildConfig.src.e2e, buildConfig.src.html, 
    'scripts/e2e/index.template.html'
  ), ['e2e']);
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

gulp.task('e2e', ['sass'], function() {
  var e2eSrc = path.join(__dirname, 'src/components/**/test/**/*');
  var templateSrc = path.join(__dirname, 'scripts/e2e/index.template.html');
  var e2eDest = path.join(__dirname, 'dist/e2e/');

  return gulp.src(e2eSrc)
    .pipe(gulpif(/index.html/, wrap({
      src: templateSrc
    })))
    .pipe(rename(function(file) {
      file.dirname = file.dirname.replace('/test/', '/');
    }))
    .pipe(gulpif({ isFile: true }, gulp.dest(e2eDest)));
});

require('./scripts/snapshot/snapshot.task')(gulp, argv, buildConfig);

// Take es6 files from angular2's output, rename to js, and move to dist/lib/
gulp.task('ng2-rename', function(done) {
  exec('test -e node_modules/angular-master', function(err) {
    if (err) {
      console.log('You have not installed angular master.\n' +
                  'Please run ./scripts/build/update-angular.sh.\n' +
                  'Aborting.');
      return process.exit(1);
    }
    gulp.src([
      'node_modules/angular-master/dist/js/dev/es6/{angular2,rtts_assert}/**/*.es6'
    ])
      .pipe(rename({ extname: '.js' }))
      .pipe(gulp.dest('dist/lib'))
      .on('end', done);
  });
});

gulp.task('ng2', ['ng2-rename'], function() {
  var builder = new SystemJsBuilder();
  builder.config({
    baseURL: 'dist/lib',
    traceurOptions: buildConfig.traceurOptions,
    map: {
      rx: __dirname + '/node_modules/rx'
    }
  });
  return builder.build('angular2/angular2', 'dist/lib/angular2.js');
});


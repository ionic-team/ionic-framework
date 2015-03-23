/////
// Mostly stolen from https://github.com/pkozlowski-opensource/ng2-play
/////

var gulp = require('gulp');
var karma = require('karma').server;
var path = require('path');
var buildConfig = require('./scripts/build/config');
var through2 = require('through2');

var concat = require('gulp-concat');
var debug = require('gulp-debug');
var del = require('del');
var exec = require('gulp-exec');
var gulpif = require('gulp-if');
var karma = require('karma').server;
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var shell = require('gulp-shell');
var traceur = require('gulp-traceur');
var wrap = require('gulp-wrap');

gulp.task('default', ['js', 'html', 'sass', 'libs', 'playgroundJs', 'playgroundFiles']);

gulp.task('watch', ['default'], function() {
  var http = require('http');
  var connect = require('connect');
  var serveStatic = require('serve-static');
  var port = 9000;

  gulp.watch(buildConfig.src.html, ['html']);
  gulp.watch(buildConfig.src.js, ['js']);
  gulp.watch(buildConfig.src.scss, ['sass']);
  gulp.watch(buildConfig.src.playgroundJs, ['playgroundJs']);
  gulp.watch(buildConfig.src.playgroundFiles, ['playgroundFiles']);

  var app = connect().use(serveStatic(__dirname + '/' + buildConfig.dist));  // serve everything that is static
  http.createServer(app).listen(port);
  console.log('Serving `dist` on http://localhost:' + port);
});

gulp.task('karma', function() {
  return karma.start({ configFile: __dirname + '/scripts/test/karma.conf.js' });
});
gulp.task('karma-watch', function() {
  return karma.start({ configFile: __dirname + '/scripts/test/karma-watch.conf.js' });
});

gulp.task('sass-watch', ['sass'], function () {
  gulp.watch('src/**/*.scss', ['sass']);
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

gulp.task('playgroundFiles', function() {
  return gulp.src(buildConfig.src.playgroundFiles)
    .pipe(gulp.dest(buildConfig.dist));
});

gulp.task('playgroundJs', function() {
  return gulp.src(buildConfig.src.playgroundJs)
    .pipe(rename({extname: ''})) //hack, see: https://github.com/sindresorhus/gulp-traceur/issues/54
    .pipe(plumber())
    .pipe(traceur({
        modules: 'instantiate',
        moduleName: true,
        annotations: true,
        types: true
    }))
    .pipe(rename({extname: '.js'})) //hack, see: https://github.com/sindresorhus/gulp-traceur/issues/54
    .pipe(gulp.dest(buildConfig.dist));
});

function traceurCompile() {
  return lazypipe()
    ();
}
gulp.task('js', function () {
  return gulp.src(buildConfig.src.js)
    .pipe(rename(function(file) {
      // Forces the files to register themselves with 'ionic' prefix
      file.dirname = 'ionic/' + file.dirname;
    }))
    .pipe(rename({extname: ''})) //hack, see: https://github.com/sindresorhus/gulp-traceur/issues/54
    .pipe(plumber())
    .pipe(traceur({
        modules: 'instantiate',
        moduleName: true,
        annotations: true,
        types: true
    }))
    .pipe(rename({extname: '.js'})) //hack, see: https://github.com/sindresorhus/gulp-traceur/issues/54
    // compiled js files in playground go to the playground root, everything else goes in /ionic
    .pipe(gulp.dest('dist'));
});

gulp.task('html', function () {
  // Don't do anything with html for now
  // return gulp.src(buildConfig.src.html)
  //   .pipe(gulp.dest(buildConfig.dist));
});

gulp.task('libs', ['angular2'], function () {
  return gulp.src(buildConfig.lib)
    .pipe(gulp.dest('dist/lib'));
});

gulp.task('angular2', function () {
  //transpile & concat
  return gulp.src([
    'node_modules/angular2/es6/prod/*.es6',
    'node_modules/angular2/es6/prod/src/**/*.es6'
  ], {
    base: 'node_modules/angular2/es6/prod'
  })
    .pipe(rename(function(path){
        path.dirname = 'angular2/' + path.dirname; //this is not ideal... but not sure how to change angular's file structure
        path.extname = ''; //hack, see: https://github.com/sindresorhus/gulp-traceur/issues/54
    }))
    .pipe(traceur({ modules: 'instantiate', moduleName: true}))
    .pipe(concat('angular2.js'))
    .pipe(gulp.dest('dist/lib'));
});

gulp.task('examples', function() {
  var mainFileRegex = /(main|index).html$/;
  return gulp.src('src/components/**/examples/**/*') 
    .pipe(gulpif(mainFileRegex, wrap({
      src: 'scripts/examples/index.template.html' 
    })))
    .pipe(gulpif(mainFileRegex, rename({
      basename: 'index.html' 
    })))
    .pipe(rename(function(file) {
      file.dirname = file.dirname.replace('/examples/', '/');
    }))
    .pipe(gulp.dest('dist/examples/'));
});

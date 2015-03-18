/////
// Mostly stolen from https://github.com/pkozlowski-opensource/ng2-play
/////

var gulp = require('gulp');
var gulpif = require('gulp-if');
var del = require('del');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var traceur = require('gulp-traceur');
var lazypipe = require('lazypipe');
var sass = require('gulp-sass');

var config = {
  dist: 'dist',
  src: {
    js: ['src/**/*.js', '!src/**/*.spec.js'],
    html: 'src/**/*.html',
    scss: 'src/**/*.scss',
    playgroundJs: 'playground/**/*.js',
    playgroundFiles: ['playground/**/*', '!playground/**/*.js'],
  },
  lib: [
    'node_modules/gulp-traceur/node_modules/traceur/bin/traceur-runtime.js',
    'node_modules/es6-module-loader/dist/es6-module-loader-sans-promises.src.js',
    'node_modules/systemjs/lib/extension-register.js',
    'node_modules/angular2/node_modules/zone.js/zone.js',
    'node_modules/hammerjs/hammer.js'
  ]
};

gulp.task('default', ['js', 'html', 'sass', 'libs', 'playgroundJs', 'playgroundFiles']);

gulp.task('watch', ['default'], function () {
  var http = require('http');
  var connect = require('connect');
  var serveStatic = require('serve-static');
  var open = require('open');
  var port = 9000;

  gulp.watch(config.src.html, ['html']);
  gulp.watch(config.src.js, ['js']);
  gulp.watch(config.src.sass, ['sass']);
  gulp.watch(config.src.playgroundJs, ['playgroundJs']);
  gulp.watch(config.src.playgroundFiles, ['playgroundFiles']);

  var app = connect().use(serveStatic(__dirname + '/' + config.dist));  // serve everything that is static
  http.createServer(app).listen(port);
  console.log('Serving `dist` on http://localhost:' + port);
});

gulp.task('sass-watch', ['sass'], function () {
  gulp.watch('src/**/*.scss', ['sass']);
});

gulp.task('sass', function(done) {
  gulp.src('src/core/styles/ionic.scss')
    .pipe(sass({
      onError: function(err) {
        console.log(err);
      }
    }))
    .pipe(gulp.dest('dist/css'))
    .on('end', done);
});

gulp.task('clean', function(done) {
  del([config.dist], done);
});

gulp.task('playgroundFiles', function() {
  return gulp.src(config.src.playgroundFiles)
    .pipe(gulp.dest(config.dist));
});

gulp.task('playgroundJs', function() {
  return gulp.src(config.src.playgroundJs)
   .pipe(traceurCompile())
    .pipe(gulp.dest(config.dist));
});

function traceurCompile() {
  return lazypipe()
    .pipe(rename, {extname: ''}) //hack, see: https://github.com/sindresorhus/gulp-traceur/issues/54
    .pipe(plumber)
    .pipe(traceur, {
        modules: 'instantiate',
        moduleName: true,
        annotations: true,
        types: true
    })
    .pipe(rename, {extname: '.js'}) //hack, see: https://github.com/sindresorhus/gulp-traceur/issues/54
    ();
}
gulp.task('js', function () {
  return gulp.src(config.src.js)
    .pipe(rename(function(file) {
      // Forces the files to register themselves with 'ionic' prefix
      file.dirname = 'ionic/' + file.dirname;
    }))
    .pipe(traceurCompile())
    // compiled js files in playground go to the playground root, everything else goes in /ionic
    .pipe(gulp.dest('dist'));
});

gulp.task('html', function () {
  // Don't do anything with html for now
  // return gulp.src(config.src.html)
  //   .pipe(gulp.dest(config.dist));
});

gulp.task('libs', ['angular2'], function () {
  return gulp.src(config.lib)
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

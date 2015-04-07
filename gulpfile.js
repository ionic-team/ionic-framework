var _ = require('lodash')
var buildConfig = require('./scripts/build/config')
var SystemJsBuilder = require('systemjs-builder')
var exec = require('child_process').exec
var fs = require('fs')
var gulp = require('gulp')
var karma = require('karma').server
var path = require('path')
var VinylFile = require('vinyl')

var argv = require('yargs').argv
var concat = require('gulp-concat')
var debug = require('gulp-debug')
var del = require('del')
var gulpif = require('gulp-if')
var karma = require('karma').server
var plumber = require('gulp-plumber')
var rename = require('gulp-rename')
var sass = require('gulp-sass')
var shell = require('gulp-shell')
var through2 = require('through2')
var traceur = require('gulp-traceur')

require('./scripts/snapshot/snapshot.task')(gulp, argv, buildConfig)

gulp.task('default', ['clean'], function() {
  gulp.run('build')
})

gulp.task('build', ['e2e', 'ionic-js', 'lib', 'sass'])

gulp.task('lib', ['ng2', 'fonts', 'dependencies'])

gulp.task('watch', ['default'], function() {
  gulp.watch(buildConfig.src.scss, ['sass'])
  gulp.watch([].concat(
    buildConfig.src.js, buildConfig.src.e2e, buildConfig.src.html,
    'scripts/e2e/index.template.html'
  ), ['e2e'])
})

gulp.task('karma', function() {
  return karma.start({ configFile: __dirname + '/scripts/test/karma.conf.js' })
})
gulp.task('karma-watch', function() {
  return karma.start({ configFile: __dirname + '/scripts/test/karma-watch.conf.js' })
})

gulp.task('dependencies', function() {
  return gulp.src(buildConfig.dependencies)
    .pipe(gulp.dest(buildConfig.distLib))
})

gulp.task('ionic-compile', function() {
  var builder = new SystemJsBuilder()
  builder.config({
    traceurOptions: buildConfig.traceurOptions,
    meta: {
      'angular2/angular2': { build: false },
      'angular2/src/di/annotations': { build: false },
      'angular2/src/core/compiler/private_component_loader': { build: false },
      'angular2/src/core/compiler/private_component_location': { build: false },
      'hammer': { build: false },
    },
    map: {
      'ionic2': 'src'
    }
  })
  return builder.build('ionic2/ionic2', buildConfig.distLib + '/ionic2.js')
})

gulp.task('ionic-js', ['ionic-compile'], function() {
  return gulp.src(buildConfig.distLib + '/ionic2.js')
    .pipe(through2.obj(function(file, enc, next) {
      var contents = file.contents.toString()
      contents = contents.replace(/"src\//g, '"ionic2/')
      file.contents = new Buffer(contents)
      next(null, file)
    }))
    .pipe(gulp.dest(buildConfig.distLib))
})

gulp.task('sass', function(done) {
  gulp.src('src/components/app/ionic.scss')
    .pipe(sass({
      onError: function(err) {
        console.log(err)
      }
    }))
    .pipe(gulp.dest('dist/css'))
    .on('end', done)
})

gulp.task('fonts', function(done) {
  gulp.src('src/components/icon/fonts/**/*')
      .pipe(gulp.dest('dist/fonts'))
      .on('end', done)
})

gulp.task('clean', function(done) {
  del([buildConfig.dist], done)
})

gulp.task('e2e', ['ionic-js', 'sass'], function() {
  var indexContents = _.template( fs.readFileSync('scripts/e2e/index.template.html') )({
    buildConfig: buildConfig
  });
  var testTemplate = _.template( fs.readFileSync('scripts/e2e/e2e.template.js') )

  var platforms = [
    'android',
    'default',
    'ios',
  ]

  // Get each test folder with gulp.src
  return gulp.src(buildConfig.src.e2e)
    .pipe(rename(function(file) {
      file.dirname = file.dirname.replace(path.sep + 'test' + path.sep, path.sep)
    }))
    .pipe(gulpif(/main.js$/, processMain()))
    .pipe(gulpif(/e2e.js$/, createPlatformTests()))
    .pipe(gulp.dest(buildConfig.dist + '/e2e'))

    function processMain() {
      return through2.obj(function(file, enc, next) {
        this.push(new VinylFile({
          base: file.base,
          contents: new Buffer(indexContents),
          path: file.path.replace(/main.js$/, 'index.html'),
        }))
        next(null, file)
      })
    }
    function createPlatformTests(file) {
      return through2.obj(function(file, enc, next) {
        var self = this
        var relativePath = path.dirname(file.path.replace(/^.*?src(\/|\\)components(\/|\\)/, ''))
        var contents = file.contents.toString()
        platforms.forEach(function(platform) {
          var platformContents = testTemplate({
            contents: contents,
            buildConfig: buildConfig,
            relativePath: relativePath,
            platform: platform
          })
          self.push(new VinylFile({
            base: file.base,
            contents: new Buffer(platformContents),
            path: file.path.replace(/e2e.js$/, platform + '.e2e.js')
          }))
        })
        next()
      })
    }

})

// Take es6 files from angular2's output, rename to js, and move to dist/lib/
gulp.task('ng2-rename', function(done) {
  exec('test -e node_modules/angular-master', function(err) {
    if (err) {
      console.log('You have not installed angular master.\n' +
                  'Please run ./scripts/build/update-angular.sh.\n' +
                  'Aborting.')
      return process.exit(1)
    }
    gulp.src([
      'node_modules/angular-master/dist/js/dev/es6/{angular2,rtts_assert}/**/*.es6'
    ])
      .pipe(rename({ extname: '.js' }))
      .pipe(gulp.dest(buildConfig.distLib))
      .on('end', done)
  })
})

// We use SystemJsBuilder to build ng2 because it will properly 
gulp.task('ng2', ['ng2-rename'], function() {
  var builder = new SystemJsBuilder()
  builder.config({
    baseURL: buildConfig.distLib,
    traceurOptions: buildConfig.traceurOptions,
    map: {
      rx: __dirname + '/node_modules/rx'
    }
  })
  return builder.build('angular2/angular2', buildConfig.distLib + '/angular2.js')
})

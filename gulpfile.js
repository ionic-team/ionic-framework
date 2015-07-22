var _ = require('lodash');
var buildConfig = require('./scripts/build/config');
var fs = require('fs');
var gulp = require('gulp');
var karma = require('karma').server;
var path = require('path');
var VinylFile = require('vinyl');
var argv = require('yargs').argv;
var cached = require('gulp-cached');
var concat = require('gulp-concat');
var del = require('del');
var gulpif = require('gulp-if');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var through2 = require('through2');
var runSequence = require('run-sequence');
var watch = require('gulp-watch');
var exec = require('child_process').exec;
var babel = require('gulp-babel');
var tsc = require('gulp-typescript');
var lazypipe = require('lazypipe');
var cache = require('gulp-cached');
var connect = require('gulp-connect');

function getBabelOptions(moduleName) {
  return {
    optional: ['es7.decorators'],
    modules: "system",
    moduleIds: true,
    getModuleId: function(name) {
      return moduleName + '/' + name.split('/test').join('');
    }
  }
}

var tscOptions = {
  target: 'ES6',
  // Don't use the version of typescript that gulp-typescript depends on, we need 1.5
  // see https://github.com/ivogabe/gulp-typescript#typescript-version
  typescript: require('typescript'),
  allowNonTsExtensions: true,
  isolatedModules: true,
  //declaration: true, //generate d.ts files
  emitDecoratorMetadata: true,
  experimentalDecorators: true,
  noEmitOnError: false,  // ignore errors
  rootDir: '.'
}
var tscReporter = {
    error: function (error) {
        console.error(error.message);
    }
};

// Framework
gulp.task('transpile', transpileTask);
gulp.task('bundle.js', bundleJsTask);
gulp.task('sass', sassTask);
gulp.task('fonts', fontsTask);

// Karma testing
gulp.task('tests', testsTask);
gulp.task('karma', karmaTask);
gulp.task('karma-watch', karmaWatchTask);

// e2e testing
gulp.task('e2e.copy', e2eCopyTask);
gulp.task('e2e.template', e2eHTMLTemplateTask);
gulp.task('e2e.transpile', e2eTranspileTask);
gulp.task('e2e.tests', e2eTestsTask);
gulp.task('e2e', gulp.parallel('e2e.copy', 'e2e.template', 'e2e.transpile', 'e2e.tests'));

// Utility
gulp.task('clean', cleanTask);
gulp.task('vendor', vendorTask);
gulp.task('copy-scripts', copyScriptsTask);
gulp.task('serve', serveTask);
gulp.task('watch-task', watchTask);
gulp.task('watch', gulp.series('serve', 'watch-task'));
gulp.task('examples', gulp.parallel('e2e.copy', 'e2e.template', 'e2e.transpile'));

// Build
gulp.task('build', gulp.parallel(
  gulp.series('transpile', 'bundle.js', 'copy-scripts'),
  'sass',
  'fonts',
  'vendor'
))

gulp.task('clean.build', gulp.series(
  'clean',
  'build'
));

gulp.task('build.watch', gulp.series(
  gulp.parallel('build', 'examples'),
  'serve',
  'watch-task'
))

/*****************************************************************************/

function watchTask(done) {
  watch([
      'ionic/**/*.js',
      'ionic/**/*.ts',
      '!ionic/components/*/test/**/*',
      '!ionic/util/test/*'
    ],
    gulp.series('transpile', 'bundle.js')
  );
  watch('ionic/components/*/test/**/*.ts', e2eTranspileTask);
  watch('scripts/e2e/e2e.template.html', e2eHTMLTemplateTask);
  watch([
      'ionic/components/*/test/**/*',
      '!ionic/components/*/test/**/*.ts'
    ],
    e2eCopyTask
  );
  watch('ionic/**/*.scss', sassTask);
  done();
}

function serveTask(done) {
  connect.server({
    root: 'dist',
    port: 8000,
    livereload: false
  });
  done();
}

function cleanTask(done) {
  del(['dist/'], done);
}

function transpileTask() {
  var stream = gulp.src([
      'ionic/**/*.ts',
      'ionic/**/*.js',
      '!ionic/components/*/test/**/*',
      '!ionic/init.js',
      '!ionic/util/test/*'
    ])
    .pipe(cache('transpile', { optimizeMemory: true }))
    .pipe(tsc(tscOptions, null, tscReporter))
    .on('error', function(error) {
      stream.emit('end');
    })
    .pipe(gulp.dest('dist/js/es6/ionic'))
    .pipe(babel(getBabelOptions('ionic')))
    .on('error', function (err) {
      console.log("ERROR: " + err.message);
      this.emit('end');
    })
    .pipe(gulp.dest('dist/js/es5/ionic'))

  return stream;
}

function bundleJsTask() {
  return gulp.src(['dist/js/es5/ionic/**/*.js', 'ionic/init.js'])
    .pipe(concat('ionic.bundle.js'))
    .pipe(gulp.dest('dist/js/'));
}

function testsTask() {
  return gulp.src('ionic/components/*/test/*/**/*.spec.ts')
    .pipe(tsc(tscOptions, null, tscReporter))
    .pipe(babel(getBabelOptions('tests')))
    .pipe(rename(function(file) {
      file.dirname = file.dirname.replace(path.sep + 'test' + path.sep, path.sep)
    }))
    .pipe(gulp.dest('dist/tests'))
}

function copyScriptsTask() {
  return gulp.src([
      'scripts/resources/*.js',
      'config.js',
      'dist/js/ionic.bundle.js',
      'dist/vendor/web-animations-js/web-animations.min.js'
    ])
    .pipe(gulp.dest('dist/lib'));
}


function e2eCopyTask() {
  return gulp.src([
      'ionic/components/*/test/*/**/*',
      '!ionic/components/*/test/*/**/*.ts'
    ])
    .pipe(rename(function(file) {
      file.dirname = file.dirname.replace(path.sep + 'test' + path.sep, path.sep)
    }))
    .pipe(gulp.dest('dist/e2e'))
}

function e2eTranspileTask() {
  return gulp.src([
      'ionic/components/*/test/*/**/*.ts',
      '!ionic/components/*/test/*/**/*.spec.ts',
      '!ionic/components/*/test/*/**/e2e.ts'
    ])
    .pipe(cache('e2e.transpile', { optimizeMemory: true }))
    .pipe(tsc(tscOptions, null, tscReporter))
    .pipe(babel(getBabelOptions('e2e')))
    .on('error', function (err) {
      console.log("ERROR: " + err.message);
      this.emit('end');
    })
    .pipe(rename(function(file) {
      file.dirname = file.dirname.replace(path.sep + 'test' + path.sep, path.sep)
    }))
    .pipe(gulp.dest('dist/e2e/'))
}

function e2eHTMLTemplateTask() {
  var HTMLTemplate = _.template(
    fs.readFileSync('scripts/e2e/e2e.template.html')
  )({
    buildConfig: buildConfig
  });

  // we won't actually do anything with index.ts, we just know that this is the
  // location index.html should be
  return gulp.src('ionic/components/*/test/*/**/index.ts')
    .pipe(cache('e2e.html.template', { optimizeMemory: true }))
    .pipe(through2.obj(function(file, enc, next) {
      var module = path.dirname(file.path)
                      .replace(__dirname, '')
                      .replace('/ionic/components/', 'e2e/')
                      .replace('/test/', '/') +
                      '/index';

      var templateContents = HTMLTemplate.replace('{{MODULE}}', module);
      var indexFile = new VinylFile({
        base: file.base,
        contents: new Buffer(templateContents),
        path: path.join(path.dirname(file.path), 'index.html'),
      })
      next(null, indexFile);
    }))
    .pipe(rename(function(file) {
      file.dirname = file.dirname.replace(path.sep + 'test' + path.sep, path.sep)
    }))
    .pipe(gulp.dest('dist/e2e/'))
}

function e2eTestsTask() {
  var testTemplate = _.template(fs.readFileSync('scripts/e2e/e2e.template.js'));
  var platforms = [
    'android',
    'core',
    'ios',
  ];

  return gulp.src('ionic/components/*/test/*/**/e2e.ts')
    .pipe(cache('e2e.tests', { optimizeMemory: true }))
    .pipe(tsc(tscOptions, null, tscReporter))
    .pipe(babel())
    .on('error', function (err) {
      console.log("ERROR: " + err.message);
      this.emit('end');
    })
    .pipe(rename(function(file) {
      file.dirname = file.dirname.replace(path.sep + 'test' + path.sep, path.sep)
    }))
    .pipe(through2.obj(function(file, enc, next) {
      var self = this;
      var relativePath = path.dirname(file.path.replace(/^.*?ionic(\/|\\)components(\/|\\)/, ''));
      var contents = file.contents.toString();
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
    }))
    .pipe(gulp.dest('dist/e2e/'))
}

function sassTask() {
  return gulp.src('ionic/ionic.scss')
    .pipe(sass({
      onError: function(err) {
        console.log(err)
      }
    }))
    .pipe(autoprefixer(buildConfig.autoprefixer))
    .pipe(gulp.dest('dist/css/'));
}

function fontsTask() {
  return gulp.src('ionic/components/icon/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));
}

function vendorTask() {
  return gulp.src(['scripts/vendor/**/*'])
    .pipe(gulp.dest('dist/vendor'));
}

function karmaTask() {
  return karma.start({ configFile: __dirname + '/scripts/test/karma.conf.js' })
}

function karmaWatchTask() {
  return karma.start({ configFile: __dirname + '/scripts/test/karma-watch.conf.js' })
}

// snapshot tasks
require('./scripts/snapshot/snapshot.task')(gulp, argv, buildConfig);

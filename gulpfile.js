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

gulp.task('clean.build', function(done) {
  runSequence(
    'clean',
    'transpile',
    'bundle.js',
    'e2e',
    'sass',
    'fonts',
    done
  );
})

gulp.task('build', function(done) {
  runSequence(
    'transpile',
    'bundle.js',
    'e2e',
    'sass',
    'fonts',
    done
  );
})

gulp.task('watch', function(done) {

  runSequence(
    'transpile',
    'bundle.js',
    'e2e',
    'sass',
    'fonts',
    'serve',
    function() {
      watch(
        [
          'ionic/**/*.js',
          'ionic/**/*.ts',
          '!ionic/components/*/test/**/*',
          '!ionic/util/test/*'
        ],
        function() {
          runSequence(
            'transpile',
            'bundle.js',
            'e2e'
          )
        }
      );

      watch('ionic/components/*/test/**/*', function() {
        gulp.start('e2e');
      });

      watch('ionic/**/*.scss', function() {
        gulp.start('sass');
      });

      done();
    }
  );
});

gulp.task('serve', function() {
  connect.server({
    root: 'dist',
    port: 8000,
    livereload: false
  });
});

gulp.task('clean', function(done) {
  del(['dist/'], done);
});

gulp.task('transpile', function() {
  var stream = gulp.src(
                      [
                         'ionic/**/*.ts',
                         'ionic/**/*.js',
                         '!ionic/components/*/test/**/*',
                         '!ionic/init.js',
                         '!ionic/util/test/*'
                      ]
                   )
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
});

gulp.task('bundle.js', function() {
  return gulp.src(['dist/js/es5/ionic/**/*.js', 'ionic/init.js'])
             .pipe(concat('ionic.bundle.js'))
             .pipe(gulp.dest('dist/js/'));
});

gulp.task('tests', function() {
  return gulp.src('ionic/components/*/test/*/**/*.spec.ts')
             .pipe(tsc(tscOptions, null, tscReporter))
             .pipe(babel(getBabelOptions('tests')))
             .pipe(rename(function(file) {
               file.dirname = file.dirname.replace(path.sep + 'test' + path.sep, path.sep)
             }))
             .pipe(gulp.dest('dist/tests'))
})

gulp.task('copy-scripts', function(){
  gulp.src([
    'scripts/resources/*.js',
    'scripts/vendor/web-animations-js/web-animations.min.js',
    'config.js',
    'dist/js/ionic.bundle.js'
  ]).pipe(gulp.dest('dist/lib'));
})

gulp.task('e2e', ['copy-scripts'], function() {
  var buildTest = lazypipe()
             //.pipe(traceur, traceurOptions)
             .pipe(tsc, tscOptions, null, tscReporter)
             .pipe(babel, getBabelOptions('e2e'))

  var buildE2ETest = lazypipe()
             //.pipe(traceur, traceurOptions)
             .pipe(tsc, tscOptions, null, tscReporter)
             .pipe(babel)

  var indexTemplate = _.template(
   fs.readFileSync('scripts/e2e/e2e.template.html')
  )({
   buildConfig: buildConfig

  })
  var testTemplate = _.template( fs.readFileSync('scripts/e2e/e2e.template.js') )

  var platforms = [
    'android',
    'ios',
    //'core'
  ];

  // Get each test folder with gulp.src
  return gulp.src(['ionic/components/*/test/*/**/*', '!ionic/components/*/test/*/**/*.spec.ts'])
    .pipe(cache('e2e', { optimizeMemory: true }))
    .pipe(gulpif(/e2e.ts$/, buildE2ETest()))
    .pipe(gulpif(/.ts$/, buildTest()))
    .on('error', function (err) {
      console.log("ERROR: " + err.message);
      this.emit('end');
    })
    .pipe(gulpif(/index.js$/, createIndexHTML())) //TSC changes .ts to .js
    .pipe(rename(function(file) {
      file.dirname = file.dirname.replace(path.sep + 'test' + path.sep, path.sep)
    }))
    .pipe(gulpif(/e2e.js$/, createPlatformTests()))
    .pipe(gulp.dest('dist/e2e/'))

  function createIndexHTML() {
    return through2.obj(function(file, enc, next) {
      var self = this;

      var module = path.dirname(file.path)
                      .replace(__dirname, '')
                      .replace('/ionic/components/', 'e2e/')
                      .replace('/test/', '/') +
                      '/index';

      var indexContents = indexTemplate.replace('{{MODULE}}', module);

      self.push(new VinylFile({
        base: file.base,
        contents: new Buffer(indexContents),
        path: path.join(path.dirname(file.path), 'index.html'),
      }));
      next(null, file);
    });
  }

  function createPlatformTests(file) {
    return through2.obj(function(file, enc, next) {
      var self = this
      var relativePath = path.dirname(file.path.replace(/^.*?ionic(\/|\\)components(\/|\\)/, ''))
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
});

gulp.task('sass', function() {
  return gulp.src('ionic/ionic.scss')
    .pipe(sass({
      onError: function(err) {
        console.log(err)
      }
    }))
    .pipe(autoprefixer(buildConfig.autoprefixer))
    .pipe(gulp.dest('dist/css/'));
});

gulp.task('fonts', function() {
  return gulp.src('ionic/components/icon/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));
});

require('./scripts/snapshot/snapshot.task')(gulp, argv, buildConfig);

gulp.task('karma', function() {
  return karma.start({ configFile: __dirname + '/scripts/test/karma.conf.js' })
  //return karma.start({ configFile: __dirname + '/karma.conf.js' })
});

gulp.task('karma-watch', function() {
  return karma.start({ configFile: __dirname + '/scripts/test/karma-watch.conf.js' })
});

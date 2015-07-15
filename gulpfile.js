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


gulp.task('clean.build', function() {
  runSequence(
    'clean',
    'transpile',
    //'bundle.deps',
    'bundle.js',
    'examples',
    'sass',
    'fonts',
    'vendor');
})

gulp.task('build', function() {
  runSequence(
    'transpile',
    'bundle.js',
    'examples',
    'sass',
    'fonts',
    'vendor');
})

gulp.task('watch', function() {

  runSequence(
    'transpile',
    'bundle.js',
    'examples',
    'sass',
    'fonts',
    'vendor',
    'serve',

    function() {
      watch(['ionic/**/*.js', 'ionic/**/*.ts', '!ionic/components/*/test/**/*'], function() {
        runSequence(
          'transpile',
          'bundle.js',
          'examples'
        )
      });

      watch('ionic/components/*/test/**/*', function() {
        gulp.start('examples');
      });

      watch('ionic/**/*.scss', function() {
        gulp.start('sass');
      });
    })
});

gulp.task('serve', function() {
  connect.server({
    port: 8000,
    livereload: false
  });
});

gulp.task('clean', function(done) {
  del(['dist/'], done);
});

var traceurOptions = {
  annotations: true,
  types: true,
  outputLanguage: 'es6'
};

var babelOptions = {
  optional: ['es7.decorators'],
  /*plugins: [
    './transformers/disable-define',
    'angular2-annotations',
    'type-assertion:after'
  ],*/
  modules: "system",
  moduleIds: true,
  getModuleId: function(name) {
    return "ionic/" + name;
  }
};

var exampleBabelOptions = {
  optional: ['es7.decorators'],
  /*plugins: [
    './transformers/disable-define',
    'angular2-annotations',
    'type-assertion:after'
  ],*/
  modules: "system",
  moduleIds: true,
  getModuleId: function(name) {
    return "dist/examples/" + name.split('/test').join('');
  }
};

var testBabelOptions = {
  optional: ['es7.decorators'],
  /*plugins: [
    './transformers/disable-define',
    'angular2-annotations',
    'type-assertion:after'
  ],*/
  modules: "system",
  moduleIds: true,
  getModuleId: function(name) {
    return "dist/tests/" + name.split('/test').join('');
  }
};

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

gulp.task('transpile', function() {
  var stream = gulp.src(['ionic/**/*.ts', 'ionic/**/*.js', '!ionic/components/*/test/**/*', '!ionic/init.js'])
                   .pipe(cache('transpile', { optimizeMemory: true }))
                   .pipe(tsc(tscOptions, null, tscReporter))
                   .on('error', function(error) {
                     stream.emit('end');
                   })
                // .pipe(traceur(traceurOptions))
                // .on('error', function (err) {
                //   console.log("ERROR: " + err.message);
                //   this.emit('end');
                // })
                   .pipe(gulp.dest('dist/js/es6/ionic'))
                   .pipe(babel(babelOptions))
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

//gulp.task('bundle.deps', function() {
//  var Builder = require('systemjs-builder')
//  var builder = new Builder();
//  return builder.loadConfig('config.js').then(function(){
//    // add ionic and angular2 build paths, since config.js is loaded at runtime from
//    // tests we don't want to put them there
//    builder.config({
//      baseURL: 'file:' + process.cwd(),
//      paths : {
//        "ionic/*": "dist/js/es6/ionic/*.js"
//      }
//    });
//    return builder.build('dist/js/es6/ionic/**/* - [dist/js/es6/ionic/**/*]', 'dist/js/dependencies.js');
//  }, function(error){
//    console.log("Error building dependency bundle, have you transpiled Ionic and/or built Angular2 yet?");
//    throw new Error(error);
//  })
//});
gulp.task('tests', function() {
  return gulp.src('ionic/components/*/test/*/**/*.spec.ts')
             .pipe(tsc(tscOptions, null, tscReporter))
             .pipe(babel(testBabelOptions))
             .pipe(rename(function(file) {
               file.dirname = file.dirname.replace(path.sep + 'test' + path.sep, path.sep)
             }))
             .pipe(gulp.dest('dist/tests'))
})


gulp.task('examples', function() {
  var buildTest = lazypipe()
             //.pipe(traceur, traceurOptions)
             .pipe(tsc, tscOptions, null, tscReporter)
             .pipe(babel, exampleBabelOptions)

  // Get each test folder with gulp.src
  return gulp.src(['ionic/components/*/test/*/**/*', '!ionic/components/*/test/*/**/*.spec.ts'])
    .pipe(cache('examples', { optimizeMemory: true }))
    .pipe(gulpif(/.ts$/, buildTest()))
    .on('error', function (err) {
      console.log("ERROR: " + err.message);
      this.emit('end');
    })
    .pipe(gulpif(/index.js$/, createIndexHTML())) //TSC changes .ts to .js
    .pipe(rename(function(file) {
      file.dirname = file.dirname.replace(path.sep + 'test' + path.sep, path.sep)
    }))
    .pipe(gulp.dest('dist/examples/'))

  function createIndexHTML() {
    var template = _.template(
      fs.readFileSync('scripts/e2e/ionic.template.html')
    )({
      buildConfig: buildConfig
    });

    return through2.obj(function(file, enc, next) {
      var self = this;

      var module = path.dirname(file.path)
                      .replace(__dirname, '')
                      .replace('/ionic/components/', 'dist/examples/')
                      .replace('/test/', '/') +
                      '/index';

      var indexContents = template.replace('{{MODULE}}', module);

      self.push(new VinylFile({
        base: file.base,
        contents: new Buffer(indexContents),
        path: path.join(path.dirname(file.path), 'index.html'),
      }));
      next(null, file);
    });
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


gulp.task('vendor', function() {
  return gulp.src(['scripts/vendor/**/*'])
    .pipe(gulp.dest('dist/vendor'));
});

require('./scripts/snapshot/snapshot.task')(gulp, argv, buildConfig);

gulp.task('karma', function() {
  return karma.start({ configFile: __dirname + '/scripts/test/karma.conf.js' })
  //return karma.start({ configFile: __dirname + '/karma.conf.js' })
});

gulp.task('karma-watch', function() {
  return karma.start({ configFile: __dirname + '/scripts/test/karma-watch.conf.js' })
});

gulp.task('e2e', ['sass'], function() {
  var indexContents = _.template( fs.readFileSync('scripts/e2e/index.template.html') )({
    buildConfig: buildConfig
  });
  var testTemplate = _.template( fs.readFileSync('scripts/e2e/e2e.template.js') )

  var platforms = [
    'android',
    'core',
    'ios',
  ];

  gulp.src(['ionic/**/*.js'])
           .pipe(gulp.dest('dist/src'));

  // Get each test folder with gulp.src
  return gulp.src(buildConfig.src.e2e)
    .pipe(cached('e2e'))
    .pipe(rename(function(file) {
      file.dirname = file.dirname.replace(path.sep + 'test' + path.sep, path.sep)
    }))
    .pipe(gulpif(/main.js$/, processMain()))
    //.pipe(gulpif(/e2e.js$/, createPlatformTests()))
    .pipe(gulp.dest(buildConfig.dist + '/e2e'));

    function processMain() {
      return through2.obj(function(file, enc, next) {
        var self = this;
        self.push(new VinylFile({
          base: file.base,
          contents: new Buffer(indexContents),
          path: path.join(path.dirname(file.path), 'index.html'),
        }));
        next(null, file);
      })
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

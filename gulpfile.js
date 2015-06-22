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
var traceur = require('gulp-traceur');
var webpack = require('gulp-webpack');
var lazypipe = require('lazypipe');
var cache = require('gulp-cached');
var connect = require('gulp-connect');


gulp.task('clean.build', function() {
  runSequence(
    'clean',
    'transpile',
    'bundle.deps',
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
      watch(['ionic/**/*.js', '!ionic/components/*/test/**/*'], function() {
        runSequence(
          'transpile',
          'bundle.js',
          'examples'
        )
      });

      watch('ionic/components/*/test/**/*', function() {
        gulp.start('examples');
      });

      watch('ionic/components/**/*.scss', function() {
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
}

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

gulp.task('transpile', function() {
  return gulp.src(['ionic/**/*.js', '!ionic/components/*/test/**/*', '!ionic/init.js'])
             .pipe(cache('transpile', { optimizeMemory: true }))
             .pipe(traceur(traceurOptions))
             .on('error', function (err) {
               console.log("ERROR: " + err.message);
               this.emit('end');
             })
             .pipe(gulp.dest('dist/js/es6/ionic'))
             .pipe(babel(babelOptions))
             .on('error', function (err) {
               console.log("ERROR: " + err.message);
               this.emit('end');
             })
             .pipe(gulp.dest('dist/js/es5/ionic'))
});

gulp.task('bundle.js', function() {
  return gulp.src(['dist/js/es5/ionic/**/*.js', 'ionic/init.js'])
             .pipe(concat('ionic.bundle.js'))
             .pipe(gulp.dest('dist/js/'));
});

gulp.task('bundle.deps', function() {
  var Builder = require('systemjs-builder')
  var builder = new Builder();
  return builder.loadConfig('config.js').then(function(){
    // add ionic and angular2 build paths, since config.js is loaded at runtime from
    // tests we don't want to put them there
    builder.config({
      baseURL: 'file:' + process.cwd(),
      paths : {
        "ionic/*": "dist/js/es6/ionic/*.js"
      }
    });
    return builder.build('dist/js/es6/ionic/**/* - [dist/js/es6/ionic/**/*]', 'dist/js/dependencies.js');
  }, function(error){
    console.log("Error building dependency bundle, have you transpiled Ionic and/or built Angular2 yet?");
    throw new Error(error);
  })
});

gulp.task('examples', function() {
  var buildTest = lazypipe()
             .pipe(traceur, traceurOptions)
             //.pipe(babel, babelOptions) Let SystemJS load index.js at runtime, saves build time

  // Get each test folder with gulp.src
  return gulp.src('ionic/components/*/test/*/**/*')
    .pipe(cache('examples', { optimizeMemory: true }))
    .pipe(gulpif(/.js$/, buildTest()))
    .on('error', function (err) {
            console.log("ERROR: " + err.message);
            this.emit('end');
        })
    .pipe(gulpif(/index.js$/, createIndexHTML()))
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


/********************************************************************/

gulp.task('old.build', function() {
  runSequence(
    'old.clean',
    'old.ionic.copy.js',
    'old.ionic.examples',
    'old.sass',
    'old.fonts',
    'old.vendor');
})

gulp.task('old.watch', function() {

  runSequence(
    'old.clean',
    'old.ionic.copy.js',
    'old.ionic.examples',
    'old.sass',
    'old.fonts',
    'old.vendor',

    function() {
      watch('ionic/**/*.js', function(file) {
        var splt = file.path.split('/');
        var filename = splt[splt.length - 1];

        var dest = file.path.replace(__dirname, '../angular-ionic/modules');
        dest = dest.replace(filename, '')

        doubleCheckDistFiles();

        return gulp.src(file.path).pipe(gulp.dest(dest));
      });

      watch('ionic/components/*/test/**/*', function() {
        doubleCheckDistFiles();
        gulp.start('old.ionic.examples');
      });

      watch('ionic/components/**/*.scss', function() {
        gulp.start('old.sass');
      });
    })

});

function doubleCheckDistFiles() {
  if (!fs.existsSync('../angular-ionic/dist/js/dev/es5/css')) {
    gulp.start('old.sass');
  }

  if (!fs.existsSync('../angular-ionic/dist/js/dev/es5/fonts')) {
    gulp.start('old.fonts');
  }

  if (!fs.existsSync('../angular-ionic/dist/js/dev/es5/vendor')) {
    gulp.start('old.vendor');
  }
}

gulp.task('old.clean', function(done) {
  del(['../angular-ionic/modules/ionic, ./angular-ionic/modules/examples/src/ionic'], done);
});


gulp.task('old.ionic.copy.js', function(done) {
  return gulp.src(['ionic/**/*.js', '!ionic/components/*/test/**/*'])
             .pipe(gulp.dest('../angular-ionic/modules/ionic'));
});


gulp.task('old.ionic.examples', function() {
  var indexContents = _.template( fs.readFileSync('scripts/e2e/angular.template.html') )({
    buildConfig: buildConfig
  });

  // Get each test folder with gulp.src
  return gulp.src('ionic/components/*/test/*/**/*')
    .pipe(rename(function(file) {
      file.dirname = file.dirname.replace(path.sep + 'test' + path.sep, path.sep)
    }))
    .pipe(gulpif(/index.js$/, processMain()))
    .pipe(gulp.dest('../angular-ionic/modules/examples/src/ionic'))

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

});


gulp.task('old.sass', function() {
  return gulp.src('ionic/ionic.scss')
    .pipe(sass({
      onError: function(err) {
        console.log(err)
      }
    }))
    .pipe(autoprefixer(buildConfig.autoprefixer))
    .pipe(gulp.dest('../angular-ionic/dist/js/dev/es5/css'));
});


gulp.task('old.fonts', function() {
  return gulp.src('ionic/components/icon/fonts/**/*')
    .pipe(gulp.dest('../angular-ionic/dist/js/dev/es5/fonts'));
});


gulp.task('old.vendor', function() {
  return gulp.src(['scripts/vendor/**/*'])
    .pipe(gulp.dest('../angular-ionic/dist/js/dev/es5/vendor'));
});


gulp.task('old.update.angular', function(done) {

  if (!fs.existsSync('../angular-ionic')) {
    fs.mkdirSync('../angular-ionic');

    console.log('cloning angular master...');
    exec('git clone git@github.com:angular/angular ../angular-ionic', function() {
      npmInstall();
    });

  } else {
    console.log('angular master: cleaning modules');
    del(['../angular-ionic/modules'], function() {

      console.log('angular master: reset --hard...');
      exec('git reset --hard origin/master', {cwd: '../angular-ionic'}, function () {

        console.log('angular master: git pull origin master...');
        exec('git pull origin master', function () {
          npmInstall();
        });
      });

    })
  }

  function npmInstall() {
    console.log('angular master: npm install (may take a while, chill out)...');
    exec('npm install', {cwd: '../angular-ionic'}, function () {
      done();
    });
  }

});

gulp.task('old.karma', function() {
  return karma.start({ configFile: __dirname + '/scripts/test/karma.conf.js' })
});

gulp.task('old.karma-watch', function() {
  return karma.start({ configFile: __dirname + '/scripts/test/karma-watch.conf.js' })
});

gulp.task('old.e2e', ['old.sass'], function() {
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

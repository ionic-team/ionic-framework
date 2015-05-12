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
var through2 = require('through2');
var runSequence = require('run-sequence');
var watch = require('gulp-watch');
var exec = require('child_process').exec;


// !!! TEMP HACK !!!
// first run ./update-angular.sh
gulp.task('watch', function() {

  runSequence(
    'clean',
    'ionic.copy.js',
    'ionic.examples',
    'sass',

    function() {
      watch('ionic/**/*.js', function() {
        gulp.start('ionic.copy.js');
      });

      watch('ionic/components/*/test/**/*', function() {
        gulp.start('ionic.examples');
      });

      watch('ionic/components/**/*.scss', function() {
        gulp.start('sass');
      });
    })

});

gulp.task('clean', function(done) {
  del(['../angular/modules/ionic, ./angular/modules/examples/src/ionic'], done);
});


gulp.task('ionic.copy.js', function(done) {
  return gulp.src(['ionic/**/*.js', '!ionic/components/*/test/**/*'])
             .pipe(gulp.dest('../angular/modules/ionic'));
});


gulp.task('ionic.examples', function() {
  var indexContents = _.template( fs.readFileSync('scripts/e2e/angular.template.html') )({
    buildConfig: buildConfig
  });

  // Get each test folder with gulp.src
  return gulp.src('ionic/components/*/test/*/**/*')
    .pipe(rename(function(file) {
      file.dirname = file.dirname.replace(path.sep + 'test' + path.sep, path.sep)
    }))
    .pipe(gulpif(/index.js$/, processMain()))
    .pipe(gulp.dest('../angular/modules/examples/src/ionic'))

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


gulp.task('sass', function() {
  return gulp.src('ionic/ionic.scss')
    .pipe(sass({
      onError: function(err) {
        console.log(err)
      }
    }))
    .pipe(gulp.dest('dist/css'));
});


gulp.task('update.angular', function(done) {

  if (!fs.existsSync('../angular')) {
    fs.mkdirSync('../angular');

    console.log('cloning angular master...');
    exec('git clone git@github.com:angular/angular ../angular', function() {
      npmInstall();
    });

  } else {
    console.log('angular master: cleaning modules');
    del(['../angular/modules'], function() {

      console.log('angular master: reset --hard...');
      exec('git reset --hard origin/master', {cwd: '../angular'}, function () {

        console.log('angular master: git pull origin master...');
        exec('git pull origin master', function () {
          npmInstall();
        });
      });

    })
  }

  function npmInstall() {
    console.log('angular master: npm install (may take a while, chill out)...');
    exec('npm install', {cwd: '../angular'}, function () {
      done();
    });
  }

});



require('./scripts/snapshot/snapshot.task')(gulp, argv, buildConfig);


// gulp.task('watch', ['default'], function() {
//   gulp.watch(buildConfig.src.scss, ['sass'])
//   gulp.watch([].concat(
//     buildConfig.src.js, buildConfig.src.html,
//     'scripts/e2e/index.template.html'
//   ), ['e2e'])
//   gulp.watch([].concat(
//     buildConfig.src.e2e, buildConfig.src.html,
//     'scripts/e2e/index.template.html'
//   ), ['ionic-js'])
// });

gulp.task('karma', function() {
  return karma.start({ configFile: __dirname + '/scripts/test/karma.conf.js' })
});

gulp.task('karma-watch', function() {
  return karma.start({ configFile: __dirname + '/scripts/test/karma-watch.conf.js' })
});

gulp.task('fonts', function() {
  return gulp.src('ionic/components/icon/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));
});






gulp.task('e2e', ['ionic-js', 'sass'], function() {
  var indexContents = _.template( fs.readFileSync('scripts/e2e/index.template.html') )({
    buildConfig: buildConfig
  });
  var testTemplate = _.template( fs.readFileSync('scripts/e2e/e2e.template.js') )

  var platforms = [
    'android',
    'core',
    'ios',
  ];

  // Get each test folder with gulp.src
  return gulp.src(buildConfig.src.e2e)
    .pipe(cached('e2e'))
    .pipe(rename(function(file) {
      file.dirname = file.dirname.replace(path.sep + 'test' + path.sep, path.sep)
    }))
    .pipe(gulpif(/main.js$/, processMain()))
    //.pipe(gulpif(/e2e.js$/, createPlatformTests()))
    //.pipe(gulp.dest(buildConfig.dist + '/e2e'))

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

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
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var runSequence = require('run-sequence');


// !!! TEMP HACK !!!
// first run ./update-angular.sh
gulp.task('build', function(done) {

  if (!fs.existsSync('./dist/angular')) {
    console.error('hey yo, run "gulp update.angular" first');
    return;
  }

  runSequence(
    'ionic.copy.js',
    'ionic.examples',
    'angular.build',
    done
  );

});


gulp.task('ionic.copy.js', function(done) {
  console.log('copying ionic src JS to dist/angular/modules/ionic...');
  return gulp.src('ionic/**/*.js')
    .pipe(gulp.dest('dist/angular/modules/ionic'));
});


gulp.task('ionic.examples', function() {
  var indexContents = _.template( fs.readFileSync('scripts/e2e/angular.template.html') )({
    buildConfig: buildConfig
  });

  // Get each test folder with gulp.src
  return gulp.src('ionic/components/*/test/*/**/*')
    .pipe(cached('ionicexamples'))
    .pipe(rename(function(file) {
      file.dirname = file.dirname.replace(path.sep + 'test' + path.sep, path.sep)
    }))
    .pipe(gulpif(/main.js$/, processMain()))
    .pipe(gulp.dest('dist/angular/modules/examples/src/ionic'))

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


gulp.task('serve', function(done) {

  runSequence(
    'build',
    'angular.serve',
    done
  );

});


gulp.task('angular.serve', function(done) {

  var serve = spawn('gulp', ['serve.js.dev'], {
    cwd: './dist/angular'
  });

  serve.stdout.on('data', function (data) {
    console.log('' + data);
  });

  serve.stderr.on('data', function (data) {
    console.log('' + data);
  });

  serve.on('close', function (code) {
    console.log('gulp serve exited with code ' + code);
  });

});


gulp.task('angular.build', function(done) {

  var child = exec('gulp build.js.dev', {
    cwd: './dist/angular'
  }, function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
    done();
  });

});


gulp.task('update.angular', function(done) {

  if (!fs.existsSync('./dist')) {
    fs.mkdirSync('./dist');
  }
  if (!fs.existsSync('./dist/angular')) {
    fs.mkdirSync('./dist/angular');

    console.log('cloning angular master...');
    exec('git clone git@github.com:angular/angular ./dist/angular', function() {
      npmInstall();
    });

  } else {
    console.log('angular master: cleaning modules');
    del(['dist/angular/modules'], {cwd: './dist/angular'}, function() {

      console.log('angular master: reset --hard...');
      exec('git reset --hard origin/master', {cwd: './dist/angular'}, function () {

        console.log('angular master: git pull origin master...');
        exec('git pull origin master', function () {
          npmInstall();
        });
      });

    })
  }

  function npmInstall() {
    console.log('angular master: npm install (may take a while, chill out)...');
    exec('npm install', {cwd: './dist/angular'}, function () {
      done();
    });
  }

});




require('./scripts/snapshot/snapshot.task')(gulp, argv, buildConfig);

gulp.task('default', ['clean'], function() {
  gulp.run('build');
});


gulp.task('watch', ['default'], function() {
  gulp.watch(buildConfig.src.scss, ['sass'])
  gulp.watch([].concat(
    buildConfig.src.js, buildConfig.src.html,
    'scripts/e2e/index.template.html'
  ), ['e2e'])
  gulp.watch([].concat(
    buildConfig.src.e2e, buildConfig.src.html,
    'scripts/e2e/index.template.html'
  ), ['ionic-js'])
});

gulp.task('karma', function() {
  return karma.start({ configFile: __dirname + '/scripts/test/karma.conf.js' })
});

gulp.task('karma-watch', function() {
  return karma.start({ configFile: __dirname + '/scripts/test/karma-watch.conf.js' })
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

gulp.task('fonts', function() {
  return gulp.src('ionic/components/icon/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));
});


gulp.task('clean', function(done) {
  del(['dist/e2e'], done);
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

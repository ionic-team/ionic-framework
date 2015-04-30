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
var babel = require('gulp-babel')
var cached = require('gulp-cached');
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

gulp.task('build', ['e2e', 'ionic-js', 'ng2', 'sass'])

gulp.task('lib', ['fonts', 'dependencies'])

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
})

gulp.task('karma', function() {
  return karma.start({ configFile: __dirname + '/scripts/test/karma.conf.js' })
})
gulp.task('karma-watch', function() {
  return karma.start({ configFile: __dirname + '/scripts/test/karma-watch.conf.js' })
})

gulp.task('dependencies', function() {
  var copyFrom = buildConfig.scripts
    .map(function(data) {  return data.from; })
    .filter(function(item) { return !!item; });
  return gulp.src(copyFrom)
    .pipe(gulp.dest(buildConfig.distLib))
})

gulp.task('sass', function() {
  return gulp.src('ionic/ionic.scss')
    .pipe(sass({
      onError: function(err) {
        console.log(err)
      }
    }))
    .pipe(gulp.dest('dist/css'));
})

gulp.task('fonts', function() {
  return gulp.src('ionic/components/icon/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));
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
    'core',
    'ios',
  ]

  // Get each test folder with gulp.src
  return gulp.src(buildConfig.src.e2e)
    .pipe(cached('e2e'))
    .pipe(rename(function(file) {
      file.dirname = file.dirname.replace(path.sep + 'test' + path.sep, path.sep)
    }))
    .pipe(gulpif(/main.js$/, processMain()))
    .pipe(gulpif(/e2e.js$/, createPlatformTests()))
    .pipe(gulp.dest(buildConfig.dist + '/e2e'))

    function processMain() {
      return through2.obj(function(file, enc, next) {
        var self = this;
        self.push(new VinylFile({
          base: file.base,
          contents: new Buffer(indexContents),
          path: path.join(path.dirname(file.path), 'index.html'),
        }));
        next(null, file);

        // var builder = new SystemJsBuilder({
        //   baseURL: __dirname,
        //   traceurOptions: { annotations: true, types: true },
        //   meta: {
        //     'angular2/angular2': { build: false },
        //     'ionic/ionic': { build: false },
        //   },
        //   map: {
        //     hammer: 'node_modules/hammerjs/hammer',
        //     rx: 'node_modules/rx'
        //   },
        //   paths: {
        //     'angular2/*': 'dist/lib/angular2/*.js',
        //     'app/*': path.dirname(file.path) + '/*.js'
        //   },
        // });
        // builder.build('app/main').then(function(output) {
        //   self.push(new VinylFile({
        //     base: file.base,
        //     contents: new Buffer(output.source),
        //     path: file.path,
        //   }));
        //   next();
        // })
        // .catch(function(err) {
        //   console.log('error', err);
        //   throw new Error(err);
        // });
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

})

gulp.task('ng2-copy', function() {
  return gulp.src('node_modules/angular2/es6/prod/**/*.es6')
    .pipe(rename({ extname: '.js' }))
    .pipe(gulp.dest(path.join(buildConfig.distLib, 'angular2')));
});
gulp.task('ng2', ['lib', 'ng2-copy'], function() {
  var builder = new SystemJsBuilder({
    paths: {
      "angular2/*": "node_modules/angular2/es6/prod/*.es6",
      "rx/*": "node_modules/angular2/node_modules/rx/*.js"
    }
  });
  return builder.build('angular2/angular2', path.join(buildConfig.distLib, 'angular2.js')).then(function() {
    return builder.build('angular2/di', path.join(buildConfig.distLib, 'angular2-di.js'));
  });
});
gulp.task('ng2-di', ['ng2'], function() {
});

gulp.task('ionic-js', function() {
  var builder = new SystemJsBuilder({
    traceurOptions: {
      annotations: true,
      types: true,
    },
    meta: {
      'angular2/angular2': { build: false },
      'angular2/di': { build: false },
    },
    paths: {
      "hammer": 'node_modules/hammerjs/*.js',
      "angular2/*": "node_modules/angular2/es6/prod/*.es6",
      "rx/*": "node_modules/angular2/node_modules/rx/*.js",
    }
  });
  return builder.build('ionic/ionic', path.join(buildConfig.distLib, 'ionic2.js'));
})


// Take es6 files from angular2's output, rename to js, and move to dist/lib/
// gulp.task('ng2-rename', function(done) {
//   exec('test -e node_modules/angular-master', function(err) {
//     if (err) {
//       console.log('You have not installed angular master.\n' +
//                   'Please run ./scripts/build/update-angular.sh.\n' +
//                   'Aborting.')
//       return process.exit(1)
//     }
//     gulp.src([
//       'node_modules/angular-master/dist/js/dev/es6/{angular2,rtts_assert}/**/*.es6'
//     ])
//       .pipe(rename({ extname: '.js' }))
//       .pipe(gulp.dest(buildConfig.distLib))
//       .on('end', done)
//   })
// })

// // We use SystemJsBuilder to build ng2 because it will properly
// gulp.task('ng2', ['ng2-rename'], function() {
//   var builder = new SystemJsBuilder()
//   builder.config({
//     baseURL: buildConfig.distLib,
//     traceurOptions: buildConfig.traceurOptions,
//     map: {
//       rx: __dirname + '/node_modules/rx'
//     }
//   })
//   return builder.build('angular2/angular2', buildConfig.distLib + '/angular2.js')
// })

var buildConfig = require('./scripts/build/config');
var gulp = require('gulp');
var path = require('path');
var argv = require('yargs').argv;
var del = require('del');
var rename = require('gulp-rename');
var through2 = require('through2');
var runSequence = require('run-sequence');
var watch = require('gulp-watch');
var tsc = require('gulp-typescript');
var cache = require('gulp-cached');
var remember = require('gulp-remember');
var minimist = require('minimist');
var connect = require('gulp-connect');
var docsConfig = require('./scripts/config.json');

var flagConfig = {
  string: ['port', 'animations'],
  alias: {'p': 'port'},
  default: { 'port': 8000 }
};
var flags = minimist(process.argv.slice(2), flagConfig);

var IS_RELEASE = false;

function getTscOptions(name) {
  var opts = {
    emitDecoratorMetadata: true,
    experimentalDecorators: true,
    target: "es5",
    module: "commonjs",
    isolatedModules: true
  }

  if (name === "typecheck") {
    opts.declaration = true;
    delete opts.isolatedModules;
  } else if (name === "es6") {
    opts.target = "es6";
    delete opts.module;
  }
  return opts;
}

var tscReporter = {
  error: function (error) {
    // TODO
    // suppress type errors until we convert everything to TS
    // console.error(error.message);
  }
};

// We use Babel to easily create named System.register modules
// See: https://github.com/Microsoft/TypeScript/issues/4801
// and https://github.com/ivogabe/gulp-typescript/issues/211
var babelOptions = {
  modules: 'system',
  moduleIds: true,
  getModuleId: function(name) {
    return 'ionic/' + name;
  }
}

/**
 * Build Ionic sources to dist
 */
gulp.task('build', function(done){
  runSequence(
    'clean',
    'copy.libs',
    ['bundle', 'sass', 'fonts', 'copy.scss']
  );
});

gulp.task('watch', ['build'], function() {
  watchTask('transpile');
});

function watchTask(task){
  watch([
      'ionic/**/*.ts',
      '!ionic/components/*/test/**/*',
      '!ionic/util/test/*'
    ],
    function(file) {
      if (file.event === "unlink") {
        deleteFile(file);
      } else {
        gulp.start(task);
      }
    }
  );

  watch('ionic/**/*.scss', function() {
    gulp.start('sass');
  });

  function deleteFile(file) {
    //TODO
    // var basePath = file.base.substring(0, file.base.lastIndexOf("ionic/"));
    // var relativePath = file.history[0].replace(file.base, '').replace('.ts', '.js');
    //
    // var filePath = basePath + 'dist/' + relativePath;
    // var typingPath = filePath.replace('.js', '.d.ts');
    //
    // delete cache.caches['no-typecheck'][file.history[0]];
    // remember.forget('no-typecheck', file.history[0]);
    //
    // del([filePath, typingPath], function(){
    //   gulp.start('bundle.system');
    // });
  }
}

gulp.task('serve', function() {
  connect.server({
    port: flags.port,
    livereload: {
      port: 35700
    }
  });
});

gulp.task('clean', function(done) {
  del(['dist/**', '!dist'], done);
});


/**
 * Source build tasks
 */
gulp.task('bundle', ['bundle.cjs', 'bundle.system']);

gulp.task('bundle.cjs', ['transpile'], function(done){
  //TODO
  //   if (flags.animations == 'polyfill') {
  //     prepend.push('window.Element.prototype.animate=undefined;');
  //   }

  var config = require('./scripts/npm/ionic.webpack.config.js');
  bundle({ config: config, stats: true });

  // build minified bundle
  var minConfig = require('./scripts/npm/ionic.min.webpack.config.js');
  bundle({ config: minConfig, cb: finished, stats: true });

  var outputPaths = [
    config.output.path + path.sep + config.output.filename,
    minConfig.output.path + path.sep + minConfig.output.filename
  ];

  function bundle(args) {
    var webpack = require('webpack');
    var path = require('path');

    webpack(args.config, function(err, stats){
      if (args.stats) {
        var statsOptions = {
          'colors': true,
          'modules': false,
          'chunks': false,
          'exclude': ['node_module'],
          'errorDetails': true
        }
        console.log(stats.toString(statsOptions));
      }

      args.cb && args.cb();
    })
  }

  function finished(){
    gulp.src(outputPaths)
      .pipe(connect.reload())
      .on('end', done);
  }
});

gulp.task('bundle.system', function(){
  var babel = require('gulp-babel');
  var concat = require('gulp-concat');
  var gulpif = require('gulp-if');
  var stripDebug = require('gulp-strip-debug');
  var merge = require('merge2');

  var tsResult = tsCompile(getTscOptions('es6'), 'system')
    .pipe(babel(babelOptions));

  var swiper = gulp.src('ionic/components/slides/swiper-widget.system.js');

  return merge([tsResult, swiper])
    .pipe(remember('system'))
    .pipe(gulpif(IS_RELEASE, stripDebug()))
    .pipe(concat('ionic.system.js'))
    .pipe(gulp.dest('dist/bundles'))
    .pipe(connect.reload())
});

gulp.task('transpile', function(){
  var gulpif = require('gulp-if');
  var stripDebug = require('gulp-strip-debug');

  var tscOpts = getTscOptions(IS_RELEASE ? 'typecheck' : undefined);
  var tsResult = tsCompile(tscOpts, 'transpile')

  if (IS_RELEASE) {
    var merge = require('merge2');
    var js = tsResult.js.pipe(stripDebug());
    var dts = tsResult.dts;
    // merge definition and source streams
    return merge([js, dts])
      .pipe(gulp.dest('dist'));
  }

  return tsResult.pipe(gulp.dest('dist'));
});

function tsCompile(options, cacheName){
  return gulp.src([
      'ionic/**/*.ts',
      '!ionic/**/*.d.ts',
      '!ionic/components/*/test/**/*',
      '!ionic/util/test/*',
      '!ionic/config/test/*',
      '!ionic/platform/test/*',
      '!ionic/**/*.spec.ts'
    ])
    .pipe(cache(cacheName, { optimizeMemory: true }))
    .pipe(tsc(options, undefined, tscReporter))
    .on('error', function(error) {
      console.log(error.message);
      this.emit('end');
    });
}

gulp.task('sass', function() {
  var sass = require('gulp-sass');
  var autoprefixer = require('gulp-autoprefixer');
  var minifyCss = require('gulp-minify-css');

  gulp.src([
    'ionic/ionic.ios.scss',
    'ionic/ionic.md.scss',
    'ionic/ionic.scss'
  ])
  .pipe(sass({
      includePaths: [__dirname + '/node_modules/ionicons/dist/scss/'],
    }).on('error', sass.logError)
  )
  .pipe(autoprefixer(buildConfig.autoprefixer))
  .pipe(gulp.dest('dist/bundles/'))
  .pipe(minifyCss())
  .pipe(rename({ extname: '.min.css' }))
  .pipe(gulp.dest('dist/bundles/'));
});

gulp.task('sass.themes', function() {
  var sass = require('gulp-sass');
  var autoprefixer = require('gulp-autoprefixer');

  function buildTheme(mode) {
    gulp.src([
      'scripts/e2e/ionic.' + mode + '.dark.scss'
    ])
    .pipe(sass({
        includePaths: [__dirname + '/node_modules/ionicons/dist/scss/'],
      }).on('error', sass.logError)
    )
    .pipe(autoprefixer(buildConfig.autoprefixer))
    .pipe(gulp.dest('dist/bundles/'));
  }

  buildTheme('ios');
  buildTheme('md');
});

gulp.task('fonts', function() {
  gulp.src([
    'ionic/fonts/*.+(ttf|woff|woff2)',
    'node_modules/ionicons/dist/fonts/*.+(ttf|woff|woff2)'
   ])
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('copy.scss', function() {
  return gulp.src([
      'ionic/**/*.scss',
      '!ionic/components/*/test/**/*',
      '!ionic/util/test/*'
    ])
    .pipe(gulp.dest('dist'));
});

gulp.task('copy.libs', function() {
  var merge = require('merge2');
  var webAnimations = gulp.src([
      'scripts/resources/web-animations-js/web-animations.min.js',
      'node_modules/es6-shim/es6-shim.min.js',
      'node_modules/systemjs/node_modules/es6-module-loader/dist/es6-module-loader.src.js',
      'node_modules/systemjs/dist/system.src.js',
      'node_modules/angular2/bundles/angular2-polyfills.js',
      'node_modules/angular2/bundles/angular2.dev.js',
      'node_modules/angular2/bundles/router.dev.js',
      'node_modules/angular2/bundles/http.dev.js',
      'node_modules/rxjs/bundles/Rx.js'
    ])
    .pipe(gulp.dest('dist/js'));

  // for swiper-widget
  var libs = gulp.src([
      'ionic/**/*.js',
      'ionic/**/*.d.ts'
    ])
    .pipe(gulp.dest('dist'));

  return merge([webAnimations, libs]);
});


/**
 * Test build tasks
 */
gulp.task('watch.e2e', ['e2e'], function() {
  watchTask('bundle.system');

  watch('ionic/components/*/test/**/*', function(file) {
    gulp.start('e2e.build');
  });
});

gulp.task('e2e', ['e2e.build', 'bundle.system', 'copy.libs', 'sass', 'fonts']);

gulp.task('e2e.build', function() {
  var gulpif = require('gulp-if');
  var merge = require('merge2');
  var _ = require('lodash');
  var fs = require('fs');
  var VinylFile = require('vinyl');

  var indexTemplate = _.template(
   fs.readFileSync('scripts/e2e/e2e.template.html')
  )({
    buildConfig: buildConfig
  });
  var testTemplate = _.template(fs.readFileSync('scripts/e2e/e2e.template.js'));

  var platforms = [
    'android',
    'ios',
  ];

  // Get each test folder with gulp.src
  var tsResult = gulp.src([
      'ionic/components/*/test/*/**/*.ts',
      '!ionic/components/*/test/*/**/*.spec.ts'
    ])
    .pipe(cache('e2e.ts'))
    .pipe(tsc(getTscOptions(), undefined, tscReporter))
    .on('error', function(error) {
      console.log(error.message);
      this.emit('end');
    })
    .pipe(gulpif(/index.js$/, createIndexHTML()))
    .pipe(gulpif(/e2e.js$/, createPlatformTests()))

  var testFiles = gulp.src([
      'ionic/components/*/test/*/**/*',
      '!ionic/components/*/test/*/**/*.ts'
    ])
    .pipe(cache('e2e.files'))

  return merge([
      tsResult,
      testFiles
    ])
    .pipe(rename(function(file) {
      var sep = path.sep;
      file.dirname = file.dirname.replace(sep + 'test' + sep, sep);
    }))
    .pipe(gulp.dest('dist/e2e/'))
    .pipe(connect.reload());

  function createIndexHTML() {
    return through2.obj(function(file, enc, next) {
      this.push(new VinylFile({
        base: file.base,
        contents: new Buffer(indexTemplate),
        path: path.join(path.dirname(file.path), 'index.html'),
      }));
      next(null, file);
    });
  }

  function createPlatformTests(file) {
    return through2.obj(function(file, enc, next) {
      var self = this;
      var relativePath = path.dirname(file.path.replace(/^.*?ionic(\/|\\)components(\/|\\)/, ''));
      relativePath = relativePath.replace('/test/', '/');
      var contents = file.contents.toString();
      platforms.forEach(function(platform) {
        var platformContents = testTemplate({
          contents: contents,
          buildConfig: buildConfig,
          relativePath: relativePath,
          platform: platform
        });
        self.push(new VinylFile({
          base: file.base,
          contents: new Buffer(platformContents),
          path: file.path.replace(/e2e.js$/, platform + '.e2e.js')
        }));
      })
      next();
    })
  }
});

gulp.task('tests', function() {
  return gulp.src('ionic/**/test/**/*.spec.ts')
    .pipe(tsc(getTscOptions(), undefined, tscReporter))
    .pipe(rename(function(file) {
      var regex = new RegExp(path.sep + 'test(' + path.sep + '|$)');
      file.dirname = file.dirname.replace(regex, path.sep);
    }))
    .pipe(gulp.dest('dist/tests'))
})


/**
 * Demos
 */
gulp.task('watch.demos', function() {
  watch('demos/**/*', function() {
    gulp.start('demos');
  });
});

gulp.task('demos', ['bundle.demos'], function() {
  var merge = require('merge2');

  var demosStream = gulp.src([
    'dist/demos/**/*',
    '!dist/demos/**/*.scss',
  ])
    .pipe(gulp.dest(docsConfig.docsDest + '/demos/'));

  var cssStream = gulp.src('dist/bundles/**/*.css')
    .pipe(gulp.dest(docsConfig.sitePath + '/dist/bundles'));

  return merge([demosStream, cssStream]);
 });

gulp.task('bundle.demos', ['build.demos', 'transpile', 'copy.libs', 'sass', 'fonts'], function(done) {
  var glob = require('glob');
  var webpack = require('webpack');
  var path = require('path');

  return glob('dist/demos/**/index.js', function(err, files){
    var numTasks = files.length;
    files.forEach(function(file){
      var config = require('./scripts/demos/webpack.config.js');

      // add our bundle entry, removing previous if necessary
      // since config is cached
      if (config.entry.length > 4) {
        config.entry.pop();
      }
      config.entry.push('./' + file);
      config.output = {
        filename: path.dirname(file) + '/bundle.js'
      }

      webpack(config, function(err, stats){
        var statsOptions = {
         'colors': true,
          'modules': false,
          'chunks': false,
          'exclude': ['node_modules'],
          'errorDetails': true
        }
        console.log(stats.toString(statsOptions));
        if (--numTasks === 0) done();
      })
    })

  });
});

gulp.task('build.demos', function() {
  var gulpif = require('gulp-if');
  var merge = require('merge2');
  var _ = require('lodash');
  var fs = require('fs');
  var VinylFile = require('vinyl');

  var baseIndexTemplate = _.template(fs.readFileSync('scripts/demos/index.template.html'))();

  var tsResult = gulp.src(['demos/**/*.ts'])
    .pipe(cache('demos.ts'))
    .pipe(tsc(getTscOptions(), undefined, tscReporter))
    .on('error', function(error) {
      console.log(error.message);
      this.emit('end');
    })
    .pipe(gulpif(/index.js$/, createIndexHTML())) //TSC changes .ts to .js

  var demoFiles = gulp.src([
      'demos/**/*',
      '!demos/**/*.ts'
    ])
    .pipe(cache('demos.files'));

  return merge([
      tsResult,
      demoFiles
    ])
    .pipe(gulp.dest('dist/demos'))
    .pipe(connect.reload());

  function createIndexHTML() {
    return through2.obj(function(file, enc, next) {
      var indexTemplate = baseIndexTemplate;
      var customTemplateFp = file.path.split('/').slice(0, -1).join('/') + '/index.html';
      if (fs.existsSync(customTemplateFp)) {
        indexTemplate = _.template(fs.readFileSync(customTemplateFp))();
      }
      this.push(new VinylFile({
        base: file.base,
        contents: new Buffer(indexTemplate),
        path: path.join(path.dirname(file.path), 'index.html'),
      }));
      next(null, file);
    });
  }
});


/**
 * Tests
 */
require('./scripts/snapshot/snapshot.task')(gulp, argv, buildConfig);

gulp.task('karma', ['tests'], function() {
  var karma = require('karma').server;
  return karma.start({ configFile: __dirname + '/scripts/karma/karma.conf.js' })
});

gulp.task('karma-watch', function() {
  var karma = require('karma').server;
  return karma.start({ configFile: __dirname + '/scripts/karma/karma-watch.conf.js' })
});


/**
 * Release
 */
gulp.task('prerelease', ['prepare', 'build.release'], function(done){
  runSequence('package', done);
});

gulp.task('release', ['publish.npm', 'publish.github']);

gulp.task('prepare', function(){
  var execSync = require('child_process').execSync;
  var spawnSync = require('child_process').spawnSync;
  var semver = require('semver');
  var fs = require('fs');
  var changelog = require('gulp-conventional-changelog');
  var self = this;

  //Check for uncommitted changes
  var gitStatusResult = execSync('git status --porcelain');
  if (gitStatusResult.toString().length > 0) {
    return fail('You have uncommitted changes, please stash or commit them before running prepare');
  }

  //Pull latest
  var gitPullResult = spawnSync('git', ['pull', 'origin', '2.0']);
  if (gitPullResult.status !== 0) {
    fail('There was an error running \'git pull\':\n' + gitPullResult.stderr.toString());
  }

  //Update package.json version
  var packageJSON = require('./package.json');
  packageJSON.version = semver.inc(packageJSON.version, 'prerelease', 'alpha');
  fs.writeFileSync('package.json', JSON.stringify(packageJSON, null, 2));

  //Update changelog
  return gulp.src('./CHANGELOG.md')
    .pipe(changelog({
      preset: 'angular'
    }))
    .pipe(gulp.dest('./'));


  function fail(msg) {
    // remove gulp's 'Finished 'task' after 10ms' message
    self.removeAllListeners('task_stop');
    console.error('Prepare aborted.');
    console.error(msg);
  }

});

gulp.task('package', function(done){
  var _ = require('lodash');
  var fs = require('fs');
  var distDir = 'dist';

  gulp.src([
      'scripts/npm/.npmignore',
      'scripts/npm/README.md',
      '*tooling/**/*'
    ])
    .pipe(gulp.dest(distDir));

  var templateVars = {};
  var packageJSON = require('./package.json');
  templateVars.ionicVersion = packageJSON.version;
  templateVars.angularVersion = packageJSON.dependencies.angular2;
  var packageTemplate = _.template(fs.readFileSync('scripts/npm/package.json'));
  fs.writeFileSync(distDir + '/package.json', packageTemplate(templateVars));
  done();
});

gulp.task('publish.github', function(done){
  var changelog = require('conventional-changelog');
  var GithubApi = require('github');
  var packageJSON = require('./package.json');

  var github = new GithubApi({
    version: '3.0.0'
  });

  github.authenticate({
    type: 'oauth',
    token: process.env.GH_TOKEN
  });

  return changelog({
    preset: 'angular'
  })
  .pipe(through2.obj(function(file, enc, cb){
    github.releases.createRelease({
      owner: 'driftyco',
      repo: 'ionic',
      target_commitish: '2.0',
      tag_name: 'v' + packageJSON.version,
      name: packageJSON.version,
      body: file.toString(),
      prerelease: true
    }, done);
  }));
});

gulp.task('publish.npm', function(done) {
  var spawn = require('child_process').spawn;

  var npmCmd = spawn('npm', ['publish', './dist']);

  npmCmd.stdout.on('data', function (data) {
    console.log(data.toString());
  });

  npmCmd.stderr.on('data', function (data) {
    console.log('npm err: ' + data.toString());
  });

  npmCmd.on('close', function() {
    done();
  });
});

/**
 * Build Ionic sources, with typechecking and debug statements removed
 */
gulp.task('build.release', function(done){
  IS_RELEASE = true;
  runSequence(
    'clean',
    'copy.libs',
    ['bundle', 'sass', 'fonts', 'copy.scss']
  );
});


/**
 * Docs
 */
require('./scripts/docs/gulp-tasks')(gulp, flags)

/**
 * Tooling
 */
gulp.task('tooling', function(){
  gulp.src('*tooling/**/*')
    .pipe(gulp.dest('dist'));

  watch('tooling/**/*', function(){
    gulp.src('*tooling/**/*')
      .pipe(gulp.dest('dist'));
  })
});

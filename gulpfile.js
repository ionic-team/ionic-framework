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
  string: ['port', 'version', 'ngVersion', 'animations'],
  boolean: ['dry-run'],
  alias: {'p': 'port', 'v': 'version', 'a': 'ngVersion'},
  default: { port: 8000 }
};
var flags = minimist(process.argv.slice(2), flagConfig);

var IS_RELEASE = false;

var tscOptions = {
  emitDecoratorMetadata: true,
  experimentalDecorators: true,
  target: "es5",
  module: "commonjs",
  declaration: true
}

var tscOptionsNoTypeCheck = {
  emitDecoratorMetadata: true,
  experimentalDecorators: true,
  target: "es5",
  module: "commonjs",
  isolatedModules: true
}

var tscOptionsEs6 = {
  emitDecoratorMetadata: true,
  experimentalDecorators: true,
  target: 'ES6',
  isolatedModules: true
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

gulp.task('build', ['bundle.system', 'e2e.build', 'sass', 'fonts']);

gulp.task('clean.build', function(done) {
  runSequence('clean', 'build', done);
});

gulp.task('watch', function(done) {
  runSequence(
    'copy.libs',
    'build',
    'serve',
    function() {
      watch([
          'ionic/**/*.ts',
          '!ionic/components/*/test/**/*',
          '!ionic/util/test/*'
        ],
        function(file) {
          if (file.event === "unlink") {
            deleteFile(file);
          } else {
            gulp.start('bundle.system');
          }
        }
      );

      watch('ionic/components/*/test/**/*', function(file) {
        gulp.start('e2e.build');
      });

      watch('ionic/**/*.scss', function() {
        gulp.start('sass');
      });

      done();
    }
  );

  function deleteFile(file) {
    var basePath = file.base.substring(0, file.base.lastIndexOf("ionic/"));
    var relativePath = file.history[0].replace(file.base, '').replace('.ts', '.js');

    var filePath = basePath + 'dist/' + relativePath;
    var typingPath = filePath.replace('.js', '.d.ts');

    delete cache.caches['no-typecheck'][file.history[0]];
    remember.forget('no-typecheck', file.history[0]);

    del([filePath, typingPath], function(){
      gulp.start('bundle.system');
    });
  }
});

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

gulp.task('transpile.no-typecheck', function(){
  var gulpif = require('gulp-if');
  var stripDebug = require('gulp-strip-debug');

  return tsCompile(tscOptionsNoTypeCheck, 'no-typecheck')
    .pipe(gulpif(IS_RELEASE, stripDebug()))
    .pipe(gulp.dest('dist'));
});

gulp.task('typecheck', ['transpile.typecheck']);

gulp.task('transpile.typecheck', function(){
  var merge = require('merge2');
  var stripDebug = require('gulp-strip-debug');

  var result = tsCompile(tscOptions, 'typecheck');

  var js = result.js;
  var dts = result.dts;
  if (IS_RELEASE) {
    js = js.pipe(stripDebug());
  }

  // merge definition and source streams
  return merge([js, dts])
    .pipe(gulp.dest('dist'));
})

gulp.task('bundle.system', function(){
  var babel = require('gulp-babel');
  var concat = require('gulp-concat');
  var gulpif = require('gulp-if');
  var stripDebug = require('gulp-strip-debug');
  var merge = require('merge2');

  var tsResult = tsCompile(tscOptionsEs6, 'system')
    .pipe(babel(babelOptions));

  var swiper = gulp.src('ionic/components/slides/swiper-widget.system.js');

  return merge([tsResult, swiper])
    .pipe(remember('system'))
    .pipe(gulpif(IS_RELEASE, stripDebug()))
    .pipe(concat('ionic.system.js'))
    .pipe(gulp.dest('dist/bundles'))
    .pipe(connect.reload())
})

gulp.task('transpile', ['transpile.no-typecheck']);

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

  function finished(){
    gulp.src(outputPaths)
      .pipe(connect.reload())
      .on('end', done);
  }
})

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

gulp.task('tests', function() {
  return gulp.src('ionic/**/test/**/*.spec.ts')
    .pipe(tsc(tscOptionsNoTypeCheck, undefined, tscReporter))
    .pipe(rename(function(file) {
      var regex = new RegExp(path.sep + 'test(' + path.sep + '|$)');
      file.dirname = file.dirname.replace(regex, path.sep);
    }))
    .pipe(gulp.dest('dist/tests'))
})

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
    .pipe(tsc(tscOptionsNoTypeCheck, undefined, tscReporter))
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

gulp.task('e2e', ['e2e.build', 'bundle.system', 'copy.libs', 'sass', 'fonts']);

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

gulp.task('fonts', function() {
  gulp.src([
    'ionic/fonts/*.+(ttf|woff|woff2)',
    'node_modules/ionicons/dist/fonts/*.+(ttf|woff|woff2)'
   ])
    .pipe(gulp.dest('dist/fonts'));
});

require('./scripts/snapshot/snapshot.task')(gulp, argv, buildConfig);

gulp.task('karma', ['tests'], function() {
  var karma = require('karma').server;
  return karma.start({ configFile: __dirname + '/scripts/karma/karma.conf.js' })
});

gulp.task('karma-watch', function() {
  var karma = require('karma').server;
  return karma.start({ configFile: __dirname + '/scripts/karma/karma-watch.conf.js' })
});

gulp.task('copy.scss', function() {
  return gulp.src([
      'ionic/**/*.scss',
      '!ionic/components/*/test/**/*',
      '!ionic/util/test/*'
    ])
    .pipe(gulp.dest('dist'));
})

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

  var libs = gulp.src([
      'ionic/**/*.js',
      'ionic/**/*.d.ts'
    ])
    .pipe(gulp.dest('dist'));

  return merge([webAnimations, libs]);
})

gulp.task('src.link', function(done) {
  watch(['/ionic/**/*.ts', 'ionic/**/*.scss'], function(file) {
    gulp.start('src');
  });
})

gulp.task('src', function(done){
  runSequence(
    'clean',
    'copy.libs',
    ['bundle', 'sass', 'fonts', 'copy.scss'],
    'transpile.typecheck',
    done
  );
});

gulp.task('src.release', function(done) {
  IS_RELEASE = true;
  runSequence(
    'clean',
    'copy.libs',
    ['bundle', 'sass', 'fonts', 'copy.scss'],
    'transpile.typecheck',
    done
  );
});

gulp.task('package', ['src.release'], function(done){
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

gulp.task('publish', ['package'], function(done){
  var spawn = require('child_process').spawn;
  var semver = require('semver');
  var fs = require('fs');
  var err = false;

  var npmCmd = spawn('npm', ['publish', './dist']);

  npmCmd.stdout.on('data', function (data) {
    console.log(data.toString());
  });

  npmCmd.stderr.on('data', function (data) {
    err = true;
    console.log('npm err: ' + data.toString());
  });

  npmCmd.on('close', function() {
    // update package.json
    if (!err) {
      var packageJSON = require('./package.json');
      packageJSON.version = semver.inc(packageJSON.version, 'prerelease', 'alpha');
      fs.writeFileSync('package.json', JSON.stringify(packageJSON, null, 2));
    }
    done();
  });

});

require('./scripts/docs/gulp-tasks')(gulp, flags)

////////////////////////////////////////////////////
// Demos
// todo: move these to scripts/docs/gulp-tasks
////////////////////////////////////////////////////

gulp.task('build.demos', function(){
  var gulpif = require('gulp-if');
  var merge = require('merge2');
  var _ = require('lodash');
  var fs = require('fs');
  var VinylFile = require('vinyl');

  var baseIndexTemplate = _.template(fs.readFileSync('scripts/demos/index.template.html'))();

  var tsResult = gulp.src(['demos/**/*.ts'])
    .pipe(cache('demos.ts'))
    .pipe(tsc(tscOptionsNoTypeCheck, undefined, tscReporter))
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

gulp.task('sass.demos:components', function() {
  var sass = require('gulp-sass');
  var autoprefixer = require('gulp-autoprefixer');
  var concat = require('gulp-concat');
  return gulp.src([
      'demos/component-docs/app.scss',
    ])
    .pipe(sass()
      .on('error', sass.logError)
    )
    .pipe(concat('app.css'))
    .pipe(autoprefixer(buildConfig.autoprefixer))
    .pipe(gulp.dest(docsConfig.docsDest + '/demos/component-docs/'));
});

gulp.task('bundle.demos:api', ['build.demos', 'transpile.no-typecheck', 'copy.libs', 'sass', 'fonts'], function(done) {
  return buildDemoBundle({demo: 'api'}, done);
});

gulp.task('bundle.demos:components', ['sass.demos:components', 'build.demos'], function(done) {
  buildDemoBundle({demo: 'component-docs'}, done);
});

gulp.task('demos', ['bundle.demos:api', 'bundle.demos:components'], function() {
  return gulp
    .src([
      'dist/demos/**/*',
      '!dist/demos/**/*.scss',
      ])
    .pipe(gulp.dest(docsConfig.docsDest + '/demos/'))
});

gulp.task('watch:demos', function() {
  watch('demos/**/*', function() {
    gulp.start('demos');
  });
});

function buildDemoBundle(opts, done) {
  var glob = require('glob');
  var webpack = require('webpack');
  var path = require('path');

  var fp = 'dist/demos/'+opts.demo+'/index.js';
  if (opts.demo == 'api') {
    fp = "dist/demos/**/index.js";
  }

  return glob(fp, function(err, files){
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
}

gulp.task('tooling', function(){
  gulp.src('*tooling/**/*')
    .pipe(gulp.dest('dist'));

  watch('tooling/**/*', function(){
    gulp.src('*tooling/**/*')
      .pipe(gulp.dest('dist'));
  })
})

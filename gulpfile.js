var buildConfig = require('./scripts/build/config');
var gulp = require('gulp');
var glob = require('glob');
var fs = require('fs');
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
  string: ['port'],
  boolean: ['debug', 'typecheck'],
  alias: {'p': 'port'},
  default: { 'port': 8000, 'debug': true, 'typecheck': false }
};
var flags = minimist(process.argv.slice(2), flagConfig);

var DEBUG = flags.debug;
var TYPECHECK = flags.typecheck;


/**
 * Builds Ionic sources to dist. When the '--typecheck' flag is specified,
 * generates .d.ts definitions and does typechecking.
 */
gulp.task('build', function(done){
  runSequence(
    ['bundle', 'sass', 'fonts', 'copy.scss'],
    done
  );
});


function watchTask(task){
  watch([
      'src/**/*.ts',
      'src/components/*/test/**/*',
      '!src/util/test/*'
    ],
    function(file) {
      if (file.event === "unlink") {
        deleteFile(file);
      } else {
        console.log('start');
        gulp.start(task);
      }
    }
  );

  watch('src/**/*.scss', function() {
    gulp.start('sass');
  });

  gulp.start('serve');

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

gulp.task('release.clean', function(done) {
  del(['dist/**', '!dist'], done);
});


/**
 * Source build tasks
 */

/**
 * Creates CommonJS and SystemJS bundles from Ionic source files.
 */
gulp.task('release.bundle', ['transpile.cjs', 'transpile.es2015',]);


gulp.task('e2e.clean', function(done) {
  del(['test/**', '!test'], done);
});

/**
 * Builds Ionic e2e tests to test.
 * - Copy all component test files to the test directory
 * - Create entry.ts and index.html file for each test.
 * - Create platform tests for each test
 */
gulp.task('e2e.setup', function() {
  var gulpif = require('gulp-if');
  var merge = require('merge2');
  var _ = require('lodash');
  var fs = require('fs');
  var VinylFile = require('vinyl');

  // Get each test folder with gulp.src
  var tsResult = gulp.src([
      'src/components/*/test/*/**/*.ts',
      '!src/components/*/test/*/**/*.spec.ts'
    ])
    .pipe(cache('e2e.ts'))
    .pipe(gulpif(/AppModule.ts$/, createIndexHTML()))
    .pipe(gulpif(/e2e.ts$/, createPlatformTests()))

  var testFiles = gulp.src([
      'src/components/*/test/*/**/*',
      '!src/components/*/test/*/**/*.ts'
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
    .pipe(gulp.dest('test/'))
    .pipe(connect.reload());

  function createIndexHTML() {
    var indexTemplate = fs.readFileSync('scripts/e2e/e2e.template.html');
    var indexTs = fs.readFileSync('scripts/e2e/entry.ts');

    return through2.obj(function(file, enc, next) {
      this.push(new VinylFile({
        base: file.base,
        contents: new Buffer(indexTemplate),
        path: path.join(path.dirname(file.path), 'index.html'),
      }));
      this.push(new VinylFile({
        base: file.base,
        contents: new Buffer(indexTs),
        path: path.join(path.dirname(file.path), 'entry.ts'),
      }));
      next(null, file);
    });
  }

  function createPlatformTests(file) {
    var platforms = [
      'android',
      'ios',
      'windows'
    ];

    var testTemplate = _.template(fs.readFileSync('scripts/e2e/e2e.template.js'));

    return through2.obj(function(file, enc, next) {
      var self = this;
      var relativePath = path.dirname(file.path.replace(/^.*?src(\/|\\)components(\/|\\)/, ''));
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

gulp.task('e2e.transpile', function(done) {

  function updateE2eNgc(e2eFolder) {
    var e2eNgc = require('./e2eNgcConfig.json');

    // If an e2efolder parameter was passed then only transpile that directory
    if (e2eFolder) {
      e2eNgc.include = [
        "test/" + e2eFolder + "/**/entry.ts",
        "test/" + e2eFolder + "/**/AppModule.ts"
      ]
    } else {
      e2eNgc.include = [
        "test/**/entry.ts",
        "test/**/AppModule.ts"
      ];
    }
    fs.writeFileSync('./e2eNgcConfig.json', JSON.stringify(e2eNgc, null, 2));
  }

  updateE2eNgc(flags.e2efolder);
  var exec = require('child_process').exec;
  var shellCommand = 'node --max_old_space_size=8096 ./node_modules/.bin/ngc -p e2eNgcConfig.json';

  exec(shellCommand, function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    done(err);
  });
});

/**
 * Task: e2e.pre-webpack
 * Dynamically build webpack entryPoints
 * Update index.html file that lists all e2e tasks
 */
gulp.task('e2e.pre-webpack', function(done) {
  /**
   * Find all AppModule.ts files because the act as the entry points
   * for each e2e test.
   */
  glob('test/*/**/AppModule.ts', {}, function(er, files) {

    var directories = files.map(function(file) {
      return path.dirname(file);
    });

    var webpackEntryPoints = directories.reduce(function(endObj, dir) {
      endObj[path.join(dir, 'index')] = "./" + path.join(dir, 'entry');
      return endObj;
    }, {});

    indexFileContents = directories.map(function(dir) {
      var fileName = dir.replace(/test\//, '');
      return '<p><a href="./' + fileName + '/index.html">' + fileName + '</a></p>'
    }, []);

    fs.writeFileSync('./scripts/e2e/webpackEntryPoints.json', JSON.stringify(webpackEntryPoints, null, 2));
    fs.writeFileSync('./test/index.html',
      '<!DOCTYPE html><html lang="en"><head></head><body style="width: 500px; margin: 100px auto">\n' +
      indexFileContents.join('\n') +
      '</center></body></html>'
    );
    done();
  });
});

gulp.task('e2e.webpack', function(done) {
  var exec = require('child_process').exec;
  var shellCommand = 'node --max_old_space_size=8096 ./node_modules/.bin/webpack --config ./scripts/e2e/webpack.config.js';

  exec(shellCommand, function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    done(err);
  });
});

 /**
  * Builds e2e tests to dist/e2e and watches for changes.  Runs 'bundle.system' or
  * 'sass' on Ionic source changes and 'e2e.build' for e2e test changes.
  */
gulp.task('watch.e2e', function() {
  var webpack = require('webpack');
  var WebpackDevServer = require('webpack-dev-server');
  var config = require('./scripts/e2e/webpack.config.js');
  config.output.path = __dirname;
  config.entry = {
    "test/vendor": "./scripts/e2e/vendor",
    "test/polyfills": "./scripts/e2e/polyfills",
    "test/action-sheet/basic/index": [
      "./test/action-sheet/basic/entry"
    ]
  }
  var compiler = webpack(config);

  watchTask('e2e.resources');

  new WebpackDevServer(compiler, {
    quiet: true
  }).listen(8080, "localhost", function(err) {
      if(err) {
        throw new Error("webpack-dev-server", err);
      }
      console.log("[webpack-dev-server]", "http://localhost:8080/test/" + flags.e2efolder);
  });
});

gulp.task('run.e2e', function(done) {
  runSequence(
    'e2e.clean',
    ['e2e.resources', 'sass', 'fonts'],
    'e2e.pre-webpack',
    'e2e.webpack',
    done
  );
})


gulp.task('e2e.resources', function(done) {
  runSequence(
    'e2e.setup',
    'e2e.transpile',
    done
  );
});

/**
 * Transpiles TypeScript sources to ES5 in the CommonJS module format and outputs
 * them to dist. When the '--typecheck' flag is specified, generates .d.ts
 * definitions and does typechecking.
 */
gulp.task('transpile.es2015', function(done) {
  var exec = require('child_process').exec;
  var shellCommand = './node_modules/.bin/ngc -p es2015NgcConfig.json && ' +
    'cp src/components/slides/swiper-widget.es2015.js dist/esm/components/slides/swiper-widget.js && ' +
    'cp src/components/slides/swiper-widget.d.ts dist/esm/components/slides/';

  exec(shellCommand, function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    done(err);
  });
});

/**
 * Transpiles TypeScript sources to ES5 in the CommonJS module format and outputs
 * them to dist. When the '--typecheck' flag is specified, generates .d.ts
 * definitions and does typechecking.
 */
gulp.task('transpile.cjs', function(done) {
  var exec = require('child_process').exec;
  var shellCommand = './node_modules/.bin/ngc -p commonjsNgcConfig.json && ' +
    'cp src/components/slides/swiper-widget.js dist/components/slides/swiper-widget.js && ' +
    'cp src/components/slides/swiper-widget.d.ts dist/components/slides/';

  exec(shellCommand, function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    done(err);
  });
});

/**
 * Compiles Ionic Sass sources to stylesheets and outputs them to dist/bundles.
 */
gulp.task('sass', function() {
  var sass = require('gulp-sass');
  var autoprefixer = require('gulp-autoprefixer');
  var minifyCss = require('gulp-minify-css');

  gulp.src([
    'src/ionic.ios.scss',
    'src/ionic.md.scss',
    'src/ionic.wp.scss',
    'src/ionic.scss'
  ])
  .pipe(sass({
      includePaths: [__dirname + '/node_modules/ionicons/dist/scss/'],
    }).on('error', sass.logError)
  )
  .pipe(autoprefixer(buildConfig.autoprefixer))
  .pipe(gulp.dest('dist/bundles/'))
  .pipe(gulp.dest('test/css/'))
  .pipe(minifyCss())
  .pipe(rename({ extname: '.min.css' }))
  .pipe(gulp.dest('dist/bundles/'))
  .pipe(gulp.dest('test/css/'));
});

/**
 * Creates Ionic themes for testing.
 */
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
    .pipe(gulp.dest('dist/bundles/'))
    .pipe(gulp.dest('test/css/'));
  }

  buildTheme('ios');
  buildTheme('md');
  buildTheme('wp');
});

/**
 * Copies fonts and Ionicons to dist/fonts
 */
gulp.task('fonts', function() {
  gulp.src([
    'src/fonts/*.+(ttf|woff|woff2)',
    'node_modules/ionicons/dist/fonts/*.+(ttf|woff|woff2)'
   ])
    .pipe(gulp.dest('dist/fonts'))
    .pipe(gulp.dest('./test/fonts/'));
});

/**
 * Copies Ionic Sass sources to dist
 */
gulp.task('copy.scss', function() {
  return gulp.src([
      'src/**/*.scss',
      '!src/components/*/test/**/*',
      '!src/util/test/*'
    ])
    .pipe(gulp.dest('dist'));
});

/**
 * Lint the scss files using a ruby gem
 */
gulp.task('lint.scss', function() {
  var scsslint = require('gulp-scss-lint');

  return gulp.src([
      'src/**/*.scss',
      '!src/components/*/test/**/*',
      '!src/util/test/*'
    ])
    .pipe(scsslint())
    .pipe(scsslint.failReporter());
});

/**
 * Test build tasks
 */

/**
 * Demos
 */

 /**
  * Builds Ionic demos to dist/demos, copies them to ../ionic-site and watches
  * for changes.
  */
//TODO, decide on workflow for site demos (dev and prod), vs local dev (in dist)
var LOCAL_DEMOS = false;
gulp.task('watch.demos', function(done) {
  LOCAL_DEMOS = true;
  runSequence(
    ['build.demos', 'transpile.cjs', 'sass', 'fonts'],
    function(){
      watchTask('bundle.system');

      watch('demos/**/*', function(file) {
        gulp.start('build.demos');
      });

      done();
    }
  );
});

/**
 * Copies bundled demos from dist/demos to ../ionic-site/docs/v2 (assumes there is a
 * sibling repo to this one named 'ionic-site')
 */
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

 /**
  * Builds necessary files for each demo then bundles them using webpack. Unlike
  * e2e tests, demos are bundled for performance (but have a slower build).
  */
gulp.task('bundle.demos', ['build.demos', 'transpile', 'sass', 'fonts'], function(done) {
  var glob = require('glob');
  var webpack = require('webpack');
  var path = require('path');

  return glob('dist/demos/**/index.js', function(err, files){
    var numTasks = files.length;
    files.forEach(function(file){
      var config = require('./scripts/demos/webpack.config.js');

      // add our bundle entry, removing previous if necessary
      // since config is cached
      if (config.entry.length > 3) {
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

/**
 * Transpiles and copies Ionic demo sources to dist/demos.
 */
gulp.task('build.demos', function() {
  var gulpif = require('gulp-if');
  var merge = require('merge2');
  var _ = require('lodash');
  var fs = require('fs');
  var VinylFile = require('vinyl');

  var indexTemplateName = LOCAL_DEMOS ? 'index.template.dev.html' : 'index.template.html';
  var baseIndexTemplate = _.template(fs.readFileSync('scripts/demos/' + indexTemplateName))();

  console.log(flags);
  if (flags.production) {
    buildDemoSass(true);
  } else {
    buildDemoSass(false);
  }

  var tsResult = gulp.src(['demos/**/*.ts'])
    .pipe(cache('demos.ts'))
    .pipe(tsc(getTscOptions(), undefined, tscReporter))
    .on('error', function(error) {
      console.log(error.message);
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

function buildDemoSass(isProductionMode) {
  var sass = require('gulp-sass');
  var autoprefixer = require('gulp-autoprefixer');
  var minifyCss = require('gulp-minify-css');
  var concat = require('gulp-concat');

  var sassVars = isProductionMode ? 'demos/app.variables.production.scss': 'demos/app.variables.local.scss';

  (function combineSass() {
    gulp.src([
        sassVars,
        'demos/app.variables.scss',
        'demos/app.ios.scss'
      ])
    .pipe(concat('output.ios.scss'))
    .pipe(gulp.dest('demos/'))

    gulp.src([
        sassVars,
        'demos/app.variables.scss',
        'demos/app.md.scss'
      ])
    .pipe(concat('output.md.scss'))
    .pipe(gulp.dest('demos/'))

    gulp.src([
        sassVars,
        'demos/app.variables.scss',
        'demos/app.wp.scss'
      ])
    .pipe(concat('output.wp.scss'))
    .pipe(gulp.dest('demos/'))

  })();

  gulp.src([
    'demos/output.ios.scss',
    'demos/output.md.scss',
    'demos/output.wp.scss'
  ])

  .pipe(sass({
      includePaths: [__dirname + '/node_modules/ionicons/dist/scss/'],
    }).on('error', sass.logError)
  )
  .pipe(autoprefixer(buildConfig.autoprefixer))
  .pipe(gulp.dest('dist/demos/'))
  .pipe(minifyCss())
  .pipe(rename({ extname: '.min.css' }))
  .pipe(gulp.dest('dist/bundles/'));
}


/**
 * Tests
 */
require('./scripts/snapshot/snapshot.task')(gulp, argv, buildConfig);

// requires bundle.system to be run once
gulp.task('karma', ['tests'], function(done) {
  var karma = require('karma').server;
  karma.start({
    configFile: __dirname + '/scripts/karma/karma.conf.js'
  }, function(result) {
    if (result > 0) {
      return done(new Error('Karma exited with an error'));
    }
    done();
  });
});

gulp.task('karma-watch', ['watch.tests', 'bundle.system'], function() {
  watchTask('bundle.system');
  var karma = require('karma').server;
  return karma.start({ configFile: __dirname + '/scripts/karma/karma-watch.conf.js'})
});


/**
 * Release
 */

 /**
  * Builds Ionic sources to dist with typechecking and d.ts definitions, does
  * some prerelease magic (see 'prepare') and copies npm package and tooling
  * files to dist.
  */
gulp.task('prerelease', function(done){
  runSequence(
    'validate',
    'prepare',
    'package',
    done
  );
});

/**
 * Publishes to npm and creates a new tag and release on GitHub.
 */
gulp.task('release', ['publish.npm', 'publish.github']);

/**
 * Pulls latest, ensures there are no unstaged/uncommitted changes, updates
 * package.json minor version and generates CHANGELOG for release.
 */
gulp.task('prepare', ['git-pull-latest'], function(){
  var semver = require('semver');
  var fs = require('fs');
  var changelog = require('gulp-conventional-changelog');

  //Update package.json version
  var packageJSON = require('./package.json');
  packageJSON.version = semver.inc(packageJSON.version, 'prerelease', 'beta');
  fs.writeFileSync('package.json', JSON.stringify(packageJSON, null, 2));

  //Update changelog
  return gulp.src('./CHANGELOG.md')
    .pipe(changelog({
      preset: 'angular'
    }))
    .pipe(gulp.dest('./'));
});


gulp.task('git-pull-latest', function() {
  var execSync = require('child_process').execSync;
  var spawnSync = require('child_process').spawnSync;

  function fail(context, msg) {
    // remove gulp's 'Finished 'task' after 10ms' message
    context.removeAllListeners('task_stop');
    console.error('Prepare aborted.');
    console.error(msg);
  }

  //Check for uncommitted changes
  var gitStatusResult = execSync('git status --porcelain');
  if (gitStatusResult.toString().length > 0) {
    return fail(this, 'You have uncommitted changes, please stash or commit them before running prepare');
  }

  //Pull latest
  var gitPullResult = spawnSync('git', ['pull', 'origin', 'master']);
  if (gitPullResult.status !== 0) {
    fail('There was an error running \'git pull\':\n' + gitPullResult.stderr.toString());
  }
});

/**
 * Copies npm package and tooling files to dist.
 */
gulp.task('package', function(done){
  var fs = require('fs');
  var distDir = 'dist';

  gulp.src([
      'scripts/npm/.npmignore',
      'scripts/npm/README.md',
      '*tooling/**/*'
    ])
    .pipe(gulp.dest(distDir));

  var templatePackageJSON = require('./scripts/npm/package.json');
  var sourcePackageJSON = require('./package.json');
  var sourceDependencies = sourcePackageJSON.dependencies;

  // copy source package.json data to template
  templatePackageJSON.version = sourcePackageJSON.version
  templatePackageJSON.description = sourcePackageJSON.description
  templatePackageJSON.keywords = sourcePackageJSON.keywords

  // copy source dependencies versions to the template's peerDependencies
  // only copy dependencies that show up as peerDependencies in the template
  for (var dependency in sourceDependencies) {
    if (dependency in templatePackageJSON.peerDependencies) {
      templatePackageJSON.peerDependencies[dependency] = sourceDependencies[dependency];
    }
  }

  fs.writeFileSync(distDir + '/package.json', JSON.stringify(templatePackageJSON, null, 2));
  done();
});

/**
 * Creates a new tag and release on GitHub.
 */
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
      target_commitish: 'master',
      tag_name: 'v' + packageJSON.version,
      name: packageJSON.version,
      body: file.toString(),
      prerelease: true
    }, done);
  }));
});

/**
 * Publishes to npm.
 */
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
 * Execute this task to validate current code and then
 */
gulp.task('publish.nightly', function(done){
  runSequence('git-pull-latest', 'validate', 'nightly', done);
});

/**
 * Publishes a new tag to npm with a nightly tag.
 * This will only update the dist package.json file.
 */
gulp.task('nightly', ['package'], function(done) {
  var fs = require('fs');
  var spawn = require('child_process').spawn;
  var packageJSON = require('./dist/package.json');

  // Generate a unique id formatted from current timestamp
  function createTimestamp() {
    // YYYYMMDDHHMM
    var d = new Date();
    return d.getUTCFullYear() + // YYYY
           ('0' + (d.getUTCMonth() +　1)).slice(-2) + // MM
           ('0' + (d.getUTCDate())).slice(-2) + // DD
           ('0' + (d.getUTCHours())).slice(-2) + // HH
           ('0' + (d.getUTCMinutes())).slice(-2); // MM
  }

  /**
   * Split the version on dash so that we can add nightly
   * to all production, beta, and nightly releases
   * 0.1.0                  -becomes-  0.1.0-r8e7684t
   * 0.1.0-beta.0           -becomes-  0.1.0-beta.0-r8e7684t
   * 0.1.0-beta.0-t5678e3v  -becomes-  0.1.0-beta.0-r8e7684t
   */
  packageJSON.version = packageJSON.version.split('-')
    .slice(0, 2)
    .concat(createTimestamp())
    .join('-');

  fs.writeFileSync('./dist/package.json', JSON.stringify(packageJSON, null, 2));

  var npmCmd = spawn('npm', ['publish', '--tag=nightly', './dist']);
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
 * Build Ionic sources, with typechecking, .d.ts definition generation and debug
 * statements removed.
 */
gulp.task('build.release', function(done){
  DEBUG = false;
  TYPECHECK = true;
  runSequence(
    'release.clean',
    ['bundle', 'bundle.es6', 'sass', 'fonts', 'copy.scss'],
    done
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

/**
 * Validate Task
 * - This task
 */
gulp.task('validate', function(done) {
  runSequence(
    'lint.scss',
    'tslint',
    'build.release',
    'karma',
    done
  );
});


/**
 * TS LINT
 */
gulp.task('tslint', function() {
  var tslint = require('gulp-tslint');
  return gulp.src([
      'src/**/*.ts',
      '!src/**/test/**/*',
    ]).pipe(tslint())
      .pipe(tslint.report('verbose'));
});

var gulp = require('gulp');
var pkg = require('./package.json');
var semver = require('semver');
var through = require('through');

var argv = require('minimist')(process.argv.slice(2));

var _ = require('lodash');
var buildConfig = require('./config/build.config.js');
var changelog = require('conventional-changelog');
var connect = require('connect');
var dgeni = require('dgeni');
var es = require('event-stream');
var htmlparser = require('htmlparser2');
var irc = require('ircb');
var lunr = require('lunr');
var marked = require('marked');
var mkdirp = require('mkdirp');
var twitter = require('node-twitter-api');
var yaml = require('js-yaml');

var http = require('http');
var cp = require('child_process');
var fs = require('fs');

var concat = require('gulp-concat');
var footer = require('gulp-footer');
var gulpif = require('gulp-if');
var header = require('gulp-header');
var jshint = require('gulp-jshint');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var stripDebug = require('gulp-strip-debug');
var template = require('gulp-template');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');

var banner = _.template(buildConfig.banner, { pkg: pkg });

var IS_RELEASE_BUILD = !!argv.release;
if (IS_RELEASE_BUILD) {
  gutil.log(
    gutil.colors.red('--release:'),
    'Building release version (minified, debugs stripped)...'
  );
}

gulp.task('default', ['build']);
gulp.task('build', ['bundle', 'sass']);
gulp.task('validate', ['jshint', 'ddescribe-iit', 'karma']);

gulp.task('docs', function(done) {
  var docVersion = argv['doc-version'];
  if (docVersion != 'nightly' && !semver.valid(docVersion)) {
    console.log('Usage: gulp docs --doc-version=(nightly|versionName)');
    return process.exit(1);
  }
  process.env.DOC_VERSION = docVersion;
  return dgeni(__dirname + '/docs/docs.config.js').generateDocs().then(function() {
    gutil.log('Docs for', gutil.colors.cyan(docVersion), 'generated!');
  });
});

var IS_WATCH = false;
gulp.task('watch', ['build'], function() {
  IS_WATCH = true;
  gulp.watch('js/**/*.js', ['bundle']);
  gulp.watch('scss/**/*.scss', ['sass']);
});

gulp.task('changelog', function(done) {
  var newCodename = fs.readFileSync('config/CODENAMES').toString().split('\n')[0];
  var file = argv.standalone ? '' : __dirname + '/CHANGELOG.md';
  var subtitle = argv.subtitle || '"' + newCodename + '"';
  var toHtml = !!argv.html;
  var dest = argv.dest || 'CHANGELOG.md';
  var from = argv.from;
  changelog({
    repository: 'https://github.com/driftyco/ionic',
    version: pkg.version,
    subtitle: subtitle,
    file: file,
    from: from
  }, function(err, data) {
    if (err) return done(err);
    if (toHtml) {
      data = marked(data, {
        gfm: true
      });
    }
    fs.writeFileSync(dest, data);
    done();
  });
});

gulp.task('bundle', [
  'scripts',
  'scripts-ng',
  'vendor',
  'version',
], function() {
  IS_RELEASE_BUILD && gulp.src(buildConfig.ionicBundleFiles.map(function(src) {
      return src.replace(/.js$/, '.min.js');
    }))
      .pipe(header(buildConfig.bundleBanner))
      .pipe(concat('ionic.bundle.min.js'))
      .pipe(gulp.dest(buildConfig.distJs));

  return gulp.src(buildConfig.ionicBundleFiles)
    .pipe(header(buildConfig.bundleBanner))
    .pipe(concat('ionic.bundle.js'))
    .pipe(gulp.dest(buildConfig.distJs));
});

gulp.task('jshint', function() {
  return gulp.src(['js/**/*.js'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter(require('jshint-summary')({
      fileColCol: ',bold',
      positionCol: ',bold',
      codeCol: 'green,bold',
      reasonCol: 'cyan'
    })))
    .pipe(jshint.reporter('fail'));
});

gulp.task('ddescribe-iit', function() {
  return gulp.src(['test/**/*.js', 'js/**/*.js'])
    .pipe(notContains([
      'ddescribe', 'iit', 'xit', 'xdescribe'
    ]));
});

gulp.task('vendor', function() {
  return gulp.src(buildConfig.vendorFiles, {
      cwd: 'config/lib/',
      base: 'config/lib/'
    })
    .pipe(gulp.dest(buildConfig.dist));
});

gulp.task('scripts', function() {
  return gulp.src(buildConfig.ionicFiles)
    .pipe(gulpif(IS_RELEASE_BUILD, stripDebug()))
    .pipe(template({ pkg: pkg }))
    .pipe(concat('ionic.js'))
    .pipe(header(buildConfig.closureStart))
    .pipe(footer(buildConfig.closureEnd))
    .pipe(header(banner))
    .pipe(gulp.dest(buildConfig.distJs))
    .pipe(gulpif(IS_RELEASE_BUILD, uglify()))
    .pipe(rename({ extname: '.min.js' }))
    .pipe(header(banner))
    .pipe(gulp.dest(buildConfig.distJs));
});

gulp.task('scripts-ng', function() {
  return gulp.src(buildConfig.angularIonicFiles)
    .pipe(gulpif(IS_RELEASE_BUILD, stripDebug()))
    .pipe(concat('ionic-angular.js'))
    .pipe(header(buildConfig.closureStart))
    .pipe(footer(buildConfig.closureEnd))
    .pipe(header(banner))
    .pipe(gulp.dest(buildConfig.distJs))
    .pipe(gulpif(IS_RELEASE_BUILD, uglify()))
    .pipe(rename({ extname: '.min.js' }))
    .pipe(header(banner))
    .pipe(gulp.dest(buildConfig.distJs));
});

gulp.task('sass', function(done) {
  gulp.src('scss/ionic.scss')
    .pipe(header(banner))
    .pipe(sass({
      onError: function(err) {
        //If we're watching, don't exit on error
        if (IS_WATCH) {
          console.log(gutil.colors.red(err));
        } else {
          done(err);
        }
      }
    }))
    .pipe(concat('ionic.css'))
    .pipe(gulp.dest(buildConfig.distCss))
    .pipe(gulpif(IS_RELEASE_BUILD, minifyCss()))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest(buildConfig.distCss))
    .on('end', done);
});

gulp.task('version', function() {
  var d = new Date();
  var date = d.toISOString().substring(0,10);
  var time = pad(d.getUTCHours()) +
      ':' + pad(d.getUTCMinutes()) +
      ':' + pad(d.getUTCSeconds());
  return gulp.src('config/version.template.json')
    .pipe(template({
      pkg: pkg,
      date: date,
      time: time
    }))
    .pipe(rename('version.json'))
    .pipe(gulp.dest('dist'));
});

gulp.task('release-tweet', function(done) {
  var oauth = {
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  };
  var client = new twitter(oauth);
  client.statuses(
    'update',
    { status: buildConfig.releaseMessage() },
    oauth.accessToken,
    oauth.accessTokenSecret,
    done
  );
});

gulp.task('release-irc', function(done) {
  var client = irc({
    host: 'irc.freenode.net',
    secure: true,
    nick: 'ionitron',
    username: 'ionitron',
    realName: 'ionitron',
    channels: ['#ionic']
  }, function() {
    client.say('#ionic', buildConfig.releaseMessage(), function() {
      client.quit('', done);
    });
  });
});

gulp.task('docs-index', function() {
  var idx = lunr(function() {
    this.field('path');
    this.field('title', {boost: 10});
    this.field('body');
    this.ref('id');
  });
  var ref = {};
  var refId = 0;

  function addToIndex(path, title, layout, body) {
    // Add the data to the indexer and ref object
    idx.add({'path': path, 'body': body, 'title': title, id: refId});
    ref[refId] = {'p': path, 't': title, 'l': layout};
    refId++;
  }

  return gulp.src([
    'tmp/ionic-site/docs/{components,guide,api,overview}/**/*.{md,html,markdown}',
    'tmp/ionic-site/docs/index.html',
    'tmp/ionic-site/getting-started/index.html',
    'tmp/ionic-site/tutorials/**/*.{md,html,markdown}',
    'tmp/ionic-site/_posts/**/*.{md,html,markdown}'
  ])
    .pipe(es.map(function(file, callback) {
      //docs for gulp file objects: https://github.com/wearefractal/vinyl
      var contents = file.contents.toString(); //was buffer

      // Grab relative path from ionic-site root
      var relpath = file.path.replace(/^.*?tmp\/ionic-site\//, '');

      // Read out the yaml portion of the Jekyll file
      var yamlStartIndex = contents.indexOf('---');

      if (yamlStartIndex === -1) {
        return callback();
      }

      // read Jekyll's page yaml variables at the top of the file
      var yamlEndIndex = contents.indexOf('---', yamlStartIndex+3); //starting from start
      var yamlRaw = contents.substring(yamlStartIndex+3, yamlEndIndex);

      var pageData =  yaml.safeLoad(yamlRaw);
      if(!pageData.title || !pageData.layout) {
        return callback();
      }

      // manually set to not be searchable, or for a blog post, manually set to be searchable
      if(pageData.searchable === false || (pageData.layout == 'post' && pageData.searchable !== true)) {
        return callback();
      }

      // clean up some content so code variables are searchable too
      contents = contents.substring(yamlEndIndex+3);
      contents = contents.replace(/<code?>/gi, '');
      contents = contents.replace(/<\/code>/gi, '');
      contents = contents.replace(/<code?></gi, '');
      contents = contents.replace(/><\/code>/gi, '');
      contents = contents.replace(/`</gi, '');
      contents = contents.replace(/>`/gi, '');

      // create a clean path to the URL
      var path = '/' + relpath.replace('index.md', '')
                              .replace('index.html', '')
                              .replace('.md', '.html')
                              .replace('.markdown', '.html');
      if(pageData.layout == 'post') {
        path = '/blog/' + path.substring(19).replace('.html', '/');
      }

      var parser;
      if(pageData.search_sections === true) {
        // each section within the content should be its own search result
        var section = { body: '', title: '' };
        var isTitleOpen = false;

        parser = new htmlparser.Parser({
          ontext: function(text){
            if(isTitleOpen) {
              section.title += text; // get the title of this section
            } else {
              section.body += text.replace(/{%.*%}/, '', 'g'); // Ignore any Jekyll expressions
            }
          },
          onopentag: function(name, attrs) {
            if(name == 'section' && attrs.id) {
              // start building new section data
              section = { body: '', path: path + '#' + attrs.id, title: '' };
            } else if( (name == 'h1' || name == 'h2' || name == 'h3') && attrs.class == 'title') {
              isTitleOpen = true; // the next text will be this sections title
            }
          },
          onclosetag: function(name) {
            if(name == 'section') {
              // section closed, index this section then clear it out
              addToIndex(section.path, section.title, pageData.layout, section.body);
              section = { body: '', title: '' };
            } else if( (name == 'h1' || name == 'h2' || name == 'h3') && isTitleOpen) {
              isTitleOpen = false;
            }
          }
        });
        parser.write(contents);
        parser.end();

      } else {
        // index the entire page
        var body = '';
        parser = new htmlparser.Parser({
          ontext: function(text){
            body += text.replace(/{%.*%}/, '', 'g'); // Ignore any Jekyll expressions
          }
        });
        parser.write(contents);
        parser.end();

        addToIndex(path, pageData.title, pageData.layout, body);
      }

      callback();

    })).on('end', function() {
      // Write out as one json file
      mkdirp.sync('tmp/ionic-site/data');
      fs.writeFileSync(
        'tmp/ionic-site/data/index.json',
        JSON.stringify({'ref': ref, 'index': idx.toJSON()})
      );
    });
});

gulp.task('sauce-connect', sauceConnect);

gulp.task('cloudtest', ['protractor-sauce'], function(cb) {
  sauceDisconnect(cb);
});

gulp.task('karma', function(cb) {
  return karma(cb, [__dirname + '/config/karma.conf.js', '--single-run=true']);
});
gulp.task('karma-watch', function(cb) {
  return karma(cb, [__dirname + '/config/karma.conf.js']);
});

var connectServer;
gulp.task('connect-server', function() {
  var app = connect().use(connect.static(__dirname));
  connectServer = http.createServer(app).listen(8765);
});
gulp.task('protractor', ['connect-server'], function(cb) {
  return protractor(cb, ['config/protractor.conf.js']);
});
gulp.task('protractor-sauce', ['sauce-connect', 'connect-server'], function(cb) {
  return protractor(cb, ['config/protractor-sauce.conf.js']);
});

function karma(cb, args) {
  if (argv.browsers) {
    args.push('--browsers='+argv.browsers.trim());
  }
  if (argv.reporters) {
    args.push('--reporters='+argv.reporters.trim());
  }
  cp.spawn('node', [
    __dirname + '/node_modules/karma/bin/karma',
    'start'
  ].concat(args), { stdio: 'inherit' })
  .on('exit', function(code) {
    if (code) return cb('Karma test(s) failed. Exit code: ' + code);
    cb();
  });
}

function pad(n) {
  if (n<10) { return '0' + n; }
  return n;
}

function protractor(cb, args) {
  cp.spawn('protractor', args, { stdio: 'inherit' })
  .on('exit', function(code) {
    connectServer && connectServer.close();
    if (code) return cb('Protector test(s) failed. Exit code: ' + code);
    cb();
  });
}

var sauceInstance;
function sauceConnect(cb) {
  require('sauce-connect-launcher')({
    username: process.env.SAUCE_USER,
    accessKey: process.env.SAUCE_KEY,
    verbose: true,
    tunnelIdentifier: process.env.TRAVIS_BUILD_NUMBER
  }, function(err, instance) {
    if (err) return cb('Failed to launch sauce connect!');
    sauceInstance = instance;
    cb();
  });
}

function sauceDisconnect(cb) {
  if (sauceInstance) {
    return sauceInstance.close(cb);
  }
  cb();
}

function notContains(disallowed) {
  disallowed = disallowed || [];

  return through(function(file) {
    var error;
    var contents = file.contents.toString();
    disallowed.forEach(function(str) {
      var idx = disallowedIndex(contents, str);
      if (idx !== -1) {
        error = error || file.path + ' contains ' + str + ' on line ' +
          contents.substring(0, idx, str).split('\n').length + '!';
      }
    });
    if (error) {
      throw new Error(error);
    } else {
      this.emit('data', file);
    }
  });

  function disallowedIndex(content, disallowedString) {
    var notFunctionName = '[^A-Za-z0-9$_]';
    var regex = new RegExp('(^|' + notFunctionName + ')(' + disallowedString + ')' + notFunctionName + '*\\(', 'gm');
    var match = regex.exec(content);
    // Return the match accounting for the first submatch length.
    return match !== null ? match.index + match[1].length : -1;
  }
}

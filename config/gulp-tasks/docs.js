var buildConfig = require('../build.config.js');
var cp = require('child_process');
var dgeni = require('dgeni');
var es = require('event-stream');
var fs = require('fs');
var gutil = require('gulp-util');
var htmlparser = require('htmlparser2');
var lunr = require('lunr');
var mkdirp = require('mkdirp');
var path = require('canonical-path');
var projectRoot = path.resolve(__dirname, '../..');
var semver = require('semver');
var yaml = require('js-yaml');

module.exports = function(gulp, argv) {

  if (argv.dist) {
    buildConfig.dist = argv.dist;
  }

  gulp.task('docs', function() {
    var docVersion = argv['doc-version'] || 'nightly';
    if (docVersion != 'nightly' && !semver.valid(docVersion)) {
      console.log('Usage: gulp docs --doc-version=(nightly|versionName)');
      return process.exit(1);
    }

    var config = dgeni.loadConfig(path.resolve(projectRoot, 'config/docs/docs.config.js'));
    config.set('currentVersion', docVersion);
    config.set(
      'rendering.outputFolder',
      argv.dist ? argv.dist : path.resolve(projectRoot, '..', 'ionic-site')
    );

    return dgeni.generator(config)().then(function() {
      gutil.log('Docs for', gutil.colors.cyan(docVersion), 'generated!');
    });
  });

  gulp.task('demos', function(done) {
    var demoVersion = argv['demo-version'] || 'nightly';
    if (demoVersion != 'nightly' && !semver.valid(demoVersion)) {
      console.log('Usage: gulp docs --doc-version=(nightly|versionName)');
      return process.exit(1);
    }

    var config = dgeni.loadConfig(path.resolve(projectRoot, 'config/demos/demos.config.js'));
    config.set('currentVersion', demoVersion);
    config.set('dist', buildConfig.dist);
    config.set(
      'rendering.outputFolder',
      argv.dist ? argv.dist : path.resolve(projectRoot, buildConfig.dist, 'nightly')
    );
    config.set('demoFolderPrefix', argv.release ? '' : '/dist/ionic-demo');

    dgeni.generator(config)().then(function() {
      gutil.log('Demos for', gutil.colors.cyan(demoVersion), 'generated!');
      gutil.log('Building ionic into demo folder...');
      cp.spawn('node', [
        projectRoot + '/node_modules/.bin/gulp',
        'build',
        argv.release ? '--release' : '--no-release',
        '--dist=' + config.rendering.outputFolder + '/' +
          config.rendering.contentsFolder + '/ionic'
      ])
      .on('exit', done);
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

    var docPath = buildConfig.dist + '/ionic-site';
    gutil.log('Reading docs from', gutil.colors.cyan(docPath));

    return gulp.src([
      docPath + '/docs/{components,guide,api,overview}/**/*.{md,html,markdown}',
      docPath + '/docs/index.html',
      docPath + '/getting-started/index.html',
      docPath + '/tutorials/**/*.{md,html,markdown}',
      docPath + '/_posts/**/*.{md,html,markdown}'
    ])
      .pipe(es.map(function(file, callback) {
        //docs for gulp file objects: https://github.com/wearefractal/vinyl
        var contents = file.contents.toString(); //was buffer

        // Grab relative path from ionic-site root
        var relpath = file.path.replace(RegExp('^.*?' + docPath + '/'), '');

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
        mkdirp.sync(docPath + '/data');
        fs.writeFileSync(
          docPath + '/data/index.json',
          JSON.stringify({'ref': ref, 'index': idx.toJSON()})
        );
      });
  });

};

var config = require('../config.json');
module.exports = function(gulp, flags) {
  gulp.task('docs', ['docs.demos'], function() {
    var Dgeni = require('dgeni');
    var semver = require('semver');

    var docVersion = flags['doc-version'] || 'nightly';
    if (docVersion != 'nightly' && !semver.valid(docVersion)) {
      console.log('Usage: gulp docs --doc-version=(nightly|versionName)\nversionName must be a valid semver version.');
      return process.exit(1);
    }
    try {
      var ionicPackage = require('./dgeni-config')(docVersion);
      var dgeni = new Dgeni([ionicPackage]);
      return dgeni.generate();
    } catch (err) {
      console.log(err.stack);
    }
  });

  gulp.task('docs.demos', ['demos', 'src', 'temp.hack'], function(){
    return gulp.src([
        'dist/**',
        '!dist/e2e',
        '!dist/e2e/**/*',
        '!dist/ionic-site',
        '!dist/ionic-site/**/*',
        '!dist/src',
        '!dist/src/**/*'
      ])
      .pipe(gulp.dest(config.docsDest + '/dist'));
  });

  gulp.task('docs.index', function() {
    var lunr = require('lunr');
    var gutil = require('gulp-util');
    var es = require('event-stream');
    var yaml = require('js-yaml');
    var htmlparser = require('htmlparser2');
    var mkdirp = require('mkdirp');
    var fs = require('fs');

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

    var docPath = config.docsDest;
    gutil.log('Reading docs from', gutil.colors.cyan(docPath));

    return gulp.src([
      docPath + '/{guide,api,overview, what-is,utilities,ui,theming,native}/**/*.{md,html,markdown}',
      docPath + '/index.md',
    ])
      .pipe(es.map(function(file, callback) {
        //docs for gulp file objects: https://github.com/wearefractal/vinyl
        var contents = file.contents.toString(); //was buffer

        // Grab relative path from ionic-site root
        var relpath = file.path.replace(RegExp('^.*?' + docPath.replace('/' + config.v2DocsDir, '') + '/'), '');

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

  gulp.task('docs.sass-variables', function() {
    var fs = require('fs');
    var gutil = require('gulp-util');
    var es = require('event-stream');
    var path = require('path');
    var Entities = require('html-entities').AllHtmlEntities;
    entities = new Entities();

    var variables = [];
    var outputFile = config.docsDest + '/data/sass.json';

    // Add the variable to the array, encode the html and remove !default from the value
    function addVariable(variableName, defaultValue, file) {
      defaultValue = entities.encode(defaultValue);
      defaultValue = defaultValue.replace("!default;", "");

      variables.push({
        "name": variableName,
        "defaultValue": defaultValue.trim(),
        "file": path.relative('./', file.path)
      });
    }

    return gulp.src('ionic/**/*.scss')
      .pipe(es.map(function(file, callback) {
        var contents = file.contents.toString();
        var variableLine, variableName, defaultValue, multiline;

        fs.createReadStream(file.path, {flags: 'r'})
          .pipe(es.split())
          .pipe(es.map(function (line, callback) {
            if (line.charAt(0) == '$') {
              variableLine = line.split(/:(.+)/);
              variableName = variableLine[0];
              defaultValue = variableLine[1];

              // If there is a semicolon then it isn't a multiline value
              multiline = line.indexOf(';') > -1 ? false : true;

              if (!multiline && line.indexOf('!default') > -1)
                addVariable(variableName, defaultValue, file);
            } else if (multiline == true) {
              defaultValue += '\n' + line;

              // If the line has a semicolon then we've found the end of the value
              if (line.indexOf(';') > -1 && line.indexOf('!default') > -1) {
                addVariable(variableName, defaultValue, file);
                multiline = false;
              }
            }
            callback();
          }));
        callback();
      }).on('end', function() {
        gutil.log("Writing to file at", gutil.colors.cyan("/driftyco/ionic2/" + outputFile));
        gutil.log("Place this file in", gutil.colors.cyan("/driftyco/ionic-site/" + config.v2DocsDir + "/theming/overriding-ionic-variables/"), "in order to update the docs");
        fs.writeFileSync(outputFile, JSON.stringify(variables));
      }));
  });
}

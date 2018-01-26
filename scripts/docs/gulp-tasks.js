var config = require('../config.json');
module.exports = function(gulp, flags) {
  gulp.task('docs', [], function() {
    var Dgeni = require('dgeni');
    var semver = require('semver');

    var docVersion = flags['doc-version'] || 'nightly';
    var initialVersionBuild = flags['initial-build'] || false;
    if (docVersion != 'nightly' && !semver.valid(docVersion)) {
      console.log('Usage: gulp docs --doc-version=(nightly|versionName)\nversionName must be a valid semver version.');
      return process.exit(1);
    }
    try {
      var ionicPackage = require('./dgeni-config')(docVersion, initialVersionBuild);
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

  gulp.task('docs.sass-variables', function() {
    var fs = require('fs');
    var gutil = require('gulp-util');
    var es = require('event-stream');
    var mkdirp = require('mkdirp');
    var path = require('path');
    var Entities = require('html-entities').AllHtmlEntities;
    entities = new Entities();

    var variables = [];
    var outputFile = 'tmp/sass.json';

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

    return gulp.src('src/**/*.scss')
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
        gutil.log("Writing to file at", gutil.colors.cyan("/ionic-team/ionic/" + outputFile));
        gutil.log("Place this file in", gutil.colors.cyan("/ionic-team/ionic-site/" + config.v2DocsDir + "/theming/overriding-ionic-variables/"), "in order to update the docs");
        mkdirp.sync('tmp');
        fs.writeFileSync(outputFile, JSON.stringify(variables));
      }));
  });
}

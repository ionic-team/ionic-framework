import { createReadStream, writeFileSync } from 'fs';
import { join, relative } from 'path';
import { DEMOS_ROOT, DEMOS_SRC_ROOT } from '../constants';
import { src, dest, task } from 'gulp';

import * as Dgeni from 'dgeni';
import { split, map } from 'event-stream';
import { AllHtmlEntities } from 'html-entities';
import * as mkdirp from 'mkdirp';
import { valid }from 'semver';
import { argv } from 'yargs';


task('docs', () => {
  const docVersion = argv['doc-version'] || 'nightly';
  const initialVersionBuild = argv['initial-build'] || false;
  if (docVersion !== 'nightly' && ! valid(docVersion)) {
    console.log('Usage: gulp docs --doc-version=(nightly|versionName)\nversionName must be a valid semver version.');
    return process.exit(1);
  }

  try {
    const ionicPackage = require('../../docs/dgeni-config')(docVersion, initialVersionBuild);
    const dgeni = new Dgeni([ionicPackage]);
    return dgeni.generate();
  } catch (err) {
    console.log(err.stack);
  }
});

task('docs.copyDemos', [], () => {
  const config = require('../../config.json');
  const outputDir = join(config.docsDest, 'dist', 'demos');
  return src([`${DEMOS_ROOT}/css`, `${DEMOS_ROOT}/fonts`, `${DEMOS_ROOT}/polyfills`, `${DEMOS_SRC_ROOT}`])
    .pipe(dest(outputDir));
});

task('docs.sassVariables', () => {
  let variables = [];
  const outputFile = 'tmp/sass.json';

  function addVariable(variableName, defaultValue, file) {
    const entities = new AllHtmlEntities();
    defaultValue = entities.encode(defaultValue);
    defaultValue = defaultValue.replace('!default;', '');

    variables.push({
      name: variableName,
      defaultValue: defaultValue.trim(),
      file: relative('./', file.path)
    });
  }

  return src('./src/**/*.scss')
    .pipe(map((file, callback) => {
      let variableLine, variableName, defaultValue, multiline;
      createReadStream(file.path, { flags: 'r'})
        .pipe(split())
        .pipe(map((line, callback) => {
          if (line.charAt(0) === '$') {
            variableLine = line.split(/:(.+)/);
              variableName = variableLine[0];
              defaultValue = variableLine[1];

              // If there is a semicolon then it isn't a multiline value
              multiline = line.indexOf(';') > -1 ? false : true;
              if (!multiline && line.indexOf('!default') > -1) {
                addVariable(variableName, defaultValue, file);
              }
          } else if (multiline === true) {
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
    }).on('end', () => {
      const config = require('../../config.json');
      console.log(`Writing to file at /driftyco/ionic/${outputFile}`);
      console.log(`Place this file in /driftyco/ionic-site/${config.v2DocsDir}/theming/overriding-ionic-variables in order to update the docs`);
      mkdirp.sync('tmp');
      writeFileSync(outputFile, JSON.stringify(variables));
    }));
});

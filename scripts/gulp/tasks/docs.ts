import { createReadStream, writeFileSync } from 'fs';
import { join, relative } from 'path';

import * as Dgeni from 'dgeni';
import { split, map } from 'event-stream';
import { src, dest, task } from 'gulp';
import { AllHtmlEntities } from 'html-entities';
import * as mkdirp from 'mkdirp';
import { valid }from 'semver';
import { argv } from 'yargs';

import { DIST_DEMOS_ROOT } from '../constants';
import { SITE_ROOT } from '../constants';
import { PROJECT_ROOT } from '../constants';

task('docs', ['docs.dgeni', 'docs.demos', 'docs.sassVariables']);

task('docs.dgeni', () => {
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

task('docs.demos', (done: Function) => {
  // Copy demos already built from gulp demos.prod task to ionic-site
  const config = require('../../config.json');
  const outputDir = join(config.docsDest, 'demos');
  let promises = [];
  promises.push(copyDemoCss(join(outputDir, 'css')));
  promises.push(copyDemoFonts(join(outputDir, 'fonts')));
  promises.push(copyDemoPolyfills(join(outputDir, 'polyfills')));
  promises.push(copyDemoContent(join(outputDir, 'src')));
  Promise.all(promises).then(() => {
    done();
  }).catch(err => {
    done(err);
  });
});

function copyDemoCss(outputDir: string) {
  return new Promise((resolve, reject) => {
    const stream = src(`${DIST_DEMOS_ROOT}/css/*`).pipe(dest(outputDir));
    stream.on('end', () => {
      resolve();
    });
  });
}

function copyDemoFonts(outputDir: string) {
  return new Promise((resolve, reject) => {
    const stream = src(`${DIST_DEMOS_ROOT}/fonts/*`).pipe(dest(outputDir));
    stream.on('end', () => {
      resolve();
    });
  });
}

function copyDemoPolyfills(outputDir: string) {
  return new Promise((resolve, reject) => {
    const stream = src(`${DIST_DEMOS_ROOT}/polyfills/*`).pipe(dest(outputDir));
    stream.on('end', () => {
      resolve();
    });
  });
}

function copyDemoContent(outputDir: string) {
  return new Promise((resolve, reject) => {
    const stream = src([
      `${DIST_DEMOS_ROOT}/src/**/*`
      ]).pipe(dest(outputDir));
    stream.on('end', () => {
      resolve();
    });
  });
}

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
      console.log(`Writing to file at /ionic-team/ionic/${outputFile}`);
      console.log(`Place this file in /ionic-team/ionic-site/${config.v2DocsDir}/theming/overriding-ionic-variables in order to update the docs`);
      mkdirp.sync('tmp');
      writeFileSync(outputFile, JSON.stringify(variables));
    }));
});

task('docs.homepageVersionUpdate', () => {
  // This assumes you're currently releasing
  const sourcePackageJSON = require(`${PROJECT_ROOT}/package.json`);
  let now = new Date();

  const frameworkInfo = JSON.stringify({
    version: sourcePackageJSON.version,
    date: now.toISOString().split('T')[0]
  }, null, 2);

  writeFileSync(`${SITE_ROOT}/server/data/framework-info.json`, frameworkInfo);
});

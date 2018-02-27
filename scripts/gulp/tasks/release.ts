import { exec, spawnSync } from 'child_process';
import { spawn } from 'cross-spawn';
import { writeFileSync } from 'fs';
import * as changelog from 'conventional-changelog';
import * as GithubApi from 'github';
import { dest, src, start, task } from 'gulp';
import { prompt } from 'inquirer';
import { rollup } from 'rollup';
import * as commonjs from 'rollup-plugin-commonjs';
import * as nodeResolve from 'rollup-plugin-node-resolve';
import * as runSequence from 'run-sequence';
import * as semver from 'semver';
import { obj } from 'through2';

import { DIST_BUILD_ROOT, DIST_BUILD_UMD_BUNDLE_ENTRYPOINT, DIST_BUNDLE_ROOT, PROJECT_ROOT, SCRIPTS_ROOT, SRC_ROOT } from '../constants';
import { compileSass, copyFonts, createTimestamp, setSassIonicVersion, writePolyfills } from '../util';

var promptAnswers;

// Nightly: releases a nightly version
task('nightly', (done: (err: any) => void) => {
  runSequence('release.pullLatest',
              'validate',
              'release.prepareReleasePackage',
              'release.publishNightly',
              done);
});

// Release: prompt, update, publish
task('release', (done: (err: any) => void) => {
  runSequence('release.pullLatest',
              'validate',
              'release.prepareReleasePackage',
              'release.promptVersion',
              'release.update',
              'release.publish',
              done);
});

// Release.test: prompt and update
task('release.test', (done: (err: any) => void) => {
  runSequence('validate',
              'release.prepareReleasePackage',
              'release.promptVersion',
              'release.update',
              done);
});

// Release.update: update package.json and changelog
task('release.update', (done: (err: any) => void) => {
  if (promptAnswers.confirmRelease === 'yes') {
    runSequence('release.copyProdVersion',
                'release.prepareChangelog',
                done);
  } else {
    console.log('Did not run release.update tasks, aborted release');
    done(null);
  }
});

// Release.publish: publish to GitHub and npm
task('release.publish', (done: (err: any) => void) => {
  if (promptAnswers.confirmRelease === 'yes') {
    runSequence('release.publishNpmRelease',
                'release.publishGithubRelease',
                done);
  } else {
    console.log('Did not run release.publish tasks, aborted release');
    done(null);
  }
});

task('release.publishGithubRelease', (done: Function) => {
  const packageJSON = require('../../../package.json');

  const github = new GithubApi({
    version: '3.0.0'
  });

  github.authenticate({
    type: 'oauth',
    token: process.env.GH_TOKEN
  });

  return changelog({
    preset: 'angular'
  })
  .pipe(obj(function(file, enc, cb) {
    github.releases.createRelease({
      owner: 'ionic-team',
      repo: 'ionic',
      target_commitish: 'master',
      tag_name: 'v' + packageJSON.version,
      name: packageJSON.version,
      body: file.toString(),
      prerelease: false
    }, done);
  }));
});

task('release.publishNpmRelease', (done: Function) => {
  const npmCmd = spawn('npm', ['publish', DIST_BUILD_ROOT]);
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

task('release.promptVersion', (done: Function) => {
  prompt([
    {
      type: 'list',
      name: 'release',
      message: 'What type of release is this?',
      choices: [
        {
          name: 'Major:    Incompatible API changes',
          value: 'major'
        }, {
          name: 'Minor:    Backwards-compatible functionality',
          value: 'minor'
        }, {
          name: 'Patch:    Backwards-compatible bug fixes',
          value: 'patch'
        }, {
          name: 'Premajor',
          value: 'premajor'
        }, {
          name: 'Preminor',
          value: 'preminor'
        }, {
          name: 'Prepatch',
          value: 'prepatch'
        }, {
          name: 'Prerelease',
          value: 'prerelease'
        }
      ]
    }, {
      type: 'list',
      name: 'confirmRelease',
      default: 'no',
      choices: [
        {
          name: 'Yes',
          value: 'yes'
        }, {
          name: 'Abort release',
          value: 'no'
        }
      ],
      message: function(answers) {
        var SEP = '---------------------------------';
        console.log('\n' + SEP + '\n' + getVersion(answers) + '\n' + SEP + '\n');
        return 'Are you sure you want to proceed with the release version above?';
      }
    }
  ]).then(function (answers) {
    // Continue with the release if version was confirmed
    promptAnswers = answers;
    done();
  });
});

function getVersion(answers) {
  const sourcePackageJSON = require(`${PROJECT_ROOT}/package.json`);

  return semver.inc(sourcePackageJSON.version, answers.release, true);
}

task('release.copyProdVersion', () => {
  // Increment the version and update the source package file
  const sourcePackageJSON = require(`${PROJECT_ROOT}/package.json`);

  sourcePackageJSON.version = semver.inc(sourcePackageJSON.version, promptAnswers.release, true);

  const sourcePrettyPrintedJson = JSON.stringify(sourcePackageJSON, null, 2);
  writeFileSync(`${PROJECT_ROOT}/package.json`, sourcePrettyPrintedJson);

  // Copy the source package version and update it in the build package file
  const packageJsonToUpdate = require(`${DIST_BUILD_ROOT}/package.json`);

  packageJsonToUpdate.version = sourcePackageJSON.version;

  const prettyPrintedJson = JSON.stringify(packageJsonToUpdate, null, 2);
  writeFileSync(`${DIST_BUILD_ROOT}/package.json`, prettyPrintedJson);
});

task('release.prepareReleasePackage', (done: (err: any) => void) => {
  runSequence('clean',
          'release.polyfill',
          'compile.release',
          'release.copyTemplates',
          'release.copyNpmInfo',
          'release.preparePackageJsonTemplate',
          'release.nightlyPackageJson',
          'release.compileSass',
          'release.fonts',
          'release.sass',
          'release.createUmdBundle',
          done);
});

task('release.createUmdBundle', (done: Function) => {
  return rollup({
    entry: DIST_BUILD_UMD_BUNDLE_ENTRYPOINT,
    plugins: [
      nodeResolve({
        module: true,
        jsnext: true,
        main: true
      }),
      commonjs()
    ]
  }).then((bundle) => {
    return bundle.write({
      format: 'umd',
      moduleName: 'ionicBundle',
      dest: `${DIST_BUNDLE_ROOT}/ionic.umd.js`
    });
  });
});

task('release.polyfill', (done: Function) => {
  writePolyfills('dist/ionic-angular/polyfills').then(() => {
    done();
  }).catch(err => {
    done(err);
  });
});

task('release.publishNightly', (done: Function) => {
  const npmCmd = spawn('npm', ['publish', '--tag=nightly', DIST_BUILD_ROOT]);
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

task('release.compileSass', () => {
  return compileSass(`${DIST_BUILD_ROOT}/css`);
});

task('release.fonts', () => {
  return copyFonts(`${DIST_BUILD_ROOT}/fonts`);
});

task('release.sass', () => {
  return src([`${SRC_ROOT}/**/*.scss`, `!${SRC_ROOT}/components/*/test/**/*`, `!${SRC_ROOT}/util/test/*`]).pipe(dest(`${DIST_BUILD_ROOT}`));
});

task('release.pullLatest', (done: Function) => {
  exec('git status --porcelain', (err: Error, stdOut: string) => {
    if (err) {
      done(err);
    } else if ( stdOut && stdOut.length > 0) {
      done(new Error('There are uncommited changes. Please commit or stash changes.'));
    } else {
      const gitPullResult = spawnSync('git', ['pull', 'origin', 'master']);
      if (gitPullResult.status !== 0) {
        done(new Error('Error running git pull'));
      }
      done();
    }
  });
});

task('release.prepareChangelog', () => {
  const changelog = require('gulp-conventional-changelog');
  return src(`${PROJECT_ROOT}/CHANGELOG.md`)
    .pipe(changelog({
      preset: 'angular'
    }))
    .pipe(dest(`${PROJECT_ROOT}`));
});

task('release.copyTemplates', () => {
  return src([`${SCRIPTS_ROOT}/templates/**/*`]).pipe(dest(`${DIST_BUILD_ROOT}/templates`));
});

task('release.copyNpmInfo', () => {
  return src([`${PROJECT_ROOT}/scripts/npm/.npmignore`, `${PROJECT_ROOT}/scripts/npm/README.md`]).pipe(dest(DIST_BUILD_ROOT));
});

task('release.preparePackageJsonTemplate', () => {
  let templatePackageJSON = require(`${PROJECT_ROOT}/scripts/npm/package.json`);
  const sourcePackageJSON = require(`${PROJECT_ROOT}/package.json`);
  // copy source package.json data to template
  templatePackageJSON.version = sourcePackageJSON.version;
  templatePackageJSON.description = sourcePackageJSON.description;
  templatePackageJSON.keywords = sourcePackageJSON.keywords;

  // copy source dependencies versions to the template's peerDependencies
  // only copy dependencies that show up as peerDependencies in the template
  for (let dependency in sourcePackageJSON.dependencies) {

    // if the dependency is in both, AND the value of the entry is empty, copy it over
    if (dependency in templatePackageJSON.peerDependencies && templatePackageJSON.peerDependencies[dependency] === '') {
      templatePackageJSON.peerDependencies[dependency] = sourcePackageJSON.dependencies[dependency];
    }
  }

  writeFileSync(`${DIST_BUILD_ROOT}` + '/package.json', JSON.stringify(templatePackageJSON, null, 2));
});

task('release.nightlyPackageJson', () => {
  const packageJson: any = require(`${DIST_BUILD_ROOT}/package.json`);

  packageJson.version = packageJson.version.split('-')
                                   .slice(0, 2)
                                   .concat(createTimestamp())
                                   .join('-');

  writeFileSync(`${DIST_BUILD_ROOT}/package.json`, JSON.stringify(packageJson, null, 2));
  setSassIonicVersion(packageJson.version);
});

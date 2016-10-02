import { exec, spawnSync, spawn } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';

import * as changelog from 'conventional-changelog';
import * as GithubApi from 'github';
import * as glob from 'glob';
import { dest, src, task } from 'gulp';
import { rollup } from 'rollup';
import * as commonjs from 'rollup-plugin-commonjs';
import * as nodeResolve from 'rollup-plugin-node-resolve';
import * as runSequence from 'run-sequence';
import { obj } from 'through2';

import { DIST_BUILD_UMD_BUNDLE_ENTRYPOINT, DIST_BUILD_ROOT, DIST_BUNDLE_ROOT, PROJECT_ROOT, SCRIPTS_ROOT, SRC_ROOT } from '../constants';
import { compileSass, copyFonts, createTimestamp, setSassIonicVersion, writePolyfills } from '../util';


task('nightly', (done: (err: any) => void) => {
  runSequence('release.prepareReleasePackage',
              'release.removeDebugStatements',
              'release.publishNightly',
              done);
});

task('release', (done: (err: any) => void) => {
  runSequence('release.prepareReleasePackage',
              'release.copyProdVersion',
              'release.removeDebugStatements',
              'release.prepareChangelog',
              'release.publishNpmRelease',
              'release.publishGithubRelease',
              done);
});

task('release.removeDebugStatements', (done: Function) => {
  glob(`${DIST_BUILD_ROOT}/**/*.js`, (err, filePaths) => {
    if (err) {
      done(err);
    } else {
      // can make async if it's slow but it's fine for now
      for (let filePath of filePaths) {
        const fileContent = readFileSync(filePath).toString();
        const consoleFree = replaceAll(fileContent, 'console.debug', '// console.debug');
        const cleanedJs = replaceAll(consoleFree, 'debugger;', '// debugger;');
        writeFileSync(filePath, cleanedJs);
      }
    }
  });
});

function replaceAll(input: string, tokenToReplace: string, replaceWith: string) {
  return input.split(tokenToReplace).join(replaceWith);
}

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
  .pipe(obj(function(file, enc, cb){
    github.releases.createRelease({
      owner: 'driftyco',
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

task('release.copyProdVersion', () => {
  const sourcePackageJSON = require(`${PROJECT_ROOT}/package.json`);
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
          'release.scss',
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

task('release.scss', () => {
  return src([`${SRC_ROOT}/**/*.scss`, `!${SRC_ROOT}/components/*/test/**/*`, `!${SRC_ROOT}/util/test/*`]).pipe(dest(`${DIST_BUILD_ROOT}`));
});

task('release.pullLatest', (done: Function) => {
  exec('git status --porcelain', (err: Error, stdOut: string) =>{
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
    if (dependency in templatePackageJSON.dependencies && templatePackageJSON.dependencies[dependency] === '') {
      templatePackageJSON.dependencies[dependency] = sourcePackageJSON.dependencies[dependency];
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

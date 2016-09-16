import { dest, src, task } from 'gulp';
import { DIST_BUILD_ROOT, SRC_ROOT, PROJECT_ROOT } from '../constants';
import { compileSass, copyFonts, setSassIonicVersion, createTimestamp } from '../util';


task('nightly', (done: Function) => {
  const runSequence = require('run-sequence');
  runSequence('release.nightlyPackage', 'release.publishNightly', done);
});

task('release.prepareNightly', (done: Function) => {
  const runSequence = require('run-sequence');
  runSequence(/*'release.pullLatest', 'validate', */'release.copyTools', 'release.copyNpmInfo', 'release.preparePackageJsonTemplate', 'release.nightlyPackageJson', done);
});

task('release.nightlyPackage', (done: Function) => {
  const runSequence = require('run-sequence');
  runSequence('clean', /*'release.prepareNightly',*/ 'polyfill', 'compile.release', 'release.prepareNightly', 'release.compileSass', 'release.fonts', 'release.scss', done);
});

task('release.publishNightly', (done: Function) => {
  const spawn = require('child_process').spawn;

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
  const gulpGit = require('gulp-git');
  gulpGit.pull('origin', ['master'], err => {
    done(err);
  });
});

task('release.prepareChangelog', () => {
  const changelog = require('gulp-conventional-changelog');
  return gulp.src(`${PROJECT_ROOT}/CHANGELOG.md`)
         .pipe(changelog({
           preset: 'angular'
         }))
         .pipe(gulp.dest(`${PROJECT_ROOT}`));
});


task('release.prepareRootPackageJson', () => {
  const semver = require('semver');
  const fs = require('fs');

  let packageJSON = require('./package.json');
  packageJSON.version = semver.inc(packageJSON.version, 'prerelease', 'beta');
  fs.writeFileSync('package.json', JSON.stringify(packageJSON, null, 2));
});

task('release.copyTools', () => {
  return src([`${PROJECT_ROOT}/tooling/**/*`]).pipe(dest(`${DIST_BUILD_ROOT}/tooling`));
});

task('release.copyNpmInfo', () => {
  return src([`${PROJECT_ROOT}/scripts/npm/.npmignore`, `${PROJECT_ROOT}/scripts/npm/README.md`]).pipe(dest(DIST_BUILD_ROOT));
});

task('release.preparePackageJsonTemplate', () => {
  const fs = require('fs');
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
    } else if (dependency === 'rxjs') {
      const value = sourcePackageJSON.dependencies[dependency];
      templatePackageJSON.dependencies['rxjs-es'] = value;
    }
  }

  fs.writeFileSync(`${DIST_BUILD_ROOT}` + '/package.json', JSON.stringify(templatePackageJSON, null, 2));
});

task('release.nightlyPackageJson', () => {
  const fs = require('fs');
  const packageJson: any = require(`${DIST_BUILD_ROOT}/package.json`);

  packageJson.version = packageJson.version.split('-')
                                   .slice(0, 2)
                                   .concat(createTimestamp())
                                   .join('-');

  fs.writeFileSync(`${DIST_BUILD_ROOT}/package.json`, JSON.stringify(packageJson, null, 2));
  setSassIonicVersion(packageJson.version);
});

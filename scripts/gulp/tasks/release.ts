import {dest, src, task} from 'gulp';
import { SRC_ROOT, DIST_BUILD_ROOT, PROJECT_ROOT } from '../constants';
import { compileSass, copyFonts } from '../util';

/*task('release.prepare', (done: Function) => {
    const runSequence = require('run-sequence');
    runSequence('release.pullLatest', 'release.prepareChangelog', 'release.preparePackageJson');
});
*/

task('release.prepareNightly', (done: Function) => {
    const runSequence = require('run-sequence');
    runSequence(/*'release.pullLatest', 'validate',*/ 'clean', 'release.copyTools', 'release.copyNpmInfo', 'release.preparePackageJsonTemplate', 'release.nightlyPackageJson', done);
});

task('release.nightlyPackage', (done: Function) => {
    const runSequence = require('run-sequence');
    runSequence('clean', 'release.prepareNightly', 'compile.release', 'release.compileSass', 'release.fonts', 'release.scss');
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
    const sourceDependencies = sourcePackageJSON.dependencies;
    // copy source package.json data to template
    templatePackageJSON.version = sourcePackageJSON.version;
    templatePackageJSON.description = sourcePackageJSON.description;
    templatePackageJSON.keywords = sourcePackageJSON.keywords;

    // copy source dependencies versions to the template's peerDependencies
    // only copy dependencies that show up as peerDependencies in the template
    for (let dependency of sourceDependencies) {
        if (dependency in templatePackageJSON.peerDependencies) {
            templatePackageJSON.peerDependencies[dependency] = sourceDependencies[dependency];
        }
    }

    fs.writeFileSync(`${DIST_BUILD_ROOT}` + '/package.json', JSON.stringify(templatePackageJSON, null, 2));
});

task('release.nightlyPackageJson', () => {
    const fs = require('fs');
    let packageJson: any = require(`${PROJECT_ROOT}/package.json`);

    // Generate a unique id formatted from current timestamp
    function createTimestamp() {
        // YYYYMMDDHHMM
        var d = new Date();
        return d.getUTCFullYear() + // YYYY
            ('0' + (d.getUTCMonth() + 1)).slice(-2) + // MM
            ('0' + (d.getUTCDate())).slice(-2) + // DD
            ('0' + (d.getUTCHours())).slice(-2) + // HH
            ('0' + (d.getUTCMinutes())).slice(-2); // MM
    }


    packageJson.version = packageJson.version.split('-')
    .slice(0, 2)
    .concat(createTimestamp())
    .join('-');

  fs.writeFileSync(`${DIST_BUILD_ROOT}/package.json`, JSON.stringify(packageJson, null, 2));
});

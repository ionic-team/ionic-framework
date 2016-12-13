import { dest, src, task } from 'gulp';
import * as connect from 'gulp-connect';
import * as del from 'del';
import * as runSequence from 'run-sequence';

import { DEMOS_NAME, DIST_DEMOS_ROOT, LOCAL_SERVER_PORT, SCRIPTS_ROOT } from '../constants';
import { compileSass, copyFonts, createTimestamp, setSassIonicVersion, writePolyfills } from '../util';

task('demos.clean', (done: Function) => {
  del([`${DIST_DEMOS_ROOT}/**`]).then(() => {
    done();
  }).catch(err => {
    done(err);
  });
});

task('demos.polyfill', (done: Function) => {
  writePolyfills(`${DIST_DEMOS_ROOT}/polyfills`).then(() => {
    done();
  }).catch(err => {
    done(err);
  });
});

task('demos.copyAndCompile', (done: (err: any) => void) => {
  runSequence(
    'demos.copySource',
    'demos.compileTests',
    'demos.bundle',
    done);
});

task('demos.copyExternalDependencies', () => {
  src([`${SCRIPTS_ROOT}/${DEMOS_NAME}/*.css`]).pipe(dest(`${DIST_DEMOS_ROOT}/css`));
});

task('demos.sass', () => {
  // ensure there is a version.scss file
  setSassIonicVersion(`E2E-${createTimestamp()}`);
  return compileSass(`${DIST_DEMOS_ROOT}/css`);
});

task('demos.fonts', () => {
  return copyFonts(`${DIST_DEMOS_ROOT}/fonts`);
});

task('demos.serve', function() {
  connect.server({
    root: './',
    port: LOCAL_SERVER_PORT,
    livereload: {
      port: 35700
    }
  });
});
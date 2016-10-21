import { dest, src, task } from 'gulp';
import * as connect from 'gulp-connect';
import * as del from 'del';
import * as runSequence from 'run-sequence';

import { DIST_E2E_ROOT, LOCAL_SERVER_PORT, SCRIPTS_ROOT } from '../constants';
import { compileSass, copyFonts, createTimestamp, setSassIonicVersion, writePolyfills } from '../util';

task('e2e.clean', (done: Function) => {
  del(['dist/e2e/**']).then(() => {
    done();
  }).catch(err => {
    done(err);
  });
});

task('e2e.polyfill', (done: Function) => {
  writePolyfills('dist/e2e/polyfills').then(() => {
    done();
  }).catch(err => {
    done(err);
  });
});

task('e2e.copyAndCompile', (done: (err: any) => void) => {
  runSequence(
    'e2e.copySource',
    'e2e.compileTests',
    'e2e.bundle',
    done);
});

task('e2e.copyExternalDependencies', () => {
  src([`${SCRIPTS_ROOT}/e2e/*.css`]).pipe(dest(`${DIST_E2E_ROOT}/css`));
});

task('e2e.sass', () => {
  // ensure there is a version.scss file
  setSassIonicVersion(`E2E-${createTimestamp()}`);
  return compileSass(`${DIST_E2E_ROOT}/css`);
});

task('e2e.fonts', () => {
  return copyFonts(`${DIST_E2E_ROOT}/fonts`);
});

task('e2e.serve', function() {
  connect.server({
    root: './',
    port: LOCAL_SERVER_PORT,
    livereload: {
      port: 35700
    }
  });
});

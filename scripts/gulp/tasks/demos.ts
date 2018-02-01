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

task('demos.sass', () => {
  // ensure there is a version.scss file
  setSassIonicVersion(`E2E-${createTimestamp()}`);
  return compileSass(`${DIST_DEMOS_ROOT}/css`);
});



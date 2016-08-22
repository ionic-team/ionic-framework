import { DIST_VENDOR_ROOT, NPM_VENDOR_FILES, SCRIPTS_ROOT } from '../constants';
import path = require('path');
import { dest, src, task } from 'gulp';


task('test', ['test.vendor', 'build'], (done: () => void) => {
  const karma = require('karma');
  new karma.Server({
    configFile: path.join(SCRIPTS_ROOT, 'karma/karma.conf.js')
  }, done).start();
});


task('test.vendor', () => {
  const files = NPM_VENDOR_FILES.map((root) => {
    const glob = path.join(root, '**/*.+(js|js.map)');
    return src(path.join('node_modules', glob))
           .pipe(dest(path.join(DIST_VENDOR_ROOT, root)));
  });
  const gulpMerge = require('merge2');
  return gulpMerge(files);
});


// import gulp = require('gulp');
// const karma = require('karma');
// import path = require('path');
// import gulpMerge = require('merge2');

// import {PROJECT_ROOT} from '../constants';


// gulp.task(':build:test:vendor', function() {
//   const npmVendorFiles = [
//     '@angular', 'core-js/client', 'hammerjs', 'rxjs', 'systemjs/dist', 'zone.js/dist'
//   ];

//   return gulpMerge(
//     npmVendorFiles.map(function(root) {
//       const glob = path.join(root, '**/*.+(js|js.map)');
//       return gulp.src(path.join('node_modules', glob))
//         .pipe(gulp.dest(path.join('dist/vendor', root)));
//     }));
// });

// gulp.task('test:single-run', [':build:test:vendor', 'build:components'], function(done: () => void) {
//   new karma.Server({
//     configFile: path.join(PROJECT_ROOT, 'test/karma.conf.js'),
//     singleRun: true
//   }, done).start();
// });


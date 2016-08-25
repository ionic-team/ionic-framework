import { DIST_VENDOR_ROOT, NPM_VENDOR_FILES, PROJECT_ROOT, SCRIPTS_ROOT } from '../constants';
import path = require('path');
import { dest, src, task } from 'gulp';


task('test', ['test.vendor', 'build'], (done: () => void) => {
  const karma = require('karma');
  const argv = require('yargs').argv;

  let karmaConfig = {
    configFile: path.join(SCRIPTS_ROOT, 'karma/karma.conf.js'),
  };

  if ( argv.testGrep ) {
    (<any>karmaConfig).client = {
      args: ['--grep', argv.testGrep]
    };
  }

  new karma.Server(karmaConfig, () => {
    if (argv.coverage) {
      createKarmaCoverageReport(done);
    } else {
      done();
    }
  }).start();
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


/* creates a karma code coverage report */
function createKarmaCoverageReport(done: Function) {
  console.log('Generating Unit Test Coverage Report...');

  let exec = require('child_process').exec;
  let command = `node_modules/.bin/remap-istanbul -i coverage/coverage-final.json -o coverage -t html`;

  exec(command, function(err: any, stdout: any, stderr: any) {
    console.log(`file://${PROJECT_ROOT}/coverage/index.html`)
    done(err);
  });
}

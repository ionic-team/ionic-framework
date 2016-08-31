import { DIST_VENDOR_ROOT, NPM_VENDOR_FILES, PROJECT_ROOT, SCRIPTS_ROOT } from '../constants';
import path = require('path');
import { dest, src, task } from 'gulp';
import { COMPILE_KARMA_TASK } from './build';

export const RUN_TESTS_TASK = 'test';
export const RUN_TESTS_WITH_COVERAGE_TASK = 'test.coverage';

const INTERNAL_ASSEMBLE_VENDOR_JS_TASK = 'test.assembleVendorJs';


task(RUN_TESTS_TASK, [INTERNAL_ASSEMBLE_VENDOR_JS_TASK, COMPILE_KARMA_TASK], karmaTest);

task(RUN_TESTS_WITH_COVERAGE_TASK, [INTERNAL_ASSEMBLE_VENDOR_JS_TASK, COMPILE_KARMA_TASK], (done: Function) => {
  karmaTest(() => {
    createKarmaCoverageReport(done);
  });
});

function karmaTest(done: Function) {
  const karma = require('karma');
  const argv = require('yargs').argv;

  let karmaConfig = {
    configFile: path.join(SCRIPTS_ROOT, 'karma/karma.conf.js'),
  };

  if (argv.testGrep) {
    (<any>karmaConfig).client = {
      args: ['--grep', argv.testGrep]
    };
  }

  new karma.Server(karmaConfig, done).start();
}


task(INTERNAL_ASSEMBLE_VENDOR_JS_TASK, () => {
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
    console.log(`file://${PROJECT_ROOT}/coverage/index.html`);
    done(err);
  });
}

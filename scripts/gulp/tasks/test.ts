import { join } from 'path';
import { dest, src, task } from 'gulp';
import { DIST_VENDOR_ROOT, NPM_VENDOR_FILES, PROJECT_ROOT, SCRIPTS_ROOT } from '../constants';

task('test', ['test.assembleVendorJs', 'compile.karma'], (done: Function) => {
  karmaTest(false, done);
});

task('test.watch', ['test.assembleVendorJs', 'compile.karma'], (done: Function) => {
  karmaTest(true, done);
});

task('test.coverage', ['test.assembleVendorJs', 'compile.karma'], (done: Function) => {
  karmaTest(false, () => {
    createKarmaCoverageReport(done);
  });
});

function karmaTest(watch: boolean, done: Function) {
  const karma = require('karma');
  const argv = require('yargs').argv;

  let karmaConfig = {
    configFile: join(SCRIPTS_ROOT, 'karma/karma.conf.js'),
  };

  if (watch) {
    (karmaConfig as any).singleRun = false;
  }

  if (argv.testGrep) {
    (<any>karmaConfig).client = {
      args: ['--grep', argv.testGrep]
    };
  }

  new karma.Server(karmaConfig, done).start();
}


task('test.assembleVendorJs', () => {
  const files = NPM_VENDOR_FILES.map((root) => {
    const glob = join(root, '**/*.+(js|js.map)');
    return src(join('node_modules', glob))
           .pipe(dest(join(DIST_VENDOR_ROOT, root)));
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

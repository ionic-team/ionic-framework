import { SRC_ROOT, DIST_BUILD_ROOT, PROJECT_ROOT } from '../constants';
import { task } from 'gulp';
import { accessSync } from 'fs';
import { join } from 'path';


task('core', (done) => {
  buildAngularBinding(false, done);
});

task('core.watch', (done) => {
  buildAngularBinding(true, done);
});


function buildAngularBinding(skipBuildingCore: boolean, done: Function) {
  const cwd = join(PROJECT_ROOT, '../ionic-core');
  const args = [
    'run',
    'build.angular',
    SRC_ROOT,
    DIST_BUILD_ROOT,
    skipBuildingCore ? 'skip-core' : 'do-not-skip-core'
  ];

  try {
    accessSync(cwd);
  } catch (e) {
    console.log('core directory not found:', cwd);
    process.exit(1);
  }

  const spawn = require('child_process').spawn;
  const ls = spawn('npm', args, { cwd: cwd });

  ls.stdout.on('data', (data) => {
    console.log(data.toString().trim());
  });

  ls.stderr.on('data', (data) => {
    console.log(data.toString().trim());
  });

  ls.on('close', (code) => {
    done();
  });
}

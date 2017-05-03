import { PROJECT_ROOT } from '../constants';
import { task } from 'gulp';
import { accessSync } from 'fs';
import { join } from 'path';


task('core', (done) => {
  buildAngularBinding(false, done);
});

task('core.watch', (done) => {
  buildAngularBinding(true, done);
});


function buildAngularBinding(isDevAndWatch: boolean, done: Function) {
  let hasRunDone = false;
  const cwd = join(PROJECT_ROOT, '../ionic-core');
  const args = [
    'run',
    'build.angular',
    PROJECT_ROOT
  ];

  if (isDevAndWatch) {
    args.push('--', 'dev', 'watch');
  }

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
    if (!hasRunDone && data.toString().trim().indexOf('compile, done') > -1) {
      hasRunDone = true;
      done();
    }
  });

  ls.stderr.on('data', (data) => {
    console.log(data.toString().trim());
  });

  ls.on('close', (code) => {
    done();
  });
}

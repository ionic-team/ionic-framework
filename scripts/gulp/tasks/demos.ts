import { dirname, join } from 'path';
import { exec } from 'child_process';
import * as glob from 'glob';
import { task } from 'gulp';
import * as rollup from 'rollup';
import * as nodeResolve from 'rollup-plugin-node-resolve';

import { DEMOS_ROOT, DEMOS_SRC_ROOT} from '../constants';
import { deleteFiles, runNgc } from '../util';

function doNpmInstall() {
  return new Promise((resolve, reject) => {
    // navigate to the demos directly
    try {
      process.chdir('./demos');
      console.log('starting npm install ...');
      exec('npm install', function(err, stdout, stderr) {
        process.chdir('..');
        console.log(stdout);
        console.log(stderr);
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    } catch (ex) {
      reject(ex);
    }
  });
}

function compileTests() {
  console.log('Starting to compile tests defined via tsconfig ...');
  return new Promise((resolve, reject) => {
    runNgc(`${DEMOS_ROOT}/tsconfig.json`, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function rollupTests() {
  return new Promise((resolve, reject) => {
    glob(`${DEMOS_SRC_ROOT}/**/main.js`, null, (err: Error, files: string[]) => {
      if (err) {
        reject(err);
      } else {
        recursiveRollupHelper(files).then(() => {
          resolve();
        }).catch(err => {
          reject(err);
        });
      }
    });
  });
}

function recursiveRollupHelper(files: string[]) {
  if (!files) {
    return Promise.reject(new Error('list of files is null'));
  } else if ( files.length === 0) {
    return Promise.resolve();
  } else {
    const outputFileName = join(dirname(files[0]), 'app.bundle.js');
    return runRollup(files[0], outputFileName).then(() => {
      const remainingFiles = files.concat();
      remainingFiles.shift();
      return recursiveRollupHelper(remainingFiles);
    }).catch(err => {
      return Promise.reject(err);
    });
  }
}

function runRollup(inputFile: string, outputFile: string): Promise<any> {
  console.log(`Starting rollup on ${inputFile} ... writing to ${outputFile}`);
  return rollup.rollup({
      entry: inputFile,
      plugins: [
        rollupNG2(),
        nodeResolve()
      ]
  }).then(function(bundle){
      return bundle.write({
          format: 'iife',
          dest: outputFile,
      });
  });
}

function buildDemos(done: Function) {
  doNpmInstall()
  .then(() => {
    return compileTests();
  }).then(() => {
    return rollupTests();
  }).then(() => {
    done();
  }).catch(err => {
    done(err);
  });
}

task('demos.build', (done: Function) => {
  buildDemos(done);
});

export function rollupNG2() {
  return {
    name: 'rollupNG2',

    resolveId(id: string) {
      if (id.startsWith('rxjs/')) {
        return `${process.cwd()}/node_modules/rxjs-es/${id.split('rxjs/').pop()}.js`;
      }
    }
  };
}

function cleanDemos(done: Function) {
  deleteFiles([`${DEMOS_SRC_ROOT}/**/*.js`, `${DEMOS_SRC_ROOT}/**/*.d.ts`, `${DEMOS_SRC_ROOT}/**/*.ngfactory.ts`, `${DEMOS_SRC_ROOT}/**/*.metadata.json`], done);
}

task('demos.clean', (done: Function) => {
  cleanDemos(done);
});

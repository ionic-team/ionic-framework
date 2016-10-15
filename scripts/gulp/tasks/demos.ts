import { exec } from 'child_process';
import { dirname, join } from 'path';

import * as glob from 'glob';
import { task } from 'gulp';
import * as rollup from 'rollup';
import * as nodeResolve from 'rollup-plugin-node-resolve';
import * as commonjs from 'rollup-plugin-commonjs';

import { DEMOS_ROOT, DEMOS_SRC_ROOT} from '../constants';
import { compileSass, copyFonts, createTimestamp, deleteFiles, runNgc, setSassIonicVersion, writePolyfills } from '../util';

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

function generatePolyfills() {
  return writePolyfills(join(DEMOS_ROOT, 'polyfills'));
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
  let start;
  if (!files) {
    return Promise.reject(new Error('list of files is null'));
  } else if ( files.length === 0) {
    return Promise.resolve();
  } else {
    const outputFileName = join(dirname(files[0]), 'main.bundle.js');
    start = Date.now();
    return bundle(files[0], outputFileName).then(() => {
      const end = Date.now();
      const seconds = (end - start) / 1000;
      console.log(`Took ${seconds} seconds to process ${files[0]}`);
      const remainingFiles = files.concat();
      remainingFiles.shift();
      return recursiveRollupHelper(remainingFiles);
    }).catch(err => {
      return Promise.reject(err);
    });
  }
}

function bundle(inputFile: string, outputFile: string): Promise<any> {
  console.log(`Starting rollup on ${inputFile} ... writing to ${outputFile}`);
  return rollup.rollup({
      entry: inputFile,
      plugins: [
        commonjs(),
        nodeResolve({
          module: true,
          jsnext: true,
          main: true,
          extensions: ['.js']
        })
      ]
  }).then(bundle => {
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
    console.log('ERRROR: ', err.message);
    done(err);
  });
}

function cleanDemos(done: Function) {
  deleteFiles([`${DEMOS_SRC_ROOT}/**/*.js`,
    `${DEMOS_SRC_ROOT}/**/*.js.map`,
    `${DEMOS_SRC_ROOT}/**/*.d.ts`,
    `${DEMOS_SRC_ROOT}/**/*.ngfactory.ts`,
    `${DEMOS_SRC_ROOT}/**/*.metadata.json`,
    `${DEMOS_ROOT}/css`,
    `${DEMOS_ROOT}/fonts`,
    `${DEMOS_ROOT}/polyfills`,
    `!${DEMOS_SRC_ROOT}/scrollbar-fix.css`,
    `!${DEMOS_SRC_ROOT}/scrollbar-fix.js`,
    ], done);
}

task('demos.build', ['demos.sass', 'demos.fonts', 'demos.polyfills'], (done: Function) => {
  buildDemos(done);
});

task('demos.clean', (done: Function) => {
  cleanDemos(done);
});


task('demos.sass', () => {
  // ensure there is a version.scss file
  setSassIonicVersion(`E2E-${createTimestamp()}`);
  return compileSass(`${DEMOS_ROOT}/css`);
});

task('demos.fonts', () => {
  return copyFonts(`${DEMOS_ROOT}/fonts`);
});

task('demos.polyfills', (done: Function) => {
  generatePolyfills().then(() => {
    done();
  }).catch(err => {
    done(err);
  });
});

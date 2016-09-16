import { dirname, join } from 'path';
import { exec } from 'child_process';
import * as glob from 'glob';
import { task } from 'gulp';
import * as rollup from 'rollup';
import * as nodeResolve from 'rollup-plugin-node-resolve';

import { DEMOS_ROOT, DEMOS_SRC_ROOT} from '../constants';
import { compileSass, copyFonts, createTimestamp, deleteFiles, runNgc, setSassIonicVersion } from '../util';

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
    const outputFileName = join(dirname(files[0]), 'main.es6.js');
    return bundle(files[0], outputFileName).then(() => {
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
        rollupNG2(),
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
  }).then(() => {
    // transpile the file
    console.log('Starting transpile to ES5 ...');
    const es5BundleName = join(dirname(outputFile), 'main.bundle.js');
    return transpile(outputFile, es5BundleName);
  });
}

function transpile(inputFile: string, outputFile: string) {
  console.log(`Transpiling ${inputFile}`);
  return new Promise((resolve, reject) => {
    const command = `./node_modules/.bin/tsc --out ${outputFile} --target es5 --allowJs --sourceMap ${inputFile}`;
    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.log(stdout);
        console.log(stderr);
        reject(err);
      } else {
        resolve();
      }
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

export function rollupNG2() {
  return {
    name: 'rollupNG2',

    resolveId(id: string) {
      if (id.startsWith('rxjs/')) {
        return `${process.cwd()}/demos/node_modules/rxjs-es/${id.split('rxjs/').pop()}.js`;
      }
    }
  };
}

function cleanDemos(done: Function) {
  deleteFiles([`${DEMOS_SRC_ROOT}/**/*.js`, `${DEMOS_SRC_ROOT}/**/*.d.ts`, `${DEMOS_SRC_ROOT}/**/*.ngfactory.ts`, `${DEMOS_SRC_ROOT}/**/*.metadata.json`], done);
}

task('demos.build', ['demos.sass', 'demos.fonts'], (done: Function) => {
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

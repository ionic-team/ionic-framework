import * as child_process from 'child_process';
import { src, dest } from 'gulp';
import * as path from 'path';

export function mergeObjects(obj1: any, obj2: any ) {
  var obj3 = {};
  for (var attrname in obj1) {
    (<any>obj3)[attrname] = obj1[attrname];
  }
  for (var attrname in obj2) {
    (<any>obj3)[attrname] = obj2[attrname];
  }
  return obj3;
}

function getRootTsConfigCompilerOptions(): any{
  let tsConfig = require('../../tsconfig');
  // provide our own version of typescript
  tsConfig.compilerOptions.typescript = require('typescript');

  return tsConfig.compilerOptions;
}

/** Create a TS Build Task, based on the options. */
export function tsBuildTask(srcGlob: string[], destDir: string, overrideOptions: any = {}) {
  let tsc = require('gulp-typescript');
  let compilerOptions = getRootTsConfigCompilerOptions();
  if ( ! overrideOptions ) {
    overrideOptions = {};
  }
  var mergedOptions = mergeObjects(compilerOptions, overrideOptions);
  return src(srcGlob)
    .pipe(tsc(mergedOptions))
    .pipe(dest(destDir));
}

/* creates a karma code coverage report */
export function createKarmaCoverageReport(done: Function ){
  let exec = require('child_process').exec;
  let command = `node_modules/.bin/remap-istanbul -i coverage/coverage-final.json -o coverage -t html`;

  exec(command, function(err: any, stdout: any, stderr: any){
    done(err);
  });
}

/** Options that can be passed to execTask or execNodeTask. */
export interface ExecTaskOptions {
  // Whether to output to STDERR and STDOUT.
  silent?: boolean;
  // If an error happens, this will replace the standard error.
  errMessage?: string;
}

/** Create a task that executes a binary as if from the command line. */
export function execTask(binPath: string, args: string[], options: ExecTaskOptions = {}) {
  return (done: (err?: string) => void) => {
    const childProcess = child_process.spawn(binPath, args);

    if (!options.silent) {
      childProcess.stdout.on('data', (data: string) => {
        process.stdout.write(data);
      });

      childProcess.stderr.on('data', (data: string) => {
        process.stderr.write(data);
      });
    }

    childProcess.on('close', (code: number) => {
      if (code != 0) {
        if (options.errMessage === undefined) {
          done('Process failed with code ' + code);
        } else {
          done(options.errMessage);
        }
      } else {
        done();
      }
    });
  }
}

/**
 * Create a task that executes an NPM Bin, by resolving the binary path then executing it. These are
 * binaries that are normally in the `./node_modules/.bin` directory, but their name might differ
 * from the package. Examples are typescript, ngc and gulp itself.
 */
export function execNodeTask(packageName: string, executable: string | string[], args?: string[],
                             options: ExecTaskOptions = {}) {
  if (!args) {
    args = <string[]>executable;
    executable = undefined;
  }

  return (done: (err: any) => void) => {
    const resolveBin = require('resolve-bin');
    resolveBin(packageName, { executable: executable }, (err: any, binPath: string) => {
      if (err) {
        done(err);
      } else {
        // Forward to execTask.
        execTask(binPath, args, options)(done);
      }
    });
  }
}

export function copyFonts(destinationPath: string) {
  return src([
    'src/fonts/*.+(ttf|woff|woff2)',
    'node_modules/ionicons/dist/fonts/*.+(ttf|woff|woff2)'
   ])
   .pipe(dest(destinationPath));
}

export function compileSass(destinationPath: string) {
  let sass = require('gulp-sass');
  let autoprefixer = require('gulp-autoprefixer');
  let minifyCss = require('gulp-minify-css');
  let rename = require('gulp-rename');
  let buildConfig = require('../build/config');

  let ioniconsPath = path.normalize(`${__dirname}/../../node_modules/ionicons/dist/scss/`);

  return src([
    'src/ionic.ios.scss',
    'src/ionic.md.scss',
    'src/ionic.wp.scss',
    'src/ionic.scss'
  ])
  .pipe(sass({
      includePaths: [ioniconsPath],
    }).on('error', sass.logError)
  )
  .pipe(autoprefixer(buildConfig.autoprefixer))
  .pipe(dest(destinationPath))
  .pipe(minifyCss())
  .pipe(rename({ extname: '.min.css' }))
  .pipe(dest(destinationPath));
}

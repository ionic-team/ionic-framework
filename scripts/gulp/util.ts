import * as child_process from 'child_process';
import { DIST_BUILD_ROOT, NODE_MODULES_ROOT, PROJECT_ROOT, PACKAGE_NAME, SRC_ROOT } from './constants';
import * as fs from 'fs';
import * as path from 'path';
import { src, dest } from 'gulp';

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


// import * as child_process from 'child_process';
// import * as fs from 'fs';
// import * as gulp from 'gulp';
// import * as gulpTs from 'gulp-typescript';
// import * as path from 'path';

// import {NPM_VENDOR_FILES, PROJECT_ROOT, DIST_ROOT} from './constants';


// /** Those imports lack typings. */
// const gulpClean = require('gulp-clean');
// const gulpMerge = require('merge2');
// const gulpRunSequence = require('run-sequence');
// const gulpSass = require('gulp-sass');
// const gulpServer = require('gulp-server-livereload');
// const gulpSourcemaps = require('gulp-sourcemaps');
// const resolveBin = require('resolve-bin');


// /** If the string passed in is a glob, returns it, otherwise append '**\/*' to it. */
// function _globify(maybeGlob: string, suffix = '**/*') {
//   return maybeGlob.indexOf('*') != -1 ? maybeGlob : path.join(maybeGlob, suffix);
// }




// /** Create a SASS Build Task. */
// export function sassBuildTask(dest: string, root: string, includePaths: string[]) {
//   const sassOptions = { includePaths };

//   return () => {
//     return gulp.src(_globify(root, '**/*.scss'))
//       .pipe(gulpSourcemaps.init())
//       .pipe(gulpSass(sassOptions).on('error', gulpSass.logError))
//       .pipe(gulpSourcemaps.write('.'))
//       .pipe(gulp.dest(dest));
//   };
// }


// /** Options that can be passed to execTask or execNodeTask. */
// export interface ExecTaskOptions {
//   // Whether to output to STDERR and STDOUT.
//   silent?: boolean;
//   // If an error happens, this will replace the standard error.
//   errMessage?: string;
// }

// /** Create a task that executes a binary as if from the command line. */
// export function execTask(binPath: string, args: string[], options: ExecTaskOptions = {}) {
//   return (done: (err?: string) => void) => {
//     const childProcess = child_process.spawn(binPath, args);

//     if (!options.silent) {
//       childProcess.stdout.on('data', (data: string) => {
//         process.stdout.write(data);
//       });

//       childProcess.stderr.on('data', (data: string) => {
//         process.stderr.write(data);
//       });
//     }

//     childProcess.on('close', (code: number) => {
//       if (code != 0) {
//         if (options.errMessage === undefined) {
//           done('Process failed with code ' + code);
//         } else {
//           done(options.errMessage);
//         }
//       } else {
//         done();
//       }
//     });
//   }
// }

// /**
//  * Create a task that executes an NPM Bin, by resolving the binary path then executing it. These are
//  * binaries that are normally in the `./node_modules/.bin` directory, but their name might differ
//  * from the package. Examples are typescript, ngc and gulp itself.
//  */
// export function execNodeTask(packageName: string, executable: string | string[], args?: string[],
//                              options: ExecTaskOptions = {}) {
//   if (!args) {
//     args = <string[]>executable;
//     executable = undefined;
//   }

//   return (done: (err: any) => void) => {
//     resolveBin(packageName, { executable: executable }, (err: any, binPath: string) => {
//       if (err) {
//         done(err);
//       } else {
//         // Forward to execTask.
//         execTask(binPath, args, options)(done);
//       }
//     });
//   }
// }


// /** Copy files from a glob to a destination. */
// export function copyTask(srcGlobOrDir: string, outRoot: string) {
//   return () => {
//     return gulp.src(_globify(srcGlobOrDir)).pipe(gulp.dest(outRoot));
//   }
// }


// /** Delete files. */
// export function cleanTask(glob: string) {
//   return () => gulp.src(glob, { read: false }).pipe(gulpClean(null));
// }


// /** Build an task that depends on all application build tasks. */
// export function buildAppTask(appName: string) {
//   const buildTasks = ['vendor', 'ts', 'scss', 'assets']
//     .map(taskName => `:build:${appName}:${taskName}`);

//   return (done: () => void) => {
//     gulpRunSequence(
//       'clean',
//       ['build:components', ...buildTasks],
//       done
//     );
//   };
// }


// /** Create a task that copies vendor files in the proper destination. */
// export function vendorTask() {
//   return () => gulpMerge(
//     NPM_VENDOR_FILES.map(root => {
//       const glob = path.join(PROJECT_ROOT, 'node_modules', root, '**/*.+(js|js.map)');
//       return gulp.src(glob).pipe(gulp.dest(path.join(DIST_ROOT, 'vendor', root)));
//     }));
// }


// /** Create a task that serves the dist folder. */
// export function serverTask(liveReload: boolean = true,
//                            streamCallback: (stream: NodeJS.ReadWriteStream) => void = null) {
//   return () => {
//     const stream = gulp.src('dist').pipe(gulpServer({
//       livereload: liveReload,
//       fallback: 'index.html',
//       port: 4200
//     }));

//     if (streamCallback) {
//       streamCallback(stream);
//     }
//     return stream;
//   }
// }


// /** Create a task that's a sequence of other tasks. */
// export function sequenceTask(...args: any[]) {
//   return (done: any) => {
//     gulpRunSequence(
//       ...args,
//       done
//     );
//   }
// }

import { DIST_BUILD_ROOT, NODE_MODULES_ROOT, PROJECT_ROOT, PACKAGE_NAME, SRC_ROOT } from './constants';
import * as fs from 'fs';
import * as gulpTs from 'gulp-typescript';
import * as path from 'path';
import { dest } from 'gulp';


/** Create a TS Build Task, based on the options. */
export function tsBuildTask(tsConfigPath: string, enteryIndex: string, exclude: string[]) {
  const gulpSourcemaps = require('gulp-sourcemaps');
  const gulpMerge = require('merge2');

  const orgConfigPath = path.join(PROJECT_ROOT, 'tsconfig.json');
  const newConfigPath = path.join(tsConfigPath, 'tsconfig.json');

  return () => {
    const tsConfig: any = JSON.parse(fs.readFileSync(orgConfigPath, 'utf-8'));

    tsConfig.compilerOptions.outDir = DIST_BUILD_ROOT;
    tsConfig.compilerOptions.paths = {};
    tsConfig.compilerOptions.paths[PACKAGE_NAME] = [path.join(SRC_ROOT, enteryIndex)];
    tsConfig.compilerOptions.typeRoots = [path.join(NODE_MODULES_ROOT, '@types')];
    tsConfig.include = [path.join(SRC_ROOT, '**', '*.ts')];
    tsConfig.exclude = exclude;

    const newConfigData = JSON.stringify(tsConfig, undefined, 2);

    fs.writeFileSync(newConfigPath, newConfigData);

    const tsProject = gulpTs.createProject(newConfigPath, {
      typescript: require('typescript')
    });

    let pipe = tsProject.src()
      .pipe(gulpSourcemaps.init())
      .pipe(gulpTs(tsProject));
    let dts = pipe.dts.pipe(dest(DIST_BUILD_ROOT));

    return gulpMerge([
      dts,
      pipe
        .pipe(gulpSourcemaps.write('.'))
        .pipe(dest(DIST_BUILD_ROOT))
    ]);
  };
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

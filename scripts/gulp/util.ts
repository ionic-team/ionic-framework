import { E2E_BASE_CONFIG_NGC_CONFIG, E2E_GENERATED_CONFIG_NGC_CONFIG, SRC_COMPONENTS_ROOT } from './constants';
import * as child_process from 'child_process';
import { src, dest } from 'gulp';
import * as path from 'path';
import * as fs from 'fs';

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

function getRootTsConfigCompilerOptions(): any {
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
      if (code !== 0) {
        if (options.errMessage === undefined) {
          done('Process failed with code ' + code);
        } else {
          done(options.errMessage);
        }
      } else {
        done();
      }
    });
  };
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
  };
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
  let cleanCSS = require('gulp-clean-css');
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
  .pipe(cleanCSS())
  .pipe(rename({ extname: '.min.css' }))
  .pipe(dest(destinationPath));
}

export function copyFile(srcPath: string, destPath: string) {
  const sourceData = fs.readFileSync(srcPath);
  fs.writeFileSync(destPath, sourceData);
}

export function copySwiperToPath(distPath: string) {
  copyFile(`${SRC_COMPONENTS_ROOT}/slides/swiper-widget.js`, `${distPath}/swiper-widget.js`);
  copyFile(`${SRC_COMPONENTS_ROOT}/slides/swiper-widget.d.ts`, `${distPath}/swiper-widget.d.ts`);
  copyFile(`${SRC_COMPONENTS_ROOT}/slides/swiper-widget.es2015.js`, `${distPath}/swiper-widget.es2015.js`);
  copyFile(`${SRC_COMPONENTS_ROOT}/slides/swiper-widget.system.js`, `${distPath}/swiper-widget.system.js`);
}

export function generateE2EBuildConfig(compilerOptions: any, angularCompilerOptions: any, includeGlob: string[]) {
  const fs = require('fs');

  let baseConfig = require(E2E_BASE_CONFIG_NGC_CONFIG);

  if (!compilerOptions) {
    compilerOptions = {};
  }
  baseConfig.compilerOptions = mergeObjects(baseConfig.compilerOptions, compilerOptions);

  // only touch angularCompilerOptions if provided
  // if we provide an empty config, it doesn't work as expected
  if (angularCompilerOptions) {
    if ( !baseConfig.angularCompilerOptions) {
      baseConfig.angularCompilerOptions = {};
    }

    baseConfig.angularCompilerOptions = mergeObjects(baseConfig.angularCompilerOptions, angularCompilerOptions);
  }

  if (includeGlob && includeGlob.length > 0) {
    baseConfig.include = includeGlob;
  }

  let prettyString = JSON.stringify(baseConfig, null, 2);

  fs.writeFileSync(E2E_GENERATED_CONFIG_NGC_CONFIG, prettyString);
}

export function removeGeneratedE2EBuildConfig() {
  //let del = require('del');
  //del.sync(E2E_GENERATED_CONFIG_NGC_CONFIG);
}

import { spawn } from 'cross-spawn';
import { NODE_MODULES_ROOT, SRC_ROOT } from './constants';
import { dest, src } from 'gulp';
import { dirname, join, resolve } from 'path';
import { ensureDirSync, readFile, readFileSync, readdirSync, statSync, writeFile, writeFileSync } from 'fs-extra';
import { rollup } from 'rollup';
import { Replacer } from 'strip-function';
import * as commonjs from 'rollup-plugin-commonjs';
import * as multiEntry from 'rollup-plugin-multi-entry';
import * as nodeResolve from 'rollup-plugin-node-resolve';
import * as through from 'through2';
import * as uglifyPlugin from 'rollup-plugin-uglify';
import { argv } from 'yargs';

import { runWorker } from './utils/app-scripts-worker-client';

// These packages lack of types.
const resolveBin = require('resolve-bin');

export function mergeObjects(obj1: any, obj2: any ) {
  if (! obj1) {
    obj1 = {};
  }
  if (! obj2) {
    obj2 = {};
  }
  var obj3 = {};
  for (let attrname in obj1) {
    (<any>obj3)[attrname] = obj1[attrname];
  }
  for (let attrname in obj2) {
    (<any>obj3)[attrname] = obj2[attrname];
  }
  return obj3;
}

function getRootTsConfig(pathToReadFile): any {
  const json = readFileSync(pathToReadFile);

  let tsConfig = JSON.parse(json.toString());
  return tsConfig;
}

export function createTempTsConfig(includeGlob: string[], target: string, moduleType: string, pathToReadFile: string, pathToWriteFile: string, overrideCompileOptions: any = null): any {
  let config = getRootTsConfig(pathToReadFile);
  if (!config.compilerOptions) {
    config.compilerOptions = {};
  }
  // for now, we only compiling to same directory (no outdir)
  if (config.compilerOptions && config.compilerOptions.outDir) {
    delete config.compilerOptions.outDir;
  }

  // remove linting checks that we do not want in dist
  if (config.compilerOptions.noUnusedLocals) {
    delete config.compilerOptions.noUnusedLocals;
  }
  if (config.compilerOptions.noUnusedParameters) {
    delete config.compilerOptions.noUnusedParameters;
  }

  if (config.compilerOptions) {
    config.compilerOptions.module = moduleType;
    config.compilerOptions.target = target;
  }
  config.include = includeGlob;

  if (overrideCompileOptions) {
    config.compilerOptions = Object.assign(config.compilerOptions, overrideCompileOptions);
  }

  // TS represents paths internally with '/' and expects the tsconfig path to be in this format
  let json = JSON.stringify(config, null, 2);
  json = json.replace(/\\\\/g, '/');

  const dirToCreate = dirname(pathToWriteFile);
  ensureDirSync(dirToCreate);
  writeFileSync(pathToWriteFile, json);
}

function removeDebugStatements() {
  let replacer = new Replacer(['console.debug', 'console.time', 'console.timeEnd', 'assert', 'runInDev']);
  return through.obj(function (file, encoding, callback) {
    const content = file.contents.toString();
    const cleanedJs = replacer.replace(content);
    file.contents =  new Buffer(cleanedJs, 'utf8');
    callback(null, file);
  });
}

export function copySourceToDest(destinationPath: string, excludeSpecs: boolean, excludeE2e: boolean, stripDebug: boolean) {
  let glob = [`${SRC_ROOT}/**/*.ts`];
  if (excludeSpecs) {
    glob.push(`!${SRC_ROOT}/**/*.spec.ts`);
  } else {
    glob.push(`${SRC_ROOT}/**/*.spec.ts`);
  }
  if (excludeE2e) {
    glob.push(`!${SRC_ROOT}/components/*/test/*/**/*.ts`);
  }
  let stream = src(glob);
  if (stripDebug) {
    console.log('Removing debug statements:', destinationPath);
    stream = stream.pipe(removeDebugStatements());
  }

  return stream.pipe(dest(destinationPath));
}

export function copyGlobToDest(sourceGlob: string[], destPath: string) {
  return src(sourceGlob).pipe(dest(destPath));
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

  let ioniconsPath = join(NODE_MODULES_ROOT, 'ionicons/dist/scss/');

  return src([
    join(SRC_ROOT, 'themes/ionic.build.default.scss'),
    join(SRC_ROOT, 'themes/ionic.build.dark.scss')
  ])
  .pipe(sass({
      includePaths: [ioniconsPath]
    }).on('error', sass.logError)
  )
  .pipe(autoprefixer(buildConfig.autoprefixer))

  .pipe(rename(function (path) {
    path.basename = path.basename.replace('.default', '');
    path.basename = path.basename.replace('.build', '');
  }))

  .pipe(dest(destinationPath))

  .pipe(cleanCSS())

  .pipe(rename({
    extname: '.min.css'
  }))

  .pipe(dest(destinationPath));
}

export function setSassIonicVersion(version: string) {
  writeFileSync(join(SRC_ROOT, 'themes/version.scss'), `$ionic-version: "${version}";`);
}

export function copyFile(srcPath: string, destPath: string) {
  const sourceData = readFileSync(srcPath);
  writeFileSync(destPath, sourceData);
}

export function runNgc(pathToConfigFile: string, done: Function) {
  let exec = require('child_process').exec;
  let ngcPath = getBinaryPath('@angular/compiler-cli', 'ngc');
  let shellCommand = `node --max_old_space_size=8096 ${ngcPath} -p ${pathToConfigFile}`;

  exec(shellCommand, function(err, stdout, stderr) {
    process.stdout.write(stdout);
    process.stderr.write(stderr);
    done(err);
  });
}

export function runTsc(pathToConfigFile: string, done: Function) {
  let exec = require('child_process').exec;
  let tscPath = getBinaryPath('typescript', 'tsc');
  let shellCommand = `node --max_old_space_size=8096 ${tscPath} -p ${pathToConfigFile}`;

  exec(shellCommand, function (err, stdout, stderr) {
    process.stdout.write(stdout);
    process.stderr.write(stderr);
    done(err);
  });
}

export function runWebpack(pathToWebpackConfig: string, done: Function) {
  let exec = require('child_process').exec;
  let webpackPath = getBinaryPath('webpack');
  let shellCommand = `node --max_old_space_size=8096 ${webpackPath} --config ${pathToWebpackConfig} --display-error-details`;

  exec(shellCommand, function(err, stdout, stderr) {
    process.stdout.write(stdout);
    process.stderr.write(stderr);
    done(err);
  });
}

export function runAppScriptsServe(testOrDemoName: string, appEntryPoint: string, appNgModulePath: string, srcDir: string, distDir: string, tsConfig: string, ionicAngularDir: string, sassConfigPath: string, copyConfigPath: string, watchConfigPath: string, devApp: boolean) {
  console.log('Running ionic-app-scripts serve with', testOrDemoName);
  const deepLinksDir = dirname(dirname(appNgModulePath));
  let scriptArgs = [
    'serve',
    '--appEntryPoint', appEntryPoint,
    '--appNgModulePath', appNgModulePath,
    '--deepLinksDir', deepLinksDir,
    '--srcDir', srcDir,
    '--wwwDir', distDir,
    '--tsconfig', tsConfig,
    '--readConfigJson', 'false',
    '--ionicAngularDir', ionicAngularDir,
    '--sass', sassConfigPath,
    '--copy', copyConfigPath,
    '--enableLint', 'false',
    '--skipIonicAngularVersion', 'true'
  ];
  if (devApp) {
    scriptArgs.push('--bonjour');
  }

  if (watchConfigPath) {
    scriptArgs.push('--watch');
    scriptArgs.push(watchConfigPath);
  }

  const debug: boolean = argv.debug;
  if (debug) {
    scriptArgs.push('--debug');
  }

  return new Promise((resolve, reject) => {
    let pathToAppScripts = join(NODE_MODULES_ROOT, '.bin', 'ionic-app-scripts');
    pathToAppScripts = process.platform === 'win32' ? pathToAppScripts + '.cmd' : pathToAppScripts;

    const spawnedCommand = spawn(pathToAppScripts, scriptArgs, {stdio: 'inherit'});
    console.log(`${pathToAppScripts} ${scriptArgs.join(' ')}`);

    spawnedCommand.on('close', (code: number) => {
      if (code === 0) {
        return resolve();
      }
      reject(new Error('App-scripts failed with non-zero status code'));
    });
  });
}

export function runAppScriptsBuild(appEntryPoint: string, appNgModulePath: string, srcDir: string, distDir: string, tsConfig: string, ionicAngularDir: string, sassConfigPath: string, copyConfigPath: string, isDev: boolean = false, minifyCss: boolean = true, minifyJs: boolean = true, optimizeJs: boolean = true) {
  const pathToAppScripts = join(NODE_MODULES_ROOT, '.bin', 'ionic-app-scripts');
  const debug: boolean = argv.debug;
  return runWorker(pathToAppScripts, debug, appEntryPoint, appNgModulePath, srcDir, distDir, tsConfig, ionicAngularDir, sassConfigPath, copyConfigPath, isDev, minifyCss, minifyJs, optimizeJs);
}

/** Resolves the path for a node package executable. */
export function getBinaryPath(packageName: string, executable = packageName): string {
  return resolveBin.sync(packageName, {executable});
}

export function deleteFiles(glob: string[], done: Function) {
  let del = require('del');
  del.sync(glob);
  done();
}

export function createTimestamp() {
  // YYYYMMDDHHMM
  var d = new Date();
  return d.getUTCFullYear() + // YYYY
          ('0' + (d.getUTCMonth() + 1)).slice(-2) + // MM
          ('0' + (d.getUTCDate())).slice(-2) + // DD
          ('0' + (d.getUTCHours())).slice(-2) + // HH
          ('0' + (d.getUTCMinutes())).slice(-2); // MM
}

export function writePolyfills(outputDirectory: string) {
  const MODERN_ENTRIES = [
    'node_modules/core-js/es6/array.js',
    'node_modules/core-js/es6/date.js',
    'node_modules/core-js/es6/function.js',
    'node_modules/core-js/es6/map.js',
    'node_modules/core-js/es6/number.js',
    'node_modules/core-js/es6/object.js',
    'node_modules/core-js/es6/parse-float.js',
    'node_modules/core-js/es6/parse-int.js',
    'node_modules/core-js/es6/set.js',
    'node_modules/core-js/es6/string.js',
    'node_modules/core-js/es7/reflect.js',
    'node_modules/core-js/es6/reflect.js',
    'node_modules/zone.js/dist/zone.js',
    'scripts/polyfill/polyfill.dom.js'
  ];

  const ALL_ENTRIES = [
    'node_modules/core-js/es6/array.js',
    'node_modules/core-js/es6/date.js',
    'node_modules/core-js/es6/function.js',
    'node_modules/core-js/es6/map.js',
    'node_modules/core-js/es6/math.js',
    'node_modules/core-js/es6/number.js',
    'node_modules/core-js/es6/object.js',
    'node_modules/core-js/es6/parse-float.js',
    'node_modules/core-js/es6/parse-int.js',
    'node_modules/core-js/es6/reflect.js',
    'node_modules/core-js/es6/regexp.js',
    'node_modules/core-js/es6/set.js',
    'node_modules/core-js/es6/string.js',
    'node_modules/core-js/es6/symbol.js',
    'node_modules/core-js/es6/typed.js',
    'node_modules/core-js/es6/weak-map.js',
    'node_modules/core-js/es6/weak-set.js',
    'node_modules/core-js/es7/reflect.js',
    'node_modules/zone.js/dist/zone.js',
    'scripts/polyfill/polyfill.dom.js'
  ];

  const NG_ENTRIES = [
    'node_modules/core-js/es7/reflect.js',
    'node_modules/zone.js/dist/zone.js',
  ];

  let promises = [];
  promises.push(bundlePolyfill(MODERN_ENTRIES, join(outputDirectory, 'polyfills.modern.js')));
  promises.push(bundlePolyfill(ALL_ENTRIES, join(outputDirectory, 'polyfills.js')));
  promises.push(bundlePolyfill(NG_ENTRIES, join(outputDirectory, 'polyfills.ng.js')));

  return Promise.all(promises);
}

function bundlePolyfill(pathsToIncludeInPolyfill: string[], outputPath: string) {
  return rollup({
    entry: pathsToIncludeInPolyfill,
    plugins: [
      multiEntry(),
      nodeResolve({
        module: true,
        jsnext: true,
        main: true
      }),
      commonjs(),
      uglifyPlugin()
    ],
    onwarn: () => {
      return () => {};
    }
  }).then((bundle) => {
    return bundle.write({
      format: 'iife',
      moduleName: 'MyBundle',
      dest: outputPath
    });
  }).catch(err => {
    console.log('caught rollup error: ', err);
  });
}

export function getFolderInfo() {
  let componentName: string = null;
  let componentTest: string = null;
  const folder: string = argv.folder || argv.f;
  if (folder && folder.length) {
    const folderSplit = folder.split('/');
    componentName = folderSplit[0];
    componentTest = (folderSplit.length > 1 ? folderSplit[1] : 'basic');
  }
  const devApp = argv.devapp !== undefined;
  return {
    componentName: componentName,
    componentTest: componentTest,
    devApp: devApp
  };
}

export function getFolders(dir) {
  return readdirSync(dir)
    .filter(function(file) {
      return statSync(join(dir, file)).isDirectory();
    });
}

export function readFileAsync(filePath: string) {
  return new Promise((resolve, reject) => {
    readFile(filePath, (err: Error, buffer: Buffer) => {
      if (err) {
        return reject(err);
      }
      return resolve(buffer.toString());
    });
  });
}

export function writeFileAsync(filePath: string, fileContent: string) {
  return new Promise((resolve, reject) => {
    writeFile(filePath, fileContent, (err: Error) => {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });
}

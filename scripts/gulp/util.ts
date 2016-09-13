import { COMMONJS_MODULE, ES_MODULE, NODE_MODULES_ROOT, PROJECT_ROOT, SRC_ROOT, SRC_COMPONENTS_ROOT } from './constants';
import { src, dest } from 'gulp';
import * as path from 'path';
import * as fs from 'fs';

export function mergeObjects(obj1: any, obj2: any ) {
  if (! obj1) {
    obj1 = {};
  }
  if (! obj2) {
    obj2 = {};
  }
  var obj3 = {};
  for (var attrname in obj1) {
    (<any>obj3)[attrname] = obj1[attrname];
  }
  for (var attrname in obj2) {
    (<any>obj3)[attrname] = obj2[attrname];
  }
  return obj3;
}

function getRootTsConfig(): any {
  const json = fs.readFileSync(`${PROJECT_ROOT}/tsconfig.json`);

  let tsConfig = JSON.parse(json.toString());
  return tsConfig;
}

export function createTempTsConfig(includeGlob: string[], moduleType: String, pathToWriteFile: string): any {
  let config = getRootTsConfig();
  if (!config.compilerOptions) {
    config.compilerOptions = {};
  }
  // for now, we only compiling to same directory (no outdir)
  if (config.compilerOptions && config.compilerOptions.outDir) {
    delete config.compilerOptions.outDir;
  }
  if (config.compilerOptions) {
    config.compilerOptions.module = moduleType;
  }
  config.include = includeGlob;
  let json = JSON.stringify(config, null, 2);
  fs.writeFileSync(pathToWriteFile, json);
}

export function copySourceToDest(destinationPath: string, excludeSpecs: boolean = true, excludeE2e: boolean = true) {
  let glob = [`${SRC_ROOT}/**/*.ts`];
  if (excludeSpecs) {
    glob.push(`!${SRC_ROOT}/**/*.spec.ts`);
  } else {
    glob.push(`${SRC_ROOT}/**/*.spec.ts`);
  }
  if (excludeE2e) {
    glob.push(`!${SRC_ROOT}/components/*/test/*/*.ts`);
  }
  return src(glob)
    .pipe(dest(destinationPath));
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

  let ioniconsPath = path.join(NODE_MODULES_ROOT, 'ionicons/dist/scss/');

  return src([
    path.join(SRC_ROOT, 'themes/ionic.build.default.scss'),
    path.join(SRC_ROOT, 'themes/ionic.build.dark.scss')
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
  fs.writeFileSync(path.join(SRC_ROOT, 'themes/version.scss'), `$ionic-version: "${version}";`);
}

export function copyFile(srcPath: string, destPath: string) {
  const sourceData = fs.readFileSync(srcPath);
  fs.writeFileSync(destPath, sourceData);
}

export function copySwiperToPath(distPath: string, moduleType: string) {
  copyFile(`${SRC_COMPONENTS_ROOT}/slides/swiper-widget.d.ts`, `${distPath}/swiper-widget.d.ts`);
  if (!moduleType || moduleType === COMMONJS_MODULE) {
    copyFile(`${SRC_COMPONENTS_ROOT}/slides/swiper-widget.js`, `${distPath}/swiper-widget.js`);
  } else if (moduleType === ES_MODULE) {
    copyFile(`${SRC_COMPONENTS_ROOT}/slides/swiper-widget.es2015.js`, `${distPath}/swiper-widget.js`);
  } else {
    copyFile(`${SRC_COMPONENTS_ROOT}/slides/swiper-widget.system.js`, `${distPath}/swiper-widget.system.js`);
  }
}

export function runNgc(pathToConfigFile: string, done: Function) {
  let exec = require('child_process').exec;
  var shellCommand = `node --max_old_space_size=8096 ${PROJECT_ROOT}/node_modules/.bin/ngc -p ${pathToConfigFile}`;

  exec(shellCommand, function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    done(err);
  });
}

export function runTsc(pathToConfigFile: string, done: Function) {
  let exec = require('child_process').exec;
  var shellCommand = `node --max_old_space_size=8096 ${PROJECT_ROOT}/node_modules/.bin/tsc -p ${pathToConfigFile}`;

  exec(shellCommand, function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    done(err);
  });
}

export function runWebpack(pathToWebpackConfig: string, done: Function) {
  let exec = require('child_process').exec;
  let shellCommand = `node --max_old_space_size=8096 ./node_modules/.bin/webpack --config ${pathToWebpackConfig} --display-error-details`;

  exec(shellCommand, function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    done(err);
  });
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

import { dirname, join, relative } from 'path';

import * as glob from 'glob';
import { task } from 'gulp';
import * as del from 'del';
import * as runSequence from 'run-sequence';
import * as s3 from 's3';
import { argv } from 'yargs';


import { DEMOS_SRC_ROOT, ES_2015, ES5, PROJECT_ROOT } from '../constants';
import { createTempTsConfig, getFolderInfo, runAppScriptsBuild, writePolyfills } from '../util';

import * as pAll from 'p-all';

import * as dotenv from 'dotenv';
dotenv.config();

task('demos.prepare', (done: Function) => {
  runSequence('demos.clean', 'demos.polyfill', 'demos.sass', (err: any) => done(err));
});

task('demos.prod', ['demos.prepare'], (done: Function) => {

  // okay, first find out all of the demos tests to run by finding all of the 'main.ts' files
  filterDemosEntryPoints().then((filePaths: string[]) => {
    return buildDemos(filePaths);
  }).then(() => {
    done();
  }).catch((err: Error) => {
    done(err);
  });
});

function filterDemosEntryPoints() {
  return getDemosEntryPoints().then((entryPoints: string[]) => {
    const folderInfo = getFolderInfo();
    if (folderInfo && folderInfo.componentName) {
      const filtered = entryPoints.filter(entryPoint => {
        return entryPoint.indexOf(folderInfo.componentName) >= 0;
      });
      return filtered;
    }
    return entryPoints;
  });
}

function getDemosEntryPoints() {
  return new Promise((resolve, reject) => {
    const mainGlob = join(DEMOS_SRC_ROOT, '**', 'main.ts');
    glob(mainGlob, (err: Error, matches: string[]) => {
      if (err) {
        return reject(err);
      }
      resolve(matches);
    });
  });
}


function buildDemos(filePaths: string[]) {
  const batches = chunkArrayInGroups(filePaths, argv.batches || 1);
  const batch = argv.batch || 0;
  if (batch >= batches.length) {
    throw new Error(`Batch number higher than total number of batches.`);
  }

  console.log(`Compiling ${batches[batch].length} of ${filePaths.length} Demos ...`);

  const functions = batches[batch].map(filePath => () => {
    return buildDemo(filePath);
  });
  let concurrentNumber = 2;
  if (argv.concurrency) {
    concurrentNumber = argv.concurrency;
  }
  return pAll(functions, {concurrency: concurrentNumber});
}

function buildDemo(filePath: string) {
  const start = Date.now();
  const ionicAngularDir = join(process.cwd(), 'src');

  const componentDir = dirname(dirname(filePath));
  const relativePathFromComponents = relative(dirname(DEMOS_SRC_ROOT), componentDir);

  const distTestRoot = join(process.cwd(), 'dist', 'demos', relativePathFromComponents);

  const includeGlob = [ join(ionicAngularDir, '**', '*.ts'), join(componentDir, '**', '*.ts')];
  const pathToWriteFile = join(distTestRoot, 'tsconfig.json');
  const pathToReadFile = join(PROJECT_ROOT, 'tsconfig.json');

  createTempTsConfig(includeGlob, ES5, ES_2015, pathToReadFile, pathToWriteFile, { removeComments: true});

  const sassConfigPath = join('scripts', 'demos', 'sass.config.js');
  const copyConfigPath = join('scripts', 'demos', 'copy.config.js');

  const appEntryPoint = filePath;
  const appNgModulePath = join(dirname(filePath), 'app.module.ts');
  const distDir = join(distTestRoot, 'www');

  const minifyCss = argv.noMinifyCss ? false : true;
  const minifyJs = argv.noMinifyJs ? false : true;
  const optimizeJs = argv.noOptimizeJs ? false : true;

  return runAppScriptsBuild(
    appEntryPoint,
    appNgModulePath,
    ionicAngularDir,
    distDir,
    pathToWriteFile,
    ionicAngularDir,
    sassConfigPath,
    copyConfigPath,
    false,
    minifyCss,
    minifyJs,
    optimizeJs
  ).then(() => {
    const end = Date.now();
    console.log(`${filePath} took a total of ${(end - start) / 1000} seconds to build`);
    uploadToS3(pathToWriteFile);
  });
}

function chunkArrayInGroups(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    if (!Array.isArray(result[i % size])) {
      result[i % size] = [];
    }
    result[i % size].push(arr[i]);
  }
  return result;
}

function uploadToS3(path) {
  // fail silently if envars not present
  if (!process.env.AWS_KEY || !process.env.AWS_SECRET) {
    return Promise.resolve();
  }

  let client = s3.createClient({
    s3Options: {
      accessKeyId: process.env.AWS_KEY,
      secretAccessKey: process.env.AWS_SECRET
    },
  });

  // get demo name from path
  let demo = path.split('/')[path.split('/').length - 2];

  let params = {
    localDir: path.replace('tsconfig.json', ''),
    deleteRemoved: true,
    s3Params: {
      Bucket: 'ionic-demos',
      Prefix: demo,
    },
  };

  const uploader = client.uploadDir(params);

  return new Promise((resolve, reject) => {
    uploader.on('error', function(err) {
      console.error('s3 Upload Error:', err.stack);
      reject();
    });
    uploader.on('end', function() {
      console.log(demo, ' demo uploaded to s3');
      resolve();
    });
  });
}

task('demos.download', (done: Function) => {
  if (!process.env.AWS_KEY || !process.env.AWS_SECRET) {
    return Promise.resolve();
  }

  let client = s3.createClient({
    s3Options: {
      accessKeyId: process.env.AWS_KEY,
      secretAccessKey: process.env.AWS_SECRET
    },
  });

  let params = {
    localDir: join(process.cwd(), 'dist', 'demos', 'src'),
    s3Params: {
      Bucket: 'ionic-demos',
    },
  };

  let uploader = client.downloadDir(params);

  return new Promise((resolve, reject) => {
    uploader.on('error', function(err) {
      console.error('s3 Download Error:', err.stack);
      reject();
    });
    uploader.on('end', function() {
      console.log('Demos downloaded from s3');
      resolve();
    });
  });
});

task('demos.clean', (done: Function) => {
  // this is a super hack, but it works for now
  if (argv.skipClean) {
    return done();
  }

  del(['dist/demos/**']).then(() => {
    done();
  }).catch(err => {
    done(err);
  });
});

task('demos.polyfill', (done: Function) => {
  if (argv.skipPolyfill) {
    return done();
  }

  writePolyfills('dist/demos/polyfills').then(() => {
    done();
  }).catch(err => {
    done(err);
  });
});

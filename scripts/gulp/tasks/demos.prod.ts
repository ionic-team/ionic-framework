import { dirname, join, relative } from 'path';
import { readFileSync } from 'fs';

import * as glob from 'glob';
import { task } from 'gulp';
import * as del from 'del';
import { template } from 'lodash';
import * as runSequence from 'run-sequence';
import { argv } from 'yargs';


import { DEMOS_SRC_ROOT, ES_2015, PROJECT_ROOT, SRC_ROOT, SRC_COMPONENTS_ROOT, SCRIPTS_ROOT } from '../constants';
import { createTempTsConfig, getFolderInfo, readFileAsync, runAppScriptsBuild, writeFileAsync, writePolyfills } from '../util';

import * as pAll from 'p-all';

task('demos.prepare', (done: Function) => {
  runSequence('demos.clean', 'demos.polyfill', (err: any) => done(err));
});

task('demos.prod', ['demos.prepare'], (done: Function) => {

  // okay, first find out all of the demos tests to run by finding all of the 'main.ts' files
  filterDemosEntryPoints().then((filePaths: string[]) => {
    console.log(`Compiling ${filePaths.length} Demos ...`);
    console.log('filePaths: ', filePaths);
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
  const functions = filePaths.map(filePath => () => {
    return buildDemo(filePath);
  });
  return pAll(functions, {concurrency: 8});
}

function buildDemo(filePath: string) {
  const start = Date.now();
  const ionicAngularDir = join(process.cwd(), 'src');

  const componentDir = dirname(dirname(filePath));
  const relativePathFromComponents = relative(dirname(DEMOS_SRC_ROOT), componentDir);
  console.log('relativePathFromComponents: ', relativePathFromComponents);

  const distTestRoot = join(process.cwd(), 'dist', 'demos', relativePathFromComponents);

  const includeGlob = [ join(ionicAngularDir, '**', '*.ts'), join(componentDir, '**', '*.ts')];
  const pathToWriteFile = join(distTestRoot, 'tsconfig.json');
  const pathToReadFile = join(PROJECT_ROOT, 'tsconfig.json');

  createTempTsConfig(includeGlob, ES_2015, ES_2015, pathToReadFile, pathToWriteFile, { removeComments: true});

  const sassConfigPath = join('scripts', 'demos', 'sass.config.js');
  const copyConfigPath = join('scripts', 'demos', 'copy.config.js');

  const appEntryPoint = filePath;
  const appNgModulePath = join(dirname(filePath), 'app.module.ts');
  const distDir = join(distTestRoot, 'www');

  return runAppScriptsBuild(appEntryPoint, appNgModulePath, ionicAngularDir, distDir, pathToWriteFile, ionicAngularDir, sassConfigPath, copyConfigPath).then(() => {
    const end = Date.now();
    console.log(`${filePath} took a total of ${(end - start) / 1000} seconds to build`);
  });
}

function copyProtractorTestContent(filePaths: string[]): Promise<any> {
  return readDemosTestFiles(filePaths)
    .then((map: Map<string, string>) => {
      return applyTemplate(map);
    }).then((map: Map<string, string>) => {
      writeDemosJsFiles(map);
    });
}

function applyTemplate(filePathContent: Map<string, string>) {
  const buildConfig = require('../../build/config');
  const templateFileContent = readFileSync(join(SCRIPTS_ROOT, 'demos', 'demos.template.js'));
  const templater = template(templateFileContent.toString());
  const modifiedMap = new Map<string, string>();
  const platforms = ['android', 'ios', 'windows'];
  filePathContent.forEach((fileContent: string, filePath: string) => {
    const srcRelativePath = relative(SRC_ROOT, dirname(filePath));
    const wwwRelativePath = join(srcRelativePath, 'www');
    platforms.forEach(platform => {
      const platformContents = templater({
        contents: fileContent,
        buildConfig: buildConfig,
        relativePath: wwwRelativePath,
        platform: platform,
        relativePathBackwardsCompatibility: dirname(wwwRelativePath)
      });
      const newFilePath = join(wwwRelativePath, `${platform}.demos.js`);
      modifiedMap.set(newFilePath, platformContents);
    });
  });
  return modifiedMap;
}

function writeDemosJsFiles(map: Map<string, string>) {
  const promises: Promise<any>[] = [];
  map.forEach((fileContent: string, filePath: string) => {
    const destination = join(process.cwd(), 'dist', 'demos', filePath);
    promises.push(writeFileAsync(destination, fileContent));
  });
  return Promise.all(promises);
}


function readDemosTestFiles(mainFilePaths: string[]): Promise<Map<string, string>> {
  const demosFiles = mainFilePaths.map(mainFilePath => {
    return join(dirname(mainFilePath), 'demos.ts');
  });

  const promises: Promise<any>[] = [];
  const map = new Map<string, string>();
  for (const demosFile of demosFiles) {
    const promise = readDemosFile(demosFile);
    promises.push(promise);
    promise.then((content: string) => {
      map.set(demosFile, content);
    });
  }

  return Promise.all(promises).then(() => {
    return map;
  });
}

function readDemosFile(filePath: string) {
  return readFileAsync(filePath).then((content: string) => {
    // purge the import statement at the top
    const purgeImportRegex = /.*?import.*?'protractor';/g;
    return content.replace(purgeImportRegex, '');
  });
}



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

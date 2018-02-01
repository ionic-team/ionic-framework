import { spawn } from 'child_process';
import { accessSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join, relative } from 'path';

import * as glob from 'glob';
import { task } from 'gulp';
import * as del from 'del';
import { template } from 'lodash';
import * as runSequence from 'run-sequence';
import { argv } from 'yargs';


import { DIST_E2E_COMPONENTS_ROOT, ES_2015, PROJECT_ROOT, SRC_ROOT, SRC_COMPONENTS_ROOT, SCRIPTS_ROOT } from '../constants';
import { createTempTsConfig, createTimestamp, getFolderInfo, readFileAsync, runAppScriptsBuild, writeFileAsync, writePolyfills } from '../util';

import * as pAll from 'p-all';

task('e2e.prepare', (done: Function) => {
  runSequence('e2e.clean', 'e2e.polyfill', 'e2e.prepareSass', (err: any) => done(err));
});

task('e2e.prepareSass', (done: Function) => {
  const version = `E2E-${createTimestamp()}`;
  writeFileSync(join(SRC_ROOT, 'themes', 'version.scss'), `$ionic-version: "${version}";`);
  done();
});

task('e2e.prod', ['e2e.prepare'], (done: Function) => {
  // okay, first find out all of the e2e tests to run by finding all of the 'main.ts' files
  filterE2eTestfiles().then((filePaths: string[]) => {
    if (filePaths && filePaths.length > 0) {
      console.log(`Compiling ${filePaths.length} E2E tests ...`);
      return buildTests(filePaths);
    }
  }).then(() => {
    done();
  }).catch((err: Error) => {
    done(err);
    process.exit(1);
  });
});

function e2eComponentExists(folderInfo: any): boolean {
  let componentPath = join(SRC_COMPONENTS_ROOT, folderInfo.componentName, 'test', folderInfo.componentTest, 'app');

  try {
    accessSync(componentPath);
  } catch (e) {
    return false;
  }
  return true;
}

function filterE2eTestfiles() {
  return getE2eTestFiles().then((filePaths: string[]) => {
    const entryPoints = filePaths.map(filePath => {
      const directoryName = dirname(filePath);
      return join(directoryName, 'app', 'main.ts');
    });
    return entryPoints;
  }).then((entryPoints: string[]) => {
    const folderInfo = getFolderInfo();
    if (folderInfo && folderInfo.componentName && folderInfo.componentTest) {
      if (!e2eComponentExists(folderInfo)) {
        console.log('Cannot find E2E test ', join(folderInfo.componentName, 'test', folderInfo.componentTest), '. Make sure that the test exists and you are passing the correct folder.');
        return [];
      }
      const filtered = entryPoints.filter(entryPoint => {
        return entryPoint.indexOf(join(folderInfo.componentName, 'test', folderInfo.componentTest)) >= 0;
      });
      return filtered;
    }
    return entryPoints;
  });
}

function getE2eTestFiles() {
  return new Promise((resolve, reject) => {
    const mainGlob = join(SRC_COMPONENTS_ROOT, '*', 'test', '*', 'e2e.ts');
    glob(mainGlob, (err: Error, matches: string[]) => {
      if (err) {
        return reject(err);
      }
      resolve(matches);
    });
  });
}


function buildTests(filePaths: string[]) {
  const functions = filePaths.map(filePath => () => {
    return buildTest(filePath);
  });

  // Run 2 tests at a time unless the `concurrency` arg is passed
  let concurrentNumber = 2;
  if (argv.concurrency) {
    concurrentNumber = argv.concurrency;
  }
  return pAll(functions, {concurrency: concurrentNumber}).then(() => {
    // copy over all of the protractor tests to the correct location now
    return copyProtractorTestContent(filePaths);
  });
}

function buildTest(filePath: string) {
  const start = Date.now();
  const ionicAngularDir = join(process.cwd(), 'src');

  let appEntryPoint = filePath;
  let srcTestRoot = dirname(dirname(appEntryPoint));
  try {
    // check if the entry point exists, otherwise fall back to the legacy entry point without 'app' folder
    readFileSync(appEntryPoint);
  } catch (ex) {
    // the file doesn't exist, so use the legacy entry point
    appEntryPoint = join(dirname(dirname(appEntryPoint)), 'main.ts');
    srcTestRoot = dirname(appEntryPoint);
  }

  const relativePathFromComponents = relative(dirname(SRC_COMPONENTS_ROOT), srcTestRoot);
  const distTestRoot = join(process.cwd(), 'dist', 'e2e', relativePathFromComponents);

  const includeGlob = [join(ionicAngularDir, '**', '*.ts')];
  const pathToWriteFile = join(distTestRoot, 'tsconfig.json');
  const pathToReadFile = join(PROJECT_ROOT, 'tsconfig.json');

  createTempTsConfig(includeGlob, ES_2015, ES_2015, pathToReadFile, pathToWriteFile, { removeComments: true});

  const sassConfigPath = join('scripts', 'e2e', 'sass.config.js');
  const copyConfigPath = join('scripts', 'e2e', 'copy.config.js');

  const appNgModulePath = join(dirname(appEntryPoint), 'app.module.ts');
  const distDir = join(distTestRoot, 'www');

  const minifyCss = argv.minifyCss ? true : false;
  const minifyJs = argv.minifyJs ? true : false;
  const optimizeJs = argv.optimizeJs ? true : false;

  return runAppScriptsBuild(appEntryPoint, appNgModulePath, ionicAngularDir, distDir, pathToWriteFile, ionicAngularDir, sassConfigPath, copyConfigPath, argv.dev, minifyCss, minifyJs, optimizeJs).then(() => {
    const end = Date.now();
    console.log(`${filePath} took a total of ${(end - start) / 1000} seconds to build`);
  }).catch((err) => {
    console.log(`${err}`);
  });
}

function copyProtractorTestContent(filePaths: string[]): Promise<any> {
  const e2eTestPaths = filePaths.map(filePath => {
    return join(dirname(dirname(filePath)), 'e2e.ts');
  });
  return readE2ETestFiles(e2eTestPaths)
    .then((map: Map<string, string>) => {
      return applyTemplate(map);
    }).then((map: Map<string, string>) => {
      writeE2EJsFiles(map);
    });
}

function applyTemplate(filePathContent: Map<string, string>) {
  const buildConfig = require(join('..', '..', 'build', 'config'));
  const templateFileContent = readFileSync(join(SCRIPTS_ROOT, 'e2e', 'e2e.template.js'));
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
      const newFilePath = join(wwwRelativePath, `${platform}.e2e.js`);
      modifiedMap.set(newFilePath, platformContents);
    });
  });
  return modifiedMap;
}

function writeE2EJsFiles(map: Map<string, string>) {
  const promises: Promise<any>[] = [];
  map.forEach((fileContent: string, filePath: string) => {
    const destination = join(process.cwd(), 'dist', 'e2e', filePath);
    promises.push(writeFileAsync(destination, fileContent));
  });
  return Promise.all(promises);
}


function readE2ETestFiles(mainFilePaths: string[]): Promise<Map<string, string>> {
  const e2eFiles = mainFilePaths.map(mainFilePath => {
    return join(dirname(mainFilePath), 'e2e.ts');
  });

  const promises: Promise<any>[] = [];
  const map = new Map<string, string>();
  for (const e2eFile of e2eFiles) {
    const promise = readE2EFile(e2eFile);
    promises.push(promise);
    promise.then((content: string) => {
      map.set(e2eFile, content);
    });
  }

  return Promise.all(promises).then(() => {
    return map;
  });
}

function readE2EFile(filePath: string) {
  return readFileAsync(filePath).then((content: string) => {
    // purge the import statement at the top
    const purgeImportRegex = /.*?import.*?'protractor';/g;
    return content.replace(purgeImportRegex, '');
  });
}



task('e2e.clean', (done: Function) => {
  // this is a super hack, but it works for now
  if (argv.skipClean) {
    return done();
  }

  del(['dist/e2e/**']).then(() => {
    done();
  }).catch(err => {
    done(err);
  });
});

task('e2e.polyfill', (done: Function) => {
  if (argv.skipPolyfill) {
    return done();
  }

  writePolyfills(join('dist', 'e2e', 'polyfills')).then(() => {
    done();
  }).catch(err => {
    done(err);
  });
});

task('e2e.openProd', (done: Function) => {
  runSequence('e2e.prod', 'e2e.open', (err: any) => done(err));
});

task('e2e.open', (done: Function) => {
  const folderInfo = getFolderInfo();
  if (folderInfo && folderInfo.componentName && folderInfo.componentTest) {
    const filePath = join(DIST_E2E_COMPONENTS_ROOT, folderInfo.componentName, 'test', folderInfo.componentTest, 'www', 'index.html');
    const spawnedCommand = spawn('open', [filePath]);

    spawnedCommand.on('close', (code: number) => {
      done();
    });
  } else {
    console.log(`Can't open without folder argument.`);
  }
});

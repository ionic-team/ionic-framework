import { dirname, join } from 'path';
import { readFileSync } from 'fs';

import { task } from 'gulp';

import { ES_2015, PROJECT_ROOT } from '../constants';
import { createTempTsConfig, getFolderInfo, runAppScriptsServe } from '../util';

task('e2e.watch', ['e2e.prepare'], (done: Function) => {
  const folderInfo = getFolderInfo();
  if (!folderInfo || !folderInfo.componentName || !folderInfo.componentTest) {
    done(new Error(`Usage: gulp e2e.watch --folder nav/basic`));
    return;
  }

  serveTest(folderInfo).then(() => {
    done();
  }).catch((err: Error) => {
    done(err);
  });
});

function serveTest(folderInfo: any) {

  const ionicAngularDir = join(PROJECT_ROOT, 'src');
  const srcTestRoot = join(PROJECT_ROOT, 'src', 'components', folderInfo.componentName, 'test', folderInfo.componentTest);
  const distTestRoot = join(PROJECT_ROOT, 'dist', 'e2e', 'components', folderInfo.componentName, 'test', folderInfo.componentTest);
  const includeGlob = [ join(ionicAngularDir, '**', '*.ts')];
  const pathToWriteFile = join(distTestRoot, 'tsconfig.json');
  const pathToReadFile = join(PROJECT_ROOT, 'tsconfig.json');

  createTempTsConfig(includeGlob, ES_2015, ES_2015, pathToReadFile, pathToWriteFile, { removeComments: true});

  const sassConfigPath = join('scripts', 'e2e', 'sass.config.js');
  const copyConfigPath = join('scripts', 'e2e', 'copy.config.js');

  let appEntryPoint = join(srcTestRoot, 'app', 'main.ts');
  try {
    // check if the entry point exists, otherwise fall back to the legacy entry point without 'app' folder
    readFileSync(appEntryPoint);
  } catch (ex) {
    // the file doesn't exist, so use the legacy entry point
    appEntryPoint = join(srcTestRoot, 'main.ts');
  }

  // this assume that app.module.ts and main.ts are peers, which they should be no matter what
  const appNgModulePath = join(dirname(appEntryPoint), 'app.module.ts');
  const distDir = join(distTestRoot, 'www');

  return runAppScriptsServe(join(folderInfo.componentName, folderInfo.componentTest), appEntryPoint, appNgModulePath, ionicAngularDir, distDir, pathToWriteFile, ionicAngularDir, sassConfigPath, copyConfigPath, null);
}

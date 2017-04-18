import { join } from 'path';

import { task } from 'gulp';

import { DEMOS_ROOT, DIST_DEMOS_ROOT, ES_2015, PROJECT_ROOT } from '../constants';
import { createTempTsConfig, getFolderInfo, runAppScriptsServe } from '../util';

task('demos.watch', ['demos.prepare'], (done: Function) => {
  const folderInfo = getFolderInfo();
  if (!folderInfo || !folderInfo.componentName ) {
    done(new Error(`Usage: gulp e2e.watch --folder modal`));
  }

  serveDemo(folderInfo.componentName).then(() => {
    done();
  }).catch((err: Error) => {
    done(err);
  });
});

function serveDemo(folderName: any) {
  const testOrDemoName = folderName;
  const ionicAngularDir = join(PROJECT_ROOT, 'src');
  const coreCompilerFilePath = join(PROJECT_ROOT, 'dist', 'ionic-angular', 'compiler');
  const coreDir = join(PROJECT_ROOT, 'dist', 'ionic-angular');
  const srcTestRoot = join(DEMOS_ROOT, 'src', folderName);
  const distDemoRoot = join(DIST_DEMOS_ROOT, folderName);
  const includeGlob = [ join(ionicAngularDir, '**', '*.ts'),
                        join(srcTestRoot, '**', '*.ts')];


  const pathToWriteFile = join(distDemoRoot, 'tsconfig.json');
  const pathToReadFile = join(PROJECT_ROOT, 'tsconfig.json');

  createTempTsConfig(includeGlob, ES_2015, ES_2015, pathToReadFile, pathToWriteFile, { removeComments: true});

  const sassConfigPath = join('scripts', 'demos', 'sass.config.js');
  const copyConfigPath = join('scripts', 'demos', 'copy.config.js');
  const watchConfigPath = join('scripts', 'demos', 'watch.config.js');

  const appEntryPoint = join(srcTestRoot, 'app', 'main.ts');
  const appNgModulePath = join(srcTestRoot, 'app', 'app.module.ts');
  const distDir = join(distDemoRoot, 'www');

  return runAppScriptsServe(testOrDemoName, appEntryPoint, appNgModulePath, ionicAngularDir, distDir, pathToWriteFile, ionicAngularDir, coreCompilerFilePath, coreDir, sassConfigPath, copyConfigPath, watchConfigPath);
}

import { spawn } from 'child_process';
import { createServer } from 'http';
import { join, resolve } from 'path';

import * as connect from 'connect';
import { task } from 'gulp';
import * as serveStatic from 'serve-static';
import { argv } from 'yargs';

import { DIST_E2E_COMPONENTS_ROOT, PROJECT_ROOT, SCRIPTS_ROOT } from '../constants';
import { mergeObjects } from '../util';


task('snapshot', ['e2e.prod'], (done: Function) => {
  snapshot(false, done);
});

task('snapshot.skipBuild', (done: Function) => {
  snapshot(false, done);
});

function snapshot(quickMode: boolean, callback: Function) {
  const snapshotConfig = require('../../snapshot/snapshot.config').config;
  const protractorConfigFile = resolve(SCRIPTS_ROOT, 'snapshot/protractor.config.js');

  const snapshotDefaults = snapshotConfig.platformDefaults || {};
  const snapshotValues: any = mergeObjects(snapshotDefaults, argv || {});

  if (!snapshotConfig.accessKey || !snapshotConfig.accessKey.length) {
    console.error('Missing IONIC_SNAPSHOT_KEY environment variable');
    return callback(new Error('Missing IONIC_SNAPSHOT_KEY environment variable'));
  }

  let component = '*';
  let e2eSpecs = '*';

  const folderArg: string = argv.folder || argv.f;
  if (folderArg && folderArg.length) {
    const folderArgPaths = folderArg.split('/');
    component = folderArgPaths[0];
    if (folderArgPaths.length > 1) {
      e2eSpecs = folderArgPaths[1];
    }
  }

  const specs = join(DIST_E2E_COMPONENTS_ROOT, component, 'test', e2eSpecs, 'www', '*e2e.js');

  console.log('[snapshot] Running with', 'Production', 'build');
  console.log(`[snapshot] Specs: ${specs}`);

  const testId = generateTestId();
  console.log(`[snapshot] TestId: ${testId}`);

  snapshotValues.params.test_id = testId;
  snapshotValues.params.upload = !quickMode;

  var protractorArgs = [
    '--browser ' + snapshotValues.browser,
    '--platform ' + snapshotValues.platform,
    '--params.platform_id=' +  snapshotValues.params.platform_id,
    '--params.platform_index=' +  snapshotValues.params.platform_index,
    '--params.platform_count=' +  snapshotValues.params.platform_count,
    '--params.width=' +  snapshotValues.params.width,
    '--params.height=' +  snapshotValues.params.height,
    '--params.test_id=' +  snapshotValues.params.test_id,
    '--params.upload=' +  snapshotValues.params.upload,
    '--specs=' + specs
  ];

  return protractor(callback, [protractorConfigFile].concat(protractorArgs), testId);
}

function protractor(callback, args, testId: string) {
  const buildConfig = require('../../build/config');
  const app = connect().use(serveStatic(PROJECT_ROOT));
  const protractorHttpServer = createServer(app).listen(buildConfig.protractorPort);

  console.log(`Serving ${process.cwd()} on http://localhost:${buildConfig.protractorPort}`);

  let spawnCommand = process.platform === 'win32' ? 'protractor.cmd' : 'protractor';

  const child = spawn(spawnCommand, args, {
    stdio: [process.stdin, process.stdout, 'pipe']
  });

  let errored = false;
  let callbackCalled = false;

  child.stderr.on('data', function(data) {
    protractorHttpServer.close();
    console.error(data.toString());
    if (!errored) {
      errored = true;
      if (!callbackCalled) {
        callback('Protractor tests failed.');
        callbackCalled = true;
      }
    }
  });

  child.on('exit', function() {
    protractorHttpServer.close();
    if (!callbackCalled) {
      console.log(`[snapshot] TestId: ${testId}`);
      callback();
      callbackCalled = true;
    }
  });
}

function generateTestId() {
  let chars = 'abcdefghjkmnpqrstuvwxyz';
  let id = chars.charAt(Math.floor(Math.random() * chars.length));
  chars += '0123456789';
  while (id.length < 3) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

import { task } from 'gulp';
import { DIST_E2E_COMPONENTS_ROOT, PROJECT_ROOT, SCRIPTS_ROOT } from '../constants';
import { mergeObjects } from '../util';
import * as path from 'path';

import { E2E_BUILD_TASK, E2E_COMPILE_SASS } from './e2e';

export const SNAPSHOT_TASK = 'snapshot';
export const SNAPSHOT_SKIP_BUILD_TASK = 'snapshot.skipBuild';
export const SNAPSHOT_QUICK_TASK = 'snapshot.quick';

task(SNAPSHOT_TASK, [E2E_BUILD_TASK], (done: Function) => {
  snapshot(false, done);
});

task(SNAPSHOT_SKIP_BUILD_TASK, [E2E_COMPILE_SASS], (done: Function) => {
  snapshot(false, done);
});

task(SNAPSHOT_QUICK_TASK, [E2E_COMPILE_SASS], (done: Function) => {
  snapshot(true, done);
});

function snapshot(quickMode: boolean, callback: Function) {
  const snapshotConfig = require('../../snapshot/snapshot.config').config;
  const protractorConfigFile = path.resolve(SCRIPTS_ROOT, 'snapshot/protractor.config.js');
  const argv = require('yargs').argv;

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
  const specs = path.join(DIST_E2E_COMPONENTS_ROOT, component, 'test', e2eSpecs, '*e2e.js');
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
  const connect = require('connect');
  const http = require('http');
  const serveStatic = require('serve-static');
  const buildConfig = require('../../build/config');
  const app = connect().use(serveStatic(PROJECT_ROOT));
  const protractorHttpServer = http.createServer(app).listen(buildConfig.protractorPort);

  console.log(`Serving ${process.cwd()} on http://localhost:${buildConfig.protractorPort}`);

  const cp = require('child_process');
  const child = cp.spawn('protractor', args, {
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

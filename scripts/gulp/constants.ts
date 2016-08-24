import { join } from 'path';

export const DIST_NAME = 'dist';
export const E2E = 'e2e';
export const PACKAGE_NAME = 'ionic-angular';
export const SCRIPTS_NAME = 'scripts';
export const BUILD_NAME = 'build';
export const SRC_NAME = 'src';
export const VENDOR_NAME = 'vendor';
export const NODE_MODULES = 'node_modules';

export const PROJECT_ROOT = join(__dirname, '../..');

export const DIST_ROOT = join(PROJECT_ROOT, DIST_NAME);
export const DIST_E2E_ROOT = `${DIST_ROOT}/${E2E}`;
export const DIST_BUILD_ROOT = join(DIST_ROOT, PACKAGE_NAME);
export const DIST_VENDOR_ROOT = join(DIST_ROOT, VENDOR_NAME);

export const NODE_MODULES_ROOT = join(PROJECT_ROOT, NODE_MODULES);

export const SCRIPTS_ROOT = join(PROJECT_ROOT, SCRIPTS_NAME);

export const SRC_ROOT = join(PROJECT_ROOT, SRC_NAME);

export const NPM_VENDOR_FILES = [
  '@angular', 'core-js/client', 'rxjs', 'systemjs/dist', 'zone.js/dist'
];

export const COMMON_JS_NGC_FILE_NAME = 'commonjsNgcConfig.json';
export const COMMON_JS_NGC_CONFIG = `./${SCRIPTS_NAME}/${BUILD_NAME}/${COMMON_JS_NGC_FILE_NAME}`;


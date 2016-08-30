import { join } from 'path';

// Names
export const COMPONENTS_NAME = 'components';
export const DIST_NAME = 'dist';
export const E2E_NAME = 'e2e';
export const PACKAGE_NAME = 'ionic-angular';
export const SCRIPTS_NAME = 'scripts';
export const BUILD_NAME = 'build';
export const SRC_NAME = 'src';
export const VENDOR_NAME = 'vendor';
export const NODE_MODULES = 'node_modules';

// File Paths
export const PROJECT_ROOT = join(__dirname, '../..');
export const DIST_ROOT = join(PROJECT_ROOT, DIST_NAME);
export const DIST_E2E_ROOT = join(DIST_ROOT, E2E_NAME);
export const DIST_E2E_COMPONENTS_ROOT = join(DIST_E2E_ROOT, COMPONENTS_NAME);
export const DIST_BUILD_ROOT = join(DIST_ROOT, PACKAGE_NAME);
export const DIST_BUILD_ESM_ROOT = join(DIST_BUILD_ROOT, 'esm');
export const DIST_VENDOR_ROOT = join(DIST_ROOT, VENDOR_NAME);
export const NODE_MODULES_ROOT = join(PROJECT_ROOT, NODE_MODULES);
export const SCRIPTS_ROOT = join(PROJECT_ROOT, SCRIPTS_NAME);
export const SRC_ROOT = join(PROJECT_ROOT, SRC_NAME);
export const SRC_COMPONENTS_ROOT = join(SRC_ROOT, COMPONENTS_NAME);

// NPM
export const NPM_VENDOR_FILES = [
  '@angular', 'core-js/client', 'rxjs', 'systemjs/dist', 'zone.js/dist'
];

// NGC
export const COMMON_JS_NGC_FILE_NAME = 'release-tsconfig-commonjs.json';
export const COMMON_JS_NGC_CONFIG = join(PROJECT_ROOT, `./${SCRIPTS_NAME}/${BUILD_NAME}/${COMMON_JS_NGC_FILE_NAME}`);
export const ES_MODULES_NGC_FILE_NAME = 'release-tsconfig-esm.json';
export const ES_MODULES_NGC_CONFIG = join(PROJECT_ROOT, `./${SCRIPTS_NAME}/${BUILD_NAME}/${ES_MODULES_NGC_FILE_NAME}`);
export const E2E_BASE_CONFIG_NGC_FILE_NAME = 'e2e-base-tsconfig.json';
export const E2E_BASE_CONFIG_NGC_CONFIG = join(PROJECT_ROOT, `./${SCRIPTS_NAME}/${BUILD_NAME}/${E2E_BASE_CONFIG_NGC_FILE_NAME}`);
export const E2E_GENERATED_CONFIG_NGC_FILE_NAME = 'e2e-generated-tsconfig.json';
export const E2E_GENERATED_CONFIG_NGC_CONFIG = join(PROJECT_ROOT, `./${SCRIPTS_NAME}/${BUILD_NAME}/${E2E_GENERATED_CONFIG_NGC_FILE_NAME}`);


// SERVER
export const LOCAL_SERVER_PORT = 8080;

import { join } from 'path';


// Names
export const COMPONENTS_NAME = 'components';
export const DIST_NAME = 'dist';
export const DEMOS_NAME = 'demos';
export const E2E_NAME = 'e2e';
export const PACKAGE_NAME = 'ionic-angular';
export const SCRIPTS_NAME = 'scripts';
export const BUILD_NAME = 'build';
export const SRC_NAME = 'src';
export const VENDOR_NAME = 'vendor';
export const NODE_MODULES = 'node_modules';
export const COMMONJS_MODULE = 'commonjs';
export const ES_MODULE = 'es2015';


// File Paths
export const PROJECT_ROOT = join(__dirname, '../..');
export const DEMOS_ROOT = join(PROJECT_ROOT, DEMOS_NAME);
export const DEMOS_SRC_ROOT = join(DEMOS_ROOT, SRC_NAME);
export const DIST_ROOT = join(PROJECT_ROOT, DIST_NAME);
export const DIST_E2E_ROOT = join(DIST_ROOT, E2E_NAME);
export const DIST_E2E_COMPONENTS_ROOT = join(DIST_E2E_ROOT, COMPONENTS_NAME);
export const DIST_BUILD_ROOT = join(DIST_ROOT, PACKAGE_NAME);
export const DIST_BUILD_COMMONJS_ROOT = join(DIST_BUILD_ROOT, COMMONJS_MODULE);
export const DIST_VENDOR_ROOT = join(DIST_ROOT, VENDOR_NAME);
export const NODE_MODULES_ROOT = join(PROJECT_ROOT, NODE_MODULES);
export const SCRIPTS_ROOT = join(PROJECT_ROOT, SCRIPTS_NAME);
export const SRC_ROOT = join(PROJECT_ROOT, SRC_NAME);

export const SRC_COMPONENTS_ROOT = join(SRC_ROOT, COMPONENTS_NAME);


// NPM
export const NPM_VENDOR_FILES = [
  '@angular', 'core-js/client', 'rxjs', 'systemjs/dist', 'zone.js/dist'
];


// SERVER
export const LOCAL_SERVER_PORT = 8080;


// Polyfills entries
export const MODERN_ENTRIES = [
  'node_modules/core-js/es6/array.js',
  'node_modules/core-js/es6/date.js',
  'node_modules/core-js/es6/function.js',
  'node_modules/core-js/es6/map.js',
  'node_modules/core-js/es6/number.js',
  'node_modules/core-js/es6/object.js',
  'node_modules/core-js/es6/parse-float.js',
  'node_modules/core-js/es6/parse-int.js',
  'node_modules/core-js/es6/promise.js',
  'node_modules/core-js/es6/set.js',
  'node_modules/core-js/es6/string.js',
  'node_modules/core-js/es7/reflect.js',
  'node_modules/core-js/es6/reflect.js',
  'node_modules/zone.js/dist/zone.js',
];

export const ALL_ENTRIES = [
  'node_modules/core-js/es6/index.js',
  'node_modules/core-js/es7/reflect.js',
  'node_modules/zone.js/dist/zone.js',
];

export const NG_ENTRIES = [
  'node_modules/core-js/es7/reflect.js',
  'node_modules/zone.js/dist/zone.js',
];


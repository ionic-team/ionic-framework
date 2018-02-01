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
export const UMD_MODULE = 'umd';
export const ES_2015 = 'es2015';
export const ES5 = 'es5';
export const INDEX_JS = 'index.js';
export const BUNDLES = 'bundles';
export const SITE_NAME = 'ionic-site';

// File Paths
export const PROJECT_ROOT = join(__dirname, '..', '..');
export const DEMOS_ROOT = join(PROJECT_ROOT, DEMOS_NAME);
export const DEMOS_SRC_ROOT = join(DEMOS_ROOT, SRC_NAME);
export const DIST_ROOT = join(PROJECT_ROOT, DIST_NAME);
export const DIST_DEMOS_ROOT = join(DIST_ROOT, DEMOS_NAME);
export const DIST_DEMOS_COMPONENTS_ROOT = join(DIST_DEMOS_ROOT, COMPONENTS_NAME);
export const DIST_E2E_ROOT = join(DIST_ROOT, E2E_NAME);
export const DIST_E2E_COMPONENTS_ROOT = join(DIST_E2E_ROOT, COMPONENTS_NAME);
export const DIST_BUILD_ROOT = join(DIST_ROOT, PACKAGE_NAME);
export const DIST_BUNDLE_ROOT = join(DIST_BUILD_ROOT, BUNDLES);
export const DIST_BUILD_UMD_ROOT = join(DIST_BUILD_ROOT, UMD_MODULE);
export const DIST_BUILD_UMD_BUNDLE_ENTRYPOINT = join(DIST_BUILD_ROOT, INDEX_JS);
export const DIST_BUILD_ES2015_ROOT = join(DIST_BUILD_ROOT, 'es2015');
export const DIST_VENDOR_ROOT = join(DIST_ROOT, VENDOR_NAME);
export const NODE_MODULES_ROOT = join(PROJECT_ROOT, NODE_MODULES);
export const SCRIPTS_ROOT = join(PROJECT_ROOT, SCRIPTS_NAME);
export const SRC_ROOT = join(PROJECT_ROOT, SRC_NAME);
export const SITE_ROOT = join(PROJECT_ROOT, '..', SITE_NAME);

export const SRC_COMPONENTS_ROOT = join(SRC_ROOT, COMPONENTS_NAME);
export const WORKERS_SRC = join(SCRIPTS_ROOT, 'workers');


// NPM
export const NPM_VENDOR_FILES = [
  '@angular', join('core-js', 'client'), 'rxjs', join('systemjs', 'dist'), join('zone.js', 'dist')
];


// SERVER
export const LOCAL_SERVER_PORT = 8000;

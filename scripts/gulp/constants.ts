import { join } from 'path';

export const DIST_NAME = 'dist';
export const PACKAGE_NAME = 'ionic-angular';
export const SCRIPTS_NAME = 'scripts';
export const SRC_NAME = 'src';
export const VENDOR_NAME = 'vendor';
export const NODE_MODULES = 'node_modules';

export const PROJECT_ROOT = join(__dirname, '../..');

export const DIST_ROOT = join(PROJECT_ROOT, DIST_NAME);
export const DIST_BUILD_ROOT = join(DIST_ROOT, PACKAGE_NAME);
export const DIST_VENDOR_ROOT = join(DIST_ROOT, VENDOR_NAME);

export const NODE_MODULES_ROOT = join(PROJECT_ROOT, NODE_MODULES);

export const SCRIPTS_ROOT = join(PROJECT_ROOT, SCRIPTS_NAME);

export const SRC_ROOT = join(PROJECT_ROOT, SRC_NAME);

export const NPM_VENDOR_FILES = [
  '@angular', 'core-js/client', 'rxjs', 'systemjs/dist', 'zone.js/dist'
];

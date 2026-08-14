import type { Migration } from '../types.js';

import { angularStandaloneImports } from './v9/angular-standalone-imports.js';
import { angularCssTilde } from './v9/angular-css-tilde.js';
import { angularZoneless } from './v9/angular-zoneless.js';
import { angularZonelessManual } from './v9/angular-zoneless-manual.js';
import { angularDeps } from './v9/angular-deps.js';
import { angularIonicModule } from './v9/angular-ionic-module.js';
import { angularModuleResolution } from './v9/angular-module-resolution.js';
import { angularTypescript } from './v9/angular-typescript.js';
import { angularVersion } from './v9/angular-version.js';
import { reactDeps } from './v9/react-deps.js';
import { reactRouter6Routes } from './v9/react-router-6-routes.js';
import { reactRouter6Code } from './v9/react-router-6-code.js';
import { vueDeps } from './v9/vue-deps.js';
import { vueRouterNextGuard } from './v9/vue-router-next-guard.js';
import { coreBrowserslist } from './v9/core-browserslist.js';
import { coreCapacitor } from './v9/core-capacitor.js';
import { coreDeps } from './v9/core-deps.js';
import { coreFloatingLabel } from './v9/core-floating-label.js';
import { coreFormStructure } from './v9/core-form-structure.js';
import { coreModalHandle } from './v9/core-modal-handle.js';
import { corePackageExports } from './v9/core-package-exports.js';
import { coreSelectEvents } from './v9/core-select-events.js';
import { coreSwipeBackConfig } from './v9/core-swipe-back-config.js';
import { coreTextareaHeight } from './v9/core-textarea-height.js';
import { coreLegacyPicker } from './v9/core-legacy-picker.js';
import { coreAutocorrect } from './v9/core-autocorrect.js';
import { coreAutocorrectManual } from './v9/core-autocorrect-manual.js';
import { coreIonImg } from './v9/core-ion-img.js';
import { coreNavRouter } from './v9/core-nav-router.js';

/**
 * Every migration the tool knows about, across all major versions. To add a
 * migration, drop a file under `migrations/v<major>/` and register it here. The
 * engine filters by version range and framework at run time.
 */
export const allMigrations: Migration[] = [
  angularStandaloneImports,
  angularCssTilde,
  angularZoneless,
  angularZonelessManual,
  angularDeps,
  angularIonicModule,
  angularModuleResolution,
  angularTypescript,
  angularVersion,
  reactDeps,
  reactRouter6Routes,
  reactRouter6Code,
  vueDeps,
  vueRouterNextGuard,
  coreBrowserslist,
  coreCapacitor,
  coreDeps,
  coreFloatingLabel,
  coreFormStructure,
  coreModalHandle,
  corePackageExports,
  coreSelectEvents,
  coreSwipeBackConfig,
  coreTextareaHeight,
  coreLegacyPicker,
  coreAutocorrect,
  coreAutocorrectManual,
  coreIonImg,
  coreNavRouter,
];

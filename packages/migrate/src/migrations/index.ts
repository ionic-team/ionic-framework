import type { Migration } from '../types.js';

import { angularStandaloneImports } from './v9/angular-standalone-imports.js';
import { angularCssTilde } from './v9/angular-css-tilde.js';
import { angularZoneless } from './v9/angular-zoneless.js';
import { angularDeps } from './v9/angular-deps.js';
import { reactDeps } from './v9/react-deps.js';
import { reactRouter6Routes } from './v9/react-router-6-routes.js';
import { reactRouter6Code } from './v9/react-router-6-code.js';
import { vueDeps } from './v9/vue-deps.js';
import { vueRouterNextGuard } from './v9/vue-router-next-guard.js';
import { coreLegacyPicker } from './v9/core-legacy-picker.js';
import { coreAutocorrect } from './v9/core-autocorrect.js';
import { coreAutocorrectManual } from './v9/core-autocorrect-manual.js';
import { coreIonImg } from './v9/core-ion-img.js';

/**
 * Every migration the tool knows about, across all major versions. To add a
 * migration, drop a file under `migrations/v<major>/` and register it here; the
 * engine filters by version range and framework at run time.
 */
export const allMigrations: Migration[] = [
  angularStandaloneImports,
  angularCssTilde,
  angularZoneless,
  angularDeps,
  reactDeps,
  reactRouter6Routes,
  reactRouter6Code,
  vueDeps,
  vueRouterNextGuard,
  coreLegacyPicker,
  coreAutocorrect,
  coreAutocorrectManual,
  coreIonImg,
];

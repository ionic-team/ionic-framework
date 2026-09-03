import type { EnvironmentProviders, Provider } from '@angular/core';

/**
 * Change detection providers, spread into both the lazy (`app.module.ts`) and
 * standalone (`main-standalone.ts`) bootstraps.
 *
 * Empty by default, which leaves Angular's own: zone-based on ng18-20, zoneless
 * on ng21/ng22. An app opts into a different mode by overriding this file.
 */
export const changeDetectionProviders: (Provider | EnvironmentProviders)[] = [];

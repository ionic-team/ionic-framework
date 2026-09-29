import { provideZoneChangeDetection } from '@angular/core';
import type { EnvironmentProviders, Provider } from '@angular/core';

/**
 * Angular 22 bootstraps zoneless unless a change detection provider is
 * registered, so loading Zone.js isn't enough on its own.
 *
 * This app ships no `src/polyfills.ts`, so it inherits base's `import 'zone.js'`.
 * Don't add ng22's zone-free override: the provider below needs Zone.js loaded.
 */
export const changeDetectionProviders: (Provider | EnvironmentProviders)[] = [provideZoneChangeDetection()];

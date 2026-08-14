import { describe, expect, it } from 'vitest';

import { createInMemoryContext } from '../src/context.js';
import { angularZonelessManual as migration } from '../src/migrations/v9/angular-zoneless-manual.js';

describe('angular-zoneless-manual', () => {
  it('flags an NgModule bootstrap for manual zone-provider migration', () => {
    const ctx = createInMemoryContext({
      'src/main.ts':
        `import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';\n` +
        `platformBrowserDynamic().bootstrapModule(AppModule).catch((e) => console.log(e));\n`,
      'src/polyfills.ts': `import 'zone.js';\n`,
    });

    const findings = migration.detect(ctx);

    expect(findings).toHaveLength(1);
    expect(findings[0].filePath).toBe('src/main.ts');
    expect(findings[0].detail).toContain('applicationProviders');
  });

  it('does not flag an NgModule app that never loaded Zone.js', () => {
    const ctx = createInMemoryContext({
      'src/main.ts':
        `import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';\n` +
        `platformBrowserDynamic().bootstrapModule(AppModule).catch((e) => console.log(e));\n`,
    });

    expect(migration.detect(ctx)).toEqual([]);
  });

  it('does not flag a standalone bootstrap (handled by the auto-fix)', () => {
    const ctx = createInMemoryContext({
      'src/main.ts': `bootstrapApplication(AppComponent, { providers: [] });\n`,
    });

    expect(migration.detect(ctx)).toEqual([]);
  });

  it('is silent when a zone provider is already configured', () => {
    const ctx = createInMemoryContext({
      'src/main.ts':
        `import { provideZoneChangeDetection } from '@angular/core';\n` +
        `platformBrowserDynamic().bootstrapModule(AppModule, {\n` +
        `  applicationProviders: [provideZoneChangeDetection()],\n` +
        `});\n`,
    });

    expect(migration.detect(ctx)).toEqual([]);
  });
});

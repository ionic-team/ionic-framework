import { describe, expect, it } from 'vitest';

import { createInMemoryContext } from '../src/context.js';
import { angularZoneless as migration } from '../src/migrations/v9/angular-zoneless.js';

const STANDALONE_MAIN =
  `import { bootstrapApplication } from '@angular/platform-browser';\n` +
  `import { provideIonicAngular } from '@ionic/angular';\n\n` +
  `bootstrapApplication(AppComponent, {\n` +
  `  providers: [provideIonicAngular()],\n` +
  `});\n`;

/** A polyfills file that loads Zone.js, as every pre-Angular-21 app has. */
const ZONE_POLYFILLS = `import 'zone.js';\n`;

function withMain(text: string) {
  const ctx = createInMemoryContext({ 'src/main.ts': text, 'src/polyfills.ts': ZONE_POLYFILLS });
  const read = () => ctx.project.getSourceFileOrThrow(`${ctx.rootDir}/src/main.ts`).getFullText();
  return { ctx, read };
}

describe('angular-zoneless', () => {
  it('adds provideZoneChangeDetection() to a standalone bootstrap and imports it', () => {
    const { ctx, read } = withMain(STANDALONE_MAIN);

    migration.fix!(ctx);
    const out = read();

    expect(out).toContain('provideZoneChangeDetection()');
    // provider is added to the providers array, ahead of the existing ones
    expect(out).toMatch(/providers:\s*\[\s*provideZoneChangeDetection\(\)/);
    // and imported from @angular/core
    expect(out).toMatch(/import\s*\{[^}]*provideZoneChangeDetection[^}]*\}\s*from\s*['"]@angular\/core['"]/);
    // existing providers are preserved
    expect(out).toContain('provideIonicAngular()');
  });

  it('reports the bootstrap location', () => {
    const { ctx } = withMain(STANDALONE_MAIN);

    const findings = migration.detect(ctx);

    expect(findings).toHaveLength(1);
    expect(findings[0].filePath).toBe('src/main.ts');
    expect(findings[0].detail).toContain('provideZoneChangeDetection');
  });

  it('is a no-op when a zone provider is already present', () => {
    const input = STANDALONE_MAIN.replace('provideIonicAngular()', 'provideZoneChangeDetection(), provideIonicAngular()');
    const { ctx, read } = withMain(input);

    expect(migration.detect(ctx)).toEqual([]);
    migration.fix!(ctx);
    expect(read()).toBe(input);
  });

  it('is a no-op when the app already opted into zoneless', () => {
    const input = STANDALONE_MAIN.replace('provideIonicAngular()', 'provideExperimentalZonelessChangeDetection(), provideIonicAngular()');
    const { ctx } = withMain(input);

    expect(migration.detect(ctx)).toEqual([]);
  });

  it('fixes every standalone bootstrap in a multi-project workspace', () => {
    const ctx = createInMemoryContext({
      'apps/a/src/main.ts': STANDALONE_MAIN,
      'apps/a/src/polyfills.ts': ZONE_POLYFILLS,
      'apps/b/src/main.ts': STANDALONE_MAIN,
      'apps/b/src/polyfills.ts': ZONE_POLYFILLS,
    });

    expect(migration.detect(ctx)).toHaveLength(2);

    migration.fix!(ctx);

    for (const path of ['apps/a/src/main.ts', 'apps/b/src/main.ts']) {
      const out = ctx.project.getSourceFileOrThrow(`${ctx.rootDir}/${path}`).getFullText();
      expect(out).toContain('provideZoneChangeDetection()');
      expect(out).toMatch(/import\s*\{[^}]*provideZoneChangeDetection[^}]*\}\s*from\s*['"]@angular\/core['"]/);
    }
  });

  it('leaves an app that does not load Zone.js alone', () => {
    const ctx = createInMemoryContext({
      'src/main.ts': STANDALONE_MAIN,
      'src/polyfills.ts': `// This app runs zoneless, so Zone.js is not imported here.\n`,
      'angular.json': JSON.stringify({
        projects: { app: { architect: { build: { options: { polyfills: ['src/polyfills.ts'] } } } } },
      }),
    });

    expect(migration.detect(ctx)).toEqual([]);

    migration.fix!(ctx);

    expect(ctx.project.getSourceFileOrThrow(`${ctx.rootDir}/src/main.ts`).getFullText()).toBe(STANDALONE_MAIN);
  });

  it('fixes an app whose Zone.js is loaded by an angular.json polyfills entry', () => {
    // The Angular CLI's current scaffold has no polyfills file: `zone.js` is
    // listed straight in the build options, so no source file imports it.
    const ctx = createInMemoryContext({
      'src/main.ts': STANDALONE_MAIN,
      'angular.json': JSON.stringify({
        projects: { app: { architect: { build: { options: { polyfills: ['zone.js'] } } } } },
      }),
    });

    expect(migration.detect(ctx)).toHaveLength(1);

    migration.fix!(ctx);

    expect(ctx.project.getSourceFileOrThrow(`${ctx.rootDir}/src/main.ts`).getFullText()).toContain(
      'provideZoneChangeDetection()'
    );
  });

  it('does not count a commented-out zone.js import as loading Zone.js', () => {
    // The CLI scaffolds this exact commented line into `environments/environment.ts`,
    // so a text scan would read every zoneless app as a Zone.js app.
    const ctx = createInMemoryContext({
      'src/main.ts': STANDALONE_MAIN,
      'src/environments/environment.ts':
        `// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.\n` +
        `export const environment = { production: false };\n`,
    });

    expect(migration.detect(ctx)).toEqual([]);
  });

  it('matches the indentation of the providers it is inserted in front of', () => {
    const { ctx, read } = withMain(
      `import { bootstrapApplication } from '@angular/platform-browser';\n` +
        `import { provideIonicAngular } from '@ionic/angular';\n\n` +
        `bootstrapApplication(AppComponent, {\n` +
        `  providers: [\n` +
        `    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },\n` +
        `    provideIonicAngular(),\n` +
        `  ],\n` +
        `});\n`
    );

    migration.fix!(ctx);
    const lines = read().split('\n');

    expect(lines).toContain('    provideZoneChangeDetection(),');
    // and the element it was inserted in front of keeps its own indentation
    expect(lines).toContain('    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },');
  });

  it('keeps a single-line providers array on one line', () => {
    const { ctx, read } = withMain(STANDALONE_MAIN);

    migration.fix!(ctx);

    expect(read()).toContain('providers: [provideZoneChangeDetection(), provideIonicAngular()]');
  });

  it('leaves the zoneless app alone in a workspace where a sibling keeps Zone.js', () => {
    const ctx = createInMemoryContext({
      'angular.json': JSON.stringify({
        projects: {
          a: { root: 'apps/a', architect: { build: { options: { polyfills: ['zone.js'] } } } },
          b: { root: 'apps/b', architect: { build: { options: { polyfills: [] } } } },
        },
      }),
      'apps/a/src/main.ts': STANDALONE_MAIN,
      'apps/b/src/main.ts': STANDALONE_MAIN,
    });

    expect(migration.detect(ctx).map((f) => f.filePath)).toEqual(['apps/a/src/main.ts']);

    migration.fix!(ctx);

    const read = (path: string) => ctx.project.getSourceFileOrThrow(`${ctx.rootDir}/${path}`).getFullText();
    expect(read('apps/a/src/main.ts')).toContain('provideZoneChangeDetection()');
    expect(read('apps/b/src/main.ts')).toBe(STANDALONE_MAIN);
  });

  it('scopes a polyfills import to its own project in a workspace', () => {
    const ctx = createInMemoryContext({
      'angular.json': JSON.stringify({
        projects: {
          a: { root: 'apps/a', architect: { build: { options: { polyfills: ['apps/a/src/polyfills.ts'] } } } },
          b: { root: 'apps/b', architect: { build: { options: { polyfills: [] } } } },
        },
      }),
      'apps/a/src/polyfills.ts': ZONE_POLYFILLS,
      'apps/a/src/main.ts': STANDALONE_MAIN,
      'apps/b/src/main.ts': STANDALONE_MAIN,
    });

    expect(migration.detect(ctx).map((f) => f.filePath)).toEqual(['apps/a/src/main.ts']);
  });

  it('does not treat a Zone.js test setup as an app that bootstraps with it', () => {
    const ctx = createInMemoryContext({
      'src/main.ts': STANDALONE_MAIN,
      'src/test.ts': `import 'zone.js/testing';\n`,
      'angular.json': JSON.stringify({
        projects: {
          app: {
            architect: {
              build: { options: { polyfills: ['src/polyfills.ts'] } },
              test: { options: { polyfills: ['zone.js', 'zone.js/testing'] } },
            },
          },
        },
      }),
    });

    expect(migration.detect(ctx)).toEqual([]);
  });

  it('adds the provider to an empty providers array', () => {
    const { ctx, read } = withMain(
      `import { bootstrapApplication } from '@angular/platform-browser';\n` +
        `bootstrapApplication(AppComponent, { providers: [] });\n`
    );

    migration.fix!(ctx);

    expect(read()).toContain('provideZoneChangeDetection()');
  });

  it('reads a project root spelled as "." the same as an empty one', () => {
    const ctx = createInMemoryContext({
      'src/main.ts': STANDALONE_MAIN,
      'angular.json': JSON.stringify({
        projects: { app: { root: '.', architect: { build: { options: { polyfills: ['zone.js'] } } } } },
      }),
    });

    expect(migration.detect(ctx)).toHaveLength(1);
  });

  it('does not read a nested project polyfills as the outer project own', () => {
    const ctx = createInMemoryContext({
      'src/main.ts': STANDALONE_MAIN,
      'angular.json': JSON.stringify({ projects: { app: { root: '' } } }),
      'projects/admin/project.json': JSON.stringify({ targets: { build: { options: { polyfills: [] } } } }),
      'projects/admin/src/polyfills.ts': ZONE_POLYFILLS,
    });

    expect(migration.detect(ctx)).toEqual([]);
  });

  it('ignores a zone.js import outside the polyfills the build loads', () => {
    // A zoneless app can sit in a repo alongside code that still uses Zone.js,
    // and adding the provider on the strength of that would break its bootstrap.
    const ctx = createInMemoryContext({
      'src/main.ts': STANDALONE_MAIN,
      'src/polyfills.ts': `// zoneless\n`,
      'functions/legacy/setup.ts': ZONE_POLYFILLS,
      'angular.json': JSON.stringify({
        projects: { app: { architect: { build: { options: { polyfills: ['src/polyfills.ts'] } } } } },
      }),
    });

    expect(migration.detect(ctx)).toEqual([]);
  });

  it('does not add the provider to a type-only @angular/core import', () => {
    // Extending `import type { ... }` elides the provider at compile time, so the
    // call in the providers array becomes a ReferenceError.
    const { ctx, read } = withMain(
      `import type { Provider } from '@angular/core';\n` +
        `import { bootstrapApplication } from '@angular/platform-browser';\n\n` +
        `bootstrapApplication(AppComponent, { providers: [] });\n`
    );

    migration.fix!(ctx);
    const out = read();

    expect(out).not.toMatch(/import type \{[^}]*provideZoneChangeDetection/);
    expect(out).toMatch(/import \{ provideZoneChangeDetection \} from ['"]@angular\/core['"]/);
  });

  it('ignores NgModule bootstrap (out of scope)', () => {
    const { ctx } = withMain(
      `import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';\n` +
        `platformBrowserDynamic().bootstrapModule(AppModule).catch((e) => console.log(e));\n`
    );

    expect(migration.detect(ctx)).toEqual([]);
  });
});

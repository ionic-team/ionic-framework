import { describe, expect, it } from 'vitest';

import { createInMemoryContext } from '../src/context.js';
import { angularZoneless as migration } from '../src/migrations/v9/angular-zoneless.js';

const STANDALONE_MAIN =
  `import { bootstrapApplication } from '@angular/platform-browser';\n` +
  `import { provideIonicAngular } from '@ionic/angular';\n\n` +
  `bootstrapApplication(AppComponent, {\n` +
  `  providers: [provideIonicAngular()],\n` +
  `});\n`;

function withMain(text: string) {
  const ctx = createInMemoryContext({ 'src/main.ts': text });
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
      'apps/b/src/main.ts': STANDALONE_MAIN,
    });

    expect(migration.detect(ctx)).toHaveLength(2);

    migration.fix!(ctx);

    for (const path of ['apps/a/src/main.ts', 'apps/b/src/main.ts']) {
      const out = ctx.project.getSourceFileOrThrow(`${ctx.rootDir}/${path}`).getFullText();
      expect(out).toContain('provideZoneChangeDetection()');
      expect(out).toMatch(/import\s*\{[^}]*provideZoneChangeDetection[^}]*\}\s*from\s*['"]@angular\/core['"]/);
    }
  });

  it('ignores NgModule bootstrap (out of scope)', () => {
    const { ctx } = withMain(
      `import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';\n` +
        `platformBrowserDynamic().bootstrapModule(AppModule).catch((e) => console.log(e));\n`
    );

    expect(migration.detect(ctx)).toEqual([]);
  });
});

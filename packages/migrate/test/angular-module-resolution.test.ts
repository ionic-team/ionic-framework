import { describe, expect, it } from 'vitest';

import { createInMemoryContext } from '../src/context.js';
import { angularModuleResolution as migration } from '../src/migrations/v9/angular-module-resolution.js';

describe('angular-module-resolution', () => {
  it('switches classic node resolution to bundler', () => {
    const ctx = createInMemoryContext({
      'tsconfig.json': `{\n  "compilerOptions": {\n    "moduleResolution": "node"\n  }\n}\n`,
    });

    migration.fix!(ctx);

    expect(ctx.readFile('tsconfig.json')).toBe(
      `{\n  "compilerOptions": {\n    "moduleResolution": "bundler"\n  }\n}\n`
    );
  });

  it('keeps the JSONC comments Angular generates', () => {
    // Angular's tsconfig.json is commented, so a JSON round trip would strip it.
    const ctx = createInMemoryContext({
      'tsconfig.json':
        `/* To learn more about this file see: https://angular.dev/reference/configs/tsconfig. */\n` +
        `{\n  "compilerOptions": {\n    // Classic resolution\n    "moduleResolution": "node"\n  }\n}\n`,
    });

    migration.fix!(ctx);
    const out = ctx.readFile('tsconfig.json')!;

    expect(out).toContain('To learn more about this file');
    expect(out).toContain('// Classic resolution');
    expect(out).toContain('"moduleResolution": "bundler"');
  });

  it('leaves resolution modes that already understand exports alone', () => {
    for (const mode of ['bundler', 'node16', 'nodenext']) {
      const source = `{ "compilerOptions": { "moduleResolution": "${mode}" } }\n`;
      const ctx = createInMemoryContext({ 'tsconfig.json': source });

      expect(migration.detect(ctx), `${mode} should not be rewritten`).toEqual([]);
      migration.fix!(ctx);
      expect(ctx.readFile('tsconfig.json')).toBe(source);
    }
  });

  it('covers the solution-style tsconfigs Angular splits a workspace across', () => {
    const ctx = createInMemoryContext({
      'tsconfig.json': `{ "compilerOptions": { "moduleResolution": "node" } }\n`,
      'tsconfig.app.json': `{ "compilerOptions": { "moduleResolution": "Node10" } }\n`,
      'projects/admin/tsconfig.spec.json': `{ "compilerOptions": { "moduleResolution": "classic" } }\n`,
    });

    expect(migration.detect(ctx).map((f) => f.filePath).sort()).toEqual([
      'projects/admin/tsconfig.spec.json',
      'tsconfig.app.json',
      'tsconfig.json',
    ]);

    migration.fix!(ctx);

    expect(ctx.readFile('tsconfig.app.json')).toContain('"bundler"');
    expect(ctx.readFile('projects/admin/tsconfig.spec.json')).toContain('"bundler"');
  });

  it('leaves a CommonJS config alone, where bundler resolution is illegal', () => {
    const source = `{\n  "compilerOptions": {\n    "module": "commonjs",\n    "moduleResolution": "node"\n  }\n}\n`;
    const ctx = createInMemoryContext({ 'tsconfig.server.json': source });

    expect(migration.detect(ctx)).toEqual([]);
    migration.fix!(ctx);
    expect(ctx.readFile('tsconfig.server.json')).toBe(source);
  });

  it('leaves a commented-out setting alone', () => {
    // Rewriting a commented-out setting would report work on a correct project.
    const source =
      `{\n  "compilerOptions": {\n    // "moduleResolution": "node",\n    "moduleResolution": "bundler"\n  }\n}\n`;
    const ctx = createInMemoryContext({ 'tsconfig.json': source });

    expect(migration.detect(ctx)).toEqual([]);
    migration.fix!(ctx);
    expect(ctx.readFile('tsconfig.json')).toBe(source);
  });

  it('reports the line the setting is on', () => {
    const ctx = createInMemoryContext({
      'tsconfig.json': `{\n  "compilerOptions": {\n    "strict": true,\n    "moduleResolution": "node"\n  }\n}\n`,
    });

    expect(migration.detect(ctx)).toEqual([
      { filePath: 'tsconfig.json', line: 4, detail: expect.stringContaining('bundler') },
    ]);
  });
});

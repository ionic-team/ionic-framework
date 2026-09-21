import { describe, expect, it } from 'vitest';

import { createInMemoryContext } from '../src/context.js';
import { angularCssTilde as migration } from '../src/migrations/v9/angular-css-tilde.js';

describe('angular-css-tilde', () => {
  it('removes the ~ prefix from an @ionic/angular css import', () => {
    const ctx = createInMemoryContext({
      'src/global.scss': `@import '~@ionic/angular/css/core.css';\n`,
    });

    migration.fix!(ctx);

    expect(ctx.readFile('src/global.scss')).toBe(`@import '@ionic/angular/css/core.css';\n`);
  });

  it('removes the ~ prefix from a plain .css file', () => {
    const ctx = createInMemoryContext({
      'src/global.css': `@import '~@ionic/angular/css/core.css';\n`,
    });

    migration.fix!(ctx);

    expect(ctx.readFile('src/global.css')).toBe(`@import '@ionic/angular/css/core.css';\n`);
  });

  it('removes the ~ prefix from @use and @forward rules', () => {
    const ctx = createInMemoryContext({
      'src/global.scss':
        `@use '~@ionic/angular/css/core.css';\n` + `@forward '~@ionic/angular/css/normalize.css';\n`,
    });

    migration.fix!(ctx);

    expect(ctx.readFile('src/global.scss')).toBe(
      `@use '@ionic/angular/css/core.css';\n` + `@forward '@ionic/angular/css/normalize.css';\n`
    );
  });

  it('leaves non-ionic tilde imports alone', () => {
    const input = `@import '~bootstrap/scss/bootstrap';\n`;
    const ctx = createInMemoryContext({ 'src/global.scss': input });

    migration.fix!(ctx);

    expect(ctx.readFile('src/global.scss')).toBe(input);
    expect(migration.detect(ctx)).toEqual([]);
  });

  it('reports each offending import with its file and line', () => {
    const ctx = createInMemoryContext({
      'src/global.scss':
        `@import '~bootstrap/scss/bootstrap';\n` + `@import '~@ionic/angular/css/core.css';\n`,
    });

    expect(migration.detect(ctx)).toEqual([
      { filePath: 'src/global.scss', line: 2, detail: 'remove `~` prefix from @ionic/angular import' },
    ]);
  });
});

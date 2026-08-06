import { describe, expect, it } from 'vitest';

import { createInMemoryContext } from '../src/context.js';

describe('context.glob', () => {
  it('excludes native (ios/android) and build output directories at the project root', () => {
    const ctx = createInMemoryContext({
      'src/app.js': '1',
      'ios/App/App/public/main.js': '1',
      'android/app/src/main/assets/public/main.js': '1',
      'build/main.js': '1',
    });

    expect(ctx.glob(['**/*.js'])).toEqual(['src/app.js']);
  });

  it('keeps source in folders that merely share a name with a root-only exclude', () => {
    const ctx = createInMemoryContext({
      'src/theme/ios/tokens.js': '1',
      'src/platforms/android/config.js': '1',
      'src/build/helpers.js': '1',
    });

    expect(ctx.glob(['**/*.js']).sort()).toEqual([
      'src/build/helpers.js',
      'src/platforms/android/config.js',
      'src/theme/ios/tokens.js',
    ]);
  });
});

describe('context.touchedFiles', () => {
  it('tracks writeFile edits', () => {
    const ctx = createInMemoryContext({ 'a.scss': 'x' });
    ctx.writeFile('a.scss', 'y');
    expect([...ctx.touchedFiles]).toEqual(['a.scss']);
  });

  it('tracks only the ts-morph source files that changed, on save', () => {
    const ctx = createInMemoryContext({ 'src/a.ts': 'const a = 1;\n', 'src/b.ts': 'const b = 2;\n' });
    ctx.project.getSourceFileOrThrow(`${ctx.rootDir}/src/a.ts`).addStatements('const c = 3;');

    ctx.save();

    expect([...ctx.touchedFiles]).toContain('src/a.ts');
    expect([...ctx.touchedFiles]).not.toContain('src/b.ts');
  });
});

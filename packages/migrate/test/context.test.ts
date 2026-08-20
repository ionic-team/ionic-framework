import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { createDiskContext, createInMemoryContext } from '../src/context.js';

const dirs: string[] = [];

afterEach(() => {
  let dir: string | undefined;
  while ((dir = dirs.pop())) rmSync(dir, { recursive: true, force: true });
});

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

describe('context.requireFromProject', () => {
  it('returns undefined for a package the project does not have installed', () => {
    // Migrations that read a tool's own config (e.g. Angular's browser policy)
    // must degrade to report-only rather than throw on a fresh clone.
    const ctx = createInMemoryContext({ 'package.json': '{}' });

    expect(ctx.requireFromProject('browserslist')).toBeUndefined();
  });

  it('returns undefined rather than throwing on a real project without node_modules', () => {
    // The in-memory stub can't exercise `createRequire`, which is the part that
    // throws, and every migration reading a tool's config depends on it not to.
    const dir = mkdtempSync(join(tmpdir(), 'ionic-migrate-ctx-'));
    dirs.push(dir);
    writeFileSync(join(dir, 'package.json'), '{ "name": "app" }');

    const ctx = createDiskContext(dir);

    expect(ctx.requireFromProject('definitely-not-installed')).toBeUndefined();
    expect(ctx.resolveFromProject('definitely-not-installed')).toBeUndefined();
  });

  it('reads a package hoisted above the project, through the path it resolves to', () => {
    // A workspace installs shared tooling at its root, so the resolved path sits
    // outside the project and cannot be read as a project-relative one.
    const root = mkdtempSync(join(tmpdir(), 'ionic-migrate-ws-'));
    dirs.push(root);
    mkdirSync(join(root, 'node_modules/@angular/build'), { recursive: true });
    writeFileSync(join(root, 'node_modules/@angular/build/package.json'), '{ "name": "@angular/build" }');
    writeFileSync(join(root, 'node_modules/@angular/build/.browserslistrc'), 'Chrome >= 107\n');
    mkdirSync(join(root, 'apps/web'), { recursive: true });
    writeFileSync(join(root, 'apps/web/package.json'), '{ "name": "web" }');

    const ctx = createDiskContext(join(root, 'apps/web'));
    const manifest = ctx.resolveFromProject('@angular/build/package.json');

    expect(manifest).toBeDefined();
    expect(ctx.readFile(`${manifest!.slice(0, manifest!.lastIndexOf('/'))}/.browserslistrc`)).toBe('Chrome >= 107\n');
  });

  it('returns a stubbed package so migrations can be tested without node_modules', () => {
    const ctx = createInMemoryContext({ 'package.json': '{}' }, '/app', { browserslist: () => ['chrome 111'] });

    const browserslist = ctx.requireFromProject<(q: string) => string[]>('browserslist');

    expect(browserslist?.('anything')).toEqual(['chrome 111']);
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

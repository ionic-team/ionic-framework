import { describe, expect, it } from 'vitest';

import { createInMemoryContext } from '../src/context.js';
import { coreBrowserslist as migration } from '../src/migrations/v9/core-browserslist.js';

describe('core-browserslist', () => {
  it('raises a below-floor browser version to the one Ionic 9 supports', () => {
    const ctx = createInMemoryContext({ '.browserslistrc': `Chrome >=79\n` });

    migration.fix!(ctx);

    expect(ctx.readFile('.browserslistrc')).toBe(`Chrome >=89\n`);
  });

  it('raises every stale entry of an Ionic 8 starter browserslist', () => {
    const ctx = createInMemoryContext({
      '.browserslistrc':
        `Chrome >=79\nChromeAndroid >=79\nFirefox >=70\nEdge >=79\nSafari >=14\niOS >=14\n`,
    });

    migration.fix!(ctx);

    expect(ctx.readFile('.browserslistrc')).toBe(
      `Chrome >=89\nChromeAndroid >=89\nFirefox >=75\nEdge >=89\nSafari >=16\niOS >=16\n`
    );
  });

  it('leaves comments, blank lines, and queries it does not own untouched', () => {
    // Overwriting the file would discard the project's own entries.
    const ctx = createInMemoryContext({
      '.browserslistrc': `# Supported browsers\n\nChrome >=79\nnot dead\nlast 2 versions\n`,
    });

    migration.fix!(ctx);

    expect(ctx.readFile('.browserslistrc')).toBe(
      `# Supported browsers\n\nChrome >=89\nnot dead\nlast 2 versions\n`
    );
  });

  it('replaces the whole version, not just its major', () => {
    // `Safari >=15.4` must become `>=16`, not `>=16.4`.
    const ctx = createInMemoryContext({ '.browserslistrc': `Safari >=15.4\nChrome >=88.0.4324\n` });

    migration.fix!(ctx);

    expect(ctx.readFile('.browserslistrc')).toBe(`Safari >=16\nChrome >=89\n`);
  });

  it('reads a file with CRLF line endings', () => {
    const ctx = createInMemoryContext({ '.browserslistrc': `Chrome >=79\r\nSafari >=14\r\n` });

    expect(migration.detect(ctx)).toHaveLength(2);
    migration.fix!(ctx);
    expect(ctx.readFile('.browserslistrc')).toBe(`Chrome >=89\r\nSafari >=16\r\n`);
  });

  it('does not lower a browser already above the floor', () => {
    const source = `Chrome >=100\nSafari >=17\n`;
    const ctx = createInMemoryContext({ '.browserslistrc': source });

    expect(migration.detect(ctx)).toEqual([]);
    migration.fix!(ctx);
    expect(ctx.readFile('.browserslistrc')).toBe(source);
  });

  it('raises a stale entry declared in package.json', () => {
    const ctx = createInMemoryContext({
      'package.json': `${JSON.stringify(
        { name: 'app', devDependencies: { browserslist: '^4.24.0' }, browserslist: ['Chrome >=79', 'Safari >=14'] },
        null,
        2
      )}\n`,
    });

    // located at their own lines, not at the same-named devDependency above them
    expect(migration.detect(ctx).map((f) => `${f.filePath}:${f.line}`)).toEqual(['package.json:7', 'package.json:8']);

    migration.fix!(ctx);

    expect(JSON.parse(ctx.readFile('package.json')!).browserslist).toEqual(['Chrome >=89', 'Safari >=16']);
  });

  it('raises the same entry under two environment keys, reporting each line', () => {
    const ctx = createInMemoryContext({
      'package.json': `${JSON.stringify(
        { name: 'app', browserslist: { production: ['Chrome >=79'], development: ['Chrome >=79'] } },
        null,
        2
      )}\n`,
    });

    expect(migration.detect(ctx).map((f) => f.line)).toEqual([5, 8]);

    migration.fix!(ctx);

    expect(JSON.parse(ctx.readFile('package.json')!).browserslist).toEqual({
      production: ['Chrome >=89'],
      development: ['Chrome >=89'],
    });
  });

  it('raises a workspace app manifest, not just the root one', () => {
    const ctx = createInMemoryContext({
      'package.json': JSON.stringify({ name: 'workspace' }, null, 2),
      'apps/web/package.json': `${JSON.stringify({ name: 'web', browserslist: ['Chrome >=79'] }, null, 2)}\n`,
    });

    expect(migration.detect(ctx).map((f) => f.filePath)).toEqual(['apps/web/package.json']);

    migration.fix!(ctx);

    expect(JSON.parse(ctx.readFile('apps/web/package.json')!).browserslist).toEqual(['Chrome >=89']);
  });

  it('reports the file and line of each stale entry', () => {
    const ctx = createInMemoryContext({ '.browserslistrc': `# browsers\nChrome >=79\nSafari >=14\n` });

    expect(migration.detect(ctx).map((f) => `${f.filePath}:${f.line}`)).toEqual([
      '.browserslistrc:2',
      '.browserslistrc:3',
    ]);
  });
});

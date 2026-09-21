import { describe, expect, it } from 'vitest';

import { createInMemoryContext } from '../src/context.js';
import { coreBrowserslistManual as migration } from '../src/migrations/v9/core-browserslist-manual.js';

describe('core-browserslist-manual', () => {
  it('reports a browser missing from an otherwise-named list', () => {
    // The guide's block lists six browsers; a list naming five silently drops one.
    const ctx = createInMemoryContext({
      '.browserslistrc': `Chrome >=107\nFirefox >=106\nEdge >=107\nSafari >=16.1\niOS >=16.1\n`,
    });

    const findings = migration.detect(ctx);

    expect(findings).toHaveLength(1);
    expect(findings[0].filePath).toBe('.browserslistrc');
    expect(findings[0].detail).toContain('ChromeAndroid >=89');
  });

  it('treats a list split across a file and the manifest as one list', () => {
    const ctx = createInMemoryContext({
      '.browserslistrc': `Chrome >=107\nChromeAndroid >=107\nEdge >=107\n`,
      'package.json': `${JSON.stringify(
        { name: 'app', browserslist: ['Firefox >=106', 'Safari >=16.1', 'iOS >=16.1'] },
        null,
        2
      )}\n`,
    });

    expect(migration.detect(ctx)).toEqual([]);
  });

  it('reports against the manifest when that is where the list lives', () => {
    const ctx = createInMemoryContext({
      'package.json': `${JSON.stringify({ name: 'app', browserslist: ['Chrome >=107'] }, null, 2)}\n`,
    });

    const findings = migration.detect(ctx);

    expect(findings).toHaveLength(1);
    expect(findings[0].filePath).toBe('package.json');
    expect(findings[0].line).toBe(3);
  });

  it('does not report missing browsers for a list of browsers Ionic does not name', () => {
    const ctx = createInMemoryContext({ '.browserslistrc': `Samsung >=15\nOpera >=90\n` });

    expect(migration.detect(ctx)).toEqual([]);
  });

  it('does not report missing browsers for a query-style list', () => {
    const ctx = createInMemoryContext({ '.browserslistrc': `last 2 versions\nnot dead\n` });

    expect(migration.detect(ctx)).toEqual([]);
  });
});

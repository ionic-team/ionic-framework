import { describe, expect, it } from 'vitest';

import { createInMemoryContext } from '../src/context.js';
import { coreAutocorrectManual as migration } from '../src/migrations/v9/core-autocorrect-manual.js';
import { DETAIL, ON_DETAIL } from '../src/migrations/v9/core-autocorrect.js';
import { V9_DOCS } from '../src/migrations/v9/docs.js';

describe('core-autocorrect-manual (report-only)', () => {
  it('reports an ion-input in an Angular inline template', () => {
    const ctx = createInMemoryContext({
      'home.page.ts':
        `import { Component } from '@angular/core';\n` +
        `@Component({ template: '<ion-input autocorrect="off"></ion-input>' })\n` +
        `export class HomePage {}\n`,
    });

    const findings = migration.detect(ctx);

    expect(findings).toHaveLength(1);
    expect(findings[0].filePath).toBe('home.page.ts');
    expect(findings[0].line).toBe(2);
  });

  it('anchors a searchbar finding at the searchbar section, not the input one', () => {
    // The Pascal spelling specifically: this path only reaches `#searchbar`
    // because `findOpeningTags` lower-cases tag names. If that stopped, the
    // finding would fall through to `#input` silently.
    const ctx = createInMemoryContext({
      'App.jsx': `const a = <IonSearchbar autocorrect="off" />;\n`,
    });

    expect(migration.detect(ctx).map((f) => f.docsUrl)).toEqual([`${V9_DOCS}#searchbar`]);
  });

  it('reports a React <IonInput> in a .jsx file (never loaded into ts-morph)', () => {
    const ctx = createInMemoryContext({ 'App.jsx': `const a = <IonInput autocorrect="off" />;\n` });

    const findings = migration.detect(ctx);

    expect(findings).toHaveLength(1);
    expect(findings[0].filePath).toBe('App.jsx');
  });

  it('is report-only: it exposes no fix', () => {
    expect(migration.fix).toBeUndefined();
  });

  it('leaves .tsx to core-autocorrect (excluded here to avoid double-reporting)', () => {
    const ctx = createInMemoryContext({ 'App.tsx': `const a = <IonInput autocorrect="off" />;\n` });

    expect(migration.detect(ctx)).toEqual([]);
  });

  it('reports autocorrect="on" for manual conversion to a boolean binding', () => {
    const ctx = createInMemoryContext({
      'a.ts': `const t = '<ion-input autocorrect="on"></ion-input>';\n`,
      'b.jsx': `const a = <IonInput autocorrect="on" />;\n`,
    });

    const findings = migration.detect(ctx);

    expect(findings.map((f) => f.filePath).sort()).toEqual(['a.ts', 'b.jsx']);
    expect(findings.every((f) => f.detail === ON_DETAIL)).toBe(true);
  });

  it('ignores native inputs', () => {
    const ctx = createInMemoryContext({ 'b.jsx': `const a = <input autocorrect="off" />;\n` });

    expect(migration.detect(ctx)).toEqual([]);
  });

  it('reports autocorrect="off" with the removal detail', () => {
    const ctx = createInMemoryContext({ 'App.jsx': `const a = <IonInput autocorrect="off" />;\n` });

    expect(migration.detect(ctx)[0].detail).toBe(DETAIL);
  });
});

import { describe, expect, it } from 'vitest';

import { createInMemoryContext } from '../src/context.js';
import { coreFormStructure as migration } from '../src/migrations/v9/core-form-structure.js';
import { V9_DOCS } from '../src/migrations/v9/docs.js';

describe('core-form-structure', () => {
  it('flags a textarea selector whose wrapper no longer exists', () => {
    const ctx = createInMemoryContext({
      'styles.scss': `ion-textarea .textarea-wrapper-inner .native-wrapper {\n  color: red;\n}\n`,
    });

    const findings = migration.detect(ctx);

    expect(findings).toHaveLength(1);
    expect(findings[0].detail).toContain('.textarea-control');
    expect(findings[0].docsUrl).toBe(`${V9_DOCS}#textarea-internal-dom-structure-changes`);
  });

  it('flags the renamed textarea slot wrappers', () => {
    const ctx = createInMemoryContext({
      'styles.css': `.start-slot-wrapper { margin: 0; }\n.end-slot-wrapper { margin: 0; }\n`,
    });

    const details = migration.detect(ctx).map((f) => f.detail);

    expect(details).toHaveLength(2);
    expect(details[0]).toContain('.textarea-start');
    expect(details[1]).toContain('.textarea-end');
  });

  it('flags the select part that was removed outright', () => {
    const ctx = createInMemoryContext({
      'styles.css': `ion-select::part(inner) {\n  padding: 0;\n}\n`,
    });

    const findings = migration.detect(ctx);

    expect(findings).toHaveLength(1);
    expect(findings[0].detail).toContain('removed');
    expect(findings[0].docsUrl).toBe(`${V9_DOCS}#select-internal-dom-structure-changes`);
  });

  it('flags an input selector that relies on the old wrapper nesting', () => {
    const ctx = createInMemoryContext({
      'styles.css': `ion-input .input-wrapper .native-wrapper { border: 0; }\n`,
    });

    const findings = migration.detect(ctx);

    expect(findings).toHaveLength(1);
    expect(findings[0].detail).toContain('.input-control');
    expect(findings[0].docsUrl).toBe(`${V9_DOCS}#input-internal-dom-structure-changes`);
  });

  it('gives the slot answer for the guide\'s own example selector', () => {
    // The guide maps this exact selector to `.input-start [slot="start"]`. The
    // broader wrapper rule also matches it, so the slot rules have to win or
    // the developer is sent to `.input-control`, which still won't match.
    const ctx = createInMemoryContext({
      'styles.css': `ion-input .input-wrapper .native-wrapper [slot="start"] { color: red; }\n`,
    });

    const findings = migration.detect(ctx);

    expect(findings).toHaveLength(1);
    expect(findings[0].detail).toContain('.input-start');
  });

  it('flags slotted content that moved out of the native wrapper', () => {
    const ctx = createInMemoryContext({
      'styles.css': `ion-input .native-wrapper [slot="start"] { color: red; }\n`,
    });

    expect(migration.detect(ctx)).toHaveLength(1);
  });

  it('flags the label wrapper, which moved on all three components', () => {
    const ctx = createInMemoryContext({
      'styles.css': `ion-input .input-wrapper .label-text-wrapper { color: red; }\n`,
    });

    expect(migration.detect(ctx)).toHaveLength(1);
  });

  it('leaves class names that still exist in v9 alone', () => {
    const ctx = createInMemoryContext({
      'styles.css': `ion-input .native-wrapper { color: red; }\nion-input .input-wrapper { color: blue; }\n`,
    });

    expect(migration.detect(ctx)).toEqual([]);
  });
});

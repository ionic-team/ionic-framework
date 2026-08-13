import { describe, expect, it } from 'vitest';

import { createInMemoryContext } from '../src/context.js';
import { coreTextareaHeight } from '../src/migrations/v9/core-textarea-height.js';
import { V9_DOCS } from '../src/migrations/v9/docs.js';

describe('core-textarea-height', () => {
  it('flags styling built on the old Material Design textarea height', () => {
    const ctx = createInMemoryContext({
      'styles.scss': `ion-textarea {\n  min-height: 56px;\n}\n`,
    });

    const findings = coreTextareaHeight.detect(ctx);

    expect(findings).toHaveLength(1);
    expect(findings[0].detail).toContain('72px');
    // One breaking change, so the link lives on the migration, not each finding.
    expect(coreTextareaHeight.docsUrl).toBe(`${V9_DOCS}#minimum-height-change`);
  });

  it('does not flag a 56px value in a file with no textarea styling', () => {
    const ctx = createInMemoryContext({ 'styles.css': `ion-button { height: 56px; }\n` });

    expect(coreTextareaHeight.detect(ctx)).toEqual([]);
  });
});

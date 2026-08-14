import { describe, expect, it } from 'vitest';

import { createInMemoryContext } from '../src/context.js';
import { angularTypescript } from '../src/migrations/v9/angular-typescript.js';

describe('angular-typescript', () => {
  it('raises TypeScript to the 5.4 floor Ionic 9 requires', () => {
    // Tilde, not caret: `^5.4.0` resolves to 5.9.x, which Angular 18 rejects.
    const ctx = createInMemoryContext({
      'package.json': JSON.stringify({ devDependencies: { typescript: '~5.2.0' } }, null, 2),
    });

    angularTypescript.fix!(ctx);

    expect(JSON.parse(ctx.readFile('package.json')!).devDependencies.typescript).toBe('~5.4.0');
  });

  it('leaves a pin a later Angular requires alone', () => {
    const ctx = createInMemoryContext({
      'package.json': JSON.stringify({ devDependencies: { typescript: '~5.8.2' } }, null, 2),
    });

    expect(angularTypescript.detect(ctx)).toEqual([]);
  });

  it('does not downgrade a TypeScript pin already above the floor', () => {
    const ctx = createInMemoryContext({
      'package.json': JSON.stringify({ devDependencies: { typescript: '~5.9.2' } }, null, 2),
    });

    expect(angularTypescript.detect(ctx)).toEqual([]);
  });
});

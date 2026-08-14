import { describe, expect, it } from 'vitest';

import { createInMemoryContext } from '../src/context.js';
import { coreCapacitor } from '../src/migrations/v9/core-capacitor.js';

describe('core-capacitor', () => {
  it('flags Capacitor 2, which no longer reports as a native platform', () => {
    const ctx = createInMemoryContext({
      'package.json': JSON.stringify({ dependencies: { '@capacitor/core': '^2.4.0' } }, null, 2),
    });

    const findings = coreCapacitor.detect(ctx);

    expect(findings).toHaveLength(1);
    expect(findings[0].detail).toContain('Capacitor 2');
  });

  it('says nothing about a supported Capacitor', () => {
    const ctx = createInMemoryContext({
      'package.json': JSON.stringify({ dependencies: { '@capacitor/core': '^7.0.0' } }, null, 2),
    });

    expect(coreCapacitor.detect(ctx)).toEqual([]);
  });

  it('says nothing when the app does not use Capacitor at all', () => {
    const ctx = createInMemoryContext({
      'package.json': JSON.stringify({ dependencies: { '@ionic/core': '^8.0.0' } }, null, 2),
    });

    expect(coreCapacitor.detect(ctx)).toEqual([]);
  });
});

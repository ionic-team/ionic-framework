import { describe, expect, it } from 'vitest';

import { createInMemoryContext } from '../src/context.js';
import { coreFloatingLabel as migration } from '../src/migrations/v9/core-floating-label.js';
import { V9_DOCS } from '../src/migrations/v9/docs.js';

describe('core-floating-label', () => {
  it('flags a floating label on an input that has slotted content', () => {
    const ctx = createInMemoryContext({
      'home.page.html':
        `<ion-input label="Name" label-placement="floating">\n` +
        `  <ion-icon slot="start" name="person"></ion-icon>\n` +
        `</ion-input>\n`,
    });

    const findings = migration.detect(ctx);

    expect(findings).toHaveLength(1);
    expect(findings[0].docsUrl).toBe(`${V9_DOCS}#input-floating-label-behavior`);
  });

  it('stays quiet on a floating label with no slotted content', () => {
    const ctx = createInMemoryContext({
      'home.page.html': `<ion-input label="Name" label-placement="floating"></ion-input>\n`,
    });

    expect(migration.detect(ctx)).toEqual([]);
  });

  it('stays quiet on slotted content with a non-floating label', () => {
    const ctx = createInMemoryContext({
      'home.page.html':
        `<ion-input label="Name" label-placement="stacked">\n` +
        `  <ion-icon slot="start" name="person"></ion-icon>\n` +
        `</ion-input>\n`,
    });

    expect(migration.detect(ctx)).toEqual([]);
  });

  it('links each component to its own section of the guide', () => {
    const ctx = createInMemoryContext({
      'page.html':
        `<ion-textarea label-placement="floating"><span slot="end">x</span></ion-textarea>\n` +
        `<ion-select label-placement="floating"><span slot="start">x</span></ion-select>\n`,
    });

    expect(migration.detect(ctx).map((f) => f.docsUrl)).toEqual([
      `${V9_DOCS}#textarea-floating-label-behavior`,
      `${V9_DOCS}#select-floating-label-behavior`,
    ]);
  });

  it('flags a floating select placeholder, which now shows only on focus', () => {
    // The guide adds this to the select section without the slotted-content
    // condition, so the slot gate would miss it entirely.
    const ctx = createInMemoryContext({
      'page.html': `<ion-select label-placement="floating" placeholder="Choose"></ion-select>\n`,
    });

    const findings = migration.detect(ctx);

    expect(findings).toHaveLength(1);
    expect(findings[0].detail).toContain('placeholder');
  });

  it('reads a Vue binding and a React prop, not just the plain attribute', () => {
    const ctx = createInMemoryContext({
      'Page.vue': `<ion-input :label-placement="'floating'"><i slot="start" /></ion-input>\n`,
      'App.tsx': `const a = <IonInput labelPlacement="floating"><i slot="start" /></IonInput>;\n`,
    });

    expect(migration.detect(ctx)).toHaveLength(2);
  });
});

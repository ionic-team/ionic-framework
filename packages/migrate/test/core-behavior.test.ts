import { describe, expect, it } from 'vitest';

import { createInMemoryContext } from '../src/context.js';
import { coreModalHandle } from '../src/migrations/v9/core-modal-handle.js';
import { coreSelectEvents } from '../src/migrations/v9/core-select-events.js';
import { coreSwipeBackConfig } from '../src/migrations/v9/core-swipe-back-config.js';
import { V9_DOCS } from '../src/migrations/v9/docs.js';

describe('core-modal-handle', () => {
  it('flags a sheet modal that never opted into a handle behavior', () => {
    const ctx = createInMemoryContext({
      'home.page.html': `<ion-modal [breakpoints]="[0, 0.5, 1]" [initialBreakpoint]="0.5"></ion-modal>\n`,
    });

    const findings = coreModalHandle.detect(ctx);

    expect(findings).toHaveLength(1);
    expect(findings[0].detail).toContain('handle-behavior="none"');
  });

  it('stays quiet once handleBehavior is set either way', () => {
    const ctx = createInMemoryContext({
      'a.html': `<ion-modal [breakpoints]="[0, 1]" handle-behavior="none"></ion-modal>\n`,
      'b.tsx': `const m = <IonModal breakpoints={[0, 1]} handleBehavior="cycle" />;\n`,
    });

    expect(coreModalHandle.detect(ctx)).toEqual([]);
  });

  it('stays quiet when handleBehavior is set elsewhere in a multi-line options object', () => {
    // Prettier splits the create() call, so the opt-out is not on the same line.
    const ctx = createInMemoryContext({
      'page.ts':
        `const modal = await modalController.create({\n` +
        `  component: Page,\n` +
        `  initialBreakpoint: 0.5,\n` +
        `  handleBehavior: 'none',\n` +
        `});\n`,
    });

    expect(coreModalHandle.detect(ctx)).toEqual([]);
  });

  it('still flags a second sheet in a file where another one opts out', () => {
    // One inert sheet must not silence the others beside it.
    const ctx = createInMemoryContext({
      'page.ts':
        `export const inert = () =>\n` +
        `  modalController.create({ initialBreakpoint: 0.5, handleBehavior: 'none' });\n` +
        `export const cycling = () =>\n` +
        `  modalController.create({ initialBreakpoint: 0.25 });\n`,
    });

    expect(coreModalHandle.detect(ctx)).toHaveLength(1);
  });

  it('keeps a Vue template opt-out out of its own script block', () => {
    const ctx = createInMemoryContext({
      'Page.vue':
        `<template>\n` +
        `  <ion-modal :initial-breakpoint="0.5" handle-behavior="none"></ion-modal>\n` +
        `</template>\n` +
        `<script setup>\n` +
        `const m = await modalController.create({ initialBreakpoint: 0.5 });\n` +
        `</script>\n`,
    });

    expect(coreModalHandle.detect(ctx)).toHaveLength(1);
  });

  it('stays quiet on a modal that is not a sheet', () => {
    const ctx = createInMemoryContext({ 'a.html': `<ion-modal trigger="open"></ion-modal>\n` });

    expect(coreModalHandle.detect(ctx)).toEqual([]);
  });

  it('flags a sheet built through the modal controller', () => {
    const ctx = createInMemoryContext({
      'page.ts': `const modal = await modalController.create({ component: Page, initialBreakpoint: 0.5 });\n`,
      'Page.tsx': `const [present] = useIonModal(Body, { initialBreakpoint: 0.5 });\n`,
    });

    expect(coreModalHandle.detect(ctx)).toHaveLength(2);
  });

  it('flags a sheet created from a Vue script block', () => {
    const ctx = createInMemoryContext({
      'Page.vue': `<script setup>\nconst m = await modalController.create({ initialBreakpoint: 0.5 });\n</script>\n`,
    });

    expect(coreModalHandle.detect(ctx)).toHaveLength(1);
  });

  it('reports a JSX sheet once, not twice for the same element', () => {
    // The element scan already covers .tsx, so the options-object scan must not
    // match a JSX prop as well.
    const ctx = createInMemoryContext({
      'Page.tsx': `const m = <IonModal initialBreakpoint={0.5} breakpoints={[0, 1]} />;\n`,
    });

    expect(coreModalHandle.detect(ctx)).toHaveLength(1);
  });
});

describe('core-select-events', () => {
  it('flags an ionChange handler on a select, which no longer fires on every confirm', () => {
    const ctx = createInMemoryContext({
      'home.page.html': `<ion-select (ionChange)="onChange($event)"></ion-select>\n`,
    });

    const findings = coreSelectEvents.detect(ctx);

    expect(findings).toHaveLength(1);
    expect(findings[0].docsUrl).toBe(`${V9_DOCS}#ionchange-only-fires-when-the-value-changes`);
  });

  it('reads the React and Vue spellings of the handler', () => {
    const ctx = createInMemoryContext({
      'App.tsx': `const a = <IonSelect onIonChange={onChange} />;\n`,
      'Page.vue': `<ion-select @ionChange="onChange" />\n`,
    });

    expect(coreSelectEvents.detect(ctx)).toHaveLength(2);
  });

  it('reads a JavaScript React app, which has no ts-morph coverage', () => {
    const ctx = createInMemoryContext({
      'App.jsx': `const a = <IonSelect onIonChange={onChange} />;\n`,
    });

    expect(coreSelectEvents.detect(ctx)).toHaveLength(1);
  });

  it('does not flag ionChange on other components', () => {
    const ctx = createInMemoryContext({
      'home.page.html': `<ion-input (ionChange)="onChange($event)"></ion-input>\n`,
    });

    expect(coreSelectEvents.detect(ctx)).toEqual([]);
  });

  it('flags reading the action sheet dismiss role, which no longer says selected', () => {
    const ctx = createInMemoryContext({
      'page.ts':
        `const sel = document.querySelector('ion-select');\n` +
        `el.addEventListener('ionActionSheetDidDismiss', (e) => console.log(e.detail.role));\n`,
    });

    const findings = coreSelectEvents.detect(ctx);

    expect(findings).toHaveLength(1);
    expect(findings[0].docsUrl).toBe(`${V9_DOCS}#action-sheet-interface-selected-role-removed`);
  });

  it('leaves an app\'s own action sheet alone, which the change never touched', () => {
    const ctx = createInMemoryContext({
      'page.ts':
        `const sheet = await actionSheetController.create({ buttons });\n` +
        `sheet.addEventListener('ionActionSheetDidDismiss', (e) => console.log(e.detail.role));\n`,
    });

    expect(coreSelectEvents.detect(ctx)).toEqual([]);
  });
});

describe('core-swipe-back-config', () => {
  it('flags the swipeBackEnabled config, now read once at outlet mount', () => {
    const ctx = createInMemoryContext({
      'main.tsx': `setupIonicReact({ swipeBackEnabled: someCondition });\n`,
    });

    const findings = coreSwipeBackConfig.detect(ctx);

    expect(findings).toHaveLength(1);
    expect(findings[0].detail).toContain('swipeGesture');
  });

  it('stays quiet when the config is not used', () => {
    const ctx = createInMemoryContext({ 'main.tsx': `setupIonicReact({ mode: 'ios' });\n` });

    expect(coreSwipeBackConfig.detect(ctx)).toEqual([]);
  });
});

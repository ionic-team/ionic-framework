import { describe, expect, it } from 'vitest';

import { createInMemoryContext } from '../src/context.js';
import { coreAutocorrect as migration, ON_DETAIL } from '../src/migrations/v9/core-autocorrect.js';
import { V9_DOCS } from '../src/migrations/v9/docs.js';

describe('core-autocorrect', () => {
  it('removes autocorrect="off" from an ion-input in an html template', () => {
    const ctx = createInMemoryContext({ 'home.page.html': `<ion-input autocorrect="off"></ion-input>\n` });

    migration.fix!(ctx);

    expect(ctx.readFile('home.page.html')).toBe(`<ion-input></ion-input>\n`);
  });

  it('removes it from an ion-searchbar in a Vue SFC', () => {
    const ctx = createInMemoryContext({
      'Page.vue': `<template>\n  <ion-searchbar autocorrect="off" />\n</template>\n`,
    });

    migration.fix!(ctx);

    expect(ctx.readFile('Page.vue')).toBe(`<template>\n  <ion-searchbar />\n</template>\n`);
  });

  it('removes it from a React <IonInput> via ts-morph', () => {
    const ctx = createInMemoryContext({ 'App.tsx': `const a = <IonInput autocorrect="off" />;\n` });

    migration.fix!(ctx);

    expect(ctx.project.getSourceFileOrThrow(`${ctx.rootDir}/App.tsx`).getFullText()).toBe(
      `const a = <IonInput />;\n`
    );
  });

  it('links each finding to the section for its own component', () => {
    const ctx = createInMemoryContext({
      'page.html': `<ion-input autocorrect="off"></ion-input>\n<ion-searchbar autocorrect="off"></ion-searchbar>\n`,
      'App.tsx': `const a = <IonSearchbar autocorrect="off" />;\n`,
    });

    const anchors = migration.detect(ctx).map((f) => `${f.filePath}:${f.line} ${f.docsUrl}`);

    expect(anchors).toEqual([
      `page.html:1 ${V9_DOCS}#input`,
      `page.html:2 ${V9_DOCS}#searchbar`,
      `App.tsx:1 ${V9_DOCS}#searchbar`,
    ]);
  });

  it('leaves a native <input autocorrect="off"> untouched', () => {
    const input = `<input autocorrect="off" />\n`;
    const ctx = createInMemoryContext({ 'index.html': input });

    expect(migration.detect(ctx)).toEqual([]);
    migration.fix!(ctx);
    expect(ctx.readFile('index.html')).toBe(input);
  });

  it('leaves autocorrect="on" in a vanilla .html untouched (no binding syntax)', () => {
    // No package.json means no Angular is detected, so this .html reads as a
    // vanilla template with no property-binding syntax. "on" already coerces to
    // true in v9, so there is nothing safe to rewrite.
    const input = `<ion-input autocorrect="on"></ion-input>\n`;
    const ctx = createInMemoryContext({ 'index.html': input });

    expect(migration.detect(ctx)).toEqual([]);
    migration.fix!(ctx);
    expect(ctx.readFile('index.html')).toBe(input);
  });

  it('rewrites autocorrect="on" to [autocorrect]="true" in an Angular .html template', () => {
    const ctx = createInMemoryContext({
      'package.json': JSON.stringify({ dependencies: { '@ionic/angular': '^8.0.0' } }),
      'home.page.html': `<ion-input autocorrect="on"></ion-input>\n`,
    });

    expect(migration.detect(ctx)).toEqual([
      { filePath: 'home.page.html', line: 1, detail: ON_DETAIL, docsUrl: `${V9_DOCS}#input` },
    ]);
    migration.fix!(ctx);

    expect(ctx.readFile('home.page.html')).toBe(`<ion-input [autocorrect]="true"></ion-input>\n`);
  });

  it('rewrites autocorrect="on" to :autocorrect="true" in a Vue SFC', () => {
    const ctx = createInMemoryContext({
      'Page.vue': `<template>\n  <ion-searchbar autocorrect="on" />\n</template>\n`,
    });

    migration.fix!(ctx);

    expect(ctx.readFile('Page.vue')).toBe(`<template>\n  <ion-searchbar :autocorrect="true" />\n</template>\n`);
  });

  it('rewrites autocorrect="on" to autocorrect={true} in a React <IonInput> via ts-morph', () => {
    const ctx = createInMemoryContext({ 'App.tsx': `const a = <IonInput autocorrect="on" />;\n` });

    migration.fix!(ctx);

    expect(ctx.project.getSourceFileOrThrow(`${ctx.rootDir}/App.tsx`).getFullText()).toBe(
      `const a = <IonInput autocorrect={true} />;\n`
    );
  });

  it('does not break on a `>` inside an attribute value', () => {
    const ctx = createInMemoryContext({
      'home.page.html': `<ion-input [disabled]="a > b" autocorrect="off"></ion-input>\n`,
    });

    migration.fix!(ctx);

    expect(ctx.readFile('home.page.html')).toBe(`<ion-input [disabled]="a > b"></ion-input>\n`);
  });

  it('reports each occurrence with its location', () => {
    const ctx = createInMemoryContext({
      'home.page.html': `<div>\n  <ion-input autocorrect="off"></ion-input>\n</div>\n`,
    });

    const findings = migration.detect(ctx);

    expect(findings).toHaveLength(1);
    expect(findings[0].filePath).toBe('home.page.html');
    expect(findings[0].line).toBe(2);
  });

  it('ignores autocorrect="off" on JSX nested inside an attribute expression', () => {
    // The autocorrect here is on a nested <Foo> reached only through an attribute
    // expression of the in-scope IonInput; only the element's own attrs count.
    const input = `const a = <IonInput helper={<Foo autocorrect="off" />} />;\n`;
    const ctx = createInMemoryContext({ 'App.tsx': input });

    expect(migration.detect(ctx)).toEqual([]);
    migration.fix!(ctx);
    expect(ctx.project.getSourceFileOrThrow(`${ctx.rootDir}/App.tsx`).getFullText()).toBe(input);
  });

  it('is idempotent: a second run makes no further change', () => {
    const ctx = createInMemoryContext({ 'home.page.html': `<ion-input autocorrect="off"></ion-input>\n` });

    migration.fix!(ctx);
    const afterFirst = ctx.readFile('home.page.html');
    expect(migration.detect(ctx)).toEqual([]);
    migration.fix!(ctx);

    expect(ctx.readFile('home.page.html')).toBe(afterFirst);
  });
});

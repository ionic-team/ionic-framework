import { describe, expect, it } from 'vitest';

import { createInMemoryContext } from '../src/context.js';
import { selectMigrations } from '../src/registry.js';
import { allMigrations } from '../src/migrations/index.js';
import { reactTypescript } from '../src/migrations/v9/react-typescript.js';

describe('react-typescript', () => {
  it('raises TypeScript to the 5.4 floor @ionic/react requires', () => {
    const ctx = createInMemoryContext({
      'package.json': JSON.stringify({ devDependencies: { typescript: '^4.9.5' } }, null, 2),
    });

    reactTypescript.fix!(ctx);

    expect(JSON.parse(ctx.readFile('package.json')!).devDependencies.typescript).toBe('^5.4.0');
  });

  it('raises a pin declared in dependencies rather than devDependencies', () => {
    const ctx = createInMemoryContext({
      'package.json': JSON.stringify({ dependencies: { typescript: '~5.0.4' } }, null, 2),
    });

    reactTypescript.fix!(ctx);

    expect(JSON.parse(ctx.readFile('package.json')!).dependencies.typescript).toBe('^5.4.0');
  });

  it('does not downgrade a pin already above the floor', () => {
    const ctx = createInMemoryContext({
      'package.json': JSON.stringify({ devDependencies: { typescript: '^5.9.2' } }, null, 2),
    });

    expect(reactTypescript.detect(ctx)).toEqual([]);
  });

  it('leaves a TypeScript 6 pin alone', () => {
    // The caret target is a floor, not a ceiling, so a later major stays put.
    const ctx = createInMemoryContext({
      'package.json': JSON.stringify({ devDependencies: { typescript: '^6.0.0' } }, null, 2),
    });

    expect(reactTypescript.detect(ctx)).toEqual([]);
  });

  it('adds nothing to a project that does not use TypeScript', () => {
    const ctx = createInMemoryContext({
      'package.json': JSON.stringify({ dependencies: { react: '^18.0.0' } }, null, 2),
    });

    reactTypescript.fix!(ctx);
    const pkg = JSON.parse(ctx.readFile('package.json')!);

    expect(reactTypescript.detect(ctx)).toEqual([]);
    expect(pkg.devDependencies?.typescript).toBeUndefined();
    expect(pkg.dependencies.typescript).toBeUndefined();
  });

  it('leaves a range it cannot parse alone', () => {
    const ctx = createInMemoryContext({
      'package.json': JSON.stringify({ devDependencies: { typescript: 'catalog:' } }, null, 2),
    });

    expect(reactTypescript.detect(ctx)).toEqual([]);
  });

  it('reports the change it would make', () => {
    const ctx = createInMemoryContext({
      'package.json': JSON.stringify({ devDependencies: { typescript: '^4.9.5' } }, null, 2),
    });

    expect(reactTypescript.detect(ctx)).toEqual([
      { filePath: 'package.json', line: 1, detail: 'set typescript to ^5.4.0' },
    ]);
  });

  it('is selected for a React project and not an Angular one', () => {
    const selectedFor = (framework: 'react' | 'angular') =>
      selectMigrations(allMigrations, { fromMajor: 8, toMajor: 9, frameworks: [framework] }).map((m) => m.id);

    expect(selectedFor('react')).toContain('react-typescript');
    expect(selectedFor('angular')).not.toContain('react-typescript');
  });
});

import { describe, expect, it } from 'vitest';

import { createInMemoryContext } from '../src/context.js';
import { detectFrameworks, parseMajor } from '../src/detect.js';
import { resolveTarget, selectMigrations } from '../src/registry.js';
import { allMigrations } from '../src/migrations/index.js';
import { run } from '../src/runner.js';
import { buildReport } from '../src/report.js';
import type { Migration } from '../src/types.js';

/** Minimal migration factory for engine tests (behavior is irrelevant here). */
function fakeMigration(over: Partial<Migration> & Pick<Migration, 'id'>): Migration {
  return {
    framework: 'core',
    fromMajor: 8,
    toMajor: 9,
    status: 'stable',
    docsUrl: 'https://example.test',
    detect: () => [],
    ...over,
  };
}

describe('detectFrameworks', () => {
  it('reads the installed Ionic framework and major from package.json', () => {
    const ctx = createInMemoryContext({
      'package.json': JSON.stringify({ dependencies: { '@ionic/angular': '^8.4.1' } }),
    });

    expect(detectFrameworks(ctx)).toEqual([{ framework: 'angular', major: 8 }]);
  });

  it('detects multiple bindings across dependencies and devDependencies', () => {
    const ctx = createInMemoryContext({
      'package.json': JSON.stringify({
        dependencies: { '@ionic/react': '8.0.0' },
        devDependencies: { '@ionic/vue': '~8.2.0' },
      }),
    });

    expect(detectFrameworks(ctx)).toEqual([
      { framework: 'react', major: 8 },
      { framework: 'vue', major: 8 },
    ]);
  });

  it('parses the major from assorted range syntaxes', () => {
    expect(parseMajor('^8.4.1')).toBe(8);
    expect(parseMajor('9.0.0-rc.1')).toBe(9);
    expect(parseMajor(undefined)).toBeUndefined();
  });

  it('treats a project already on v9 as major 9, closing the re-run gate', () => {
    // Single-shot transforms corrupt already-migrated code, so a second run
    // must select nothing.
    const ctx = createInMemoryContext({
      'package.json': JSON.stringify({ dependencies: { '@ionic/angular': '^9.0.0' } }),
    });

    expect(detectFrameworks(ctx)).toEqual([{ framework: 'angular', major: 9 }]);
  });

  it('skips a protocol/alias dependency range it cannot bump or gate', () => {
    // angular-deps won't rewrite an `npm:`/`workspace:` range, so detecting it
    // as v8 would leave the re-run gate open and let single-shot migrations
    // corrupt already-migrated code. It must not be treated as migratable.
    const ctx = createInMemoryContext({
      'package.json': JSON.stringify({
        dependencies: {
          '@ionic/angular': 'npm:@myco/ionic-fork@8.5.0',
          '@ionic/react': 'workspace:^8.0.0',
        },
      }),
    });

    expect(detectFrameworks(ctx)).toEqual([]);
  });

  it('throws a clear error on a malformed package.json', () => {
    const ctx = createInMemoryContext({ 'package.json': '{ not valid json' });

    expect(() => detectFrameworks(ctx)).toThrow(/Could not parse package\.json/);
  });
});

describe('selectMigrations', () => {
  const angular89 = fakeMigration({ id: 'a', framework: 'angular', fromMajor: 8, toMajor: 9 });
  const react89 = fakeMigration({ id: 'r', framework: 'react', fromMajor: 8, toMajor: 9 });
  const core89 = fakeMigration({ id: 'c', framework: 'core', fromMajor: 8, toMajor: 9 });
  const core910 = fakeMigration({ id: 'd', framework: 'core', fromMajor: 9, toMajor: 10 });
  const experimental = fakeMigration({ id: 'x', fromMajor: 8, toMajor: 9, status: 'experimental' });
  const all = [core910, react89, angular89, core89, experimental];

  it('selects only the detected framework plus core, sorted deterministically', () => {
    const selected = selectMigrations(all, { fromMajor: 8, toMajor: 9, frameworks: ['angular'] });
    expect(selected.map((m) => m.id)).toEqual(['a', 'c']);
  });

  it('is a version gate: a project already on the target major yields nothing', () => {
    const selected = selectMigrations(all, { fromMajor: 9, toMajor: 9, frameworks: ['angular'] });
    expect(selected).toEqual([]);
  });

  it('chains multiple major hops in order', () => {
    const selected = selectMigrations(all, { fromMajor: 8, toMajor: 10, frameworks: ['core'] });
    expect(selected.map((m) => m.id)).toEqual(['c', 'd']);
  });

  it('excludes experimental migrations unless opted in', () => {
    const stable = selectMigrations(all, { fromMajor: 8, toMajor: 9, frameworks: ['core'] });
    const withExp = selectMigrations(all, {
      fromMajor: 8,
      toMajor: 9,
      frameworks: ['core'],
      includeExperimental: true,
    });
    expect(stable.map((m) => m.id)).toEqual(['c']);
    expect(withExp.map((m) => m.id)).toEqual(['c', 'x']);
  });
});

describe('the shipped registry', () => {
  it('reaches v9 and no further, so a v9 project has nothing to apply', () => {
    // Tripwire: this fails the moment a migration targets v10.
    expect(resolveTarget(allMigrations, 9)).toEqual({
      kind: 'nothing-to-do',
      reason: 'at-ceiling',
      fromMajor: 9,
      latestMajor: 9,
    });
  });

  it('holds the strict-hop invariant that resolveTarget depends on', () => {
    // `resolveTarget`'s ceiling gate relies on this, and `fromMajor`/`toMajor` are
    // bare numbers, so nothing else enforces it.
    expect(allMigrations.every((m) => m.toMajor > m.fromMajor)).toBe(true);
  });
});

describe('resolveTarget', () => {
  const all = [fakeMigration({ id: 'a', fromMajor: 8, toMajor: 9 })];

  it('defaults to one major up when no target is given', () => {
    expect(resolveTarget(all, 8)).toEqual({ kind: 'run', toMajor: 9 });
  });

  it('has nothing to do against an empty registry, which reaches no major at all', () => {
    expect(resolveTarget([], 8)).toEqual({
      kind: 'nothing-to-do',
      reason: 'at-ceiling',
      fromMajor: 8,
      latestMajor: 0,
    });
  });

  it('honors an explicit target the tool has a path to', () => {
    expect(resolveTarget(all, 8, 9)).toEqual({ kind: 'run', toMajor: 9 });
  });

  it('clamps a target above the newest known major instead of skipping the run', () => {
    // Why clamp rather than refuse: see resolveTarget in registry.ts.
    expect(resolveTarget(all, 8, 10)).toEqual({ kind: 'run', toMajor: 9, clampedFrom: 10 });
  });

  it('has nothing to do when the source is already at the newest known major', () => {
    expect(resolveTarget(all, 9)).toEqual({
      kind: 'nothing-to-do',
      reason: 'at-ceiling',
      fromMajor: 9,
      latestMajor: 9,
    });
  });

  it('has nothing to do for a target equal to the source at the ceiling, not an error', () => {
    // `--to 9` on an already-migrated v9 app is a re-run, not a typo, so it
    // shouldn't fail CI.
    expect(resolveTarget(all, 9, 9)).toEqual({
      kind: 'nothing-to-do',
      reason: 'at-ceiling',
      fromMajor: 9,
      latestMajor: 9,
    });
  });

  it('rejects a target equal to the source when work exists above it', () => {
    // Unlike the case above, the ceiling branch doesn't fire on v8, so an empty
    // [8,8] range would otherwise run and print "0 migration(s)".
    expect(resolveTarget(all, 8, 8)).toEqual({
      kind: 'invalid',
      reason: 'not-above-source',
      requestedTo: 8,
      fromMajor: 8,
    });
  });

  it('rejects a target below the source major', () => {
    expect(resolveTarget(all, 9, 8)).toEqual({
      kind: 'invalid',
      reason: 'below-source',
      requestedTo: 8,
      fromMajor: 9,
    });
  });

  // The shipped registry only hops v8 -> v9, so nothing else covers these.
  describe('with a registry that spans more than one hop', () => {
    const multi = [
      fakeMigration({ id: 'a', fromMajor: 8, toMajor: 9 }),
      fakeMigration({ id: 'b', fromMajor: 9, toMajor: 10 }),
    ];

    it('still defaults to a single hop rather than the furthest reachable major', () => {
      expect(resolveTarget(multi, 8)).toEqual({ kind: 'run', toMajor: 9 });
    });

    it('honors an explicit multi-hop target', () => {
      expect(resolveTarget(multi, 8, 10)).toEqual({ kind: 'run', toMajor: 10 });
    });

    it('clamps only down to the furthest reachable major, not to one hop', () => {
      expect(resolveTarget(multi, 8, 12)).toEqual({ kind: 'run', toMajor: 10, clampedFrom: 12 });
    });

    it('rejects a target equal to the source even when a higher major is reachable', () => {
      // The same `(9, 9)` that's an at-ceiling no-op today. Once v10 is
      // reachable it's this error instead, by the choice noted in registry.ts.
      expect(resolveTarget(multi, 9, 9)).toEqual({
        kind: 'invalid',
        reason: 'not-above-source',
        requestedTo: 9,
        fromMajor: 9,
      });
    });
  });
});

describe('run', () => {
  const rewriteFoo = fakeMigration({
    id: 'rewrite-foo',
    detect: (ctx) => (ctx.readFile('data.txt') === 'foo' ? [{ filePath: 'data.txt', line: 1, detail: 'foo->bar' }] : []),
    fix: (ctx) => ctx.writeFile('data.txt', 'bar'),
  });

  it('applies auto-fixable migrations and persists the change', () => {
    const ctx = createInMemoryContext({ 'data.txt': 'foo' });

    const result = run(ctx, [rewriteFoo]);

    expect(result.entries[0].applied).toBe(true);
    expect(ctx.readFile('data.txt')).toBe('bar');
  });

  it('dry-run reports findings but writes nothing', () => {
    const ctx = createInMemoryContext({ 'data.txt': 'foo' });

    const result = run(ctx, [rewriteFoo], { dryRun: true });

    expect(result.entries[0].findings).toHaveLength(1);
    expect(result.entries[0].applied).toBe(false);
    expect(ctx.readFile('data.txt')).toBe('foo');
  });

  it('reports a report-only migration (no fix) without applying it', () => {
    const reportOnly = fakeMigration({
      id: 'report-only',
      detect: () => [{ filePath: 'x.ts', line: 3, detail: 'review this' }],
      fix: undefined,
    });
    const ctx = createInMemoryContext({});

    const result = run(ctx, [reportOnly]);

    expect(result.entries[0].applied).toBe(false);
    expect(result.entries[0].findings).toHaveLength(1);
  });

  it('skips migrations with no findings', () => {
    const ctx = createInMemoryContext({ 'data.txt': 'already-bar' });

    const result = run(ctx, [rewriteFoo]);

    expect(result.entries).toEqual([]);
  });

  it('persists nothing to disk when a later migration throws', () => {
    // Writes are buffered until save(), which only runs after every migration
    // succeeds. A throw partway must leave the files on disk untouched so a
    // re-run starts clean and the gate-closing package.json bump never persists.
    const ctx = createInMemoryContext({ 'package.json': '{}\n' });
    const bumpFirst = fakeMigration({
      id: 'bump-first',
      detect: () => [{ filePath: 'package.json', line: 1, detail: 'bump' }],
      fix: (c) => c.writeFile('package.json', '{"bumped":true}\n'),
    });
    const throwsSecond = fakeMigration({
      id: 'throws-second',
      detect: () => [{ filePath: 'data.txt', line: 1, detail: 'x' }],
      fix: () => {
        throw new Error('boom');
      },
    });

    expect(() => run(ctx, [bumpFirst, throwsSecond])).toThrow(/boom/);
    // Read the underlying filesystem, not the write buffer, to prove nothing landed.
    const fs = ctx.project.getFileSystem();
    expect(fs.readFileSync(`${ctx.rootDir}/package.json`)).toBe('{}\n');
  });
});

describe('buildReport', () => {
  it('summarizes fixed and manual migrations', () => {
    const ctx = createInMemoryContext({ 'data.txt': 'foo' });
    const result = run(ctx, [
      fakeMigration({
        id: 'auto',
        detect: () => [{ filePath: 'data.txt', line: 1, detail: 'x' }],
        fix: () => {},
      }),
      fakeMigration({
        id: 'manual',
        detect: () => [{ filePath: 'x.ts', line: 9, detail: 'do it yourself' }],
        fix: undefined,
        docsUrl: 'https://docs.test/manual',
      }),
    ]);

    const report = buildReport(result);

    expect(report).toContain('[fixed] auto');
    expect(report).toContain('[todo]  manual');
    expect(report).toContain('x.ts:9 - do it yourself');
    expect(report).toContain('https://docs.test/manual');
  });

  it('reports nothing-to-do on an empty result', () => {
    expect(buildReport({ entries: [] })).toBe('No applicable Ionic migrations found. Nothing to do.');
  });
});

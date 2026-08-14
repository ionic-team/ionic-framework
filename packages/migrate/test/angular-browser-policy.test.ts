import { describe, expect, it } from 'vitest';

import { createInMemoryContext } from '../src/context.js';
import { allMigrations } from '../src/migrations/index.js';
import { selectMigrations } from '../src/registry.js';
import { angularBrowserPolicy as migration } from '../src/migrations/v9/angular-browser-policy.js';
import { angularBrowserPolicyManual } from '../src/migrations/v9/angular-browser-policy-manual.js';
import { angularProject } from './helpers/angular-policy.js';

/** An Angular 22 project with the policy installed and resolvable. */
function project(files: Record<string, string> = {}) {
  return angularProject({
    major: 22,
    files,
    resolved: ['chrome 111', 'firefox 112', 'safari 16.4', 'ios_saf 16.4'],
  });
}

describe('angular-browser-policy', () => {
  it("raises entries to Angular's own floors, including decimal ones", () => {
    const ctx = project({ '.browserslistrc': `Chrome >=89\nSafari >=16\niOS >=16\n` });

    migration.fix!(ctx);

    expect(ctx.readFile('.browserslistrc')).toBe(`Chrome >=111\nSafari >=16.4\niOS >=16.4\n`);
  });

  it('reports each entry it would raise, with its file and line', () => {
    const ctx = project({ '.browserslistrc': `Chrome >=89\nSafari >=16.4\n` });

    const findings = migration.detect(ctx);

    expect(findings).toHaveLength(1);
    expect(findings[0].filePath).toBe('.browserslistrc');
    expect(findings[0].line).toBe(1);
    expect(findings[0].detail).toBe('Chrome >=89 -> >=111 (Angular 22 browser policy)');
  });

  it('raises the package.json field the Angular starters generate', () => {
    const ctx = project({
      'package.json': `${JSON.stringify(
        { dependencies: { '@angular/core': '^22.0.0' }, browserslist: ['Chrome >=107', 'Safari >=16.1'] },
        null,
        2
      )}\n`,
    });

    migration.fix!(ctx);

    expect(JSON.parse(ctx.readFile('package.json')!).browserslist).toEqual(['Chrome >=111', 'Safari >=16.4']);
  });

  it('raises the env-keyed shape without flattening it', () => {
    const ctx = project({
      'package.json': `${JSON.stringify(
        {
          dependencies: { '@angular/core': '^22.0.0' },
          browserslist: { production: ['Chrome >=89', 'last 2 versions'], development: ['Chrome >=89'] },
        },
        null,
        2
      )}\n`,
    });

    migration.fix!(ctx);

    expect(JSON.parse(ctx.readFile('package.json')!).browserslist).toEqual({
      production: ['Chrome >=111', 'last 2 versions'],
      development: ['Chrome >=111'],
    });
  });

  it('leaves a browser Angular policy does not name alone', () => {
    const ctx = project({ '.browserslistrc': `Samsung >=15\nnot dead\n` });

    expect(migration.detect(ctx)).toEqual([]);
    migration.fix!(ctx);
    expect(ctx.readFile('.browserslistrc')).toBe(`Samsung >=15\nnot dead\n`);
  });

  it('writes nothing when the policy cannot be resolved', () => {
    // Writing against empty floors is a silent no-op at best and wrong versions at worst.
    const ctx = createInMemoryContext({
      'package.json': JSON.stringify({ dependencies: { '@angular/core': '^22.0.0' } }, null, 2),
      '.browserslistrc': `Chrome >=89\n`,
    });

    expect(migration.detect(ctx)).toEqual([]);
    migration.fix!(ctx);
    expect(ctx.readFile('.browserslistrc')).toBe(`Chrome >=89\n`);
  });

  it('writes nothing when the project browserslist throws on the policy query', () => {
    const ctx = createInMemoryContext(
      {
        'package.json': JSON.stringify({ dependencies: { '@angular/core': '^22.0.0' } }, null, 2),
        '.browserslistrc': `Chrome >=89\n`,
        'node_modules/@angular/build/package.json': '{ "name": "@angular/build" }',
        'node_modules/@angular/build/src/utils/supported-browsers.js': `const BASELINE_DATE = '2025-10-20';\n`,
      },
      '/app',
      {
        browserslist: () => {
          throw new Error('Unknown browser query');
        },
      }
    );

    expect(migration.detect(ctx)).toEqual([]);
    migration.fix!(ctx);
    expect(ctx.readFile('.browserslistrc')).toBe(`Chrome >=89\n`);
  });

  it('writes nothing on an Angular that enforces no policy of its own', () => {
    const ctx = angularProject({ major: 19, files: { '.browserslistrc': `Chrome >=89\n` }, resolved: ['chrome 111'] });

    expect(migration.detect(ctx)).toEqual([]);
    migration.fix!(ctx);
    expect(ctx.readFile('.browserslistrc')).toBe(`Chrome >=89\n`);
  });

  it('is experimental, so a default run only gets the report', () => {
    const selected = selectMigrations(allMigrations, {
      fromMajor: 8,
      toMajor: 9,
      frameworks: ['angular'],
    }).map((m) => m.id);

    expect(selected).toContain('angular-browser-policy-manual');
    expect(selected).not.toContain('angular-browser-policy');
  });

  it('runs before the report under --experimental, which then goes quiet', () => {
    // Both are selected with the opt-in, so the report must not repeat what the
    // fix just applied.
    const ctx = project({ '.browserslistrc': `Chrome >=89\n` });
    const selected = selectMigrations(allMigrations, {
      fromMajor: 8,
      toMajor: 9,
      frameworks: ['angular'],
      includeExperimental: true,
    }).map((m) => m.id);

    expect(selected.indexOf('angular-browser-policy')).toBeLessThan(selected.indexOf('angular-browser-policy-manual'));

    migration.fix!(ctx);

    expect(angularBrowserPolicyManual.detect(ctx)).toEqual([]);
  });
});

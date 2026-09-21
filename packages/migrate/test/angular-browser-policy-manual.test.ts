import { describe, expect, it } from 'vitest';

import { createInMemoryContext } from '../src/context.js';
import { angularBrowserPolicyManual as migration } from '../src/migrations/v9/angular-browser-policy-manual.js';
import { ANGULAR_20_POLICY, angularProject, fakeBrowserslist } from './helpers/angular-policy.js';

describe('angular-browser-policy-manual', () => {
  it('names the version to raise an entry to, read from the installed Angular', () => {
    const browserslist = fakeBrowserslist(['chrome 108', 'chrome 107', 'safari 16.0']);
    const ctx = createInMemoryContext(
      {
        'package.json': JSON.stringify({ dependencies: { '@angular/core': '^20.0.0' } }, null, 2),
        '.browserslistrc': `Chrome >=89\nSafari >=16\n`,
        'node_modules/@angular/build/package.json': '{ "name": "@angular/build" }',
        'node_modules/@angular/build/.browserslistrc': ANGULAR_20_POLICY,
      },
      '/app',
      { browserslist }
    );

    const findings = migration.detect(ctx);

    // the static file is parsed into queries, with its comment and blank line dropped
    expect(browserslist.queries).toEqual([
      ['Chrome >= 107', 'ChromeAndroid >= 107', 'Edge >= 107', 'Firefox >= 104', 'Safari >= 16', 'iOS >= 16'],
    ]);
    expect(findings).toHaveLength(1);
    expect(findings[0].filePath).toBe('.browserslistrc');
    expect(findings[0].line).toBe(1);
    expect(findings[0].detail).toContain('Chrome >=89');
    expect(findings[0].detail).toContain('>=107');
    // Safari >=16 already meets the policy, so it is not reported
    expect(findings[0].detail).not.toContain('Safari');
  });

  it('resolves the rolling baseline policy Angular 21+ ships instead of a file', () => {
    const ctx = angularProject({
      major: 22,
      files: { '.browserslistrc': `Safari >=16.1\n` },
      resolved: ['chrome 111', 'safari 16.4', 'ios_saf 16.6-16.7'],
    });

    const findings = migration.detect(ctx);

    expect(findings).toHaveLength(1);
    expect(findings[0].detail).toContain("Angular 22's browser policy");
    // a decimal floor, and not confused with the 16.6 lower bound of the iOS range
    expect(findings[0].detail).toContain('>=16.4');
  });

  it('ignores the Android browsers, which caniuse tracks only at their latest', () => {
    const ctx = angularProject({
      major: 22,
      files: { '.browserslistrc': `ChromeAndroid >=89\nFirefoxAndroid >=89\n` },
      resolved: ['chrome 111', 'and_chr 149', 'firefox 112', 'and_ff 151'],
    });

    expect(migration.detect(ctx)).toEqual([]);
  });

  it('finds @angular/build nested under the devkit builder', () => {
    // An app on @angular-devkit/build-angular has no top-level @angular/build,
    // which is the layout the Ionic conference app ships.
    const ctx = angularProject({
      major: 22,
      files: {
        '.browserslistrc': `Chrome >=107\n`,
        'node_modules/@angular-devkit/build-angular/package.json': '{ "name": "@angular-devkit/build-angular" }',
      },
      resolved: ['chrome 111'],
      buildDir: 'node_modules/@angular-devkit/build-angular/node_modules/@angular/build',
    });

    expect(migration.detect(ctx)[0]?.detail).toContain('>=111');
  });

  it('falls back to naming the policy when dependencies are not installed', () => {
    const ctx = createInMemoryContext({
      'package.json': JSON.stringify({ dependencies: { '@angular/core': '^22.0.0' } }, null, 2),
      '.browserslistrc': `Chrome >=89\n`,
    });

    const findings = migration.detect(ctx);

    expect(findings).toHaveLength(1);
    expect(findings[0].detail).toContain('own browser support policy');
  });

  it('says nothing on an Angular that enforces no policy of its own', () => {
    const ctx = createInMemoryContext({
      'package.json': JSON.stringify({ dependencies: { '@angular/core': '^19.0.0' } }, null, 2),
      '.browserslistrc': `Chrome >=79\n`,
    });

    expect(migration.detect(ctx)).toEqual([]);
  });

  it('says nothing when the app declares no browserslist of its own', () => {
    const ctx = createInMemoryContext({
      'package.json': JSON.stringify({ dependencies: { '@angular/core': '^22.0.0' } }, null, 2),
    });

    expect(migration.detect(ctx)).toEqual([]);
  });
});

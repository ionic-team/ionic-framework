import type { Finding, Migration } from '../../types.js';

/**
 * `IonicModule` is deprecated in Ionic 9 in favor of `provideIonicAngular()`,
 * which works in both standalone and NgModule apps. Report-only: it still
 * works, and the rewrite is structural (the entry moves from a module's
 * `imports` to its `providers`, with any `forRoot()` config).
 *
 * See https://ionicframework.com/docs/updating/9-0#ionicmodule-deprecation
 */
// Word-bounded so an app's own `MyIonicModuleHelper` is not mistaken for it.
const IONIC_MODULE = /\bIonicModule\b/;

export const angularIonicModule: Migration = {
  id: 'angular-ionic-module',
  framework: 'angular',
  fromMajor: 8,
  toMajor: 9,
  status: 'stable',
  docsUrl: 'https://ionicframework.com/docs/updating/9-0#ionicmodule-deprecation',

  detect(ctx) {
    // One finding per file, at the first mention: a module names `IonicModule`
    // on both its import line and in its `imports` array.
    const findings: Finding[] = [];
    for (const filePath of ctx.glob(['**/*.ts'])) {
      const text = ctx.readFile(filePath);
      if (text === undefined) continue;
      const line = text.split('\n').findIndex((l) => IONIC_MODULE.test(l));
      if (line !== -1) {
        findings.push({
          filePath,
          line: line + 1,
          detail:
            'IonicModule is deprecated. Migrate to provideIonicAngular(), which works in standalone and NgModule apps',
        });
      }
    }
    return findings;
  },
};

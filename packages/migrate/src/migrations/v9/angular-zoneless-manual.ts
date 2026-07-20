import { SyntaxKind } from 'ts-morph';

import type { Finding, Migration } from '../../types.js';

/**
 * Report-only companion to `angular-zoneless`. The auto-fix adds
 * `provideZoneChangeDetection()` to the standalone `bootstrapApplication`
 * providers array, but NgModule apps bootstrap via
 * `platformBrowserDynamic().bootstrapModule(AppModule)`, where the provider is
 * passed as `applicationProviders` on the `bootstrapModule` call (Angular's own
 * recommendation for NgModule apps; it is also accepted in the AppModule's
 * `@NgModule({ providers })`). Which shape fits depends on the app, so this
 * flags the bootstrap for manual migration rather than dropping the warning
 * NgModule apps previously received.
 *
 * See https://ionicframework.com/docs/updating/9-0#zoneless-change-detection
 */
const ZONE_PROVIDER = /provide(Experimental)?Zone(less)?ChangeDetection/;
const DETAIL =
  'NgModule bootstrap: pass provideZoneChangeDetection() as applicationProviders on bootstrapModule to keep Zone.js';

export const angularZonelessManual: Migration = {
  id: 'angular-zoneless-manual',
  framework: 'angular',
  fromMajor: 8,
  toMajor: 9,
  status: 'stable',
  docsUrl: 'https://ionicframework.com/docs/updating/9-0#zoneless-change-detection',

  detect(ctx) {
    const findings: Finding[] = [];
    for (const file of ctx.project.getSourceFiles()) {
      // Already configured (zone or zoneless)? Nothing to warn about.
      if (ZONE_PROVIDER.test(file.getFullText())) continue;
      for (const call of file.getDescendantsOfKind(SyntaxKind.CallExpression)) {
        if (call.getExpression().getText().endsWith('bootstrapModule')) {
          findings.push({
            filePath: ctx.relative(file.getFilePath()),
            line: call.getStartLineNumber(),
            detail: DETAIL,
          });
        }
      }
    }
    return findings;
  },
};

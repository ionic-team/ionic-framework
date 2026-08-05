import { SyntaxKind } from 'ts-morph';

import type { Finding, Migration } from '../../types.js';
import { ZONE_PROVIDER } from './angular-zoneless.js';

/**
 * Report-only companion to `angular-zoneless`. NgModule apps bootstrap via
 * `bootstrapModule`, which the auto-fix can't edit, so flag them for a manual
 * zone-provider migration rather than dropping the warning they previously got.
 *
 * See https://ionicframework.com/docs/updating/9-0#zoneless-change-detection
 */
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

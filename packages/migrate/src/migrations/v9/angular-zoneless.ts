import { Node, SyntaxKind } from 'ts-morph';
import type { ArrayLiteralExpression } from 'ts-morph';

import type { MigrationContext } from '../../context.js';
import type { Migration } from '../../types.js';

/**
 * Ionic 9 defaults to zoneless change detection (Angular 21+ bootstraps
 * zoneless out of the box). To preserve an existing app's Zone.js behavior we
 * add `provideZoneChangeDetection()` to the standalone bootstrap so the app
 * keeps re-rendering on async state exactly as it did on v8. The developer can
 * adopt zoneless later on their own schedule.
 *
 * Scoped to the standalone `bootstrapApplication` shape. NgModule bootstraps
 * are handled report-only by the companion `angular-zoneless-manual`.
 *
 * See https://ionicframework.com/docs/updating/9-0#zoneless-change-detection
 */
/** Matches any zone or zoneless change-detection provider already in place. */
export const ZONE_PROVIDER = /provide(Experimental)?Zone(less)?ChangeDetection/;
const CORE_MODULE = '@angular/core';
const PROVIDER = 'provideZoneChangeDetection';

/**
 * The `providers` array of every standalone bootstrap that lacks any
 * zone/zoneless provider. Returns all matches so monorepo/multi-project
 * workspaces (several `main.ts` files) are each covered. Shared by detect/fix.
 */
function targetProvidersArrays(ctx: MigrationContext): ArrayLiteralExpression[] {
  const arrays: ArrayLiteralExpression[] = [];
  for (const file of ctx.project.getSourceFiles()) {
    for (const call of file.getDescendantsOfKind(SyntaxKind.CallExpression)) {
      if (call.getExpression().getText() !== 'bootstrapApplication') continue;
      const opts = call.getArguments()[1];
      if (!opts || !Node.isObjectLiteralExpression(opts)) continue;
      const prop = opts.getProperty('providers');
      if (!prop || !Node.isPropertyAssignment(prop)) continue;
      const arr = prop.getInitializerIfKind(SyntaxKind.ArrayLiteralExpression);
      if (!arr) continue;
      // Respect an app that already configured (zone or zoneless) change detection.
      if (arr.getElements().some((el) => ZONE_PROVIDER.test(el.getText()))) continue;
      arrays.push(arr);
    }
  }
  return arrays;
}

export const angularZoneless: Migration = {
  id: 'angular-zoneless',
  framework: 'angular',
  fromMajor: 8,
  toMajor: 9,
  status: 'stable',
  docsUrl: 'https://ionicframework.com/docs/updating/9-0#zoneless-change-detection',

  detect(ctx) {
    return targetProvidersArrays(ctx).map((arr) => ({
      filePath: ctx.relative(arr.getSourceFile().getFilePath()),
      line: arr.getStartLineNumber(),
      detail: `add ${PROVIDER}() to preserve Zone.js change detection`,
    }));
  },

  fix(ctx) {
    for (const arr of targetProvidersArrays(ctx)) {
      arr.insertElement(0, `${PROVIDER}()`);

      const file = arr.getSourceFile();
      const coreImport = file.getImportDeclaration((d) => d.getModuleSpecifierValue() === CORE_MODULE);
      if (!coreImport) {
        file.addImportDeclaration({ moduleSpecifier: CORE_MODULE, namedImports: [PROVIDER] });
      } else if (!coreImport.getNamedImports().some((n) => n.getName() === PROVIDER)) {
        coreImport.addNamedImport(PROVIDER);
      }
    }
  },
};

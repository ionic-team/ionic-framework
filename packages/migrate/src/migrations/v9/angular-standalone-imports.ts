import type { Finding, Migration } from '../../types.js';

/** Old import specifier -> new import specifier. */
const REWRITES: Record<string, string> = {
  '@ionic/angular': '@ionic/angular/lazy',
  '@ionic/angular/standalone': '@ionic/angular',
};

/**
 * Ionic 9 makes standalone the default Angular import path:
 *   - `@ionic/angular`            (was lazy)       -> `@ionic/angular/lazy`
 *   - `@ionic/angular/standalone` (was standalone) -> `@ionic/angular`
 *
 * Single-shot: `@ionic/angular` means lazy in v8 but standalone in v9, so the
 * two states are textually identical and re-running would wrongly rewrite
 * already-migrated imports. The engine's version gate blocks re-application once
 * the project reads as v9.
 *
 * See https://ionicframework.com/docs/updating/9-0#component-imports
 */
export const angularStandaloneImports: Migration = {
  id: 'angular-standalone-imports',
  framework: 'angular',
  fromMajor: 8,
  toMajor: 9,
  status: 'stable',
  docsUrl: 'https://ionicframework.com/docs/updating/9-0#component-imports',

  detect(ctx) {
    const findings: Finding[] = [];
    for (const file of ctx.project.getSourceFiles()) {
      for (const decl of file.getImportDeclarations()) {
        const specifier = decl.getModuleSpecifierValue();
        const target = REWRITES[specifier];
        if (target !== undefined) {
          findings.push({
            filePath: ctx.relative(file.getFilePath()),
            line: decl.getStartLineNumber(),
            detail: `'${specifier}' -> '${target}'`,
          });
        }
      }
    }
    return findings;
  },

  fix(ctx) {
    for (const file of ctx.project.getSourceFiles()) {
      for (const decl of file.getImportDeclarations()) {
        const target = REWRITES[decl.getModuleSpecifierValue()];
        if (target !== undefined) {
          decl.setModuleSpecifier(target);
        }
      }
    }
  },
};

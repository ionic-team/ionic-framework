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
 * See https://ionicframework.com/docs/updating/9-0#component-imports
 *
 * Single-shot: `@ionic/angular` is a v8 lazy import but a v9 standalone import,
 * so the two states are textually identical and this migration cannot be
 * re-run safely. The migration assumes a v8 starting point; the engine's
 * version gate (see `detectFrameworks`, which recognizes the v9 pin) guards
 * against re-application after `angular-deps` has bumped `package.json`.
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

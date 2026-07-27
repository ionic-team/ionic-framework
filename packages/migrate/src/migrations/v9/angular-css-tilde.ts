import type { Finding, Migration } from '../../types.js';

/**
 * Angular's build pipeline no longer supports the webpack-loader `~` prefix when
 * pulling in `@ionic/angular` stylesheets:
 *
 *   @import '~@ionic/angular/css/core.css';  ->  @import '@ionic/angular/css/core.css';
 *
 * `@use` and `@forward` are covered too: webpack's sass-loader honored the `~`
 * prefix on all three, so a Sass app may write it on any of them.
 *
 * See https://ionicframework.com/docs/updating/9-0#css-imports
 */
const TILDE_IONIC_IMPORT = /((?:@import|@use|@forward)\s+['"])~(@ionic\/angular\/)/g;

export const angularCssTilde: Migration = {
  id: 'angular-css-tilde',
  framework: 'angular',
  fromMajor: 8,
  toMajor: 9,
  status: 'stable',
  docsUrl: 'https://ionicframework.com/docs/updating/9-0#css-imports',

  detect(ctx) {
    const findings: Finding[] = [];
    for (const filePath of ctx.glob(['**/*.css', '**/*.scss'])) {
      const text = ctx.readFile(filePath);
      if (text === undefined) continue;
      text.split('\n').forEach((line, i) => {
        // Fresh non-global regex per line: TILDE_IONIC_IMPORT is /g (needed for
        // fix's replace), and a global regex's stateful lastIndex makes repeated
        // .test() calls alternate true/false and skip matching lines.
        if (new RegExp(TILDE_IONIC_IMPORT.source).test(line)) {
          findings.push({ filePath, line: i + 1, detail: 'remove `~` prefix from @ionic/angular import' });
        }
      });
    }
    return findings;
  },

  fix(ctx) {
    for (const filePath of ctx.glob(['**/*.css', '**/*.scss'])) {
      const text = ctx.readFile(filePath);
      if (text === undefined) continue;
      const next = text.replace(TILDE_IONIC_IMPORT, '$1$2');
      if (next !== text) ctx.writeFile(filePath, next);
    }
  },
};

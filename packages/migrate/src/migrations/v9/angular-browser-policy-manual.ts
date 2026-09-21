import type { Finding, Migration } from '../../types.js';
import { angularMajor, angularPolicyFloors, BROWSER_POLICY_ANGULAR } from './angular-browser-policy.js';
import { browserslistSources, raiseEntry } from '../../ast/browserslist.js';

/**
 * Report-only companion to the experimental `angular-browser-policy` auto-fix.
 *
 * The v9 guide prints one browserslist for every framework, but from Angular 20
 * on the CLI enforces its own, higher floors on top of it: `ng build` warns for
 * every browser version below them and Angular supports none of those browsers.
 * So the guide's block cannot be taken at face value in an Angular app, and this
 * says which entries fall short.
 *
 * Report-only by default. `--experimental` applies it, and `angular-browser-policy`
 * says why.
 *
 * Refer to https://ionicframework.com/docs/updating/9-0#browser-support
 */
export const angularBrowserPolicyManual: Migration = {
  id: 'angular-browser-policy-manual',
  framework: 'angular',
  fromMajor: 8,
  toMajor: 9,
  status: 'stable',
  docsUrl: 'https://ionicframework.com/docs/updating/9-0#browser-support',

  detect(ctx) {
    const major = angularMajor(ctx);
    if (major === undefined || major < BROWSER_POLICY_ANGULAR) return [];

    const sources = browserslistSources(ctx);
    // No list of its own means Angular's defaults already apply, and there is
    // nothing to align.
    if (sources.length === 0) return [];

    const floors = angularPolicyFloors(ctx);
    if (floors === undefined) {
      // Dependencies are not installed (or Angular changed where it keeps the
      // policy), so the exact floors are out of reach.
      return [
        {
          filePath: sources[0].filePath,
          line: sources[0].line,
          detail:
            `Angular ${major} applies its own browser support policy on top of your browserslist. ` +
            `It is stricter than Ionic 9's floors, and \`ng build\` warns for every browser below it`,
        },
      ];
    }

    const findings: Finding[] = [];
    for (const source of sources) {
      for (const entry of source.entries) {
        const raised = raiseEntry(entry.text, floors);
        if (raised) {
          findings.push({
            filePath: source.filePath,
            line: entry.line,
            detail: `${raised.name} >=${raised.from} is below Angular ${major}'s browser policy. Raise it to >=${raised.to}`,
          });
        }
      }
    }
    return findings;
  },
};

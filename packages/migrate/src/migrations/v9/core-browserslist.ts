import { browserslistSources, raiseEntry, rewriteBrowserslists } from '../../ast/browserslist.js';
import type { RaisedEntry } from '../../ast/browserslist.js';
import type { Finding, Migration } from '../../types.js';

/**
 * Ionic 9 raises its supported browser floors. The guide prints a replacement
 * `.browserslistrc` block, but this raises the version numbers in place:
 * overwriting the file would drop comments and queries unrelated to Ionic.
 *
 * Only entries this owns are touched - a named browser with a `>=` floor below
 * Ionic 9's.
 *
 * Refer to https://ionicframework.com/docs/updating/9-0#browser-support
 */
/** The browsers Ionic 9 supports and their minimum versions, in guide order. */
export const BROWSERS: { name: string; floor: number }[] = [
  { name: 'Chrome', floor: 89 },
  { name: 'ChromeAndroid', floor: 89 },
  { name: 'Firefox', floor: 75 },
  { name: 'Edge', floor: 89 },
  { name: 'Safari', floor: 16 },
  { name: 'iOS', floor: 16 },
];

/** Minimum version Ionic 9 supports, keyed by lowercased browserslist name. */
const FLOORS: Record<string, number> = Object.fromEntries(BROWSERS.map((b) => [b.name.toLowerCase(), b.floor]));

/** The raised version of a line against Ionic 9's own floors. */
function raise(line: string): RaisedEntry | undefined {
  return raiseEntry(line, FLOORS);
}

export const coreBrowserslist: Migration = {
  id: 'core-browserslist',
  framework: 'core',
  fromMajor: 8,
  toMajor: 9,
  status: 'stable',
  docsUrl: 'https://ionicframework.com/docs/updating/9-0#browser-support',

  detect(ctx) {
    const findings: Finding[] = [];
    for (const source of browserslistSources(ctx)) {
      for (const entry of source.entries) {
        const raised = raise(entry.text);
        if (raised) {
          findings.push({
            filePath: source.filePath,
            line: entry.line,
            detail: `${raised.name} >=${raised.from} is below Ionic 9's floor. Raise it to >=${raised.to}`,
          });
        }
      }
    }
    return findings;
  },

  fix(ctx) {
    rewriteBrowserslists(ctx, (entry) => raise(entry)?.line ?? entry);
  },
};

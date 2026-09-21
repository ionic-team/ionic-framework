import type { Migration } from '../../types.js';
import { browserslistSources, entryBrowser } from '../../ast/browserslist.js';
import { BROWSERS } from './core-browserslist.js';

/**
 * Report-only companion to `core-browserslist`. That migration raises the
 * versions of entries a project already has; this one names the browsers from
 * the guide's block that the project has no entry for at all.
 *
 * Report-only on purpose: raising a floor keeps the same browsers, but adding
 * one widens the support matrix, which changes the build's output. That is the
 * developer's call, so the tool prints the entry to add rather than adding it.
 *
 * Refer to https://ionicframework.com/docs/updating/9-0#browser-support
 */
/**
 * Ionic browsers these entries never name, as `Name >=Floor` strings.
 *
 * Only meaningful for a list already written in the guide's named shape. A
 * query-style list (`last 2 versions`, `> 0.5%`) names no browser at all, so
 * every one of them would read as missing - that returns nothing instead.
 */
function missingEntries(entries: string[]): string[] {
  const ionic = new Set(BROWSERS.map((b) => b.name.toLowerCase()));
  const named = new Set(entries.map(entryBrowser).filter((name) => name !== undefined && ionic.has(name)));
  if (named.size === 0) return [];
  return BROWSERS.filter((b) => !named.has(b.name.toLowerCase())).map((b) => `${b.name} >=${b.floor}`);
}

export const coreBrowserslistManual: Migration = {
  id: 'core-browserslist-manual',
  framework: 'core',
  fromMajor: 8,
  toMajor: 9,
  status: 'stable',
  docsUrl: 'https://ionicframework.com/docs/updating/9-0#browser-support',

  detect(ctx) {
    const sources = browserslistSources(ctx);
    // A project can split its list across a `.browserslistrc` and a manifest, so
    // a browser is only missing when no source names it.
    const missing = missingEntries(sources.flatMap((source) => source.entries.map((entry) => entry.text)));
    if (missing.length === 0) return [];

    // Non-empty only because `missingEntries` returns nothing for a list with no
    // named browser, which includes the no-sources case.
    const [first] = sources;
    return [
      {
        filePath: first.filePath,
        line: first.line,
        detail: `Ionic 9 supports browsers this list does not name, at least ${missing.join(', ')}. Add the entries you target`,
      },
    ];
  },
};

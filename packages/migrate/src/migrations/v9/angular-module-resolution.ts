import type { Finding, Migration } from '../../types.js';

/**
 * `@ionic/angular` is now published with `exports`-based subpath resolution, so
 * classic TypeScript module resolution can no longer resolve subpaths like
 * `@ionic/angular/lazy`.
 *
 * The `angular-standalone-imports` migration introduces those subpath imports,
 * so without this fix it can leave an app that no longer compiles.
 *
 * Edited as text rather than through `JSON.parse`: Angular's generated
 * `tsconfig.json` carries `//` comments, which are valid JSONC but not JSON, and
 * round-tripping through `JSON.parse`/`stringify` would silently drop them.
 *
 * Refer to https://ionicframework.com/docs/updating/9-0#module-resolution
 */
/** A `"moduleResolution"` entry set to a classic, non-`exports`-aware value. */
const CLASSIC_RESOLUTION = /("moduleResolution"\s*:\s*")(node|node10|classic)(")/gi;
/**
 * TypeScript rejects `bundler` resolution unless `module` is `preserve` or an ES
 * variant (TS5095). These are Node-side configs (Angular SSR, web workers) that
 * never resolve `@ionic/angular` subpaths, so rewriting one would only break the
 * build.
 */
const COMMONJS_MODULE = /"module"\s*:\s*"(commonjs|node16|nodenext)"/i;
const TSCONFIG_GLOBS = ['**/tsconfig*.json'];
const DETAIL = 'set moduleResolution to "bundler" so @ionic/angular subpaths resolve';

/**
 * The rewritten line, or `undefined` when there is nothing to change. A match
 * behind a `//` is left alone. Shared by detect/fix so the report and the edit
 * can't disagree.
 */
function rewrite(line: string): string | undefined {
  const match = line.search(new RegExp(CLASSIC_RESOLUTION.source, 'i'));
  if (match === -1) return undefined;
  const comment = line.indexOf('//');
  if (comment !== -1 && comment < match) return undefined;
  return line.replace(new RegExp(CLASSIC_RESOLUTION.source, 'gi'), '$1bundler$3');
}

export const angularModuleResolution: Migration = {
  id: 'angular-module-resolution',
  framework: 'angular',
  fromMajor: 8,
  toMajor: 9,
  status: 'stable',
  docsUrl: 'https://ionicframework.com/docs/updating/9-0#module-resolution',

  detect(ctx) {
    const findings: Finding[] = [];
    for (const filePath of ctx.glob(TSCONFIG_GLOBS)) {
      const text = ctx.readFile(filePath);
      if (text === undefined || COMMONJS_MODULE.test(text)) continue;
      text.split('\n').forEach((line, i) => {
        if (rewrite(line) !== undefined) {
          findings.push({ filePath, line: i + 1, detail: DETAIL });
        }
      });
    }
    return findings;
  },

  fix(ctx) {
    for (const filePath of ctx.glob(TSCONFIG_GLOBS)) {
      const text = ctx.readFile(filePath);
      if (text === undefined || COMMONJS_MODULE.test(text)) continue;
      const next = text
        .split('\n')
        .map((line) => rewrite(line) ?? line)
        .join('\n');
      if (next !== text) ctx.writeFile(filePath, next);
    }
  },
};

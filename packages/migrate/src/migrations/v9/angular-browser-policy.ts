import { compareVersions, isPlainSemverRange, parseMajor } from '../../detect.js';
import { findDependency, readPackageJson } from '../../ast/package-json.js';
import type { MigrationContext } from '../../context.js';
import type { Finding, Migration } from '../../types.js';
import { browserslistSources, raiseEntry, rewriteBrowserslists } from '../../ast/browserslist.js';

/**
 * Angular's own browser support policy, resolved the way the Angular CLI
 * resolves it. Shared by `angular-browser-policy-manual` and the auto-fix below.
 *
 * From Angular 20 on, `@angular/build` warns for every browser below its policy,
 * so an app on the v9 guide's floors (Chrome 89, Safari 16) builds with warnings.
 * The policy is read from the installed `@angular/build` and evaluated with the
 * project's own `browserslist` rather than copied into a table here: on 21+ it is
 * a rolling `baseline widely available on <date>` query whose resolved versions
 * depend on the project's `caniuse-lite`, so a table would drift.
 *
 * See https://ionicframework.com/docs/updating/9-0#browser-support
 */
/** The first Angular whose CLI enforces a browser support policy of its own. */
export const BROWSER_POLICY_ANGULAR = 20;

/**
 * Packages to resolve `@angular/build` through. An app on the devkit builder has
 * no direct dependency on it, so it resolves from that package instead.
 */
const BUILD_PACKAGE_OWNERS = ['@angular/build', '@angular-devkit/build-angular'];

/** Angular 21+ resolves its policy from this constant instead of a static file. */
const BASELINE_DATE = /BASELINE_DATE\s*=\s*['"](\d{4}-\d{2}-\d{2})['"]/;

/**
 * caniuse browser ids mapped to the browserslist config names projects write.
 *
 * `and_chr`/`and_ff` are left out on purpose. caniuse carries one version for the
 * Android browsers, the current release, so any query resolves to that single
 * entry - both Angular's policy and the project's own list. The CLI's comparison
 * can never fail on them, and taking that version as a floor would report a
 * warning the build does not emit and move with every `caniuse-lite` update.
 */
const CANIUSE_NAMES: Record<string, string> = {
  chrome: 'Chrome',
  edge: 'Edge',
  firefox: 'Firefox',
  safari: 'Safari',
  ios_saf: 'iOS',
};

/** The Angular major the project is on, when it is a comparable version. */
export function angularMajor(ctx: MigrationContext): number | undefined {
  const parsed = readPackageJson(ctx);
  if (!parsed) return undefined;
  const dep = findDependency(parsed.pkg, '@angular/core');
  if (!dep || !isPlainSemverRange(dep.range)) return undefined;
  return parseMajor(dep.range);
}

/**
 * Absolute directories `@angular/build` is installed in. Resolved rather than
 * guessed at: pnpm links it outside the importer's own `node_modules`, and a
 * workspace can hoist it above the project.
 */
function buildPackageDirs(ctx: MigrationContext): string[] {
  const dirs: string[] = [];
  for (const owner of BUILD_PACKAGE_OWNERS) {
    // Resolved through `package.json`, the one subpath a package's `exports` map
    // can never block.
    const manifest = ctx.resolveFromProject(`${owner}/package.json`);
    if (manifest === undefined) continue;
    // Kept absolute: the package can sit outside the project (hoisted, pnpm).
    const dir = manifest.slice(0, manifest.lastIndexOf('/'));
    // The devkit builder owns `@angular/build` as a dependency, so resolve on
    // through it rather than reading the builder's own package.
    dirs.push(owner === '@angular/build' ? dir : `${dir}/node_modules/@angular/build`);
  }
  return dirs;
}

/**
 * The browserslist query describing Angular's policy: the static file it ships
 * on 20, or the baseline query it builds from `BASELINE_DATE` on 21+.
 */
function policyQuery(ctx: MigrationContext): string | string[] | undefined {
  for (const dir of buildPackageDirs(ctx)) {
    const staticList = ctx.readFile(`${dir}/.browserslistrc`);
    if (staticList !== undefined) {
      const queries = staticList
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0 && !line.startsWith('#'));
      if (queries.length > 0) return queries;
    }

    const date = BASELINE_DATE.exec(ctx.readFile(`${dir}/src/utils/supported-browsers.js`) ?? '')?.[1];
    if (date !== undefined) return `baseline widely available on ${date}`;
  }
  return undefined;
}

/**
 * The lowest version Angular supports for each browser a project can name, or
 * `undefined` when the policy cannot be resolved - no `@angular/build`
 * installed, no `browserslist` to evaluate it with, or a query neither
 * understands. Callers must treat that as "report only", never as "no floors".
 */
export function angularPolicyFloors(ctx: MigrationContext): Record<string, string> | undefined {
  const query = policyQuery(ctx);
  if (query === undefined) return undefined;

  const browserslist = ctx.requireFromProject<(q: string | string[]) => string[]>('browserslist');
  if (typeof browserslist !== 'function') return undefined;

  let resolved: string[];
  try {
    resolved = browserslist(query);
  } catch {
    return undefined;
  }

  const floors: Record<string, string> = {};
  for (const entry of resolved) {
    const [id, versions] = entry.split(' ');
    const name = CANIUSE_NAMES[id];
    if (name === undefined || versions === undefined) continue;
    // A resolved entry can cover a range (`ios_saf 16.6-16.7`). Its lower bound
    // is the version actually supported from.
    const version = versions.split('-')[0];
    // A non-numeric version (`safari TP`) would compare as NaN and then be
    // written into the project's list verbatim.
    if (!/^\d+(\.\d+)*$/.test(version)) continue;
    const current = floors[name.toLowerCase()];
    if (current === undefined || compareVersions(version, current) < 0) {
      floors[name.toLowerCase()] = version;
    }
  }
  return Object.keys(floors).length > 0 ? floors : undefined;
}

function applicableFloors(ctx: MigrationContext): Record<string, string> | undefined {
  const major = angularMajor(ctx);
  if (major === undefined || major < BROWSER_POLICY_ANGULAR) return undefined;
  return angularPolicyFloors(ctx);
}

/**
 * Raises every entry below Angular's policy. Experimental because it narrows the
 * app's support matrix and raises the build's syntax target with it, so output
 * can stop working on a browser that previously only warned.
 *
 * Runs before `angular-browser-policy-manual`, which reports the same entries:
 * migrations are selected in id order, so the report re-reads the rewritten list
 * and stays quiet. Renaming either id breaks that.
 */
export const angularBrowserPolicy: Migration = {
  id: 'angular-browser-policy',
  framework: 'angular',
  fromMajor: 8,
  toMajor: 9,
  status: 'experimental',
  docsUrl: 'https://ionicframework.com/docs/updating/9-0#browser-support',

  detect(ctx) {
    const floors = applicableFloors(ctx);
    if (floors === undefined) return [];

    const major = angularMajor(ctx);
    const findings: Finding[] = [];
    for (const source of browserslistSources(ctx)) {
      for (const entry of source.entries) {
        const raised = raiseEntry(entry.text, floors);
        if (raised) {
          findings.push({
            filePath: source.filePath,
            line: entry.line,
            detail: `${raised.name} >=${raised.from} -> >=${raised.to} (Angular ${major} browser policy)`,
          });
        }
      }
    }
    return findings;
  },

  fix(ctx) {
    const floors = applicableFloors(ctx);
    if (floors === undefined) return;
    rewriteBrowserslists(ctx, (entry) => raiseEntry(entry, floors)?.line ?? entry);
  },
};

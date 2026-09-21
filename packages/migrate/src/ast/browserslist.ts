import { compareVersions } from '../detect.js';
import { writePackageJson } from './package-json.js';
import type { PackageJson } from './package-json.js';
import type { MigrationContext } from '../context.js';

/**
 * Reading and rewriting the browserslist a project declares, shared by the four
 * browserslist migrations: `core-browserslist` and `angular-browser-policy` raise
 * floors, their `-manual` companions report against them. Entries are edited in
 * place.
 */
/**
 * A `Name >=Version` entry, the shape the Ionic starters generate. The version
 * is captured whole so raising `Safari >=15.4` writes `>=16`, not `>=16.4`. The
 * optional `\r` keeps a CRLF checkout from matching nothing.
 */
const ENTRY = /^(\s*)([A-Za-z_]+)(\s*>=\s*)(\d+(?:\.\d+)*)(.*?)\r?$/;

const BROWSERSLIST_GLOBS = ['**/.browserslistrc', '**/browserslist'];

/**
 * The browser an entry names, lowercased, or `undefined` for a query
 * (`last 2 versions`) rather than a named entry.
 */
export function entryBrowser(entry: string): string | undefined {
  return ENTRY.exec(entry)?.[2].toLowerCase();
}

/** A browserslist entry rewritten to meet a floor. */
export interface RaisedEntry {
  /** Browser name as the project wrote it. */
  name: string;
  from: string;
  to: string;
  /** The whole line, rewritten. */
  line: string;
}

/**
 * The raised version of a browserslist line against a set of floors, or
 * `undefined` when the line is not a named entry or already meets its floor.
 * Shared by detect/fix so the report and the edit can never disagree.
 *
 * Floors compare as dotted versions, so an integer floor of `16` is met by
 * `Safari >=16.3`, and a floor of `16.4` is not.
 */
export function raiseEntry(line: string, floors: Record<string, string | number>): RaisedEntry | undefined {
  const m = ENTRY.exec(line);
  if (!m) return undefined;
  const [, indent, name, op, version, rest] = m;
  const floor = floors[name.toLowerCase()];
  if (floor === undefined) return undefined;
  const to = String(floor);
  if (compareVersions(version, to) >= 0) return undefined;
  const crlf = line.endsWith('\r') ? '\r' : '';
  return { name, from: version, to, line: `${indent}${name}${op}${to}${rest}${crlf}` };
}

/**
 * The `browserslist` field's entries, flattened. The field is a query string, an
 * array of them, or an object keyed by environment (`production`, `development`)
 * whose values are either - so all three shapes are walked the same way.
 */
function fieldEntries(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(fieldEntries);
  if (value && typeof value === 'object') return Object.values(value).flatMap(fieldEntries);
  return [];
}

/** Every entry of a `browserslist` field value, rewritten through `map`. */
function mapField(value: unknown, map: (entry: string) => string): unknown {
  if (typeof value === 'string') return map(value);
  if (Array.isArray(value)) return value.map((v) => mapField(v, map));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([env, v]) => [env, mapField(v, map)]));
  }
  return value;
}

/** 1-based line of the character at `index`. A missing index (`-1`) reads as line 1. */
function lineOf(text: string, index: number): number {
  return index === -1 ? 1 : text.slice(0, index).split('\n').length;
}

/**
 * Where the `browserslist` field itself starts. Matched with its opening bracket
 * so a `"browserslist"` devDependency, which holds a string, isn't taken for it.
 */
function fieldLine(pkgText: string): number {
  return lineOf(pkgText, pkgText.search(/"browserslist"\s*:\s*[[{]/));
}

/** A manifest that declares a `browserslist` field, with its raw text. */
interface PackageBrowserslist {
  filePath: string;
  pkg: PackageJson;
  text: string;
  field: unknown;
}

/**
 * Every `package.json` declaring a `browserslist`, globbed like the list files
 * are: a workspace keeps one manifest per app, and only some of them set it.
 */
function packageBrowserslists(ctx: MigrationContext): PackageBrowserslist[] {
  const found: PackageBrowserslist[] = [];
  for (const filePath of ctx.glob(['**/package.json'])) {
    const text = ctx.readFile(filePath);
    if (text === undefined) continue;
    let pkg: PackageJson;
    try {
      pkg = JSON.parse(text) as PackageJson;
    } catch {
      continue;
    }
    if (pkg.browserslist !== undefined) found.push({ filePath, pkg, text, field: pkg.browserslist });
  }
  return found;
}

/** One place a project declares its browserslist, flattened for reporting. */
export interface BrowserslistSource {
  /** Path to report findings against. */
  filePath: string;
  /** 1-based line the list itself starts at. */
  line: number;
  /** Every entry in the list, with the line it sits on. */
  entries: { text: string; line: number }[];
}

/**
 * Every browserslist the project declares: the `.browserslistrc`/`browserslist`
 * files, and the `package.json` field the Angular starters generate.
 */
export function browserslistSources(ctx: MigrationContext): BrowserslistSource[] {
  const sources: BrowserslistSource[] = [];

  for (const filePath of ctx.glob(BROWSERSLIST_GLOBS)) {
    const text = ctx.readFile(filePath);
    if (text === undefined) continue;
    sources.push({
      filePath,
      line: 1,
      entries: text.split('\n').map((line, i) => ({ text: line, line: i + 1 })),
    });
  }

  for (const pkg of packageBrowserslists(ctx)) {
    // Entries are located in order from a moving cursor, so the same query under
    // two environment keys reports two lines rather than the first one twice.
    let cursor = 0;
    sources.push({
      filePath: pkg.filePath,
      line: fieldLine(pkg.text),
      entries: fieldEntries(pkg.field).map((entry) => {
        const index = pkg.text.indexOf(JSON.stringify(entry), cursor);
        if (index !== -1) cursor = index + 1;
        return { text: entry, line: lineOf(pkg.text, index) };
      }),
    });
  }

  return sources;
}

/**
 * Rewrite every entry of every browserslist the project declares through `map`,
 * writing back only the sources that changed.
 *
 * The manifest path reserializes the whole file (2-space, trailing newline), the
 * same way the version bump already does.
 */
export function rewriteBrowserslists(ctx: MigrationContext, map: (entry: string) => string): void {
  for (const filePath of ctx.glob(BROWSERSLIST_GLOBS)) {
    const text = ctx.readFile(filePath);
    if (text === undefined) continue;
    const next = text.split('\n').map(map).join('\n');
    if (next !== text) ctx.writeFile(filePath, next);
  }

  for (const pkg of packageBrowserslists(ctx)) {
    const nextField = mapField(pkg.field, map);
    if (JSON.stringify(nextField) !== JSON.stringify(pkg.field)) {
      writePackageJson(ctx, { ...pkg.pkg, browserslist: nextField }, pkg.filePath);
    }
  }
}

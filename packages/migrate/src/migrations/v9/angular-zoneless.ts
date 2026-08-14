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
 * A module specifier that loads Zone.js into the app: `zone.js`,
 * `zone.js/dist/zone`. `zone.js/testing` is excluded - a karma setup that patches
 * Zone.js for tests says nothing about how the app itself bootstraps.
 */
const ZONE_MODULE = /^zone\.js(?!\/testing)(\/|$)/;

/** Workspace configs that declare the `polyfills` a build loads. */
const WORKSPACE_CONFIGS = ['**/angular.json', '**/project.json', '**/workspace.json'];

/**
 * Every `polyfills` entry a parsed config declares. The `test` target is skipped:
 * its polyfills belong to karma, not to the app's bootstrap, and the CLI still
 * scaffolds Zone.js there for an app that runs zoneless.
 */
function polyfillsEntries(node: unknown): string[] {
  if (Array.isArray(node)) return node.flatMap(polyfillsEntries);
  if (node === null || typeof node !== 'object') return [];
  const found: string[] = [];
  for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
    if (key === 'test') continue;
    if (key === 'polyfills') {
      for (const entry of Array.isArray(value) ? value : [value]) {
        if (typeof entry === 'string') found.push(entry);
      }
    }
    found.push(...polyfillsEntries(value));
  }
  return found;
}

/** A project declared by a workspace config, with the polyfills it loads. */
interface DeclaredProject {
  /** Directory the project lives in, relative to the workspace root. */
  root: string;
  /** Entries its build loads, either module specifiers or workspace paths. */
  polyfills: string[];
}

/**
 * A project's root as a plain relative prefix. A config can spell "here" as `''`,
 * `'.'`, or `'./'`, and any of the last two would fail every `underRoot` test.
 */
function normalizeRoot(dir: string, declared: string): string {
  return [dir, declared.replace(/^\.\/?/, '').replace(/\/+$/, '')].filter(Boolean).join('/');
}

/** Whether a project-relative path sits under `root` (`''` is the whole tree). */
function underRoot(path: string, root: string): boolean {
  return root === '' || path === root || path.startsWith(`${root}/`);
}

/**
 * Every project any workspace config declares. A monorepo's `angular.json` lists
 * one entry per app, each with its own `root` and `polyfills`, so they have to be
 * read separately - one app keeping Zone.js says nothing about its neighbor.
 */
function declaredProjects(ctx: MigrationContext): DeclaredProject[] {
  const projects: DeclaredProject[] = [];
  for (const configPath of ctx.glob(WORKSPACE_CONFIGS)) {
    const text = ctx.readFile(configPath);
    if (text === undefined) continue;
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      // A config we cannot parse tells us nothing; the import scan still applies.
      continue;
    }
    const dir = configPath.includes('/') ? configPath.slice(0, configPath.lastIndexOf('/')) : '';
    const entries = (parsed as { projects?: unknown }).projects;
    if (entries !== null && typeof entries === 'object') {
      for (const project of Object.values(entries as Record<string, unknown>)) {
        const declared = (project as { root?: unknown }).root;
        const root = typeof declared === 'string' ? declared : '';
        projects.push({ root: normalizeRoot(dir, root), polyfills: polyfillsEntries(project) });
      }
    } else {
      // Nx's `project.json` holds a single project, rooted where it sits.
      projects.push({ root: normalizeRoot(dir, ''), polyfills: polyfillsEntries(parsed) });
    }
  }
  return projects;
}

/** Whether any of these source files imports Zone.js. */
function importsZone(ctx: MigrationContext, matches: (path: string) => boolean): boolean {
  return ctx.project
    .getSourceFiles()
    .some(
      (file) =>
        matches(ctx.relative(file.getFilePath())) &&
        file.getImportDeclarations().some((d) => ZONE_MODULE.test(d.getModuleSpecifierValue()))
    );
}

/**
 * Whether the project owning `filePath` loads Zone.js.
 * `provideZoneChangeDetection()` throws at bootstrap without it, so an app
 * already running zoneless (Angular 21+ scaffolds omit Zone.js entirely) must be
 * left alone - there is no Zone.js behavior to preserve.
 *
 * A `zone.js` dependency in `package.json` is not enough on its own, so this
 * looks at what the build actually loads: the project's `polyfills` entries,
 * either naming the module directly or pointing at a file that imports it. A
 * project with no declared polyfills falls back to scanning its own directory,
 * which is all a config-less project (or an Nx target shape we don't read) leaves
 * to go on.
 */
export function loadsZoneJs(ctx: MigrationContext, filePath: string): boolean {
  const projects = declaredProjects(ctx);
  // The innermost project containing a path. Several configs can declare the same
  // root, so they merge rather than one shadowing the other by glob order.
  const ownerOf = (path: string): { root: string; polyfills: string[] } | undefined => {
    const matches = projects.filter((project) => underRoot(path, project.root));
    if (matches.length === 0) return undefined;
    const root = matches.reduce((deepest, p) => (p.root.length > deepest.length ? p.root : deepest), '');
    return { root, polyfills: matches.filter((p) => p.root === root).flatMap((p) => p.polyfills) };
  };

  const owner = ownerOf(ctx.relative(filePath));

  if (owner !== undefined && owner.polyfills.length > 0) {
    if (owner.polyfills.some((entry) => ZONE_MODULE.test(entry))) return true;
    // Declared polyfills are workspace-relative paths, so only those files count.
    const declared = new Set(owner.polyfills.map((entry) => entry.replace(/^\.\//, '')));
    return importsZone(ctx, (sourcePath) => declared.has(sourcePath));
  }

  // Nothing declared, so fall back to the project's own files, excluding any that
  // belong to a project nested inside it.
  return importsZone(ctx, (sourcePath) => ownerOf(sourcePath)?.root === owner?.root);
}

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
      if (!loadsZoneJs(ctx, file.getFilePath())) continue;
      arrays.push(arr);
    }
  }
  return arrays;
}

/**
 * Prepend the provider to a `providers` array as text, matching the indentation
 * of the element it goes in front of. ts-morph's `insertElement` re-indents from
 * its own settings rather than the file's, which lands an 8-space line in a
 * 4-space array - and these apps often have no Prettier for the post-run format
 * pass to clean up after.
 */
function prependProvider(arr: ArrayLiteralExpression): void {
  const file = arr.getSourceFile();
  const first = arr.getElements()[0];
  if (!first) {
    arr.insertElement(0, `${PROVIDER}()`);
    return;
  }
  const start = first.getStart();
  const text = file.getFullText();
  const indent = text.slice(text.lastIndexOf('\n', start - 1) + 1, start);
  // Reuse the indentation only when that element starts its own line; a
  // single-line array (`providers: [a, b]`) stays on one line.
  file.insertText(start, /^[ \t]*$/.test(indent) ? `${PROVIDER}(),\n${indent}` : `${PROVIDER}(), `);
}

function addProviderImport(ctx: MigrationContext, filePath: string): void {
  const file = ctx.project.getSourceFileOrThrow(filePath);
  // A type-only import is skipped rather than extended: adding the provider to
  // `import type { ... }` elides it at compile time, so the call in the providers
  // array becomes a ReferenceError.
  const coreImport = file.getImportDeclaration((d) => d.getModuleSpecifierValue() === CORE_MODULE && !d.isTypeOnly());
  if (!coreImport) {
    file.addImportDeclaration({ moduleSpecifier: CORE_MODULE, namedImports: [PROVIDER] });
  } else if (!coreImport.getNamedImports().some((n) => n.getName() === PROVIDER)) {
    coreImport.addNamedImport(PROVIDER);
  }
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
    // A text insert forgets every node in that file, so the match list is
    // re-queried after each edit rather than iterated. Each fixed array now
    // holds a zone provider, so it drops out of the next query and the loop
    // converges; the counter is a backstop against an edit that does not.
    for (let remaining = targetProvidersArrays(ctx).length; remaining > 0; remaining--) {
      const [arr] = targetProvidersArrays(ctx);
      if (!arr) break;
      const filePath = arr.getSourceFile().getFilePath();
      prependProvider(arr);
      addProviderImport(ctx, filePath);
    }
  },
};

import type { MigrationContext } from '../context.js';
import type { Finding } from '../types.js';

/**
 * What a {@link scanLines} matcher says about a line. A bare string is the
 * detail, and the finding inherits the migration's `docsUrl`. The object form
 * overrides it, for a migration spanning several sections of the guide.
 */
export type ScanMatch = string | { detail: string; docsUrl: string };

/**
 * Scan matching files line by line, emitting a {@link Finding} for every line
 * the `matcher` returns a match for. Used by report-only migrations where
 * precise locations matter more than AST fidelity.
 */
export function scanLines(
  ctx: MigrationContext,
  globs: string[],
  matcher: (line: string) => ScanMatch | undefined
): Finding[] {
  const findings: Finding[] = [];
  for (const filePath of ctx.glob(globs)) {
    const text = ctx.readFile(filePath);
    if (text === undefined) continue;
    text.split('\n').forEach((line, i) => {
      const match = matcher(line);
      if (match === undefined) return;
      const { detail, docsUrl } = typeof match === 'string' ? { detail: match, docsUrl: undefined } : match;
      findings.push({ filePath, line: i + 1, detail, ...(docsUrl ? { docsUrl } : {}) });
    });
  }
  return findings;
}

/** Common file globs for source that may contain templates/markup. */
export const SOURCE_GLOBS = ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx', '**/*.html', '**/*.vue'];

/** Stylesheets, for the breaks that only surface in an app's own CSS. */
export const STYLE_GLOBS = ['**/*.css', '**/*.scss'];

/**
 * Markup that can hold Ionic elements with attributes worth reading. Includes
 * `.jsx` so a JavaScript React app gets the report-only template migrations,
 * the coverage `context.ts` gives it in place of the ts-morph ones.
 */
export const TEMPLATE_GLOBS = ['**/*.html', '**/*.vue', '**/*.tsx', '**/*.jsx'];

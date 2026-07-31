import type { MigrationContext } from '../context.js';
import type { Finding } from '../types.js';

/**
 * Scan matching files line by line, emitting a {@link Finding} for every line
 * the `matcher` returns a detail string for. Used by report-only migrations
 * where precise locations matter more than AST fidelity.
 */
export function scanLines(
  ctx: MigrationContext,
  globs: string[],
  matcher: (line: string) => string | undefined
): Finding[] {
  const findings: Finding[] = [];
  for (const filePath of ctx.glob(globs)) {
    const text = ctx.readFile(filePath);
    if (text === undefined) continue;
    text.split('\n').forEach((line, i) => {
      const detail = matcher(line);
      if (detail !== undefined) {
        findings.push({ filePath, line: i + 1, detail });
      }
    });
  }
  return findings;
}

/** Common file globs for source that may contain templates/markup. */
export const SOURCE_GLOBS = ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx', '**/*.html', '**/*.vue'];

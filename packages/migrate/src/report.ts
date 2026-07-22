import type { RunResult } from './runner.js';

/**
 * Render a "doctor" report of a run: one section per migration that matched,
 * grouped by whether it was auto-applied or needs manual work, each with its
 * finding count and docs link. Plain ASCII so it renders in any terminal and
 * copy-pastes without mangling.
 */
export function buildReport(result: RunResult): string {
  if (result.entries.length === 0) {
    return 'No applicable Ionic migrations found. Nothing to do.';
  }

  // Bucket by whether the migration can auto-fix, not by whether it ran, so a
  // dry run still shows which changes are automatic vs. manual.
  const auto = result.entries.filter((e) => e.migration.fix !== undefined);
  const manual = result.entries.filter((e) => e.migration.fix === undefined);
  const lines: string[] = [];

  if (auto.length > 0) {
    const applied = auto.some((e) => e.applied);
    lines.push(
      applied
        ? `Applied ${auto.length} automatic migration(s):`
        : `${auto.length} migration(s) can be auto-fixed (dry run - nothing written):`
    );
    for (const entry of auto) {
      lines.push(
        `  [${entry.applied ? 'fixed' : 'would-fix'}] ${entry.migration.id} (${entry.findings.length} change(s))`
      );
    }
    lines.push('');
  }

  if (manual.length > 0) {
    lines.push(`${manual.length} migration(s) need manual review:`);
    for (const entry of manual) {
      lines.push(`  [todo]  ${entry.migration.id} (${entry.findings.length} location(s))`);
      for (const finding of entry.findings) {
        lines.push(`            ${finding.filePath}:${finding.line} - ${finding.detail}`);
      }
      lines.push(`            see ${entry.migration.docsUrl}`);
    }
  }

  return lines.join('\n').trimEnd();
}

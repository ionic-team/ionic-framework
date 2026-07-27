import type { RunResult } from './runner.js';
import { bold, cyan, dim, green, yellow } from './style.js';

/**
 * Render a "doctor" report of a run: one section per matched migration, grouped
 * into auto-applied vs. needs-manual-work, each with a finding count and docs
 * link. Auto-fix findings also list their detail, not just a count. Styling
 * comes from {@link ./style.js}, which no-ops to plain ASCII off a TTY.
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
      bold(
        applied
          ? `Applied ${auto.length} automatic migration(s):`
          : `${auto.length} migration(s) can be auto-fixed (dry run - nothing written):`
      )
    );
    for (const entry of auto) {
      const tag = entry.applied ? green('[fixed]') : yellow('[would-fix]');
      lines.push(`  ${tag} ${bold(entry.migration.id)} (${entry.findings.length} change(s))`);
      for (const finding of entry.findings) {
        lines.push(`            ${dim(`${finding.filePath}:${finding.line}`)} - ${finding.detail}`);
      }
    }
    lines.push('');
  }

  if (manual.length > 0) {
    lines.push(bold(yellow(`${manual.length} migration(s) need manual review:`)));
    for (const entry of manual) {
      lines.push(`  ${yellow('[todo]')}  ${bold(entry.migration.id)} (${entry.findings.length} location(s))`);
      for (const finding of entry.findings) {
        lines.push(`            ${dim(`${finding.filePath}:${finding.line}`)} - ${finding.detail}`);
      }
      lines.push(`            see ${cyan(entry.migration.docsUrl)}`);
    }
  }

  return lines.join('\n').trimEnd();
}

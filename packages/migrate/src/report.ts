import type { RunEntry, RunResult } from './runner.js';
import type { Finding } from './types.js';
import { bold, brightBlue, cyan, dim, green, yellow } from './style.js';

/** Findings that share a docs section, in the order the sections first appear. */
interface DocsGroup {
  docsUrl: string;
  findings: Finding[];
}

/**
 * Group an entry's findings by the docs section each one points at. A migration
 * covering one breaking change collapses to a single group: every finding, then
 * one link. The ones covering several keep each finding next to the subsection
 * that explains it.
 */
function groupByDocs(entry: RunEntry): DocsGroup[] {
  const groups = new Map<string, Finding[]>();
  for (const finding of entry.findings) {
    const url = finding.docsUrl ?? entry.migration.docsUrl;
    const existing = groups.get(url);
    if (existing) {
      existing.push(finding);
    } else {
      groups.set(url, [finding]);
    }
  }
  return [...groups].map(([docsUrl, findings]) => ({ docsUrl, findings }));
}

/**
 * Render one entry's findings, grouped by docs section with a link per group.
 *
 * `review` is for work the developer still owes, `docs` for a change the tool
 * handles itself. Color is off when piped (refer to {@link ./style.js}), so the label
 * is all that separates the two buckets line by line in CI.
 */
function findingLines(entry: RunEntry, linkLabel: 'docs' | 'review'): string[] {
  const lines: string[] = [];
  for (const group of groupByDocs(entry)) {
    for (const finding of group.findings) {
      lines.push(`            ${dim(`${finding.filePath}:${finding.line}`)} - ${finding.detail}`);
    }
    lines.push(`            ${linkLabel} ${cyan(group.docsUrl)}`);
  }
  return lines;
}

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
      // Blue, not yellow: a pending auto-fix is informational, and yellow next
      // to the manual-review section reads as a warning about the app.
      const tag = entry.applied ? green('[fixed]') : brightBlue('[would-fix]');
      lines.push(`  ${tag} ${bold(entry.migration.id)} (${entry.findings.length} change(s))`);
      lines.push(...findingLines(entry, 'docs'));
    }
    lines.push('');
  }

  if (manual.length > 0) {
    lines.push(bold(yellow(`${manual.length} migration(s) need manual review:`)));
    for (const entry of manual) {
      lines.push(`  ${yellow('[todo]')}  ${bold(entry.migration.id)} (${entry.findings.length} location(s))`);
      lines.push(...findingLines(entry, 'review'));
    }
  }

  return lines.join('\n').trimEnd();
}

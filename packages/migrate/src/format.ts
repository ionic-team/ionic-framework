import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

import type { MigrationContext } from './context.js';

/**
 * Formats touched files after a run. Injectable so the CLI can wire the real
 * Prettier while tests use a fake.
 */
export interface Formatter {
  /** Whether a formatter is available for the project at `rootDir`. */
  available(rootDir: string): boolean;
  /** Format the given project-relative files in place. */
  run(rootDir: string, files: string[]): void;
}

/**
 * Run the formatter over the files a migration run touched, so AST-based edits
 * (e.g. ts-morph re-indenting an inserted array element) land as clean diffs.
 * No-op when nothing was touched or no formatter is available. Returns the files
 * handed to the formatter.
 */
export function formatTouched(ctx: MigrationContext, formatter: Formatter): string[] {
  const files = [...ctx.touchedFiles].sort();
  if (files.length === 0 || !formatter.available(ctx.rootDir)) return [];
  formatter.run(ctx.rootDir, files);
  return files;
}

/**
 * The project's own Prettier, if it has one installed. Using the project's
 * binary (and therefore its config) keeps formatting consistent with the rest
 * of the codebase; `--ignore-unknown` skips files Prettier has no parser for
 * instead of failing the run.
 */
export const prettierFormatter: Formatter = {
  available(rootDir) {
    return existsSync(join(rootDir, 'node_modules', '.bin', 'prettier'));
  },
  run(rootDir, files) {
    execFileSync(join(rootDir, 'node_modules', '.bin', 'prettier'), ['--write', '--ignore-unknown', ...files], {
      cwd: rootDir,
      // Suppress Prettier's per-file stdout on success, but keep stderr so a
      // failure surfaces a real diagnostic instead of a bare "Command failed".
      stdio: ['ignore', 'ignore', 'pipe'],
    });
  },
};

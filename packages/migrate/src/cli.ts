#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { resolve } from 'node:path';

import { createDiskContext } from './context.js';
import { detectFrameworks } from './detect.js';
import { selectMigrations } from './registry.js';
import { run } from './runner.js';
import { buildReport } from './report.js';
import { formatTouched, prettierFormatter } from './format.js';
import { allMigrations } from './migrations/index.js';

interface Args {
  dir: string;
  dryRun: boolean;
  check: boolean;
  experimental: boolean;
  force: boolean;
  noFormat: boolean;
  help: boolean;
  from?: number;
  to?: number;
}

const USAGE = `Usage: ionic-migrate [dir] [options]

Detect and apply Ionic Framework breaking-change migrations. With no options,
edits are written in place (commit first - git is your undo).

Options:
  --dry-run        Report what would change without writing anything
  --check          Report only. Exit non-zero if any migration applies (for CI)
  --experimental   Include experimental migrations
  --force          Write even if the working tree is dirty or not a git repo
  --no-format      Skip running the project's Prettier over changed files
  --from <major>   Override the detected source major version
  --to <major>     Override the target major version
  -h, --help       Show this help`;

/** Parse a `--from`/`--to` value into a finite integer, or exit on bad input. */
function parseMajorArg(flag: string, value: string | undefined): number {
  const n = Number(value);
  if (value === undefined || !Number.isInteger(n)) {
    console.error(`Invalid value for ${flag}: expected an integer, got ${value ?? '(missing)'}`);
    process.exit(1);
  }
  return n;
}

function parseArgs(argv: string[]): Args {
  const args: Args = {
    dir: '.',
    dryRun: false,
    check: false,
    experimental: false,
    force: false,
    noFormat: false,
    help: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run') args.dryRun = true;
    else if (a === '--check') args.check = true;
    else if (a === '--experimental') args.experimental = true;
    else if (a === '--force') args.force = true;
    else if (a === '--no-format') args.noFormat = true;
    else if (a === '--help' || a === '-h') args.help = true;
    else if (a === '--from') args.from = parseMajorArg('--from', argv[++i]);
    else if (a === '--to') args.to = parseMajorArg('--to', argv[++i]);
    else if (a.startsWith('-')) {
      console.error(`Unknown option: ${a}\n\n${USAGE}`);
      process.exit(1);
    } else args.dir = a;
  }
  return args;
}

/** Returns true/false for clean/dirty, or null when the dir is not a git repo. */
function isWorkingTreeClean(dir: string): boolean | null {
  try {
    const out = execSync('git status --porcelain', {
      cwd: dir,
      stdio: ['ignore', 'pipe', 'ignore'],
      // A repo with very many changed files can exceed the 1 MB default and
      // throw, which we'd otherwise misread as "not a git repo".
      maxBuffer: 64 * 1024 * 1024,
    });
    return out.toString().trim() === '';
  } catch {
    return null;
  }
}

function main(): void {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(USAGE);
    return;
  }
  const rootDir = resolve(args.dir);
  const ctx = createDiskContext(rootDir);

  const detected = detectFrameworks(ctx);
  if (detected.length === 0) {
    console.log(`No @ionic/{angular,react,vue} dependency found in ${rootDir}. Nothing to do.`);
    return;
  }

  const detectedMajor = Math.min(...detected.map((d) => d.major));
  // A `--from` below the detected major re-selects migrations the project has
  // already had applied. Some (e.g. angular-standalone-imports) are single-shot
  // and corrupt already-migrated code if re-run, so require --force to override
  // the version gate deliberately.
  if (args.from !== undefined && args.from < detectedMajor && !args.force) {
    console.error(
      `Refusing to run: --from ${args.from} is below the detected major (${detectedMajor}).\n` +
        'Re-running migrations that were already applied can corrupt your code.\n' +
        'Re-run with --force if you are sure.'
    );
    process.exit(1);
  }

  const fromMajor = args.from ?? detectedMajor;
  const toMajor = args.to ?? fromMajor + 1;
  const frameworks = detected.map((d) => d.framework);
  const migrations = selectMigrations(allMigrations, {
    fromMajor,
    toMajor,
    frameworks,
    includeExperimental: args.experimental,
  });

  const label = detected.map((d) => `${d.framework}@${d.major}`).join(', ');
  console.log(`Ionic migrate: ${label}  (v${fromMajor} -> v${toMajor}, ${migrations.length} migration(s))\n`);

  const writing = !args.dryRun && !args.check;
  if (writing && !args.force) {
    const clean = isWorkingTreeClean(rootDir);
    if (clean === false) {
      console.error(
        'Refusing to write: the working tree has uncommitted changes.\n' +
          'Commit or stash first (git is your undo), or re-run with --force.'
      );
      process.exit(1);
    }
    if (clean === null) {
      console.error(
        `Refusing to write: ${rootDir} is not a git repository, so there is no undo.\n` +
          'Initialize git (or another backup) first, or re-run with --force.'
      );
      process.exit(1);
    }
  }

  const result = run(ctx, migrations, { dryRun: !writing });
  console.log(buildReport(result));

  if (writing && !args.noFormat) {
    try {
      const formatted = formatTouched(ctx, prettierFormatter);
      if (formatted.length > 0) {
        console.log(`\nFormatted ${formatted.length} changed file(s) with Prettier.`);
      }
    } catch (e) {
      // Formatting is cosmetic and runs after the edits are already on disk, so
      // a formatter failure must not fail the migration. Warn (surfacing
      // Prettier's own stderr when we have it) and exit successfully.
      const stderr = e instanceof Error ? (e as { stderr?: Buffer | string }).stderr : undefined;
      const reason = String(stderr ?? '').trim() || (e instanceof Error ? e.message : String(e));
      console.warn(`\nSkipped Prettier formatting. It exited with an error:\n${reason}`);
    }
  }

  if (args.check && result.entries.length > 0) {
    process.exit(1);
  }
}

try {
  main();
} catch (e) {
  console.error(e instanceof Error ? e.message : String(e));
  process.exit(1);
}

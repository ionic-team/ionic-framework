import { execSync } from 'node:child_process';
import { resolve } from 'node:path';

import { createDiskContext } from './context.js';
import { detectFrameworks, sourceMajor } from './detect.js';
import { resolveTarget, selectMigrations } from './registry.js';
import { run } from './runner.js';
import { buildReport } from './report.js';
import { formatTouched, prettierFormatter } from './format.js';
import { allMigrations } from './migrations/index.js';
import { detectPackageManager } from './package-manager.js';
import { bold, cyan, dim } from './style.js';

interface Args {
  dir: string;
  dryRun: boolean;
  check: boolean;
  experimental: boolean;
  force: boolean;
  noFormat: boolean;
  noInstall: boolean;
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
  --no-install     Skip reinstalling dependencies after the version bump
  --from <major>   Override the detected source major version
  --to <major>     Override the target major version
  -h, --help       Show this help`;

/** Thrown for bad CLI input, so {@link main} can report it and exit non-zero. */
class UsageError extends Error {}

/** Parse a `--from`/`--to` value into a finite integer, or throw on bad input. */
function parseMajorArg(flag: string, value: string | undefined): number {
  const n = Number(value);
  if (value === undefined || !Number.isInteger(n)) {
    throw new UsageError(`Invalid value for ${flag}: expected an integer, got ${value ?? '(missing)'}`);
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
    noInstall: false,
    help: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run') args.dryRun = true;
    else if (a === '--check') args.check = true;
    else if (a === '--experimental') args.experimental = true;
    else if (a === '--force') args.force = true;
    else if (a === '--no-format') args.noFormat = true;
    else if (a === '--no-install') args.noInstall = true;
    else if (a === '--help' || a === '-h') args.help = true;
    else if (a === '--from') args.from = parseMajorArg('--from', argv[++i]);
    else if (a === '--to') args.to = parseMajorArg('--to', argv[++i]);
    else if (a.startsWith('-')) {
      throw new UsageError(`Unknown option: ${a}\n\n${USAGE}`);
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

/**
 * Run one migration pass and return the process exit code: 1 for unusable input,
 * a refused write, or `--check` finding pending work, 0 otherwise.
 *
 * Returned rather than passed to `process.exit` so each exit contract is reachable
 * from a test. A `process.exit` buried mid-function can be dropped without failing
 * the type-checker or the suite.
 */
export function main(argv: string[]): number {
  const args = parseArgs(argv);
  if (args.help) {
    console.log(USAGE);
    return 0;
  }
  const rootDir = resolve(args.dir);
  const ctx = createDiskContext(rootDir);

  const detected = detectFrameworks(ctx);
  if (detected.length === 0) {
    console.log(`No @ionic/{angular,react,vue,core} dependency found in ${rootDir}. Nothing to do.`);
    return 0;
  }

  const detectedMajor = sourceMajor(detected)!;
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
    return 1;
  }

  const fromMajor = args.from ?? detectedMajor;
  const label = detected.map((d) => `${d.framework}@${d.major}`).join(', ');

  const decision = resolveTarget(allMigrations, fromMajor, args.to);
  if (decision.kind === 'invalid') {
    const relation = decision.reason === 'below-source' ? 'below' : 'equal to';
    console.error(
      `Invalid value for --to: ${decision.requestedTo} is ${relation} the source major ` +
        `(v${decision.fromMajor}), so there is nothing in range to migrate.`
    );
    return 1;
  }
  if (decision.kind === 'nothing-to-do') {
    // Phrased against the source major, not the detected one: `--from` can
    // override it, and "already on v9" would then contradict the label above.
    console.log(
      bold(`Ionic migrate: ${label}`) +
        `\n\nNothing to do. This version of the tool migrates up to v${decision.latestMajor}, ` +
        `so there is nothing to apply above v${decision.fromMajor}.`
    );
    return 0;
  }
  const { toMajor } = decision;

  const frameworks = detected.map((d) => d.framework);
  const migrations = selectMigrations(allMigrations, {
    fromMajor,
    toMajor,
    frameworks,
    includeExperimental: args.experimental,
  });

  console.log(bold(`Ionic migrate: ${label}  (v${fromMajor} -> v${toMajor}, ${migrations.length} migration(s))`));
  if (decision.clampedFrom !== undefined) {
    // Not dimmed: the tool did something other than what was asked, which isn't
    // the same class as the skipped-step chatter below.
    console.log(`Asked for v${decision.clampedFrom}, which this build has no path to. Migrating to v${toMajor}.`);
  }
  console.log('');

  const writing = !args.dryRun && !args.check;
  if (writing && !args.force) {
    const clean = isWorkingTreeClean(rootDir);
    if (clean === false) {
      console.error(
        'Refusing to write: the working tree has uncommitted changes.\n' +
          'Commit or stash first (git is your undo), or re-run with --force.'
      );
      return 1;
    }
    if (clean === null) {
      console.error(
        `Refusing to write: ${rootDir} is not a git repository, so there is no undo.\n` +
          'Initialize git (or another backup) first, or re-run with --force.'
      );
      return 1;
    }
  }

  const result = run(ctx, migrations, { dryRun: !writing });
  console.log(buildReport(result));

  if (writing && !args.noFormat) {
    try {
      const formatted = formatTouched(ctx, prettierFormatter);
      if (formatted.length > 0) {
        console.log(dim(`\nFormatted ${formatted.length} changed file(s) with Prettier.`));
      } else if (ctx.touchedFiles.size > 0) {
        // Silence here reads as "formatted", so say the project has no Prettier.
        console.log(
          dim(`\nLeft ${ctx.touchedFiles.size} changed file(s) as written: no Prettier installed in this project.`)
        );
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

  // Only after a run that actually changed something: the version bump in
  // package.json leaves node_modules stale, so reinstall to match (unless
  // opted out). A dry run or check writes nothing, so there is nothing to sync.
  const applied = result.entries.some((e) => e.applied);
  if (writing && applied) {
    const pm = detectPackageManager(rootDir);
    if (args.noInstall) {
      console.log(dim(`\nSkipped dependency install. Run \`${pm.installCmd}\` before starting your app.`));
    } else {
      console.log(cyan(`\nInstalling dependencies with ${pm.name} to match the version bump...`));
      try {
        execSync(pm.installCmd, { cwd: rootDir, stdio: 'inherit' });
      } catch {
        // The edits are already on disk; a failed install must not fail the run.
        console.warn(`\nDependency install failed. Run \`${pm.installCmd}\` manually.`);
      }
    }
    // This tool is single-shot: the bumped @ionic/* version closes the re-run
    // gate, so a second run detects the target major and does nothing. Say so,
    // since it is easy to read a no-op re-run as the tool being broken.
    console.log(
      dim(
        '\nThis migration runs once. Your @ionic/* version is now bumped, so re-running detects the ' +
          'new major and skips these migrations. Use git to review or undo the changes.'
      )
    );
  }

  return args.check && result.entries.length > 0 ? 1 : 0;
}

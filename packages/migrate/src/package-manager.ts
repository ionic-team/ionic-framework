import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

/** A package manager and the command that reinstalls dependencies with it. */
export interface PackageManager {
  name: string;
  installCmd: string;
}

const NPM: PackageManager = { name: 'npm', installCmd: 'npm install' };

/** Lockfiles in precedence order, so the first match at a directory level wins. */
const LOCKFILES: Array<{ file: string; pm: PackageManager }> = [
  { file: 'pnpm-lock.yaml', pm: { name: 'pnpm', installCmd: 'pnpm install' } },
  { file: 'yarn.lock', pm: { name: 'yarn', installCmd: 'yarn install' } },
  { file: 'bun.lockb', pm: { name: 'bun', installCmd: 'bun install' } },
  { file: 'bun.lock', pm: { name: 'bun', installCmd: 'bun install' } },
  { file: 'package-lock.json', pm: NPM },
  { file: 'npm-shrinkwrap.json', pm: NPM },
];

/**
 * Pick the package manager from the nearest lockfile at or above `dir`,
 * defaulting to npm when none is found. Walking up matters for workspaces: the
 * Ionic package.json lives in a sub-package while the lockfile sits at the repo
 * root, so probing only `dir` would misdetect and run the wrong installer.
 *
 * `exists` is injectable so the probing can be tested without a real tree; it
 * defaults to a filesystem check.
 */
export function detectPackageManager(
  dir: string,
  exists: (path: string) => boolean = existsSync
): PackageManager {
  let current = resolve(dir);
  for (;;) {
    for (const { file, pm } of LOCKFILES) {
      if (exists(join(current, file))) return pm;
    }
    const parent = dirname(current);
    if (parent === current) return NPM; // reached the filesystem root
    current = parent;
  }
}

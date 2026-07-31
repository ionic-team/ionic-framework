import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { main } from '../src/main.js';

/**
 * Exit-code coverage for the CLI wiring, which unit tests of `resolveTarget` and
 * `buildReport` can't reach. `--check` is the contract worth pinning: deleting its
 * `return 1` once left the type-checker and the whole suite green while CI
 * reported an unmigrated app as clean.
 *
 * `--check` writes nothing and skips the git gate, so these need no repo.
 */
const dirs: string[] = [];

/** A throwaway project on the given Ionic React version with one migratable file. */
function project(version: string): string {
  const dir = mkdtempSync(join(tmpdir(), 'ionic-migrate-'));
  dirs.push(dir);
  writeFileSync(
    join(dir, 'package.json'),
    JSON.stringify({ name: 'app', dependencies: { '@ionic/react': version, 'react-router-dom': '^5.3.4' } })
  );
  mkdirSync(join(dir, 'src'));
  writeFileSync(join(dir, 'src', 'App.tsx'), `import { Redirect } from 'react-router-dom';\n`);
  return dir;
}

afterEach(() => {
  vi.restoreAllMocks();
  let dir: string | undefined;
  while ((dir = dirs.pop())) rmSync(dir, { recursive: true, force: true });
});

/** Run `main`, capturing stdout/stderr instead of printing it. */
function runCli(...argv: string[]): { code: number; out: string } {
  const chunks: string[] = [];
  const capture = (...args: unknown[]) => void chunks.push(args.join(' '));
  vi.spyOn(console, 'log').mockImplementation(capture);
  vi.spyOn(console, 'error').mockImplementation(capture);
  const code = main(argv);
  return { code, out: chunks.join('\n') };
}

describe('main', () => {
  it('exits non-zero under --check when migrations apply', () => {
    const { code, out } = runCli(project('^8.4.0'), '--check');

    expect(code).toBe(1);
    expect(out).toContain('v8 -> v9');
  });

  it('exits zero under --check for a project already on the newest major', () => {
    const { code, out } = runCli(project('9.0.0'), '--check');

    expect(code).toBe(0);
    expect(out).toContain('Nothing to do.');
  });

  it('runs the reachable hops when the target overshoots, rather than reporting clean', () => {
    const { code, out } = runCli(project('^8.4.0'), '--check', '--to', '10');

    expect(code).toBe(1);
    expect(out).toContain('Asked for v10');
    expect(out).toContain('v8 -> v9');
  });

  it('rejects a target that cannot hold any work', () => {
    const { code, out } = runCli(project('^8.4.0'), '--check', '--to', '8');

    expect(code).toBe(1);
    expect(out).toContain('Invalid value for --to');
  });

  it('refuses a --from below the detected major without --force', () => {
    const { code, out } = runCli(project('9.0.0'), '--check', '--from', '8');

    expect(code).toBe(1);
    expect(out).toContain('Refusing to run');
  });

  it('honors --force for a --from below the detected major', () => {
    const { code } = runCli(project('9.0.0'), '--check', '--from', '8', '--force');

    expect(code).toBe(1); // migrations apply again, so --check still fails
  });

  it('exits zero when no Ionic dependency is present', () => {
    const dir = mkdtempSync(join(tmpdir(), 'ionic-migrate-'));
    dirs.push(dir);
    writeFileSync(join(dir, 'package.json'), JSON.stringify({ name: 'not-ionic' }));

    const { code, out } = runCli(dir, '--check');

    expect(code).toBe(0);
    expect(out).toContain('Nothing to do.');
  });

  it('throws on an unparseable --to rather than migrating to a guessed target', () => {
    expect(() => runCli(project('^8.4.0'), '--to', 'nine')).toThrow(/expected an integer/);
  });

  it('throws on an unknown option', () => {
    expect(() => runCli(project('^8.4.0'), '--nope')).toThrow(/Unknown option/);
  });
});

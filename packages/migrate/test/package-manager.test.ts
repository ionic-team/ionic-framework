import { describe, expect, it } from 'vitest';

import { detectPackageManager } from '../src/package-manager.js';

/** Build an `exists` predicate that returns true only for the named lockfiles. */
function withLockfiles(...names: string[]): (path: string) => boolean {
  return (path) => names.some((name) => path.endsWith(name));
}

describe('detectPackageManager', () => {
  it('defaults to npm when no lockfile is present', () => {
    expect(detectPackageManager('/app', () => false)).toEqual({ name: 'npm', installCmd: 'npm install' });
  });

  it('detects pnpm from pnpm-lock.yaml', () => {
    expect(detectPackageManager('/app', withLockfiles('pnpm-lock.yaml')).name).toBe('pnpm');
  });

  it('detects yarn from yarn.lock', () => {
    expect(detectPackageManager('/app', withLockfiles('yarn.lock')).name).toBe('yarn');
  });

  it('detects bun from either bun.lockb or bun.lock', () => {
    expect(detectPackageManager('/app', withLockfiles('bun.lockb')).name).toBe('bun');
    expect(detectPackageManager('/app', withLockfiles('bun.lock')).name).toBe('bun');
  });

  it('detects npm from package-lock.json', () => {
    expect(detectPackageManager('/app', withLockfiles('package-lock.json')).name).toBe('npm');
  });

  it('prefers pnpm over npm when both a pnpm and package lock exist', () => {
    expect(detectPackageManager('/app', withLockfiles('pnpm-lock.yaml', 'package-lock.json')).name).toBe('pnpm');
  });

  it('walks up to a workspace-root lockfile when the sub-package has none', () => {
    // The lockfile lives at the repo root while the Ionic app is a sub-package.
    const rootLockfile = (path: string) => path === '/workspace/pnpm-lock.yaml';
    expect(detectPackageManager('/workspace/apps/mobile', rootLockfile).name).toBe('pnpm');
  });

  it('prefers a nearer lockfile over one further up the tree', () => {
    const exists = (path: string) => path === '/workspace/pnpm-lock.yaml' || path === '/workspace/apps/mobile/yarn.lock';
    expect(detectPackageManager('/workspace/apps/mobile', exists).name).toBe('yarn');
  });
});

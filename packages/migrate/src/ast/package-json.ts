import type { MigrationContext } from '../context.js';

export interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  [key: string]: unknown;
}

/** Read and parse `package.json`, or `undefined` if it does not exist. */
export function readPackageJson(ctx: MigrationContext): { pkg: PackageJson } | undefined {
  const raw = ctx.readFile('package.json');
  if (!raw) return undefined;
  try {
    return { pkg: JSON.parse(raw) as PackageJson };
  } catch (e) {
    throw new Error(`Could not parse package.json in ${ctx.rootDir}: ${(e as Error).message}`);
  }
}

/** Serialize and write `package.json`, keeping 2-space indent and a trailing newline. */
export function writePackageJson(ctx: MigrationContext, pkg: PackageJson): void {
  ctx.writeFile('package.json', `${JSON.stringify(pkg, null, 2)}\n`);
}

/** Which dependency block a package lives in. */
export function findDependency(
  pkg: PackageJson,
  name: string
): { block: 'dependencies' | 'devDependencies'; range: string } | undefined {
  if (pkg.dependencies?.[name] !== undefined) {
    return { block: 'dependencies', range: pkg.dependencies[name] };
  }
  if (pkg.devDependencies?.[name] !== undefined) {
    return { block: 'devDependencies', range: pkg.devDependencies[name] };
  }
  return undefined;
}

/** Set `name` to an explicit range/version string in place, if present. */
export function setRange(pkg: PackageJson, name: string, range: string): void {
  const dep = findDependency(pkg, name);
  if (!dep) return;
  pkg[dep.block]![name] = range;
}

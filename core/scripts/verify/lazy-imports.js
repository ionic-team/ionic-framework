/**
 * Fails if the built lazy loader is missing a literal import path for any component bundle.
 * Not in `scripts/testing/` because `vercel-build.sh` publishes that directory.
 * https://github.com/ionic-team/ionic-framework/issues/31333
 */
const fs = require('fs');
const path = require('path');

const PACKAGE_ROOT = path.resolve(__dirname, '..', '..');
const OUTPUT_DIRS = ['dist/esm', 'dist/cjs'];

function main() {
  const failures = OUTPUT_DIRS.map(verify).filter((message) => message !== null);

  if (failures.length > 0) {
    failures.forEach((message) => console.error(message));
    process.exit(1);
  }

  console.error(`Success! Every lazy bundle is imported by path in ${OUTPUT_DIRS.join(' and ')}`);
}

function verify(dir) {
  const resolved = path.join(PACKAGE_ROOT, dir);

  if (!fs.existsSync(resolved)) {
    return `${dir} does not exist. Run npm run build first.`;
  }

  const files = fs.readdirSync(resolved).filter((file) => file.endsWith('.js'));
  const entries = files.filter((file) => file.endsWith('.entry.js'));

  if (entries.length === 0) {
    return `${dir} does not contain any .entry.js files.`;
  }

  // A non-loader chunk that happens to name an entry file would be a false pass.
  const loader = files
    .filter((file) => !file.endsWith('.entry.js'))
    .map((file) => fs.readFileSync(path.join(resolved, file), 'utf-8'))
    .find((source) => /switch\s*\(bundleId\)/.test(source));

  if (loader === undefined) {
    return `${dir} has no lazy loader with a bundle id switch. Check that extras.enableImportInjection is still set in core/stencil.config.ts.`;
  }

  const missing = entries.filter((entry) => !loader.includes(`'./${entry}'`) && !loader.includes(`"./${entry}"`));

  if (missing.length > 0) {
    return `${dir} is missing an import for ${missing.length} of ${entries.length} lazy bundles: ${missing.join(', ')}`;
  }

  return null;
}

main();

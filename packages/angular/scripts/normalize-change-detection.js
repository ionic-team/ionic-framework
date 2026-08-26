const fs = require('fs');
const path = require('path');

/**
 * Rewrite `ChangeDetectionStrategy.Eager` to `Default` in the compiled output.
 *
 * Angular 22 renamed `Default` to `Eager`, but the Angular 18-20 linkers only
 * know `Default` and fail the consumer's build on anything else. Both names are
 * the same value. Remove once the peer range starts at Angular 21.
 *
 * The replacement is two characters longer and leaves the `.js.map` alone, so
 * mappings drift two columns, but only inside generated Ivy plumbing.
 */

const DIST_DIR = path.join(__dirname, '../dist');
const ANGULAR_22_NAME = 'ChangeDetectionStrategy.Eager';
const PORTABLE_NAME = 'ChangeDetectionStrategy.Default';

function listDistJsFiles() {
  if (!fs.existsSync(DIST_DIR)) {
    throw new Error('dist does not exist. build.ng emitted nothing.');
  }

  return fs
    .readdirSync(DIST_DIR, { recursive: true })
    .filter((entry) => entry.endsWith('.js'))
    .map((entry) => path.join(DIST_DIR, entry));
}

function normalize() {
  const files = listDistJsFiles();
  let rewritten = 0;

  for (const file of files) {
    const source = fs.readFileSync(file, 'utf8');
    if (!source.includes(ANGULAR_22_NAME)) continue;

    fs.writeFileSync(file, source.split(ANGULAR_22_NAME).join(PORTABLE_NAME));
    rewritten++;
  }

  console.log(`✅ normalized change detection strategy in ${rewritten} file(s)`);
}

module.exports = { DIST_DIR, PORTABLE_NAME, listDistJsFiles };

if (require.main === module) {
  normalize();
}

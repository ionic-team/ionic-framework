const fs = require('fs');
const path = require('path');

/**
 * Rewrite `ChangeDetectionStrategy.Eager` to `Default` in the compiled output.
 *
 * Angular 22 renamed `Default` to `Eager`. Both names are the same value, but a
 * linker that doesn't know the new one fails the consumer's build on it. The
 * rename was backported to 21.2, so remove this once the peer range's lowest
 * version is 21.2 or higher. 21.0 and 21.1 still reject it.
 */

const DIST_DIR = path.join(__dirname, '../dist');
const ANGULAR_22_NAME = 'ChangeDetectionStrategy.Eager';
const PORTABLE_NAME = 'ChangeDetectionStrategy.Default';

function listDistJsFiles() {
  if (!fs.existsSync(DIST_DIR)) {
    throw new Error('dist does not exist. build.ng emitted nothing.');
  }

  // Any JS extension, so an emit that moves to .mjs isn't silently skipped here.
  return fs
    .readdirSync(DIST_DIR, { recursive: true })
    .filter((entry) => /\.(m|c)?js$/.test(entry))
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

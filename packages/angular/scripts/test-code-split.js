/**
 * Validates that per-component imports let a bundler code-split Ionic components.
 *
 * Builds `test/code-split` with barrel imports from '@ionic/angular' and after
 * running `migrate-per-component-imports.js`. Inspects `www/stats.json`, the
 * esbuild metafile, to see which output chunk each component landed in. The
 * code-split app's src folder is backed up before migrating and restored after
 * the test.
 *
 * `ion-toggle` is used by the home page, while `ion-header` is used by both the
 * landing and home pages. If the two share a chunk the components are not
 * being split, so visiting the landing page downloads a toggle it doesn't use.
 *
 * Build core and the angular package before running this test.
 */

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('node:child_process');

const PACKAGE_ROOT_DIR = path.join(__dirname, '..');
const MIGRATE_IMPORTS_SCRIPT = path.join(PACKAGE_ROOT_DIR, 'scripts/migrate-per-component-imports.js');
const PROJECT_DIR = path.join(PACKAGE_ROOT_DIR, 'test/code-split');
const SRC_DIR = path.join(PROJECT_DIR, 'src');
const OUTPUT_DIR = path.join(PROJECT_DIR, 'www');
const STATS_FILE = path.join(OUTPUT_DIR, 'stats.json');

function build(label) {
  console.log(`\n--- building ${label} ---`);
  execSync(`npm run build -- --stats-json --output-hashing=none`, { cwd: PROJECT_DIR, stdio: 'inherit' });
}

function readStatsJson() {
  if (!fs.existsSync(STATS_FILE)) {
    throw new Error(`${path.relative(PROJECT_DIR, STATS_FILE)} was not produced by the build.`);
  }
  return fs.readJsonSync(STATS_FILE);
}

function findChunksForComponents(stats, components) {
  const chunksForComponents = new Set();

  for (const [chunkName, chunkData] of Object.entries(stats.outputs || {})) {
    if (chunkName.endsWith('.js')) {
      for (const module of components) {
        const matchFound = Object.keys(chunkData.inputs).some(x => x.includes(module));
        if (matchFound) {
          chunksForComponents.add(chunkName);
        }
      }
    }
  }

  return chunksForComponents;
}

function main() {
  const backupDir = path.join(PROJECT_DIR, '../code-split-source-tmp-backup');
  fs.copySync(SRC_DIR, backupDir);

  try {
    execSync('npm i', { cwd: PROJECT_DIR });
    execSync('./sync.sh', { cwd: PROJECT_DIR });

    // Core components that should be split into separate chunks after migrating imports.
    const components = ['@ionic/core/components/ion-header.js', '@ionic/core/components/ion-toggle.js'];

    build('baseline');
    const baselineStats = readStatsJson();
    const baselineChunks = findChunksForComponents(baselineStats, components);

    execSync(`node ${MIGRATE_IMPORTS_SCRIPT}`, { cwd: PROJECT_DIR, stdio: 'inherit' });

    build('migrated');
    const migratedStats = readStatsJson();
    const migratedChunks = findChunksForComponents(migratedStats, components);

    if (baselineChunks.size != 1) {
      throw new Error("Components should have all been included in the same chunk before migrating.");
    }
    if (migratedChunks.size != components.length) {
      throw new Error('Components were not all split across different chunks.')
    }

    console.log('✅ verified code-split');
  } catch (error) {
    process.exitCode = 1;
    console.error(error);
  }

  fs.removeSync(SRC_DIR);
  fs.moveSync(backupDir, SRC_DIR);
}

main();

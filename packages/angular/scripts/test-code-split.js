/**
 * Validates that per-component imports let a bundler code-split Ionic components.
 *
 * Builds `test/code-split` with barrel imports from '@ionic/angular' and after
 * running `migrate-per-component-imports.js`. Inspects `www/stats.json`, the
 * esbuild metafile, to see which output chunk a component landed in.
 *
 * `ion-toggle` is used by only the home page, so it should not be bundled with
 * the landing page
 *
 * Build core and the angular package before running this test.
 */

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('node:child_process');

const PACKAGE_ROOT_DIR = path.join(__dirname, '..');
const MIGRATE_IMPORTS_SCRIPT = path.join(PACKAGE_ROOT_DIR, 'scripts/migrate-per-component-imports.js');
const PROJECT_DIR = path.join(PACKAGE_ROOT_DIR, 'test/code-split-build');
const SOURCE_DIR = path.join(PACKAGE_ROOT_DIR, 'test/code-split');
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

function collectChunks(stats, startChunkName, chunkSet)
{
  chunkSet.add(startChunkName);
  const chunk = stats.outputs[startChunkName]
  for (const imported of chunk.imports) {
    if (imported.kind === "import-statement" && !chunkSet.has(imported.path)) {
      collectChunks(stats, imported.path, chunkSet);
    }
  }
}

function findChunksForPage(stats, page) {
  const chunkSet = new Set();

  for (const [chunkName, chunkData] of Object.entries(stats.outputs || {})) {
    if (chunkName.endsWith('.js')) {
        const importFound = Object.keys(chunkData.inputs).some(input => input.endsWith(page));
        if (importFound) {
          collectChunks(stats, chunkName, chunkSet);
        }
    }
  }

  return chunkSet;
}

function hasComponentAsInput(stats, chunks, component)
{
  for (const chunk of chunks) {
    for (const [inputName, inputData] of Object.entries(stats.outputs[chunk].inputs)) {
      if (inputName.endsWith(component)) {
        return true;
      }
    }
  }
  return false;
}

function main() {
  fs.copySync(SOURCE_DIR, PROJECT_DIR);

  try {
    execSync('npm i', { cwd: PROJECT_DIR });
    execSync('./sync.sh', { cwd: PROJECT_DIR });

    build('baseline');
    const baselineStats = readStatsJson();
    const baselineChunks = findChunksForPage(baselineStats, 'landing.page.ts');

    const splitComponent = 'ion-toggle.js';
    if (!hasComponentAsInput(baselineStats, baselineChunks, splitComponent)) {
      console.log(`${splitComponent} was already split in baseline.`);
    }

    execSync(`node ${MIGRATE_IMPORTS_SCRIPT}`, { cwd: PROJECT_DIR, stdio: 'inherit' });

    build('migrated');
    const migratedStats = readStatsJson();
    const migratedChunks = findChunksForPage(migratedStats, 'landing.page.ts');

    if (hasComponentAsInput(migratedStats, migratedChunks, splitComponent)) {
      throw new Error(`${splitComponent} was not split from landing page.`)
    }

    console.log('✅ verified code-split');
  } catch (error) {
    process.exitCode = 1;
    console.error(error);
  }

  fs.removeSync(PROJECT_DIR);
}

main();

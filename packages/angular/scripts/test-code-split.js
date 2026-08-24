/**
 * Validates that per-component imports let a bundler code-split Ionic components.
 *
 * Builds `test/code-split` with barrel imports from '@ionic/angular' and after
 * running `migrate-per-component-imports.js`. Inspects `www/stats.json`, the
 * esbuild metafile, to see which output chunk each component landed in. The
 * code-split app's src folder is backed up before migrating and restored after
 * the test.
 *
 * `ion-toggle` is used by the home page, while ion-header` is used by both the
 * landing and home pages. If the two share a chunk the components are not
 * being split, so visiting the landing page downloads a toggle it doesn't use.
 *
 * Build core and the angular package before running this test.
 */

const fs = require('fs-extra');
const os = require('os');
const path = require('path');
const { execSync } = require('node:child_process');

const packageRootDir = path.join(__dirname, '..');
const migrateImportsScript = path.join(packageRootDir, 'scripts/migrate-per-component-imports.js');
const projectDir = path.join(packageRootDir, 'test/code-split');
const srcDir = path.join(projectDir, 'src');
const outputDir = path.join(projectDir, 'www');
const statsFile = path.join(outputDir, 'stats.json');

function build(label) {
  console.log(`\n--- building ${label} ---`);
  fs.removeSync(outputDir);
  execSync(`npm run build -- --stats-json --output-hashing=none`, { cwd: projectDir, stdio: 'inherit' });
}

function readStatsJson() {
  if (!fs.existsSync(statsFile)) {
    throw new Error(`${path.relative(projectDir, statsFile)} was not produced by the ${label} build.`);
  }
  return fs.readJsonSync(statsFile);
}

function findChunksForComponents(stats, components) {
  const chunksByComponent = new Set();

  for (const [chunkName, chunkData] of Object.entries(stats.outputs || {})) {
    if (chunkName.endsWith('.js')) {
      for (const module of components) {
        const matchFound = Object.keys(chunkData.inputs).some(x => x.includes(module));
        if (matchFound) {
          chunksByComponent.add(chunkName);
        }
      }
    }
  }

  return chunksByComponent;
}

function main() {
  const backupDir = path.join(projectDir, '../code-split-source-tmp-backup');
  fs.copySync(srcDir, backupDir);

  try {
    execSync('npm i', { cwd: projectDir });
    execSync('./sync.sh', { cwd: projectDir });

    // Core components that should be split into separate chunks after migrating imports.
    const components = ['@ionic/core/components/ion-header.js', '@ionic/core/components/ion-toggle.js'];

    build('baseline');
    const baselineStats = readStatsJson();
    const baselineChunks = findChunksForComponents(baselineStats, components);

    execSync(`node ${migrateImportsScript}`, { cwd: projectDir, stdio: 'inherit' });

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

  fs.removeSync(srcDir);
  fs.moveSync(backupDir, srcDir);
}

main();

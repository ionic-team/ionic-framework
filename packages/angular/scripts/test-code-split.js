/**
 * Validates that per-component imports let a bundler code-split Ionic components.
 * Inspects `www/stats.json`, the esbuild metafile, to see which output chunk a
 * component landed in. `ion-toggle` is used by only the home page, so it
 * should not be bundled with the landing page.
 *
 * Build core and the angular package before running this test.
 */

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('node:child_process');

const PROJECT_DIR = path.join(__dirname, '../test/code-split');
const STATS_FILE = path.join(PROJECT_DIR, 'www/stats.json');


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

function hasComponentAsInput(stats, chunks, component) {
  for (const chunk of chunks) {
    for (const inputName of Object.keys(stats.outputs[chunk].inputs)) {
      if (inputName.endsWith(component)) {
        return true;
      }
    }
  }
  return false;
}

function main() {
  try {
    execSync('npm i', { cwd: PROJECT_DIR });
    execSync('./sync.sh', { cwd: PROJECT_DIR });
    execSync(`npm run build`, { cwd: PROJECT_DIR, stdio: 'inherit' });

    const stats = fs.readJsonSync(STATS_FILE);
    const landingPageChunks = findChunksForPage(stats, 'landing.page.ts');
    const homePageChunks = findChunksForPage(stats, 'home.page.ts');

    if (!hasComponentAsInput(stats, landingPageChunks, 'ion-header.js')) {
      throw new Error(`ion-header was not included in landing page.`);
    }
    if (hasComponentAsInput(stats, landingPageChunks, 'ion-toggle.js')) {
      throw new Error(`ion-toggle was not split from landing page.`);
    }

    if (!hasComponentAsInput(stats, homePageChunks, 'ion-header.js')) {
      throw new Error(`ion-header was not included in home page.`);
    }
    if (!hasComponentAsInput(stats, homePageChunks, 'ion-toggle.js')) {
      throw new Error(`ion-toggle was not included in home page.`);
    }

    console.log('✅ verified code-split');
  } catch (error) {
    process.exitCode = 1;
    console.error(error);
  }
}

main();

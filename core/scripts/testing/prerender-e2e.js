const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);
const path = require('path');
const hydrate = require('../../hydrate');

let prerenderCount = 0;

async function prerender(dirPath, srcIndexFilePath) {
  const srcHtml = await readFile(srcIndexFilePath, 'utf-8');

  const staticFilePath = path.join(dirPath, 'prerender-static.html');
  const staticResults = await hydrate.renderToString(srcHtml, {
    prettyHtml: true,
    removeScripts: true
  });

  if (staticResults.diagnostics.length > 0) {
    throw new Error(staticResults.diagnostics[0].messageText);
  }

  if (staticResults.html == null || typeof staticResults.html !== 'string' || staticResults.html.trim().length === 0) {
    throw new Error(`empty prerendered html: ${indexFilePath}`);
  }

  const hydratedFilePath = path.join(dirPath, 'prerender-hydrated.html');
  const hydrateResults = await hydrate.renderToString(srcHtml, {
    prettyHtml: true
  });

  const dstIndexFilePath = path.join(dirPath, 'prerender.html');
  const indexHtml = buildPrerenderIndexHtml(staticResults.title);

  await Promise.all([
    writeFile(staticFilePath, staticResults.html),
    writeFile(hydratedFilePath, hydrateResults.html),
    writeFile(dstIndexFilePath, indexHtml)
  ]);

  prerenderCount++;
}

function buildPrerenderIndexHtml(title) {
  return `<!doctype html>
<html class="md plt-desktop" dir="ltr" mode="md">
  <head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background: #eee;
      }
      main {
        display: flex;
        justify-content: space-evenly;
        padding: 10px;
      }
      iframe {
        border: 1px solid black;
        width: 300px;
        height: 92vh;
      }
      label {
        display: block;
      }
      iframe {
        display: none;
      }
      input:checked ~ iframe {
        display: block;
      }
    </style>
  </head>
  <body>
    <main>
      <section>
        <input type="checkbox" checked> <a href="index.html" target="_blank">Client</a>
        <iframe src="index.html"></iframe>
      </section>
      <section>
        <input type="checkbox" checked> <a href="prerender-static.html" target="_blank">Static</a>
        <iframe src="prerender-static.html"></iframe>
      </section>
      <section>
        <input type="checkbox" checked> <a href="prerender-hydrated.html" target="_blank">Hydrated</a>
        <iframe src="prerender-hydrated.html"></iframe>
      </section>
    </main>
  </body>
</html>
`;
}

async function prerenderDir(dirPath, filterText) {
  const items = await readdir(dirPath);

  await Promise.all(items.map(async item => {
    const itemPath = path.join(dirPath, item);
    const s = await stat(itemPath);

    if (s.isDirectory() && item !== 'spec') {
      await prerenderDir(itemPath, filterText);

    } else {
      if (typeof filterText === 'string' && !dirPath.includes(filterText)) {
        return;
      }
      if (item === 'index.html' && dirPath.includes('test')) {
        await prerender(dirPath, itemPath);
      }
    }
  }));
}

async function run() {
  await prerenderDir(path.join(__dirname, '..', '..', 'src', 'components'), process.argv[2]);
  console.log('prerendered:', prerenderCount);
}
run();
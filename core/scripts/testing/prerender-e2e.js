const fs = require('fs');
const path = require('path');
const hydrate = require('../../hydrate');
const domino = require('domino');

let prerenderCount = 0;

async function prerender(dirPath, srcIndexFilePath) {
  const start = Date.now();
  const srcHtml = fs.readFileSync(srcIndexFilePath, 'utf-8');

  const staticFilePath = path.join(dirPath, 'prerender-static.html');

  const staticResults = await hydrate.renderToString(srcHtml, {
    prettyHtml: true,
    removeScripts: true
  });
  if (staticResults.diagnostics.length > 0) {
    throw new Error('staticResults: ' + staticResults.diagnostics[0].messageText);
  }
  fs.writeFileSync(staticFilePath, staticResults.html);

  const hydratedFilePath = path.join(dirPath, 'prerender-hydrated.html');
  const hydrateResults = await hydrate.renderToString(srcHtml, {
    prettyHtml: true
  });
  if (hydrateResults.diagnostics.length > 0) {
    throw new Error('hydrateResults: ' + hydrateResults.diagnostics[0].messageText);
  }
  fs.writeFileSync(hydratedFilePath, hydrateResults.html);

  const dominoFilePath = path.join(dirPath, 'prerender-domino.html');
  const dominoDoc = domino.createDocument(srcHtml, true);
  const dominoResults = await hydrate.hydrateDocument(dominoDoc);
  if (dominoResults.diagnostics.length > 0) {
    throw new Error('dominoResults: ' + dominoResults.diagnostics[0].messageText);
  }
  const dominoHtml = dominoDoc.documentElement.outerHTML;
  fs.writeFileSync(dominoFilePath, dominoHtml);

  const dstIndexFilePath = path.join(dirPath, 'prerender.html');
  const prerenderIndexHtml = buildPrerenderIndexHtml('staticResults.title');
  fs.writeFileSync(dstIndexFilePath, prerenderIndexHtml);

  console.log(dirPath, `${Date.now() - start}ms`);
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
        <input type="checkbox" checked> <a href="prerender-domino.html" target="_blank">Domino</a>
        <iframe src="prerender-domino.html"></iframe>
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
  const items = fs.readdirSync(dirPath);

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const itemPath = path.join(dirPath, item);
    const stat = fs.statSync(itemPath);

    if (stat.isDirectory() && item !== 'spec') {
      await prerenderDir(itemPath, filterText);

    } else {
      if (typeof filterText === 'string' && !dirPath.includes(filterText)) {
        return;
      }
      if (item === 'index.html' && dirPath.includes('test')) {
        await prerender(dirPath, itemPath);
      }
    }
  }
}

async function run() {
  const start = Date.now();
  try {
    await prerenderDir(path.join(__dirname, '..', '..', 'src', 'components'), process.argv[2]);
  } catch (e) {
    console.error(e);
  }

  console.log(`prerendered: ${prerenderCount}`);
  console.log(`time: ${Date.now() - start}ms`);
}
run();
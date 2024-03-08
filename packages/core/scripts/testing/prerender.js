const fs = require('fs');
const path = require('path');
const hydrate = require('../../hydrate');
const domino = require('domino');

let prerenderCount = 0;

async function prerenderPage(srcIndexFilePath) {
  const start = Date.now();

  try {
    await prerenderStatic(srcIndexFilePath);
    await prerenderHydrated(srcIndexFilePath);
    await prerenderDomino(srcIndexFilePath);
    console.log(srcIndexFilePath, ` ${Date.now() - start}ms`);

  } catch (e) {
    console.error(`Failed:`, srcIndexFilePath, ` ${Date.now() - start}ms`);
    throw e;
  }
}

async function prerenderStatic(srcIndexFilePath) {
  const dirPath = path.dirname(srcIndexFilePath);
  const srcHtml = fs.readFileSync(srcIndexFilePath, 'utf-8');
  const staticFilePath = path.join(dirPath, 'prerender-static.html');

  const results = await hydrate.renderToString(srcHtml, {
    prettyHtml: true,
    removeScripts: true
  });
  if (results.diagnostics.some(d => d.type === 'error')) {
    throw new Error('staticResults:\n'  + results.diagnostics.map(d => d.messageText).join('\n'));
  }
  fs.writeFileSync(staticFilePath, results.html);

  const dstIndexFilePath = path.join(dirPath, 'prerender.html');
  const prerenderIndexHtml = buildPrerenderIndexHtml(results.title);
  fs.writeFileSync(dstIndexFilePath, prerenderIndexHtml);
  prerenderCount++;
}

async function prerenderHydrated(srcIndexFilePath) {
  const dirPath = path.dirname(srcIndexFilePath);
  const srcHtml = fs.readFileSync(srcIndexFilePath, 'utf-8');
  const hydratedFilePath = path.join(dirPath, 'prerender-hydrated.html');
  const results = await hydrate.renderToString(srcHtml, {
    prettyHtml: true
  });
  if (results.diagnostics.some(d => d.type === 'error')) {
    throw new Error('hydrateResults:\n' + staticResults.diagnostics.map(d => d.messageText).join('\n'));
  }
  fs.writeFileSync(hydratedFilePath, results.html);
  prerenderCount++;
}

async function prerenderDomino(srcIndexFilePath) {
  const dirPath = path.dirname(srcIndexFilePath);
  const srcHtml = fs.readFileSync(srcIndexFilePath, 'utf-8');
  const dominoFilePath = path.join(dirPath, 'prerender-domino.html');
  const dominoDoc = domino.createDocument(srcHtml, true);
  const results = await hydrate.hydrateDocument(dominoDoc);
  if (results.diagnostics.some(d => d.type === 'error')) {
    throw new Error('dominoResults:\n' + staticResults.diagnostics.map(d => d.messageText).join('\n'));
  }
  const dominoHtml = dominoDoc.documentElement.outerHTML;
  fs.writeFileSync(dominoFilePath, dominoHtml);
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

async function prerenderDir(dirPath) {
  const items = fs.readdirSync(dirPath);

  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const stat = fs.statSync(itemPath);

    if (stat.isDirectory() && item !== 'spec') {
      await prerenderDir(itemPath);

    } else {
      if (item === 'index.html' && dirPath.includes('test')) {
        await prerenderPage(itemPath);
      }
    }
  }
}

async function run() {
  const start = Date.now();
  try {

    let p = process.argv[2];
    if (p) {
      const s = fs.statSync(p);
      if (s.isDirectory()) {
        await prerenderDir(p)
      } else {
        await prerenderPage(p);
      }

    } else {
      p = path.join(__dirname, '..', '..', 'src', 'components');
      await prerenderDir(p);
    }

  } catch (e) {
    console.error(e);
  }

  const duration = Date.now() - start;
  console.log(`time: ${duration}ms`);
  if (prerenderCount > 1) {
    console.log(`prerendered: ${prerenderCount}`);
    console.log(`average: ${Math.round(duration / prerenderCount)}ms`);
  }
}

run();

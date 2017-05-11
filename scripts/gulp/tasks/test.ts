import { join } from 'path';
import { dest, src, task } from 'gulp';
import { DIST_VENDOR_ROOT, NPM_VENDOR_FILES, PROJECT_ROOT, SCRIPTS_ROOT } from '../constants';

task('test', ['test.assembleVendorJs', 'compile.karma'], (done: Function) => {
  karmaTest(false, done);
});

task('test.fast', ['compile.karma'], (done: Function) => {
  karmaTest(false, done);
});

task('test.watch', ['test.assembleVendorJs', 'compile.karma'], (done: Function) => {
  karmaTest(true, done);
});

task('test.coverage', ['test.assembleVendorJs', 'compile.karma'], (done: Function) => {
  karmaTest(false, () => {
    createKarmaCoverageReport(done);
  });
});

task('test.imageserver', () => {
  const http = require('http');
  const url = require('url');
  const port = 8900;
  const requestedUrls = [];
  let start = Date.now();

  function handleRequest(req, res) {
    const urlParse = url.parse(req.url, true);

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Age', '0');
    res.setHeader('cache-control', 'no-store');

    if (urlParse.pathname === '/reset') {
      console.log('Image Server Reset');
      console.log('---------------------------');
      requestedUrls.length = 0;
      start = Date.now();
      res.setHeader('Content-Type', 'text/plain');
      res.end('reset');
      return;
    }

    const delay = urlParse.query.d || 1000;
    const id = urlParse.query.id || Math.round(Math.random() * 1000);
    const width = urlParse.query.w || 80;
    const height = urlParse.query.h || 80;
    const color = urlParse.query.c || 'yellow';

    requestedUrls.push(req.url);

    console.log(`id: ${id}, requested: ${requestedUrls.filter(f => f === req.url).length}, timestamp: ${Date.now() - start}`);

    setTimeout(() => {
      res.setHeader('Content-Type', 'image/svg+xml');
      res.end(`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                   viewBox="0 0 ${width} ${height}" style="background-color: ${color};">
                 <text x="5" y="22" style="font-family: Courier; font-size: 24px">${id}</text>
               </svg>`);
    }, delay);
  }

  http.globalAgent.maxSockets = 1;

  http.createServer(handleRequest).listen(port, () => {
    console.log(`  Mock image server listening on: http://localhost:${port}/?d=2000&id=99`);
    console.log(`  Possible querystrings:`);
    console.log(`    id: the text to go in the svg image, defaults to a random number`);
    console.log(`    d: how many milliseconds it should take to respond, defaults to 1000`);
    console.log(`    w: image width, defaults to 80`);
    console.log(`    h: image height, defaults to 80`);
    console.log(`    c: image color, defaults to yellow`);
  });

});

function karmaTest(watch: boolean, done: Function) {
  const karma = require('karma');
  const argv = require('yargs').argv;

  let karmaConfig = {
    configFile: join(SCRIPTS_ROOT, 'karma/karma.conf.js'),
    singleRun: true,
  };

  if (watch) {
    (karmaConfig as any).singleRun = false;
  }

  if (argv.testGrep) {
    (<any>karmaConfig).client = {
      args: ['--grep', argv.testGrep]
    };
  }
  if (typeof argv.debug !== 'undefined') {
    karmaConfig.singleRun = false;
  }

  new karma.Server(karmaConfig, done).start();
}


task('test.assembleVendorJs', () => {
  const files = NPM_VENDOR_FILES.map((root) => {
    const glob = join(root, '**/*.+(js|js.map)');
    return src(join('node_modules', glob))
           .pipe(dest(join(DIST_VENDOR_ROOT, root)));
  });
  const gulpMerge = require('merge2');
  return gulpMerge(files);
});


/* creates a karma code coverage report */
function createKarmaCoverageReport(done: Function) {
  console.log('Generating Unit Test Coverage Report...');

  let exec = require('child_process').exec;
  let command = `node_modules/.bin/remap-istanbul -i coverage/coverage-final.json -o coverage -t html`;

  exec(command, function(err: any, stdout: any, stderr: any) {
    console.log(`file://${PROJECT_ROOT}/coverage/index.html`);
    done(err);
  });
}

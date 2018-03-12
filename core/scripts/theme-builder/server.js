const http = require('http');
const url = require('url');
const glob = require('glob');
const fs = require('fs');
const path = require('path');


const port = 5454;
const componentsPath = '/src/components/';
const cssPath = '/src/themes/css/';
const srcComponentsDir = path.join(__dirname, '../../', componentsPath);
const srcCssDir = path.join(__dirname, '../../', cssPath);


function requestHandler (request, response) {
  const parsedUrl = url.parse(request.url, true);

  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

  if (parsedUrl.pathname === '/data') {
    requestDataHandler(response);
  } else if (parsedUrl.pathname === '/color') {
    requestColorHandler(request, response);
  } else if (parsedUrl.pathname === '/save-css') {
    requestSaveCssHandler(parsedUrl, response);

  } else if (parsedUrl.pathname === '/delete-css') {
    requestDeleteCssHandler(parsedUrl, response);

  } else {
    response.end();
  }
}


function requestDataHandler (response) {
  try {
    const demoPaths = glob.sync('**/index.html', {
      cwd: srcComponentsDir
    });

    const demos = demoPaths.map(demo => {
      return {
        name: demo.toLowerCase()
          .replace(/\\/g, ' ')
          .replace(/\//g, ' ')
          .replace(/ test/g, '')
          .replace(/ index.html/g, ''),
        url: componentsPath + demo.replace(/\\/g, '/')
      };
    }).sort((a, b) => {
      if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
      if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
      return 0
    });

    const themePaths = glob.sync('**/*.css', {
      cwd: srcCssDir
    });


    const themes = themePaths.map(theme => {
      return {
        name: theme.replace(/.css/g, '')
      };
    }).sort((a, b) => {
      if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
      if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
      return 0
    });

    const data = JSON.stringify({
      demos: demos,
      themes: themes
    }, null, 2);

    response.end(data, 'utf8');

  } catch (e) {
    console.log(e);
    response.end('err: ' + e);
  }
}

function requestColorHandler (req, res) {
  res.setHeader('Content-Type', 'application/json');
  const params = {} = req.url.split('?').filter((e,i) => i > 0)[0].split('&').map(e => {let [name, value]=e.split('='); return {[name]:value}})[0],
  url = `http://www.colourlovers.com/api/palettes?format=json&keywords=${params.search}`;

  // console.log (`Proxy: ${url}`, params);
  http.get(url, (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      res.end(data);
    });

  }).on("error", (err) => {
    console.log("Error: " + err.message);
    res.end('{success: false}');
  });
}

function requestSaveCssHandler (parsedUrl, response) {
  try {
    const theme = (parsedUrl.query.theme || '').toLowerCase().trim();
    if (!theme) {
      response.end('missing theme querystring');
      return;
    }

    const filePath = path.join(srcCssDir, theme + '.css');
    const css = parsedUrl.query.css || '';

    fs.writeFileSync(filePath, css, {encoding: 'utf8'});

    console.log('css saved!', filePath);

    response.end('css saved! ' + filePath, 'utf8');

  } catch (e) {
    console.log(e);
    response.end('err: ' + e);
  }
}


function requestDeleteCssHandler (parsedUrl, response) {
  try {
    const theme = (parsedUrl.query.theme || '').toLowerCase().trim();
    if (!theme) {
      response.end('missing theme querystring');
      return;
    }

    const filePath = path.join(srcCssDir, theme + '.css');

    fs.unlinkSync(filePath);

    console.log('css deleted!', filePath);

    response.end('css deleted! ' + filePath, 'utf8');

  } catch (e) {
    console.log(e);
    response.end('err: ' + e);
  }
}


const server = http.createServer(requestHandler);

server.listen(port, (err) => {
  if (err) {
    return console.log(__filename, err);
  }

  console.log(`theme server: http://localhost:${port}/`);
});

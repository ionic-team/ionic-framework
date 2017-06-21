var express = require('express');
var app = express();
var ionicUniversal = require('../../dist/ionic-universal');
var fs = require('fs');
var path = require('path');


var ionicServerConfig = {
  staticDir: path.join('../../dist/ionic-web')
}

console.log('load components from:', ionicServerConfig.staticDir);


var ionic = ionicUniversal.init(ionicServerConfig);


app.get('/', function (req, res) {
  console.time(`serve: ${req.url}`);

  var filePath = path.join(__dirname, '../core-hn/index.html');

  fs.readFile(filePath, 'utf-8', (err, html) => {
    if (err) {
      console.error(err);
      res.send(err);
      return;
    }

    var opts = {
      req: req
    };

    ionic.hydrate(html, opts).then(hydratedHtml => {
      console.timeEnd(`serve: ${req.url}`);
      res.send(hydratedHtml);

    }).catch(err => {
      res.send(err.toString() + err.stack && err.stack.toString());
    });
  });

});


app.get('/dist/*', function (req, res) {
  // manually serve other dist files
  var filePath = path.join(__dirname, '../../', req.url);
  console.log(filePath)
  fs.readFile(filePath, 'utf-8', (err, data) => {
    res.send(data);
  });
});


app.listen(3000, () => {
  console.log('app listening on port 3000!');
});

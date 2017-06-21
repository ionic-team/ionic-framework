var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');


var stencil = require('../../dist/stencil-server-renderer');
var renderer = stencil.createRenderer({
  staticDir: path.join('../../dist/ionic-web'),
  debug: true
});


app.get('/', function (req, res, next) {
  console.log(`serve: ${req.url}`);

  var filePath = path.join(__dirname, '../vanilla/index.html');

  fs.readFile(filePath, 'utf-8', (err, html) => {
    if (err) {
      console.error(err);
      res.send(err);
      return;
    }

    renderer.hydrateToString(
      {
        html: html,
        req: req,
        config: {}
      },
      function(err, html) {
        res.send(html);
      }
    );
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

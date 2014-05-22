var path = require('canonical-path');
var _ = require('lodash');

var projectBase = path.resolve(__dirname, '../..');

module.exports = function(config) {

  config.set('logging.level', 'info');

  config.set('rendering.templateFolders', [
    path.resolve(__dirname, 'templates/demo')
  ]);

  config.set('basePath', __dirname);
  config.set('source.projectPath', '.');

  config.set('rendering.outputFolder', path.resolve(projectBase, 'temp/ionic-demo'));

};

var path = require('canonical-path');
var _ = require('lodash');
var basePackage = require('dgeni-packages/ngdoc');

var projectBase = path.resolve(__dirname, '../..');
var pkg = require('../../package.json');

module.exports = function(config) {

  config = basePackage(config);

  config.set('logging.level', 'info');

  config.prepend('rendering.templateFolders', [
    path.resolve(__dirname, 'templates')
  ]);

  config.set('basePath', __dirname);
  config.set('source.projectPath', '.');

  config.set('rendering.outputFolder', path.resolve(projectBase, 'dist/ionic-site'));
  //contentsFolder is set in the version-data processor

  config.set('processing.api-docs', {
    outputPath: 'api/${docType}/${name}/index.md',
    path: 'api/${docType}/${name}/',
    moduleOutputPath: 'api/module/${name}/index.md',
    modulePath: 'api/module/${name}/'
  });

  config.append('processing.inlineTagDefinitions', [
    require('./inline-tag-defs/link')
  ]);

  config.set('source.files', [
    { pattern: 'js/**/*.js', basePath: projectBase }
  ]);

  config.append('processing.processors', [
    require('./processors/version-data'),
    require('./processors/index-page'),
    require('./processors/jekyll'),
  ]);

  config.append('rendering.filters', [
    require('./filters/capital')
  ]);

  config.append('processing.tagDefinitions', require('./tag-defs'));

  //Don't conflict with the jekyll tags
  config.set('rendering.nunjucks.config.tags', {
    blockStart: '<@',
    blockEnd: '@>',
    variableStart: '<$',
    variableEnd: '$>',
    commentStart: '<#',
    commentEnd: '#>'
  });

  return config;
};

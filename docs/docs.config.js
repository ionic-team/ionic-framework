var path = require('canonical-path');
var basePath = path.resolve(__dirname, '..');

var _ = require('lodash');

var basePackage = require('dgeni-packages/ngdoc');
var pkg = require('../package.json');

module.exports = function(config) {
  config.set('currentVersion', process.env.DOC_VERSION || 'nightly');

  config = basePackage(config);

  config.set('logging.level', 'info');

  config.prepend('rendering.templateFolders', [
    path.resolve(__dirname, 'templates')
  ]);

  config.set('basePath', __dirname);
  config.set('source.projectPath', '.');
  config.set('rendering.outputFolder', '../tmp/ionic-site');
  config.set('rendering.contentsFolder', 'docs/' + config.get('currentVersion'));

  config.set('processing.api-docs', {
    outputPath: '${area}/${module}/${docType}/${name}/index.md',
    path: '${area}/${module}/${docType}/${name}',
    moduleOutputPath: '${area}/${name}/index.md',
    modulePath: '${area}/${name}'
  });

  config.set('processing.pages-data', {
    template: ['pages-data.template.html'],
    outputPath: '_layouts/docs_0.9.0.html'
  });

  config.append('rendering.filters', [
    require('./filters/capital')
  ]);

  config.set('source.files', [
    { pattern: 'js/**/*.js', basePath: basePath }
  ]);

  config.append('processing.inlineTagDefinitions', [
    require('./inline-tag-defs/link')
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

  config.append('processing.processors', [
    require('./processors/git-data'),
    require('./processors/keywords'),
    require('./processors/pages-data'),
    require('./processors/index-page'),
    require('./processors/debug-dump')
  ]);

  return config;
};

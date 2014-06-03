var path = require('canonical-path');
var _ = require('lodash');
var staticSite = require('./static-site');

var projectBase = path.resolve(__dirname, '../..');

module.exports = function(config) {

  config = staticSite(config);
  config.set('buildConfig', require('../build.config'));

  //rendering.outputFolder set by gulp task

  config.merge('rendering.nunjucks.config.tags', {
    variableStart: '{$',
    variableEnd: '$}',
    blockStart: '{%',
    blockEnd: '%}'
  });

  config.set('logging.level', 'info');

  config.set('rendering.templateFolders', [
    path.resolve(__dirname, 'templates')
  ]);
  config.set('rendering.templatePatterns', [
    '${ doc.template }',
    '${doc.area}/${ doc.id }.${ doc.docType }.template.html',
    '${doc.area}/${ doc.id }.template.html',
    '${doc.area}/${ doc.docType }.template.html',
    '${ doc.id }.${ doc.docType }.template.html',
    '${ doc.id }.template.html',
    '${ doc.docType }.template.html'
  ]);

  config.append('processing.processors', [
    require('../docs/processors/version-data'),
    require('./processors/demos')
  ]);

  config.set('basePath', __dirname);
  config.set('source.projectPath', '.');

  config.set('source.files', [
    { pattern: 'demos/**/*.html', basePath: projectBase },
    { pattern: 'demos/**/*.js', basePath: projectBase },
    { pattern: 'demos/**/*.css', basePath: projectBase }
  ]);


  return config;
};

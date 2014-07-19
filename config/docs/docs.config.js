var path = require('canonical-path');
var _ = require('lodash');
var basePackage = require('dgeni-packages/ngdoc');
var buildConfig = require('../build.config');

var projectBase = path.resolve(__dirname, '../..');
var pkg = require('../../package.json');

module.exports = function(config) {

  config = basePackage(config);

  //rendering.outputFolder set by gulp task

  config.set('logging.level', 'info');

  config.prepend('rendering.templateFolders', [
    path.resolve(__dirname, 'templates')
  ]);

  config.set('basePath', __dirname);
  config.set('source.projectPath', '.');

  config.set('versionFolderBase', 'docs');

  config.set('processing.api-docs', {
    outputPath: 'api/${docType}/${name}/index.md',
    path: 'api/${docType}/${name}/',
    moduleOutputPath: 'api/module/${name}/index.md',
    modulePath: 'api/module/${name}/'
  });

  config.append('processing.inlineTagDefinitions', [
    require('./inline-tag-defs/link')
  ]);

  config.set('source.files', buildConfig.ionicFiles.concat(buildConfig.angularIonicFiles).map(function(file) {
    return { pattern: file, basePath: projectBase };
  }));

  config.append('processing.processors', [
    require('./processors/version-data'),
    require('./processors/index-page'),
    require('./processors/jekyll'),
    require('./processors/latest-version')
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

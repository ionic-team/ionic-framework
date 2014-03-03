var path = require('canonical-path');
var basePath = __dirname;

var basePackage = require('dgeni-packages/ngdoc');
var pkg = require('../package.json');

module.exports = function(config) {

  config = basePackage(config);

  config.set('rendering.outputFolder', '../tmp/ionic-site');

  //Don't conflict with the jekyll tags
  config.set('rendering.nunjucks.config.tags', {
    blockStart: '<@',
    blockEnd: '@>',
    variableStart: '<$',
    variableEnd: '$>',
    commentStart: '<#',
    commentEnd: '#>'
  });

  config.prepend('rendering.templateFolders', [
    path.resolve(basePath, 'templates')
  ]);

  config.append('processing.processors', [
    require('./processors/git-data'),
    require('./processors/keywords'),
    require('./processors/versions-data'),
    require('./processors/pages-data'),
    require('./processors/index-page'),
    require('./processors/debug-dump')
  ]);

  config.set('processing.component-groups-generate.outputPathBase', 'docs/angularjs');

  config.set('processing.pages-data', {
    template: ['pages-data.template.html'],
    outputPath: '_layouts/docs_0.9.0.html'
  });

  config.append('rendering.filters', [
    require('./filters/capital')
  ]);

  config.set('source.projectPath', path.resolve(basePath, '..'));

  config.set('source.files', [
    { pattern: 'js/**/*.js', basePath: path.resolve(basePath,'..') },
    // { pattern: '**/*.ngdoc', basePath: path.resolve(basePath, 'content') }
  ]);

  config.set('logging.level', 'info');

  config.merge('deployment', {
    environments: [{
      name: 'debug',
      examples: {
        commonFiles: {
          scripts: []
        },
        dependencyPath: '../../..'
      },
      scripts: [],
      stylesheets: []
    }]
  });

  return config;
};

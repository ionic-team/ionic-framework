var path = require('canonical-path');
var log = require('winston');

module.exports = {
  name: 'index-page',
  runAfter: ['adding-extra-docs'],
  runBefore: ['extra-docs-added'],
  description: 'Create documentation index page',
  process: function(docs, config) {
    var currentVersion = config.get('currentVersion');
    var contentsFolder = config.get('rendering.contentsFolder');
    var latestVersion = config.get('versionData.latest');

    docs.push({
      docType: 'index-page',
      id: 'index-page',
      currentVersion: currentVersion,
      template: 'api_index.template.html',
      outputPath: contentsFolder + '/api/index.md'
    });
    if (latestVersion.name !== currentVersion) {
      docs.push({
        docType: 'index-page',
        id: 'index-page',
        currentVersion: currentVersion,
        template: 'api_index.template.html',
        outputPath: contentsFolder + '/api/index.md'
      });
    }
  }
};

var path = require('canonical-path');
var log = require('winston');

var contentsFolder;
module.exports = {
  name: 'index-page',
  runAfter: ['adding-extra-docs'],
  runBefore: ['extra-docs-added'],
  description: 'Create documentation index page',
  init: function(config) {
    contentsFolder = config.get('rendering.contentsFolder');
  },
  process: function(docs) {
    docs.push({
      docType: 'index-page',
      id: 'index-page',
      template: 'index.template.html',
      outputPath: path.resolve(__dirname, '../../tmp/ionic-site/', contentsFolder, 'index.md')
    });
    log.warn(docs[docs.length-1]);
  }
};

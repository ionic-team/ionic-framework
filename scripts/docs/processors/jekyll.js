var log = require('winston');

module.exports = {
  name: 'jekyll',
  runAfter: ['api-docs'],
  runBefore: ['compute-path'],
  description: 'Create jekyll includes',
  process: function(docs, config) {
    var currentVersion = config.versionData.current.name;
    docs.push({
      template: 'api_menu.template.html',
      outputPath: '_includes/api_menu.html'
    });
    docs.push({
      template: 'api_menu_version.template.html',
      outputPath: '_includes/api_menu_' + currentVersion + '.html'
    });
    docs.push({
      template: 'api_version_select.template.html',
      outputPath: '_includes/api_version_select.html'
    });
  }
};

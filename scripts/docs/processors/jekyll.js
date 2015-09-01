module.exports = function jekyll(){
  return {
    name: 'jekyll',
    description: 'Create jekyll includes',
    $runAfter: ['adding-extra-docs'],
    $runBefore: ['extra-docs-added'],
    $process: function(docs) {
      //TODO(tlancina): supply this via DI
      var currentVersion = '2.0.0-alpha.2';

      docs.push({
        docType: 'api-menu',
        id: 'api-menu',
        template: 'api_menu.template.html',
        outputPath: '_includes/api_menu.html'
      });
      docs.push({
        docType: 'api-menu-version',
        id: 'api-menu-version',
        template: 'api_menu_version.template.html',
        outputPath: '_includes/api_menu_' + currentVersion + '.html'
      });
      docs.push({
        docType: 'api-version-select',
        id: 'api-version-select',
        template: 'api_version_select.template.html',
        outputPath: '_includes/api_version_select.html'
      });
    }
  }
};

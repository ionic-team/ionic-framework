module.exports = function jekyll(renderDocsProcessor){
  return {
    name: 'jekyll',
    description: 'Create jekyll includes',
    $runAfter: ['adding-extra-docs'],
    $runBefore: ['extra-docs-added'],
    $process: function(docs) {
      var currentVersion = renderDocsProcessor.extraData.version.current.name;

      docs.push({
        docType: 'api-menu',
        id: 'api-menu',
        template: 'api_menu.template.html',
        outputPath: '_includes/v2_api_menu.html'
      });
     //TODO autogenerate this
      docs.push({
        docType: 'api-menu-version',
        id: 'api-menu-version',
        template: 'api_menu_version.template.html',
        outputPath: '_includes/v2_api_menu_' + currentVersion + '.html'
      });
      docs.push({
        docType: 'api-version-select',
        id: 'api-version-select',
        template: 'api_version_select.template.html',
        outputPath: '_includes/v2_api_version_select.html'
      });
    }
  }
};

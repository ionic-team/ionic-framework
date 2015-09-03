module.exports = function indexPage(renderDocsProcessor) {
  return {
    name: 'index-page',
    description: 'Create documentation index page',
    $runAfter: ['adding-extra-docs'],
    $runBefore: ['extra-docs-added'],
    $process: function(docs) {
      var currentVersion = renderDocsProcessor.extraData.version.current.name;

      docs.push({
        docType: 'index-page',
        id: 'index-page',
        currentVersion: currentVersion,
        template: 'api_index.template.html',
        outputPath: 'docs/' + currentVersion + '/api/index.md'
      });
    }
  }
};

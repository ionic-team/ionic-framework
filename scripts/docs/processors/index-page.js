module.exports = function indexPage(renderDocsProcessor) {
  return {
    name: 'index-page',
    description: 'Create documentation index page',
    $runAfter: ['adding-extra-docs'],
    $runBefore: ['extra-docs-added'],
    $process: function(docs) {
      var versionData = renderDocsProcessor.extraData.version;
      var currentVersion = versionData.current.name;
      var latestVersion = versionData.latest.name;

      if (currentVersion == latestVersion) {
        docs.push({
          docType: 'index-page',
          id: 'index-page',
          currentVersion: currentVersion,
          template: 'api_index.template.html',
          outputPath: 'docs/api/index.md'
        });
      }
    }
  }
};

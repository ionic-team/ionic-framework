module.exports = function indexPage() {
  return {
    name: 'index-page',
    description: 'Create documentation index page',
    version: 'nightly',
    $runAfter: ['adding-extra-docs'],
    $runBefore: ['extra-docs-added'],
    $process: function(docs) {
      docs.push({
        docType: 'index-page',
        id: 'index-page',
        currentVersion: this.version,
        template: 'api_index.template.html',
        outputPath: 'index.md'
      });
    }
  }
};

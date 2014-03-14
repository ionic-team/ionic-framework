module.exports = {
  name: 'version-data',
  runBefore: ['pages-data'],
  process: function(docs, config, extraData) {
    extraData.version = config.get('versionData');
    docs.push({
      docType: 'version-data',
      id: 'version-data',
      template: 'version-data.template.json',
      outputPath: 'docs/version-data.json'
    });
  }
};

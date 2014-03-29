module.exports = {
  name: 'version-data',
  runBefore: ['api-docs'],
  description: 'Expose version data to templates',
  process: function(extraData, config) {
    extraData.version = config.get('versionData');
  }
};

module.exports = function(config) {

  require('dgeni-packages/base')(config);
  require('dgeni-packages/nunjucks')(config);

  config.append('source.fileReaders', [
    require('./file-readers/yaml')
  ]);

  config.append('processing.processors', [
  ]);

  return config;
};

var jsYaml = require('js-yaml');
var path = require('canonical-path');

var YAML_LINE_REGEX = /---+/;
var FILE_PATTERN_REGEX = /\.(scenario.js|js|html|css)$/;

module.exports = {
  pattern: FILE_PATTERN_REGEX,
  processFile: function(filePath, contents, basePath) {

    contents = contents.trim();

    var yamlStartMatch = contents.match(YAML_LINE_REGEX);
    if (!yamlStartMatch || yamlStartMatch.index !== 0) {
      return [];
    }

    var yamlContents = contents.substring(yamlStartMatch.index + yamlStartMatch[0].length + 1);

    var yamlEndMatch = yamlContents.match(YAML_LINE_REGEX);
    if (!yamlEndMatch) {
      return [];
    }

    contents = yamlContents.substring(yamlEndMatch.index + yamlEndMatch[0].length);
    yamlContents = yamlContents.substring(0, yamlEndMatch.index);

    var yamlJson = jsYaml.safeLoad(yamlContents);

    return [{
      fileType: filePath.match(FILE_PATTERN_REGEX)[0].toString(),
      file: filePath,
      basePath: basePath,
      contents: contents,
      yaml: yamlJson
    }];
  }
};


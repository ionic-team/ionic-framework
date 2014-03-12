var _ = require('lodash');
var fs = require('fs');
var semver = require('semver');
var path = require('canonical-path');

var basePath;
var outputFolder;
var currentVersion;
module.exports = {
  name: 'version-data',
  description: 'Give a list of all available versions to the template',
  runBefore: ['pages-data'],
  init: function(config) {
    basePath = config.get('basePath');
    outputFolder = config.get('rendering.outputFolder');
    currentVersion = config.get('currentVersion');
  },
  process: function(docs, extraData) {
    var docsBaseFolder = path.resolve(basePath, outputFolder, 'docs');

    //Array of versions sorted backwards
    var versions = fs.readdirSync(docsBaseFolder)
      .filter(semver.valid)
      .sort(semver.rcompare);

    //Add current version to the top of the list if not exists
    !_.contains(versions, currentVersion) && versions.unshift(currentVersion);

    //Add nightly to the top of the list if not exists
    !_.contains(versions, 'nightly') && versions.unshift('nightly');

    versions = versions.map(function(ver) {
      return {
        href: '/docs/' + ver,
        name: ver
      };
    });
    extraData.version = {
      list: versions,
      current: _.find(versions, { name: currentVersion })
    };
  }
};

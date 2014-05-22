var _ = require('lodash');
var fs = require('fs');
var semver = require('semver');
var path = require('canonical-path');

module.exports = function(config) {
  var basePath = config.get('basePath');
  var outputFolder = config.get('rendering.outputFolder');
  var currentVersion = config.get('currentVersion');

  var docsBaseFolder = path.resolve(basePath, outputFolder, 'docs');

  var versions;
  try {
    versions = fs.readdirSync(docsBaseFolder)
      .filter(semver.valid)
      .sort(semver.rcompare);
  } catch(e) {
    versions = [];
  }

  !_.contains(versions, currentVersion) && versions.unshift(currentVersion);
  !_.contains(versions, 'nightly') && versions.unshift('nightly');

  //First semver valid version is latest
  var latestVersion = _.find(versions, semver.valid);
  versions = versions.map(function(version) {
    //Latest version is in docs root
    var folder = version == latestVersion ? '' : version;
    return {
      href: path.join('/docs', folder),
      folder: folder,
      name: version
    };
  });

  return {
    list: versions,
    current: _.find(versions, { name: currentVersion }),
    latest: _.find(versions, {name: latestVersion}) || _.first(versions)
  };
};

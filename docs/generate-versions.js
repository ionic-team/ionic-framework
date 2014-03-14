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
    versions = require(docsBaseFolder + '/version-data.json');
  } catch(e) {
    versions = [];
  }

  var nightlyVersion = {
    href: '/docs/nightly',
    folder: 'nightly',
    name: 'nightly'
  };

  if ( !_.find(versions, {name: currentVersion}) ) {
    //Make sure nightly version is always at the front of the list
    if (currentVersion != 'nightly') {
      versions.unshift({
        href: '/docs/latest',
        folder: 'latest',
        name: currentVersion
      });
      //Make sure that if we have a nightly version, it moves back to the front
      if (_.contains(versions, {name:'nightly'})) {
        _.remove(versions, {name:'nightly'});
        versions.unshift(nightlyVersion);
      }
    } else {
      versions.unshift(nightlyVersion);
    }
  }

  //Add current version to the top of the list if not exists
  if (!_.find(versions, {name: currentVersion})) {
    versions.unshift(currentVersion);
  }

  return {
    list: versions,
    current: _.find(versions, { name: currentVersion }),
    latest: _.find(versions, function(v) { return semver.valid(v.name); }) ||
      _.first(versions)
  };
};

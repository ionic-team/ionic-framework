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

  var hasNightlyVersion = currentVersion == 'nightly' ||
    _.find(versions, {name: 'nightly'});
  var nightlyVersion = {
    href: '/docs/nightly',
    folder: 'nightly',
    name: 'nightly'
  };

  //Remove nightly from versions before trying to sort things out
  //because it's different (the only non-semver version)
  _.remove(versions, {name: 'nightly'});

  if (currentVersion == 'nightly') {
    //do nothing

  } else if ( !_.find(versions, {name: currentVersion}) ) {
    //If version doesn't exist, add it...
    versions.unshift({
      href: '/docs/latest',
      folder: 'latest',
      name: currentVersion
    });

    versions.forEach(function(version, index) {
      //Make sure the other versions aren't still latest,
      //if so rename them
      if (_.contains(version.href, 'latest') && index > 0) {
        version.href = '/docs/'+version.name,
        version.folder = version.name;
        fs.unlinkSync(docsBaseFolder + '/' + version.name);
        fs.renameSync(
          docsBaseFolder + '/latest',
          docsBaseFolder + '/' + version.name
        );
      }
    });
  }

  //Add nightly back to front if it exists
  if (hasNightlyVersion) {
    versions.unshift(nightlyVersion);
  }
  console.log(versions);

  return {
    list: versions,
    current: _.find(versions, { name: currentVersion }),
    latest: _.find(versions, function(v) { return semver.valid(v.name); }) ||
      _.first(versions)
  };
};

var copy = require('cpr').cpr;
var mkdirp = require('mkdirp');
var path = require('canonical-path');
var q = require('q');

module.exports = {
  name: 'latest-version',
  runAfter: ['write-files'],
  description: 'Copy the latest version (that was compiled to docs/) into docs/versionName',
  process: function(docs, config) {
    var versionData = config.get('versionData');

    var docsBase = path.join(config.get('rendering.outputFolder'), 'docs');
    var versionDir = path.join(docsBase, versionData.latest.name);
    var latestDir = path.join(docsBase, 'api');

    var deferred = q.defer();

    mkdirp(versionDir, function() {
      copy(latestDir, path.join(versionDir, 'api'), {
        deleteFirst: true,
        overwrite: true
      }, function(err, files) {
        deferred.resolve(docs);
      });
    });

    return deferred.promise;
  }
};

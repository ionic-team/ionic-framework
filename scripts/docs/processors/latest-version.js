var copy = require('cpr').cpr;
var mkdirp = require('mkdirp');
var path = require('canonical-path');
var q = require('q');
var fs = require('fs');

module.exports = function latestVersion(renderDocsProcessor) {
  return {
    name: 'latest-version',
    $runAfter: ['files-written'],
    description: 'Copy the latest version (that was compiled to docs/) into docs/versionName',
    $process: function(docs) {
      var versionData = renderDocsProcessor.extraData.version;

      var docsBase = 'dist/ionic-site/docs/v2/';
      var versionDir = path.resolve(docsBase, versionData.latest.name);
      var latestDir = path.resolve(docsBase, 'api');

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
  }
};

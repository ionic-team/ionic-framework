var path = require('path');
var fs = require('fs');
var Q = require('q');
var sassdoc = require('sassdoc');

module.exports = function parseSass () {
  return {
    $runBefore: ['rendering-docs'],
    $process: function (docs) {

      var folders = [];
      var docsByComponent = [];
      var promises = [];
      var returnPromise = Q.defer();

      // for each doc, check if new folder(component)
      // if yes, get styles promises
      docs.forEach( function(doc, index) {
        if (doc.fileInfo) {
          var folder = doc.fileInfo.filePath
            .split('/')
            .filter( function (item, index, self) {
              return index !== self.length -  1;
            })
            .join('/');
          if(folders.indexOf(folder) === -1) {
            folders.push(folder);
            docsByComponent.push([doc]);
            promises.push( getStyles(folder, docsByComponent.length - 1) );
          } else {
            docsByComponent[folders.indexOf(folder)].push(doc);
          }
        }
      });

      // when all promises are completed, add sass info
      Q.allSettled(promises).spread( function () {
        var folders = Array.prototype.map.bind(arguments)(function (item) {
          return item.value;
        });
        appendStyles(folders, docsByComponent);
        returnPromise.resolve(docs);
      }).catch( function (error) {
        console.log('Sass Error: ' + error);
        returnPromise.resolve(docs);
      });

      return returnPromise.promise;
    }
  }
};

function appendStyles(folders, docsByComponent) {
  folders.forEach( function (folder) {

    var styles = formatStyles(folder);

    if (styles.length) {
      docsByComponent[folder.index].forEach( function (doc) {
        doc.sassVariables = styles;
      });
    }
  });
}

function formatStyles (folder) {

  return folder.styles.filter( function (style) {
      return style.data && style.data.length;
  }).map( function (style) {

    var props = style.data.filter( function (item) {
      return item.property && item.property.length;
    }).map( function (item) {

      var property = item.property[0];

      return {
        name: item.context.name || '',
        default: item.context.value || '',
        description: property.description || '',
      };
    });

    return { platform: style.platform, props: props };
  });
}

function getStyles (folder, docIndex) {

  var returnPromise = Q.defer();

  // get component name
  var component = folder.split('/').pop();

  // generate file names to check
  var extension = 'scss';
  var files = [];

  files.push({
    platform: 'base',
    path: path.join(folder, [component, extension].join('.'))
  });

  ['ios', 'md', 'wp'].forEach( function (platform) {
    var fileName = [component, platform, extension].join('.');
    files.push({
      platform: platform,
      path: path.join(folder, fileName)
    });
  });

  // for each file, fetch styles
  var promises = files.map( function (file) {
    return Q.promise( function (resolve, reject) {
      fs.access(file.path, function (err) {
        if (!err) {
          sassdoc.parse(file.path )
            .then( function (data) {
              resolve( { platform: file.platform, data: data });
            }).catch( function (error) {
              reject(error);
            });
        } else {
          // file doesn't exist
          resolve({ platform: file.platform, data: null });
        }
      });
    });
  });

  // when all promises are finished, return the results
  Q.allSettled(promises).then( function (results) {
    var styles = results.map( function (style) {
      return style.value;
    });
    returnPromise.resolve({ index: docIndex, styles: styles });
  }).catch( function (error) {
    returnPromise.reject(error);
  });

  return returnPromise.promise;
}

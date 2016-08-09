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
        console.log('SASS ERROR: ' + error);
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

  // container for holding styles by platform
  var concatenatedStyles = {};

  // extract styles
  folder.styles.filter( function (file) {
      return file.data && file.data.length;
  }).forEach( function (file) {

    var props = file.data.filter( function (item) {
      return item.property && item.property.length;
    }).map( function (item) {

      var property = item.property[0];

      return {
        name: item.context.name || '',
        default: item.context.value || '',
        description: property.description || '',
      };
    });

    if( concatenatedStyles[file.platform] ) {
      concatenatedStyles[file.platform] = concatenatedStyles[file.platform].concat(props);
    } else {
      concatenatedStyles[file.platform] = props;
    }
  });

  // place in Array
  var formattedStyles = [];

  ['base', 'ios', 'md', 'wp'].forEach( function (platform) {
    if ( concatenatedStyles[platform] ) {
      formattedStyles.push({
        platform: platform,
        props: concatenatedStyles[platform]
      });
    }
  });

  return formattedStyles;
}

function getStyles (folder, docIndex) {

  var returnPromise = Q.defer();

  // generate file names to check
  var extension = 'scss';

  var allFiles = fs.readdirSync(folder);

  var removeNonSass = function (filename) {
    return filename.split('.').pop() === extension;
  };

  var toFileObject = function (filename) {
    // determine platform
    var platform = filename.split('.')[1];

    if ( ['ios', 'md', 'wp'].indexOf(platform) === -1 ) {
      platform = 'base';
    }

    return {
      platform: platform,
      path: path.join(folder, filename)
    };
  };

  var files = allFiles.filter(removeNonSass).map(toFileObject);

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

var _ = require('lodash');
var log = require('dgeni').log;
var path = require('canonical-path');

var typeTransform = {
  markdown: 'md'
};

module.exports = {
  name: 'demos',
  description: 'Output demos to their files on ionic-demo website',
  runAfter: ['files-read'],
  runBefore: ['processing-docs'],
  process: function(docs, config, extraData) {

    var contentsFolder = config.rendering.contentsFolder;
    var assetOutputPath = '${component}/${name}/${fileName}';

    var pages = [];

    var templates = {
      '.scenario.js': 'scenario.template.js'
    };
    var transform = {
      '.scenario.js': function(doc) {
        doc.url = 'http://localhost:' +
        config.get('buildConfig.protractorPort') + '/' + path.join(
          config.demoFolderPrefix || '',
          config.versionData.current.folder,
          _.template(assetOutputPath, _.assign({},doc,{fileName:''}))
        );
        return doc;
      }
    };

    var demos = _(docs)
      .filter('yaml')
      .groupBy(function(doc) {
        return doc.yaml.component + '-' + doc.yaml.name;
      })
      .map(function(fragmentsForId, id) {

        var demoData = {
          files: []
        };
        fragmentsForId.forEach(function(fragment) {
          var doc = fragment.yaml;
          if (!doc.name || !doc.component) {
            log.error('Doc ' + fragment.filePath +
                      ' expects yaml keys "name" and "component"!');
          }

          doc.id = doc.component + '-' + doc.name;
          doc.fileType = typeTransform[fragment.fileType] || fragment.fileType;
          doc.fileName = fragment.fileName;
          doc.contents = fragment.contents;
          doc.extension = doc.fileType.replace(/^\./,'');

          doc.template = templates[doc.fileType] || 'asset.contents.template',
          doc.outputPath = path.join(contentsFolder, _.template(assetOutputPath, doc));

          doc = (transform[doc.fileType] || _.identity)(doc);

          demoData.files.push(doc);
          pages.push(doc);
        });

        var firstDoc = demoData.files[0];

        var indexOutputPath = path.join(
          contentsFolder,
          _.template(assetOutputPath, _.assign({}, firstDoc, {
            fileName: 'index.html'
          }))
        );
        var appOutputPath = path.join(
          contentsFolder,
          _.template(assetOutputPath, _.assign({}, firstDoc, {
            fileName: 'index-ionic-demo-app.js'
          }, demoData))
        );


        demoData.files = _.groupBy(demoData.files, 'extension');
        demoData.id = firstDoc.id;
        demoData.name = firstDoc.name;
        demoData.component = firstDoc.component;
        demoData.href = path.join(
          '/',
          contentsFolder,
          _.template(assetOutputPath, _.assign({}, firstDoc, { fileName: '' }))
        );

        pages.push({
          template: 'index.template.html',
          demoData: demoData,
          outputPath: indexOutputPath
        });
        pages.push({
          template: 'app.template.js',
          demoData: demoData,
          outputPath: appOutputPath
        });

        return demoData;

      })
      .value();

    pages.push({
      template: 'pages-data.template.js',
      demos: demos,
      outputPath: path.join(contentsFolder, 'pages-data.js')
    });
    pages.push({
      template: 'index.template.html',
      outputPath: path.join(contentsFolder, 'index.html')
    });
    pages.push({
      template: 'app.template.js',
      outputPath: path.join(contentsFolder, 'index-ionic-demo-app.js')
    });

    extraData.demoFolderPrefix = config.get('demoFolderPrefix');

  return pages;
}
};

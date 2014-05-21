var path = require('canonical-path');
var log = require('winston');
var _ = require('lodash');

var currentVersion;
var contentsFolder;
module.exports = {
  name: 'demos',
  runAfter: ['api-docs'],
  runBefore: ['index-page'],
  description: 'Create demos',
  init: function(config) {
    currentVersion = config.get('currentVersion');
    contentsFolder = config.get('rendering.contentsFolder');
  },
  process: function(docs, config, extraData) {
    if(1) return;
    var demoTags = [
      'javascript',
      'html',
      'css',
      'spec',
      'scenario'
    ];
    var extensions = {
      javascript: 'js',
      html: 'html',
      css: 'css',
      spec: 'js',
      scenario: 'js'
    };

    var demoFolder = path.join(config.get('versionData.current.folder'),
                               '${docType}/${name}');
    var demoPath = '${name}/${filename}.${extension}';
    var templatePath = 'demo/${filename}.template.${extension}';

    var allDemos = [];
    _(docs)
    .filter(function(doc) { return doc.demos; })
    .forEach(function(doc) {
      var outputFolder = _.template(demoFolder,doc);

      doc.demos.forEach(function(demo) {
        var demoData = {};
        allDemos.push(demoData);

        var outputFolder = _.template(demoFolder, doc);
        demoData.module = demo.module;
        demoData.name = demo.name;
        demoData.docName = doc.name;
        demoData.href = '/' + outputFolder + '/' + demo.name;

        demoTags.forEach(function(tagName) {
          var data = demo.tags.tagsByName[tagName];

          if (data && data.length) {
            var content = data.map(function(d) {
              return d.description;
            }).join('\n');
            var filename = tagName;
            var ext = extensions[tagName];
            var outputPath = outputFolder + '/' + _.template(demoPath, {
              name: demo.name,
              filename: filename,
              extension: ext
            });
            var template = _.template(templatePath, {
              filename: filename,
              extension: ext
            });

            demoData[tagName] = {
              path: outputPath,
              content: content
            };

            //Write all the files for this demo (html, css, js)
            docs.push({
              docType: 'demo',
              id: doc.name + '/' + demo.name,
              outputPath: config.get('demos.outputFolder') + '/' + outputPath,
              template: template,
              contents: content
            });
          }

        });
        var indexOutputPath = outputFolder + '/' + _.template(demoPath, {
          name: demo.name,
          filename: 'index',
          extension: 'html'
        });
        var scriptOutputPath = outputFolder + '/' + _.template(demoPath, {
          name: demo.name,
          filename: 'demo',
          extension: 'js'
        });

        //Write this specific demo's index & js page
        docs.push({
          docType: 'demo',
          outputPath: path.join(config.get('demos.outputFolder'), indexOutputPath),
          template: 'demo_index.template.html',
          demoData: demoData,
          name: doc.name
        });
        docs.push({
          docType: 'demo',
          outputPath: path.join(config.get('demos.outputFolder'), scriptOutputPath),
          template: 'demo_script.template.js',
          demoData: demoData,
          name: doc.name
        });
      });
    })
    .value();

    //Write the demo index & js for the whole version (eg at /nightly)
    docs.push({
      docType: 'demo',
      template: 'demo_index.template.html',
      outputPath: path.join(
        config.get('demos.outputFolder'),
        config.get('versionData.current.folder'),
        'index.html'
      )
    });
    docs.push({
      docType: 'demo',
      template: 'demo_script.template.js',
      outputPath: path.join(
        config.get('demos.outputFolder'),
        config.get('versionData.current.folder'),
        'demo.js'
      )
    });

    //Write the demo list to current version (eg at /nightly);
    docs.push({
      docType: 'demo',
      template: 'demo_list.template.js',
      outputPath: path.join(
        config.get('demos.outputFolder'),
        config.get('versionData.current.folder'),
        'demo-list.js'
      )
    });

    extraData.demos = allDemos;
  }
};

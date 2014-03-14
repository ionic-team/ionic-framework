var _ = require('lodash');
var path = require('canonical-path');
var log = require('winston');

var outputFolder;
var processorConfig;
var currentVersion;

module.exports = {
  name: 'pages-data',
  description: 'This plugin will create a new doc that will be rendered as an angularjs module ' +
               'which will contain meta information about the pages and navigation',
  runAfter: ['adding-extra-docs', 'component-groups-generate'],
  runBefore: ['extra-docs-added'],
  init: function(config) {
    outputFolder = config.rendering.outputFolder;
    processorConfig = config.get('processing.pages-data', {});
    currentVersion = config.get('currentVersion');
  },
  process: function(docs) {
    // Generate an object collection of pages that is grouped by section e.g.
    // - section "directive"
    //  - group "Tab Bar"
    //    - ion-tabs
    //    - ion-tab
    //  - group ""
    //    - ion-toggle
    //    - ion-checkbox
    //    - ...
    //
    var groups = _(docs)
      .filter(function(doc) { return doc.area === 'api'; })
      .filter(function(doc) { return doc.module === 'ionic'; })
      .filter(function(doc) { return doc.docType !== 'componentGroup'; })
      .groupBy(function(doc) { if (!doc.group) doc.group = 'Other'; return doc.group; })
      .map(function(pages, groupName) {
        var sections = _(pages)
          .groupBy('docType')
          .map(function(pages, docType) {
            return {
              name: docType,
              pages: _(pages)
                .sortBy(function(doc) {
                  return doc.groupMainItem;
                })
                .map(function(doc) {
                  return {
                    href: doc.path,
                    name: doc.name,
                    docType: doc.docType,
                    type: doc.docType,
                  };
                })
                .filter(function(doc) {
                  return !!doc.name;
                })
                .value()
            };
          })
          .sortBy(function(section) {
            //Directives always first
            return section.name != 'directive';
          })
          .value();

        return {
          name: groupName,
          sections: sections
        };
      })
      .sortBy(function(group) {
        //Sort by groups with most items last
        return _.values(group.sections).length;
      })
      .value();

    _.forEach(docs, function(doc) {
      if ( !doc.path ) {
        log.warn('Missing path property for ', doc.id);
      }
    });

    var docData = {
      docType: 'pages-data',
      id: 'pages-data',
      template: processorConfig.template || 'pages-data.template.js',
      outputPath: processorConfig.outputPath || 'js/pages-data.js',

      groups: groups
    };

    docs.push(docData);
  }
};

var _ = require('lodash');
var fs = require('fs');
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
  process: function(docs, config) {
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
    var sections = _(docs)
      .filter(function(doc) { return doc.area === 'api'; })
      .filter(function(doc) { return doc.module === 'ionic'; })
      .filter(function(doc) { return doc.docType !== 'componentGroup'; })
      .groupBy('docType')
      .map(function(pages, docType) {
        return {
          name: docType,
          components: pages.map(function(page) {
            return {
              href: page.path,
              name: page.name,
              docType: page.docType,
              type: page.docType
            };
          })
        };
      })
      .sortBy(function(section) {
        //Directives always first
        return section.name != 'directive';
      })
      .value();

    var outputFolder = path.join(config.get('basePath'), config.get('rendering.outputFolder'));
    var menuFileName = '_includes/api_menu_' + config.versionData.current.name + '.html';
    var menuInclude = path.join(outputFolder, menuFileName);

    if (!fs.existsSync(menuInclude)) {
      docs.push({
        docType: 'menu-data',
        id: 'menu-data',
        template: 'menu-data.template.html',
        outputPath: menuFileName,
        sections: sections
      });
    }

    docs.push({
      docType: 'pages-data',
      id: 'pages-data',
      template: processorConfig.template || 'pages-data.template.js',
      outputPath: processorConfig.outputPath || 'js/pages-data.js',
    });
  }
};

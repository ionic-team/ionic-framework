var Package = require('dgeni').Package;
var jsdocPackage = require('dgeni-packages/jsdoc');
var nunjucksPackage = require('dgeni-packages/nunjucks');
var typescriptPackage = require('./typescript-package');
var linksPackage = require('./links-package');
var gitPackage = require('dgeni-packages/git');
var path = require('path');

// Define the dgeni package for generating the docs
module.exports = new Package('ionic-v2-docs', [jsdocPackage, nunjucksPackage, typescriptPackage, linksPackage, gitPackage])

.processor(require('./processors/index-page'))
.processor(require('./processors/jekyll'))

// for debugging docs
// .processor(function test(){
//   return {
//     $runAfter: ['readTypeScriptModules'],
//     $runAfter: ['parsing-tags'],
//     $process: function(docs){
//     }
//   }
// })

.config(function(log) {
  log.level = 'error'; //'silly', 'debug', 'info', 'warn', 'error'
})

.config(function(renderDocsProcessor, versionInfo) {
  renderDocsProcessor.extraData.versionInfo = versionInfo;
})

//configure file reading
.config(function(readFilesProcessor, readTypeScriptModules) {

  // Don't run unwanted processors since we are not using the normal file reading processor
  readFilesProcessor.$enabled = false;
  readFilesProcessor.basePath = path.resolve(__dirname, '../..');

  readTypeScriptModules.basePath = path.resolve(path.resolve(__dirname, '../..'));
  readTypeScriptModules.sourceFiles = [
    'ionic/ionic.ts'
  ];
})

.config(function(parseTagsProcessor) {
  // We actually don't want to parse param docs in this package as we are getting the data out using TS
  parseTagsProcessor.tagDefinitions.forEach(function(tagDef) {
    if (tagDef.name === 'param') {
      tagDef.docProperty = 'paramData';
      tagDef.transforms = [];
    }
  });
})

// Configure links
.config(function(getLinkInfo) {
  getLinkInfo.useFirstAmbiguousLink = false;
})

// Configure file writing
.config(function(writeFilesProcessor) {
  writeFilesProcessor.outputFolder  = 'dist/ionic-site'
})

// Configure rendering
.config(function(templateFinder, templateEngine) {

  // Nunjucks and Angular conflict in their template bindings so change the Nunjucks
  // Also conflict with Jekyll
  templateEngine.config.tags = {
    variableStart: '<$',
    variableEnd: '$>',
    blockStart: '<@',
    blockEnd: '@>',
    commentStart: '<#',
    commentEnd: '#>'
  };

  templateFinder.templateFolders.unshift(path.resolve(__dirname, 'templates'));

  // Specify how to match docs to templates.
  // In this case we just use the same static template for all docs
  templateFinder.templatePatterns = [
    '${ doc.template }',
    '${ doc.docType }.template.html',
    'common.template.html'
  ]

  // templateFinder.templatePatterns = [
  //   '${ doc.template }',
  //   '${ doc.id }.${ doc.docType }.template.html',
  //   '${ doc.id }.template.html',
  //   '${ doc.docType }.template.html',
  //   'common.template.html'
  // ];
})

// Configure ids and paths
.config(function(computeIdsProcessor, computePathsProcessor, versionInfo) {
  // computeIdsProcessor.idTemplates.push({
  //   docTypes: ['guide'],
  //   getId: function(doc) {
  //     return doc.fileInfo.relativePath
  //                   // path should be relative to `modules` folder
  //                   .replace(/.*\/?modules\//, '')
  //                   // path should not include `/docs/`
  //                   .replace(/\/docs\//, '/')
  //                   // path should not have a suffix
  //                   .replace(/\.\w*$/, '');
  //   },
  //   getAliases: function(doc) { return [doc.id]; }
  // });

  // docTypes: 'module', 'member', 'class', 'var', 'function', 'let'

  computePathsProcessor.pathTemplates = [{
    docTypes: ['class', 'var', 'function', 'let'],
    getOutputPath: function(doc) {
      // TODO(tlancina): Use nightly if version isn't specified by gulp task
      // TODO(tlancina): inject api base path
      return 'docs/' + versionInfo.currentVersion.raw + '/api/' + doc.fileInfo.relativePath
               // strip ionic from path root
               .replace(/^ionic\//, '')
               // replace extension with .html
               .replace(/\.\w*$/, '.html');
    }
  }];
});

var Package = require('dgeni').Package;
var jsdocPackage = require('dgeni-packages/jsdoc');
var nunjucksPackage = require('dgeni-packages/nunjucks');
var typescriptPackage = require('./typescript-package');
var path = require('path');

// Define the dgeni package for generating the docs
module.exports = new Package('ionic-v2-docs', [jsdocPackage, nunjucksPackage, typescriptPackage/*, linksPackage, gitPackage*/])

.config(function(log) {
  log.level = 'debug' //'warn';
})

.config(function(readFilesProcessor, inlineTagProcessor, readTypeScriptModules, createTypeDefinitionFile) {

  // Don't run unwanted processors
  readFilesProcessor.$enabled = false; // We are not using the normal file reading processor
  inlineTagProcessor.$enabled = false; // We are not actually processing the inline link tags

  // jsdocFileReader.defaultPattern = /\.(j|t)s$/;
  // readFilesProcessor.fileReaders = [jsdocFileReader];
  readFilesProcessor.basePath = path.resolve(__dirname, '../..');
  readTypeScriptModules.basePath = path.resolve(path.resolve(__dirname, '../..'));
  // readFilesProcessor.sourceFiles = [
  //   { include: 'ionic/**/*.ts', basePath: 'ionic' }
  // ]
  readTypeScriptModules.sourceFiles = [
    'ionic/ionic.ts'
  ];

  writeFilesProcessor.outputFolder = 'dist/docs'
});

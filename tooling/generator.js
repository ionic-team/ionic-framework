var _ = require('lodash'),
    fs = require('fs'),
    path = require('path'),
    mkdirp = require('mkdirp-no-bin');

module.exports = Generator;

function Generator(options) {
  this.name = options.name;
  this.type = options.generator;
  this.appDirectory = options.appDirectory;

  //templateVars
  this.fileName = _.kebabCase(this.name);
  this.jsClassName = _.capitalize(_.camelCase(this.name));
}

Generator.prototype.run = function(){
  this.makeDirectories();
  this.renderTemplates();
}

Generator.prototype.makeDirectories = function(){
  if (!this.directory) {
    throw new Error('Generators must define their directory in their constructor.\nEx: \'pages\', \'components\', etc.');
  }
  mkdirp.sync(path.join(this.appDirectory, 'app', this.directory, this.fileName));
}

Generator.prototype.renderTemplates = function renderTemplates() {
  var templates = this.loadTemplates();

  templates.forEach(function(template) {
    var renderedTemplate = this.renderTemplate(template);
    var renderedTemplateDest = path.join(this.appDirectory, 'app', this.directory, this.fileName, this.fileName + template.extension);
    console.log('√ Create'.blue, path.relative(this.appDirectory, renderedTemplateDest));
    fs.writeFileSync(renderedTemplateDest, renderedTemplate);
  }, this);
}

Generator.prototype.loadTemplates = function() {
  var generatorPath = path.join(__dirname, 'generators', this.type);
  var templates = [];
  fs.readdirSync(generatorPath)
  .forEach(function(template) {
    var type;
    // Go through all the files in the folder, grab the templates, read in the file contents
    // return as template type, contents
    if (template.indexOf('.tmpl') == -1) {
      return;
    }

    templates.push({path: path.join(generatorPath, template), extension: path.extname(template)});
  }, this);

  return templates;
};

Generator.prototype.renderTemplate = function(template) {
  var templateContents = fs.readFileSync(template.path, 'utf8');
  var templateCompiler = _.template(templateContents);
  var result = templateCompiler(this);
  return result;
};
var _ = require('lodash'),
    fs = require('fs'),
    path = require('path'),
    shell = require('shelljs');

module.exports = Generator;

function Generator(options) {
  this.name = _.kebabCase(options.name);
  this.type = options.generator;
  this.appDirectory = options.appDirectory;
}

Generator.prototype.run = function(){
  this.makeDirectories();
  this.renderTemplates();
}

Generator.prototype.makeDirectories = function(){
  if (!this.directory) {
    throw new Error('Generators must define their directory in their constructor');
  }
  shell.mkdir('-p', path.join(this.appDirectory, this.directory, this.name));
}

Generator.prototype.renderTemplates = function renderTemplates() {
  var templates = this.loadTemplates();

  templates.forEach(function(template) {
    var renderedTemplate = this.renderTemplate(template);
    var renderedTemplateDest = path.join(this.appDirectory, this.directory, this.name, this.name + template.extension);
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
  var templateVars = {
    fileName: _.kebabCase(this.name),
    directory: this.directory,
    cssClassName: _.kebabCase(this.name),
    jsClassName: _.capitalize(_.camelCase(this.name))
  }

  var templateContents = fs.readFileSync(template.path, 'utf8');
  var templateCompiler = _.template(templateContents);
  var result = templateCompiler(templateVars);
  return result;
};
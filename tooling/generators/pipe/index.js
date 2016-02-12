
var path = require('path'),
    fs = require('fs'),
    mkdirp = require('mkdirp-no-bin'),
    Generator = require('../../generator');

module.exports = PipeGenerator;

function PipeGenerator(options) {
  Generator.call(this, options);
  this.directory = 'pipes';
}

PipeGenerator.prototype = Object.create(Generator.prototype);

PipeGenerator.prototype.makeDirectories = function(){
  mkdirp.sync(path.join(this.appDirectory, 'app', this.directory));
}

PipeGenerator.prototype.renderTemplates = function renderTemplates() {
  var templates = this.loadTemplates();

  templates.forEach(function(template) {
    var renderedTemplate = this.renderTemplate(template);
    var renderedTemplateDest = path.join(this.appDirectory, 'app', this.directory, this.name + template.extension);
    console.log('√ Create'.blue, path.relative(this.appDirectory, renderedTemplateDest));
    fs.writeFileSync(renderedTemplateDest, renderedTemplate);
  }, this);
}


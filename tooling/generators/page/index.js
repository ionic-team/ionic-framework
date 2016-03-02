var path = require('path'),
    fs = require('fs'),
    Generator = require('../../generator');

module.exports = PageGenerator;

function PageGenerator(options) {
  Generator.call(this, options);
  this.directory = 'pages';
  this.jsClassName += 'Page';
}

PageGenerator.prototype = Object.create(Generator.prototype);

Generator.prototype.renderTemplates = function renderTemplates() {
  var templates = this.loadTemplates();
  var scssPath = null;

  templates.forEach(function(template) {
    var renderedTemplate = this.renderTemplate(template);
    var renderedTemplateDest = path.join(this.appDirectory, 'app', this.directory, this.fileName, this.fileName + template.extension);
    if (template.extension === '.scss') {
      scssName = this.fileName + template.extension;
      scssPath = renderedTemplateDest;
    }
    console.log('√ Create'.blue, path.relative(this.appDirectory, renderedTemplateDest));
    fs.writeFileSync(renderedTemplateDest, renderedTemplate);
  }, this);

  console.log(('\nDon\'t forget to add an import for ' + scssName + ' ' + 'in ' +
               path.join('app', 'themes', 'app.core.scss') + ':\n\n  @import "' +
               path.relative(path.join(this.appDirectory, 'app', 'themes'), scssPath) +
               '";\n').green);
}



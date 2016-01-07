var fs = require('fs'),
    Generator = module.exports,
    Generate = require('../../generate'),
    path = require('path'),
    Q = require('q');
/*
    @options
      name: Page name
      appDirectory: App directory of where to save file
*/
Generator.run = function run(options) {
  Generate.createScaffoldDirectories({appDirectory: options.appDirectory, componentDirectory: 'pages', fileName: options.fileName});

  options.rootDirectory = options.rootDirectory || path.join('app', 'pages');
  var savePath = path.join(options.appDirectory, options.rootDirectory, options.fileName);

  var templates = Generate.loadGeneratorTemplates(__dirname);

  templates.forEach(function(template) {
    options.templatePath = template.file;
    var renderedTemplate = Generate.renderTemplateFromFile(options);
    var saveFilePath = path.join(savePath, [options.fileName, template.type].join(''));
    // console.log('renderedTemplate', renderedTemplate, 'saving to', saveFilePath);
    console.log('√ Create'.blue, path.relative(options.appDirectory, saveFilePath));
    fs.writeFileSync(saveFilePath, renderedTemplate);
  });
};

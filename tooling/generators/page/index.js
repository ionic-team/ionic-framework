/*
  ionic g page about
  what should happen:
    create directories if not existing: /www, /www/app, /www/app/about
    create files (about.html, about.scss, about.js) in /www/app/about
*/
var fs = require('fs'),
    Generator = module.exports,
    Generate = require('../../generate'),
    path = require('path'),
    Q = require('q');
/*
  Run: generate a page template from the name and save
  it in the desired app directory
    @options
      name: Page name
      appDirectory: App directory of where to save file
*/
Generator.run = function run(options) {
  options.rootDirectory = options.rootDirectory || path.join('www', 'app');
  var savePath = path.join(options.appDirectory, options.rootDirectory, options.fileAndClassName);

  var templates = Generate.loadGeneratorTemplates(__dirname);

  templates.forEach(function(template) {
    var templatePath = path.join(__dirname, template.file);
    options.templatePath = templatePath;
    var renderedTemplate = Generate.renderTemplateFromFile(options);
    var saveFilePath = path.join(savePath, [options.fileAndClassName, template.type].join(''));
    // console.log('renderedTemplate', renderedTemplate, 'saving to', saveFilePath);
    console.log('\n√ Create'.blue, path.relative(options.appDirectory, saveFilePath));
    fs.writeFileSync(saveFilePath, renderedTemplate);
  });

  return Q();
};

// var fileAndClassName = Generate.fileAndClassName(name);
// var javascriptClassName = Generate.javascriptClassName(name);
// Generate.createScaffoldDirectories(appDirectory, fileAndClassName);

// var jsTemplate = Generate.generateJsTemplate(name);
// var htmlTemplate = Generate.generateHtmlTemplate(name);
// var scssTemplate = Generate.generateScssTemplate(name);

// var pagePath = path.join(appDirectory, 'www', 'app', fileAndClassName),
//     jsPath = path.join(pagePath, [fileAndClassName, '.js'].join('')),
//     htmlPath = path.join(pagePath, [fileAndClassName, '.html'].join('')),
//     scssPath = path.join(pagePath, [fileAndClassName, '.scss'].join(''));

// logging.logger.info('√ Create'.blue, path.relative(appDirectory, jsPath));
// fs.writeFileSync(jsPath, jsTemplate, 'utf8');
// logging.logger.info('√ Create'.blue, path.relative(appDirectory, htmlPath));
// fs.writeFileSync(htmlPath, htmlTemplate, 'utf8');
// logging.logger.info('√ Create'.blue, path.relative(appDirectory, scssPath));
// fs.writeFileSync(scssPath, scssTemplate, 'utf8');

// //TODO: Modify the main sass file (via config) to somehow update it
// //to include this sass file. 
// //In the meantime, put a console message to alert them
// logging.logger.info('* Tip: if youd like to use the generated sass file, use \'@import "' + path.relative(appDirectory, scssPath) + '"\' in your main sass file');

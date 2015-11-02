// /*
//   ionic g page about
//   what should happen:
//     create directories if not existing: /www, /www/app, /www/app/about
//     create files (about.html, about.scss, about.js) in /www/app/about
// */
// var fs = require('fs'),
//     Generator = module.exports,
//     Generate = require('../../generate'),
//     path = require('path'),
//     Q = require('q');
// /*
//   Run: generate a page template from the name and save
//   it in the desired app directory
//     @options
//       name: Page name
//       appDirectory: App directory of where to save file
// */
// Generator.run = function run(options) {

//   // Generate.defaultTemplates(options)
//   // options.rootDirectory = options.rootDirectory || path.join('www', 'app');
//   // var savePath = path.join(options.appDirectory, options.rootDirectory, options.fileName);

//   // var templates = Generate.loadGeneratorTemplates(__dirname);

//   // templates.forEach(function(template) {
//   //   var templatePath = path.join(__dirname, template.file);
//   //   options.templatePath = templatePath;
//   //   var renderedTemplate = Generate.renderTemplateFromFile(options);
//   //   var saveFilePath = path.join(savePath, [options.fileName, template.type].join(''));
//   //   // console.log('renderedTemplate', renderedTemplate, 'saving to', saveFilePath);
//   //   console.log('√ Create'.blue, path.relative(options.appDirectory, saveFilePath));
//   //   fs.writeFileSync(saveFilePath, renderedTemplate);
//   // });
// };

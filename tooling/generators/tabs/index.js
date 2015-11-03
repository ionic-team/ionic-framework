var colors = require('colors'),
    fs = require('fs'),
    path = require('path'),
    inquirer = require('inquirer'),
    Q = require('q'),
    Generator = module.exports,
    Generate = require('../../generate'),
    path = require('path'),
    Q = require('q');

Generator.validate = function(input) {
  // console.log(typeof parseInt(input));
  if (isNaN(parseInt(input))) {
    // Pass the return value in the done callback
    return 'You need to provide a number';
  }
  return true;
};

Generator.numberNames = ['first', 'second', 'third', 'fourth', 'fifth'];

Generator.promptForTabCount = function promptForTabCount() {
  var q = Q.defer();

  inquirer.prompt({choices: ['1', '2', '3', '4', '5'], message: 'How many tabs will you have?', name: 'count', type: 'list', validate: Generator.validate}, function(result) {
    q.resolve(result.count);
  });

  return q.promise;
};

Generator.promptForTabName = function promptForTabName(tabIndex, options) {
  var q = Q.defer();

  inquirer.prompt({message: 'Enter the ' + Generator.numberNames[tabIndex] + ' tab name:', name: 'name', type: 'input'}, function(nameResult) {
    Generator.tabs.push({ appDirectory: options.appDirectory, cssClassName: Generate.cssClassName(nameResult.name), fileName: Generate.fileName(nameResult.name), jsClassName: Generate.jsClassName(nameResult.name), name: nameResult.name });
    q.resolve();
  });

  return q.promise;
}

Generator.run = function run(options) {
  //Need to query user for tabs:
  options.rootDirectory = options.rootDirectory || path.join('www', 'app');
  var savePath = path.join(options.appDirectory, options.rootDirectory, options.fileName);

  Generator.tabs = [];

  return Generator.promptForTabCount()
  .then(function(count) {
    var promise = Q();
    for(var i = 0, j = parseInt(count); i < j; i++) {
      (function(index) {
        promise = promise.then(function() {
          return Generator.promptForTabName(index, options);
        });
      })(i);//avoid closure loop var
    }

    return promise;
  })
  .then(function() {
    var templates = Generate.loadGeneratorTemplates(__dirname);

    //Generate the tabs container page templates
    templates.forEach(function(template) {
      options.templatePath = template.file;
      options.tabs = Generator.tabs;
      var renderedTemplate = Generate.renderTemplateFromFile(options);
      var saveFilePath = path.join(savePath, [options.fileName, template.type].join(''));
      // console.log('renderedTemplate', renderedTemplate, 'saving to', saveFilePath);
      console.log('√ Create'.blue, path.relative(options.appDirectory, saveFilePath));
      fs.writeFileSync(saveFilePath, renderedTemplate);
    });

    //Now render the individual tab pages
    Generator.tabs.forEach(function(tab) {
      tab.generatorName = 'page';
      tab.appDirectory = tab.appDirectory;
      Generate.generate(tab);
    });
  })
  .catch(function(ex) {
    console.log('Something went wrong', ex);
    console.log(ex.stack);
    throw ex;
  })
  .fin(function() {
    console.log('√ Done'.green);
  });
};

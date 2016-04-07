var path = require('path'),
    inquirer = require('inquirer'),
    Q = require('q'),
    Generator = require('../../generator'),
    Generate = require('../../generate');

module.exports = TabsGenerator;

function TabsGenerator(options) {
  Generator.call(this, options);
  this.directory = 'pages';
  this.jsClassName += 'Page';
  this.tabs = [];
  this.tabNames = [];
}

TabsGenerator.prototype = Object.create(Generator.prototype);

TabsGenerator.prototype.run = function(){
  return tabCountPrompt()

    .then(function(numTabs){
      var promise = Q();

      for (var i = 0, j = parseInt(numTabs); i < j; i++) {
        promise = promise.then(function(index) {
          return tabNamePrompt.bind(this)(index);
        }.bind(this, i));
      }
      return promise;
    }.bind(this))

    .then(function(){
      var PageGenerator = Generate.loadGenerator('page');

      this.tabNames.forEach(function(tabName){
        var pageGenerator = new PageGenerator({
          name: tabName,
          generator: 'page',
          appDirectory: this.appDirectory,
          isTS: this.isTS
        });

        pageGenerator.run();
        this.tabs.push(pageGenerator);
      }.bind(this));

      this.makeDirectories();
      this.renderTemplates();
    }.bind(this))

    .catch(function(err){
      console.error(err.stack);
    })
}

function tabCountPrompt(){
  var q = Q.defer();

  inquirer.prompt({
    choices: ['1', '2', '3', '4', '5'],
    message: 'How many tabs would you like?',
    name: 'count',
    type: 'list',
    validate: validate
  }, function(result) {
    q.resolve(result.count);
  });

  return q.promise;
}

function tabNamePrompt(index){
  var q = Q.defer();
  var numberNames = ['first', 'second', 'third', 'fourth', 'fifth'];

  inquirer.prompt({
    message: 'Enter the ' + numberNames[index] + ' tab name:',
    name: 'name',
    type: 'input'
  }, function(response) {
    this.tabNames.push(response.name);
    q.resolve();
  }.bind(this));

  return q.promise;
}

function validate(){
  if (isNaN(parseInt(input))) {
    // Pass the return value in the done callback
    return 'You need to provide a number';
  }
  return true;
}


/*
   __          __  
| /  \ |\ | | /  ` 
| \__/ | \| | \__, 

http://ionicframework.com/

A utility for starting and administering Ionic based mobile app projects.
Licensed under the MITlicense. See LICENSE For more.

Copyright 2013 Drifty (http://drifty.com/)
*/
                   
var IonicStartTask = require('./lib/ionic/start.js').IonicStartTask;

var argv = require('optimist').argv;

var TASKS = [
  {
    title: 'start',
    name: 'start',
    usage: 'appname',
    task: IonicStartTask
  }
];

Ionic = function() {};

Ionic.prototype = {
  _tryBuildingTask: function() {
    if(argv._.length == 0) {
      return false;
    }
    var taskName = argv._[0];

    return this._getTaskWithName(taskName);
  },

  _getTaskWithName: function(name) {
    for(var i = 0; i < TASKS.length; i++) {
      var t = TASKS[i];
      if(t.name === name) {
        return t;
      }
    }
  },

  _printGenericUsage: function() {
    this._printIonic();
    process.stderr.write('Usage: ionic task args\n\n===============\n\nAvailable tasks:\n\n');

    for(var i = 0; i < TASKS.length; i++) {
      var task = TASKS[i];
      process.stderr.write('  ' + task.name + '\t\t' + task.task.HELP_LINE + '\n');
    }

    process.exit(1);
  },

  _printIonic: function() {
    process.stdout.write('\n   __          __  \n');
    process.stdout.write('| /  \\ |\\ | | /  `\n' + '| \\__/ | \\| | \\__,\n\n');
  },

  _loadTaskRunner: function(which) {

  },

  run: function() {
    var task = this._tryBuildingTask();
    if(!task) {
      return this._printGenericUsage();
    }

    console.log('Running', task.title, 'task...')

    var taskObj = new task.task();
    taskObj.run(this);
  },

  fail: function(msg) {
    process.stderr.write(msg + '\n');
    process.exit(1);
  },

};


var ionic = new Ionic();
ionic.run();

/*
   __          __  
| /  \ |\ | | /  ` 
| \__/ | \| | \__, 

http://ionicframework.com/

A utility for starting and administering Ionic based mobile app projects.
Licensed under the Apache 2.0 license. See LICENSE For mroe.

Copyright 2013 Drifty (http://drifty.com/)
*/
                   
var argv = require('optimist').argv,
    IonicStartTask = require('./lib/ionic/start.js');

var TASKS = [
  {
    title: 'New Project',
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

    var task = this._getTaskWithName(taskName);

    return {
      task: task
    }
  },

  _getTaskWithName: function(name) {
    for(var i = 0; i < TASKS.length; i++) {
      var t = TASKS[i];
      if(t.name === name) {
        return t;
      }
    }
  },

  _printUsage: function() {
    this._printIonic();
    process.stderr.write('Usage: ionic task args\n');
    process.exit(1);
  },

  _printIonic: function() {
    process.stdout.write('\n   __          __  \n');
    process.stdout.write('| /  \\ |\\ | | /  `\n' + '| \\__/ | \\| | \\__,\n\n');
  },

  _writeTemplateFolder: function() {
    console.log('Copying template to', this.targetPath);
    ncp('template', this.appName, function(err) {
      if(err) {
        this._fail('Unable to build starter folder', err);
      }
    });
  },

  // Prompt the user for a response
  ask: function(question) {
    var response;

    process.stdout.write(question + ' ');
    process.stdin.resume();
    response = fs.readSync(process.stdin.fd, 100, 0, "utf8");
    process.stdin.pause();
    return response[0].trim();
  },

  _checkTargetPath: function() { 
    if(fs.existsSync(this.targetPath)) {
      var resp = this._ask('The ' + this.targetPath + ' directory already exists. Overwrite files? (y/n)')
      if(resp === 'y') {
        return true;
      }
      return false;
    }
    return true;
  },

  _loadTaskRunner: function(which) {

  },

  run: function() {
    var task = this._tryBuildingTask();
    if(task === false) {
      return this._printUsage();
    }

    console.log('Running', task.task.title, 'task...')

    return

    this.appName = argv._[0];
    this.targetPath = path.resolve(this.appName);

    // Make sure to create this, or ask them if they want to override it
    if(this._checkTargetPath() === false) {
      process.stderr.write('Not continuing.');
      process.exit(1);
    }

    console.log('Creating Ionic app in folder', this.targetPath);

    this._writeTemplateFolder();
  },

  fail: function(msg) {
    process.stderr.write(msg + '\n');
    process.exit(1);
  },

};


var ionic = new Ionic();
ionic.run();
var fs = require('fs'),
    ncp = require('ncp').ncp,
    path = require('path'),
    IonicTask = require('./task').IonicTask;

var argv = require('optimist').argv;

var IonicStartTask = function() {
}

IonicStartTask.HELP_LINE = 'Start a new Ionic project with the given name.';

IonicStartTask.prototype = new IonicTask();


IonicStartTask.prototype.run = function(ionic) {
  this.appName = argv._[0];
  this.targetPath = path.resolve(this.appName);

  // Make sure to create this, or ask them if they want to override it
  if(this._checkTargetPath() === false) {
    process.stderr.write('Not continuing.');
    process.exit(1);
  }

  console.log('Creating Ionic app in folder', this.targetPath);

  this._writeTemplateFolder();
};

IonicStartTask.prototype._writeTemplateFolder = function() {
  console.log('Copying template to', this.targetPath);
  ncp('template', this.appName, function(err) {
    if(err) {
      this._fail('Unable to build starter folder', err);
    }
  });
};


exports.IonicStartTask = IonicStartTask;
var fs = require('fs'),
    ncp = require('ncp').ncp,
    path = require('path'),
    IonicTask = require('./task').IonicTask;

var IonicStartTask = function() {
}

IonicStartTask.prototype = new IonicTask();
IonicStartTask.prototype.run = function(ionic) {

};


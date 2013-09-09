var fs = require('fs');

var IonicTask = function() {
};

IonicTask.prototype = {
  // Prompt the user for a response
  ask: function(question) {
    var response;

    process.stdout.write(question + ' ');
    process.stdin.resume();
    response = fs.readSync(process.stdin.fd, 100, 0, "utf8");
    process.stdin.pause();
    return response[0].trim();
  },
  run: function(ionic) {
  }
};

exports.IonicTask = IonicTask;
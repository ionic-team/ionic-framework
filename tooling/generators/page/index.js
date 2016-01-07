
var path = require('path'),
    Generator = require('../../generator');

module.exports = PageGenerator;

function PageGenerator(options) {
  Generator.call(this, options);
  this.directory = path.join('app', 'pages');
}

PageGenerator.prototype = Object.create(Generator.prototype);

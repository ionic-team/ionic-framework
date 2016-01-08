var path = require('path'),
    Generator = require('../../generator');

module.exports = PageGenerator;

function PageGenerator(options) {
  Generator.call(this, options);
  this.directory = 'pages';
  this.jsClassName += 'Page';
}

PageGenerator.prototype = Object.create(Generator.prototype);



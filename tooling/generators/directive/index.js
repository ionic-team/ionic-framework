var path = require('path'),
    Generator = require('../../generator');

module.exports = DirectiveGenerator;

function DirectiveGenerator(options) {
  Generator.call(this, options);
  this.directory = 'components';
}

DirectiveGenerator.prototype = Object.create(Generator.prototype);


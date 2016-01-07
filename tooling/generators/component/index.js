var path = require('path'),
    Generator = require('../../generator');

module.exports = ComponentGenerator;

function ComponentGenerator(options) {
  Generator.call(this, options);
  this.directory = path.join('app', 'components');
}

ComponentGenerator.prototype = Object.create(Generator.prototype);

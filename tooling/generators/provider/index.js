var path = require('path'),
    _ = require('lodash'),
    fs = require('fs'),
    Generator = require('../../generator');

module.exports = ProviderGenerator;

function ProviderGenerator(options) {
  Generator.call(this, options);
  this.directory = path.join('app', 'providers');
}

ProviderGenerator.prototype = Object.create(Generator.prototype);


var fs = require('fs'),
    path = require('path'),
    inquirer = require('inquirer');

Generate = module.exports;

Generate.__defineGetter__('generators', function() {
  if (!Generate._generators) {
    Generate._generators = Generate.loadGenerators();
  }

  return Generate._generators;
});

Generate.generate = function generate(options) {
  if (!options) {
    throw new Error('No options passed to generator');
  }

  if (!options.generator) {
    throw new Error('No generator passed to generate');
  }

  var GeneratorType = Generate.loadGenerator(options.generator);
  return new GeneratorType(options).run();
};


Generate.loadGenerator = function loadGenerator(generator) {
  var generateModule;
  try {
    generateModule = require(path.join(__dirname, 'generators', generator));
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      throw new Error('There is no generator available with the name ' + generator + '.');
    } else {
      throw err;
    }
  }
  return generateModule;
};

/*
  Return array of filenames in the generators directory
 */
Generate.loadGenerators = function loadGenerators() {
  var generators = {};
  try {
    generators = fs.readdirSync(path.join(__dirname, 'generators'));
  } catch(err) {
    throw new Error('There was an error loading the generators list', err);
  }
  return generators;
};

Generate.printAvailableGenerators = function printAvailableGenerators() {
  console.log('Available generators:'.blue);
  Generate.generators.forEach(function(generator){
    console.log(' *'.blue, generator);
  });
}

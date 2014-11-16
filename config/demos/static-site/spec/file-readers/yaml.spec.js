var fs = require('fs');
var path = require('canonical-path');
var processor = require('../../file-readers/yaml');

describe('yaml file-reader', function() {

  function readTestFile(name) {
    return fs.readFileSync(path.resolve(__dirname, '_test-data', name)).toString();
  }

  it('normal yaml header should process', function() {
    var contents = readTestFile('normal-header.md');

    var result = processor.processFile('some/file.md', contents);
    expect(result.contents.trim()).toEqual('**Here\'s** some content.');
    expect(result.yaml).toEqual({hello: 'world', works: true});
  });

  it('long yaml header should process', function() {
    var contents = readTestFile('long-header.md');

    var result = processor.processFile('cool/file.md', contents);
    expect(result.contents.trim()).toEqual('Some content');
    expect(result.yaml).toEqual({car: 'is fast', tortoise: 'is slow'});
  });

  ['markdown-title.md', 'no-closing-header.md', 'no-header.md'].forEach(function(file) {
    it(file + ' should not be processed', function() {
      var contents = readTestFile(file);
      var result = processor.processFile('cool/file.md', contents);
      expect(result).toBeFalsy();
    });
  });

});

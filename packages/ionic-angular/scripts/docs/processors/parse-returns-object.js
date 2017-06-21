module.exports = function parseReturnsObject() {

  /*
   * This processor assumes the format:
   * @returns {object} object general description
   * {number} objectName.propertyName  property description
   * {number} objectName.propertyName  objectName.propertyName
   * ...
   *
  */
  return {
    name: 'parse-returns-object',
    description: 'If a method returns an object, and the values are listed ' +
                 'out, parse them in to anobject that can be iterated by dgeni',
    $runBefore: ['rendering-docs'],
    $process: function(docs) {
      var publicDocs = [];
      docs.forEach(function(doc, i) {
        if (doc.members) {
          docs[i].members.forEach(function(member, ii) {
            if (member.returns && member.returns.typeExpression == 'object') {
              var params = docs[i].members[ii].returns.description.split('\n{');
              docs[i].members[ii].returns.description = params.shift();
              if (params.length) {
                docs[i].members[ii].returns.description = docs[i].members[ii]
                  .returns.description
                  .replace(/^(\w+)/, '<span class="fixed-width">$1</span>');
                docs[i].members[ii].returnsObjectParams = parseReturn(params);
              }
            }
          });
        }
      });
      return docs;

      function parseReturn(lineArray) {
        var params = [];
        lineArray.forEach(function(line, l) {
          params.push({
            type: line.substr(0, line.indexOf('} ')),
            key: line.substr(line.indexOf('} ') + 2,
                             line.indexOf('  ') - line.indexOf('} ') - 2),
            description: line.substr(line.indexOf('  ') + 2)
          });
        });
        return params;
      }
    }
  };
};

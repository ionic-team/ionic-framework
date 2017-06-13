module.exports = function removeParams() {
  return {
    name: 'remove-params',
    description: 'Prevent class params from being rendered',
    $runAfter: ['paths-computed'],
    $runBefore: ['rendering-docs'],
    $process: function(docs) {
      docs.forEach(function(doc) {
        if (doc.constructorDoc) {
          const constructorDoc = doc.constructorDoc;
          if (doc.members) {
            doc.members = doc.members.filter(function(method) {
              constructorDoc.parameters.forEach(function(param) {
                if (param.indexOf(method.name) > -1) {
                  return true;
                } else {
                  return false;
                }
              });
            });
          }
        }
      });
      return docs;
    }
  };
};

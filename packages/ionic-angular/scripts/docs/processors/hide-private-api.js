module.exports = function removePrivateApi() {
  return {
    name: 'remove-private-api',
    description: 'Prevent the private apis from being rendered',
    $runAfter: ['paths-computed'],
    $runBefore: ['rendering-docs'],
    $process: function(docs) {
      var publicDocs = [];
      docs.forEach(function(doc){
        if (!doc.private && (!doc.tags || !doc.tags.tagsByName.get('hidden'))){
          publicDocs.push(doc);
          return doc
        }
      })
      docs = publicDocs;
      return docs;
    }
  }
};

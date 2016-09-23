module.exports = function hidePrivateApi() {
  return {
    name: 'hide-private-api',
    description: 'Prevent the private apis from being rendered',
    $runBefore: ['rendering-docs'],
    $process: function(docs) {
      var publicDocs = [];
       docs.forEach(function(doc){
        if(!doc.private){
          publicDocs.push(doc);
          return doc
        }
      })
     docs = publicDocs;
     return docs;
    }
  }
};

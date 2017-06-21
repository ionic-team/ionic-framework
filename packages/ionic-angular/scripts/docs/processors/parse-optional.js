module.exports = function parseOptional() {
  return {
    $runBefore: ['rendering-docs'],
    $process: function(docs) {
      docs.forEach(function(doc) {
        if(doc.members && doc.members.length) {
          for (var i in doc.members) {
            if(doc.members[i].params && doc.members[i].params.length) {
              for (var ii in doc.members[i].params) {
                if(doc.members[i].params[ii].optional){
                  doc.members[i].params[ii].description += '<strong class="tag">Optional</strong>';
                }
              }
            }
          }
        }
      });
      return docs;
    }
  }
};

module.exports = function removePrivateMembers() {
  return {
    name: 'remove-private-members',
    description: 'Remove member docs with @private tags',
    $runAfter: ['tags-parsed'],
    $runBefore: ['rendering-docs'],
    $process: function(docs) {
      docs.forEach(function(doc) {
        if (doc.members) {
          doc.members = doc.members.filter(function(member) {
            return !member.tags.tagsByName.get('hidden') && !member.tags.tagsByName.get('internal');
          });
        }
        if (doc.statics) {
          doc.statics = doc.statics.filter(function(staticMethod) {
            return !staticMethod.tags.tagsByName.get('hidden') && !staticMethod.tags.tagsByName.get('internal')
          });
        }
      });

      return docs;
    }
  };
};

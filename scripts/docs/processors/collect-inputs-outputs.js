module.exports = function collectInputsOutputs() {
  return {

    $runBefore: ['rendering-docs'],
    $process: function(docs) {
      docs.forEach(function(doc) {

        if (doc.members && doc.members.length) {
          var members = [];
          var inputs = [];
          var outputs = [];

          memberLoop:
          for (var i in doc.members) {

            // identify properties to differentiate from methods
            if (typeof doc.members[i].parameters == 'undefined') {
              doc.members[i].isProperty = true;
            }

            if (doc.members[i].decorators && doc.members[i].decorators.length) {

              decoratorLoop:
              for (var ii in doc.members[i].decorators) {

                if (doc.members[i].decorators[ii].name == 'Input') {
                  inputs.push(parseMember(doc.members[i]));
                  continue memberLoop;
                }
                if (doc.members[i].decorators[ii].name == 'Output') {
                  outputs.push(parseMember(doc.members[i]));
                  continue memberLoop;
                }
              }
              // not an input or output, must be a plain member
              members.push(doc.members[i]);
            } else {
              members.push(doc.members[i]);
            };
          }

          // update doc with pruned members list and add inputs and outputs
          doc.members = members.sort(alphabetize);
          doc.inputs = inputs.sort(alphabetize);
          doc.outputs = outputs.sort(alphabetize);
        }

        function alphabetize(a, b) {
          if (!a.name) {
            return 1;
          } else if (!b.name) {
            return -1;
          } else if (a.name < b.name) {
            return -1;
          } else if (a.name > b.name) {
            return 1;
          }
          return 0;
        }

        function parseMember(member) {
          member.type = member.content.substring(
            member.content.indexOf('{') + 1,
            member.content.indexOf('}')
          );
          member.description = member.content.substring(
            member.content.indexOf('}') + 1,
            member.content.length
          );
          return member;
        }
      });
    }
  };
};

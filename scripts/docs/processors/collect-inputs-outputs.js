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
          doc.members = members;
          doc.inputs = inputs;
          doc.outputs = outputs;
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

module.exports = {
    meta: {
      messages: {
        noComponentOnReadyMethod: 'Using the componentOnReady method is not allowed. Use the componentOnReady helper utility instead.',
      },
    },
    create(context) {
      return {
        MemberExpression(node) {
          if (node.property.name === 'componentOnReady') {
            context.report({ node: node, messageId: 'noComponentOnReadyMethod' });
          }
      }
    }
  }
};

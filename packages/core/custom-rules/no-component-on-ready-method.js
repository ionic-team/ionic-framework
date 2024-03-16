module.exports = {
  meta: {
    messages: {
      noComponentOnReadyMethod: 'Using the componentOnReady method is not allowed. Use the componentOnReady helper utility in src/utils/helpers.ts instead.',
    },
  },
  create(context) {
    return {
      CallExpression(node) {
        /**
         * We only want to exclude usages of componentOnReady().
         * Checking for the existence of the componentOnReady method
         * is a way of determining if we are in a lazy loaded build
         * or custom elements build, so we want to allow that.
         */
        const callee = node.callee;
        if (callee.type === 'MemberExpression' && callee.property.name === 'componentOnReady') {
          context.report({ node: node, messageId: 'noComponentOnReadyMethod' });
        }
      }
    }
  }
};

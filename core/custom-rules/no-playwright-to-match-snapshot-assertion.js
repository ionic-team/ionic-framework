module.exports = {
  meta: {
    messages: {
      noPlaywrightToMatchSnapshotAssertion: '"toHaveSnapshot" assertions should be used in favor of "toMatchSnapshot". "toHaveSnapshot" brings file size reductions and anti-flake behaviors such as disabling animations by default.',
    },
  },
  create(context) {
    return {
      ExpressionStatement(node) {
        if (node.expression.callee === undefined) {
          return;
        }

        const { property } = node.expression.callee;

        /**
         * Check to see if toMatchSnapshot is being used
         */
        if (
          property !== undefined &&
          property.type === 'Identifier' &&
          property.name === 'toMatchSnapshot'
        ) {
          context.report({ node: node, messageId: 'noPlaywrightToMatchSnapshotAssertion' });
        }
      }
    }
  }
};

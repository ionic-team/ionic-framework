module.exports = {
  meta: {
    messages: {
      awaitPlayewrightPromiseAssertion: 'This Playwright assertions returns a Promise. Add an "await" to avoid creating a flaky test.',
    },
  },
  create(context) {
    return {
      ExpressionStatement(node) {
        const expression = node.expression;

        /**
         * The first expression of a properly await'ed
         * Playwright assertion should be an AwaitExpression,
         * so if it goes directly to the CallExpression
         * then we potentially need to report this.
         */
        if (expression.type === 'CallExpression') {
          const { object, property } = expression.callee;

          /**
           * If we are using an `expect()` call then
           * we are likely in a Playwright assertion.
           */
          if (
            object !== undefined &&
            object.callee !== undefined &&
            object.callee.type === 'Identifier' &&
            object.callee.name === 'expect'
          ) {
            if (
              property.type === 'Identifier' &&
              hasPlaywrightAsyncAssertion(property.name)
            ) {
              context.report({ node: node, messageId: 'awaitPlayewrightPromiseAssertion' });
            }
          }
        }
      }
    }
  }
};

const hasPlaywrightAsyncAssertion = (property) => {
  return ASYNC_PLAYWRIGHT_ASSERTS.includes(property);
}

const ASYNC_PLAYWRIGHT_ASSERTS = [
  'toBeChecked',
  'toBeDisabled',
  'toBeEditable',
  'toBeEmpty',
  'toBeEnabled',
  'toBeFocused',
  'toBeHidden',
  'toBeVisible',
  'toContainText',
  'toHaveAttribute',
  'toHaveClass',
  'toHaveCount',
  'toHaveCSS',
  'toHaveId',
  'toHaveJSProperty',
  'toHaveScreenshot',
  'toHaveText',
  'toHaveValue',
  'toHaveValues',
  'toHaveTitle',
  'toHaveURL',
  'toBeOK',
];

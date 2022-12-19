module.exports = {
  meta: {
    messages: {
      awaitPlaywrightPromiseAssertion: 'This Playwright assertion returns a Promise. Add an "await" to avoid creating a flaky test.',
    },
  },
  create(context) {
    return {
      ExpressionStatement(node) {
        const expression = node.expression;

        /**
         * The first expression of a properly awaited
         * Playwright assertion should be an AwaitExpression,
         * so if it goes directly to the CallExpression
         * then we potentially need to report this.
         */
        if (expression.type === 'CallExpression') {
          const { object, property } = expression.callee;

          /**
           * Check to see if the property name is
           * of a known Playwright async assertion.
           */
          if (
            property !== undefined &&
            property.type === 'Identifier' &&
            hasPlaywrightAsyncAssertion(property.name)
          ) {
            context.report({ node: node, messageId: 'awaitPlaywrightPromiseAssertion' });
          }
        }
      }
    }
  }
};

/**
 * Returns `true` if `property` is the name
 * of a known async Playwright assertion.
 */
const hasPlaywrightAsyncAssertion = (property) => {
  return ASYNC_PLAYWRIGHT_ASSERTS.includes(property);
}

// https://playwright.dev/docs/test-assertions
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

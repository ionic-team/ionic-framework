import { configs } from '@utils/test/playwright';

import { test } from './mask-fixture';

configs({
  modes: ['md'],
  directions: ['ltr'],
}).forEach(({ title, config }) => {
  test.describe(title('input: mask'), () => {
    test('should mask the input', async ({ maskPage }) => {
      // US Phone number
      await maskPage.init(config, [
        '+',
        '1',
        ' ',
        '(',
        /\d/,
        /\d/,
        /\d/,
        ')',
        ' ',
        /\d/,
        /\d/,
        /\d/,
        '-',
        /\d/,
        /\d/,
        /\d/,
        /\d/,
      ]);

      await maskPage.typeAndBlur('5555555555');
      await maskPage.expectValue('+1 (555) 555-5555');
    });

    test('should mask the input with a string', async ({ maskPage }) => {
      // Only allow lowercase letters
      await maskPage.init(config, '[a-z]$');

      await maskPage.typeAndBlur('5abc123d');
      await maskPage.expectValue('abcd');
    });
  });
});

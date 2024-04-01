import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

/**
 * This is checking internal logic. RTL tests are not needed
 */
configs({
  directions: ['ltr'],
}).forEach(({ title, config }) => {
  test.describe.skip(
    title('select: async'),
    () => {
      test('should correctly set the value after a delay', async ({
        page,
      }) => {
        await page.goto(
          `/src/components/select/test/legacy/async`,
          config
        );
        const selectValueSet =
          await page.spyOnEvent(
            'selectValueSet'
          );

        const select =
          page.locator('#default');

        await selectValueSet.next();

        await expect(
          select
        ).toHaveJSProperty(
          'value',
          'bird'
        );
      });
    }
  );
});

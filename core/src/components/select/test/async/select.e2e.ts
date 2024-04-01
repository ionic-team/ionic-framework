import { expect } from '@playwright/test';
import {
  configs,
  test,
} from '@utils/test/playwright';

/**
 * This is checking internal logic. RTL tests are not needed
 */
configs({
  modes: ['ios'],
  directions: ['ltr'],
}).forEach(({ title, config }) => {
  test.describe(
    title('select: async'),
    () => {
      test.beforeEach(
        async ({ page }) => {
          await page.goto(
            `/src/components/select/test/async`,
            config
          );
        }
      );
      test('should correctly set the value after a delay', async ({
        page,
      }) => {
        const select =
          page.locator('#default');
        await page.click(
          '#set-contents'
        );

        await expect(
          select
        ).toHaveJSProperty(
          'value',
          'bird'
        );
      });

      test('should re-render when options update but value is already set', async ({
        page,
      }) => {
        const select = page.locator(
          '#with-value'
        );
        await page.click(
          '#set-contents'
        );

        await expect(
          select.locator('.select-text')
        ).toHaveText('bird');
      });
    }
  );
});

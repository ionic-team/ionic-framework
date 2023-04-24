import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe.only('modal: dark mode', () => {
  test('should render the correct text color when outside ion-content', async ({ page, skip }) => {
    test.info().annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/26060',
    });

    skip.rtl();

    await page.goto('/src/components/modal/test/dark-mode');

    const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

    await page.click('#basic-modal');

    await ionModalDidPresent.next();

    await expect(page).toHaveScreenshot(`modal-dark-color-${page.getSnapshotSettings()}.png`);
  });
});

import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'], palettes: ['light', 'dark'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('list surfaces'), () => {
    test('should preserve card, outside-list, and custom backgrounds', async ({ page }) => {
      await page.goto('/src/css/test/list-surfaces', config);
      await expect(page.locator('#surfaces')).toHaveScreenshot(screenshot('list-surfaces-cards'));
    });

    for (const customBackground of [false, true]) {
      test(`should preserve ${customBackground ? 'custom' : 'default'} modal and nested-card backgrounds`, async ({
        page,
      }) => {
        await page.goto('/src/css/test/list-surfaces', config);
        const modal = page.locator('ion-modal');
        if (customBackground) {
          await modal.evaluate((el: HTMLIonModalElement) => el.style.setProperty('--ion-background-color', '#243b53'));
        }
        const didPresent = await page.spyOnEvent('ionModalDidPresent');
        await page.locator('#open-modal').click();
        await didPresent.next();
        await expect(modal).toHaveScreenshot(
          screenshot(`list-surfaces-modal-${customBackground ? 'custom' : 'default'}`)
        );
      });
    }
  });
});
